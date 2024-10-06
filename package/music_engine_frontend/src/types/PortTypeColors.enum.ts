import { PortType } from "music_engine/build/types/PortType";

export enum PortTypeColors {
    AUDIO = "#FFC300",
    INVALID = "#1a192b",
    MIDI = "#41D000",
    PARAM = "#FF5733",
    TRIGGER = "#00CBD0",
    PROP = "#b514de",
};

export const PortTypeKey: Record<PortType, keyof PortTypeColors> = {
    [PortType.AUDIO]: 0,
    [PortType.MIDI]: 2,
    [PortType.PARAM]: 3,
    [PortType.TRIGGER]: 4,
    // PROP: 5,
}
