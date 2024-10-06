import { useMemo } from "react";
import { MENodeProp, PropType } from "../types/MENodeRepresentation.type";

export type NodePropInputProps<T> = {
    onChange: (key: keyof T, value: any) => void;
    nodeProps: MENodeProp<T, any>[]
}

export function NodePropInput({onChange, nodeProps, ...props}: NodePropInputProps<any>) {
    const inputEls = useMemo(() => {
        const inputProps = nodeProps.filter(p => p.type !== PropType.PORT);

        const toRet = [];
        for (const inputProp of inputProps) {
            if (inputProp.type === PropType.TEXT) {
                toRet.push(<div key={String(inputProp.key)}>
                    <label>
                        {String(inputProp.key)} <br />
                        <input type="text" onChange={(e) => onChange(inputProp.key, e.target.value)} defaultValue={inputProp.value}/>
                    </label>
                </div>);
            } else if (inputProp.type === PropType.SELECT) {
                toRet.push(<div key={String(inputProp.key)}>
                    <label>
                        {String(inputProp.key)} <br />
                        <select onChange={(e) => onChange(inputProp.key, e.target.value)} defaultValue={inputProp.value}>
                            {inputProp.possibleValues?.map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </label>
                </div>);
            } else if (inputProp.type === PropType.RANGE) {
                toRet.push(<div key={String(inputProp.key)}>
                    <label>
                        {String(inputProp.key)} <br />
                        <input 
                            type="range" 
                            onChange={(e) => onChange(inputProp.key, e.target.value)} 
                            defaultValue={inputProp.value}
                            min={inputProp.rangeMin}
                            max={inputProp.rangeMax}
                        />
                    </label>
                </div>);
            } 
        }
        return toRet;
    }, [nodeProps, onChange]);
    return <>
        {inputEls}
    </>;
}
