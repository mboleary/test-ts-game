import { ReactElement } from "react";
import { useTabs } from "./TabsProvider";

export type TabButtonProps = {
    title: string,
    id: string,
};


export function TabButton({ title, id }: TabButtonProps) {
    const { setSelectedTab } = useTabs();

    return <div><a onClick={() => setSelectedTab(id)}>{title}</a></div>
}