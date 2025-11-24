import { ReactElement } from "react";
import { TabsProvider, useTabs } from "./TabsProvider";
import { TabButton } from "./TabButton";

export type TabsProps = {
    children: ReactElement | ReactElement[],
    initialTab?: string,
};


export function Tabs({ children, initialTab }: TabsProps) {
    const { tabs } = useTabs();

    return <TabsProvider>
        <div>
            { tabs.map(tab => <TabButton id={tab.id} title={tab.title} />)}
        </div>
        <>{ children }</>
    </TabsProvider>
}