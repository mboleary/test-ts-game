import { createContext, ReactElement, useCallback, useContext, useState } from "react";

export type Tab = {
    title: string,
    id: string,
};

export type TabsContextValue = {
    selectedTab: string,
    setSelectedTab: (_: string) => void,
    tabs: Tab[],
    addTab: (id: string, title: string) => void,
    updateTab: (id: string, title: string) => void,
    deleteTab: (id: string) => void,
}

export const TabsContext = createContext<TabsContextValue>({
    selectedTab: "",
    setSelectedTab: function (_: string): void {},
    tabs: [],
    addTab: function (id: string, title: string): void {},
    updateTab: function (id: string, title: string): void {},
    deleteTab: function (id: string): void {}
});

export const useTabs = () => {
    return useContext(TabsContext);
}

export type TabsProviderProps = {
    children: ReactElement | ReactElement[]
};

export function TabsProvider({ children }: TabsProviderProps) {
    const [selectedTab, setSelectedTab] = useState<string>('');
    const [tabs, setTabs] = useState<Tab[]>([]);

    const addTab = useCallback((id: string, title: string) => {
        const foundTab = tabs.find((tab) => tab.id === id);
        if (!foundTab) {
            tabs.push({id, title});
            setTabs(tabs.slice());
        }
    }, [tabs, setTabs]);

    const updateTab = useCallback((id: string, title: string) => {
        const t = tabs.find(tab => tab.id === id);
        if (t) {
            t.title = title;
            setTabs(tabs.slice());
        }
    }, [tabs, setTabs]);

    const deleteTab = useCallback((id: string) => {
        const t = tabs.findIndex(tab => tab.id === id);
        if (t !== -1) {
            tabs.splice(t, 1);
            setTabs(tabs.slice());
        }
    }, [tabs, setTabs]);

    return (
        <TabsContext.Provider value={{
            selectedTab,
            setSelectedTab,
            tabs,
            addTab,
            updateTab,
            deleteTab
        }}>
            {children}
        </TabsContext.Provider>
    );
}

