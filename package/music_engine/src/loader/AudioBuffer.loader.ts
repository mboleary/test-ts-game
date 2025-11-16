import { Loader } from "asset-manager";

export type AudioBufferLoaderOptions = {};

export class AudioBufferLoader extends Loader<ArrayBuffer, AudioBuffer, AudioBufferLoaderOptions> {
    constructor(
        private readonly audioContext: AudioContext
    ) {
        super("audio-buffer")
    }
    public validateOptions(options: AudioBufferLoaderOptions): boolean {
        return true;
    }
    public async run(input: ArrayBuffer, options: AudioBufferLoaderOptions): Promise<AudioBuffer> {
        return await this.audioContext.decodeAudioData(input);
    }

}