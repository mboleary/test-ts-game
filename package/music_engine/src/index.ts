import { MusicEngineOscillatorNode } from "./nodes/MusicEngineOscillatorNode";
import { AudioPort } from "./ports/AudioPort";
import { MidiSendPort } from "./ports/MidiSendPort";
import { MusicEngineMidiMessageType } from "./types/MusicEngineMidiMessage.type";
import { PortDirection } from "./types/PortDirection.enum";
import { repeatingPulse } from "./util/beatGenerator";
import { beatToTime, timeSigToBeat } from "./util/beatToTime";
import { scheduleNote } from "./util/midiPlaybackScheduler";
import { timeToBeat } from "./util/timeToBeat";

let interval: NodeJS.Timer;

function test() {
  const ac = new AudioContext();
  const node = new MusicEngineOscillatorNode(ac);
  // Destination, wrapped in a port
  const apDest = new AudioPort('dest', PortDirection.IN);
  apDest.registerAudioNode(ac.destination);
  node.audioOut.connect(apDest);

  const midiOut = new MidiSendPort('send');
  midiOut.connect(node.midiIn);

  const DURATION = 0.5;
  // Testing one of the AudioParam functions, @TODO doesn't seem to currently work
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
        midiOut.send({
          type: MusicEngineMidiMessageType.NOTE_ON,
          key: note,
          time: n
        });
        midiOut.send({
          type: MusicEngineMidiMessageType.NOTE_OFF,
          key: note,
          time: n + beatToTime(120, DURATION)
        });
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
  testStop
});
