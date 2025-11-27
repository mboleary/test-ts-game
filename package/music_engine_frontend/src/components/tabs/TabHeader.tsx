import { useTabs } from "./TabsProvider";
import { TabButton } from "./TabButton";
import { useEffect } from "react";

export type TabHeaderProps = {
    initialTab?: string;
};

/**
 * Populates Tab Buttons based on registered Tabs
 * @param param0 
 * @returns 
 */
export function TabHeader({ initialTab }: TabHeaderProps) {
    const { tabs, setSelectedTab } = useTabs();

    useEffect(() => {
        if (initialTab) {
            setSelectedTab(initialTab);
        }
    }, []);

    return <div className="flex-layout tabs" style={{ gap: "5px", }}>
        { tabs.map(tab => <TabButton id={tab.id} title={tab.title} />)}
    </div>;
}