export async function loadAudioFile(src: string, ac: AudioContext): Promise<AudioBuffer> {
    try {
        const resp = await fetch(src);
        const buf = await resp.arrayBuffer();
        return await ac.decodeAudioData(buf);
    } catch (err) {
        console.error(`Unable to fetch the audio file. Error: ${(err as Error).message}`);
        throw err;
    }
}