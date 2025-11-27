import { ReactElement } from "react";
import { TabsProvider, useTabs } from "./TabsProvider";
import { TabButton } from "./TabButton";
import { TabHeader } from "./TabHeader";

export type TabsProps = {
    children: ReactElement | ReactElement[],
    initialTab?: string,
};


export function Tabs({ children, initialTab }: TabsProps) {
    return <TabsProvider>
        <TabHeader initialTab={initialTab} />
        <>{ children }</>
    </TabsProvider>
}