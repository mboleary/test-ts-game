import React from "react";
import { GraphView } from "./views/GraphView";
import { ColorModeProvider } from "./components/context/ColorMode";
import Sidebar from "./components/sidebar/Sidebar";
import { DnDProvider } from "./components/context/DndContext";
  
export function App() {
    return <ColorModeProvider>
        <DnDProvider>
            <div className="flex-layout full-height">
                <div className="flex">
                    <GraphView />
                </div>
                <Sidebar />
            </div>
        </DnDProvider>
    </ColorModeProvider>;
}
