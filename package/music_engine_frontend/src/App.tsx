import React from "react";
import { GraphView } from "./views/GraphView";
import { ColorModeProvider } from "./components/context/ColorMode";
import Sidebar from "./components/Sidebar";
import { DnDProvider } from "./components/DndContext";
  
export function App() {
    return <ColorModeProvider>
        <Sidebar />
        <DnDProvider>
            <GraphView />
        </DnDProvider>
    </ColorModeProvider>;
}
