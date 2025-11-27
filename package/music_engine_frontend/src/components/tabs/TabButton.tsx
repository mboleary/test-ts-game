import { ReactElement } from "react";
import { useTabs } from "./TabsProvider";
import "../../style/tabs.css";

export type TabButtonProps = {
    title: string,
    id: string,
};


export function TabButton({ title, id }: TabButtonProps) {
    const { setSelectedTab, selectedTab } = useTabs();

    return <div className="tab-button" data-selected={selectedTab === id}><a onClick={() => setSelectedTab(id)}>{title}</a></div>
}