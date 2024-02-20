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
  const gen = repeatingPulse(beatToTime(120, 1.5), ac.currentTime);
  const AHEAD = 1;
  const POLL = 250;
  const NOTE_ARR = [69, 71, 73, 74, 76, 74, 73, 71];
  let notePos = 0;
  let currTimePos = 0;
  interval = setInterval(() => {
    while (currTimePos < ac.currentTime + AHEAD) {
      let n = gen.next().value;
      console.log("gen:", n);
      const note = NOTE_ARR[notePos];
      notePos = (notePos + 1) % NOTE_ARR.length;
      if (n) {
        currTimePos = n;
        node.receive({
          type: MusicEngineMidiMessageType.NOTE_ON,
          key: note,
          time: n
        });
        node.receive({
          type: MusicEngineMidiMessageType.NOTE_OFF,
          key: note,
          time: n + beatToTime(120, 0.25)
        });
      } else {
        gen.return();
        break;
      }
    }
  }, POLL);
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
