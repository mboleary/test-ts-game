import { ReactElement } from "react";
import { useTabs } from "./TabsProvider";

export type TabsProps = {
    children: ReactElement | ReactElement[],
    id: string,
    title?: string
};


export function Tab({ children, id, title }: TabsProps) {
    const { selectedTab, addTab } = useTabs();

    addTab(id, title || id);

    return <>{ selectedTab === id ? children : '' }</>;
}