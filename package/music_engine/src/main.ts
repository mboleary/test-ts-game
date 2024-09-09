import { nanoid } from "nanoid/non-secure";
import { MusicEngineOscillatorNode } from "./nodes/MusicEngineOscillatorNode";
import { AudioPort } from "./ports/AudioPort";
import { MidiSendPort } from "./ports/MidiSendPort";
import { MidiAccess } from "./subsystem/midi/MidiAccess";
import { MidiNoteOffMessage } from "./subsystem/midi/message/MidiNoteOffMessage";
import { MidiNoteOnMessage } from "./subsystem/midi/message/MidiNoteOnMessage";
import { MidiOutputNode } from "./subsystem/midi/nodes/MidiOutputNode";
import { MusicEngineMidiMessageType } from "./types/MusicEngineMidiMessage.type";
import { PortDirection } from "./types/PortDirection.enum";
import { repeatingPulse } from "./util/beatGenerator";
import { beatToTime, timeSigToBeat } from "./util/beatToTime";
import { scheduleNote } from "./util/midiPlaybackScheduler";
import { timeToBeat } from "./util/timeToBeat";

let interval: NodeJS.Timer;

async function midiInputTest() {
  const ac = new AudioContext();
  const node = new MusicEngineOscillatorNode(ac, 'sawtooth', 'midi synth', nanoid(), ['midi', 'synth']);
  const apDest = new AudioPort('dest', PortDirection.IN);
  apDest.registerAudioNode(ac.destination);
  node.audioOut.connect(apDest);

  const midiAccess = await MidiAccess.start(ac);
  const devicePort = midiAccess.midiInputNode.getMidiPorts().filter(port => port.name.indexOf('Port-0') === -1)[0];
  if (devicePort) {
    devicePort.connect(node.midiIn);
  }
  console.log("port:", devicePort, devicePort.name);
}

async function test() {
  const ac = new AudioContext();
  const node = new MusicEngineOscillatorNode(ac);
  // Destination, wrapped in a port
  const apDest = new AudioPort('dest', PortDirection.IN);
  apDest.registerAudioNode(ac.destination);
  node.audioOut.connect(apDest);

  const midiOut = new MidiSendPort('send');
  midiOut.connect(node.midiIn);

  const midiAccess = await MidiAccess.start(ac);
  const devicePort = midiAccess.midiOutputNode.getMidiPorts()[0];
  if (devicePort) midiOut.connect(devicePort);

  const DURATION = 0.5;
  // Testing one of the AudioParam functions
  // node.detune.linearRampToValueAtTime(
  //   1000,
  //   ac.currentTime + beatToTime(120, DURATION) + 1);
  // repeating pulse, like a metronome
  const gen = repeatingPulse(beatToTime(120, DURATION), ac.currentTime);
  const AHEAD = 1;
  const POLL = 250;
  const NOTE_ARR = [69, 71, 73, 74, 76, 74, 73, 71];
  let notePos = 0;
  let currTimePos = 0;
  interval = setInterval(() => {
    while (currTimePos < ac.currentTime + AHEAD) {
      let n = gen.next().value;
      const note = NOTE_ARR[notePos];
      notePos = (notePos + 1) % NOTE_ARR.length;
      if (n) {
        currTimePos = n;
        midiOut.send(MidiNoteOnMessage.from({
          key: note,
          velocity: 0x7F,
          time: n
        }));
        midiOut.send(MidiNoteOffMessage.from({
          key: note,
          velocity: 0x00,
          time: n + beatToTime(120, DURATION)
        }));
      } else {
        gen.return();
        break;
      }
    }
  }, POLL);
  return node;
}

function testStop() {
  clearInterval(interval);
}

Object.assign(window, {
  beatToTime,
  timeSigToBeat,
  repeatingPulse,
  timeToBeat,
  scheduleNote,
  MusicEngineOscillatorNode,
  test,
  testStop,
  midiInputTest
});
