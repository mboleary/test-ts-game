import { MusicEngineOscillatorNode } from "./nodes/MEOscNode";
import { MusicEngineMidiMessageType } from "./types/MusicEngineMidiMessage.type";
import { repeatingPulse } from "./util/beatGenerator";
import { beatToTime, timeSigToBeat } from "./util/beatToTime";
import { scheduleNote } from "./util/midiPlaybackScheduler";
import { timeToBeat } from "./util/timeToBeat";

let interval: NodeJS.Timer;

function test() {
  const ac = new AudioContext();
  const node = new MusicEngineOscillatorNode(ac, 'sine', []);
  const gen = repeatingPulse(beatToTime(120, 1), ac.currentTime);
  const AHEAD = 100;
  interval = setInterval(() => {
    const n = gen.next().value;
    console.log("gen:", n);
    if (n) {
      node.receive({
        type: MusicEngineMidiMessageType.NOTE_ON,
        key: 69,
        time: n
      });
      node.receive({
        type: MusicEngineMidiMessageType.NOTE_OFF,
        key: 69,
        time: n + 1
      });
    }
  }, AHEAD);
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
