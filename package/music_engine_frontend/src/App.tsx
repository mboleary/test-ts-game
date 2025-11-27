import React from "react";
import { GraphView } from "./views/GraphView";
import { ColorModeProvider } from "./components/context/ColorMode";
import Sidebar from "./components/sidebar/Sidebar";
import { ReactFlowProvider } from "@xyflow/react";
  
export function App() {
    return <ColorModeProvider>
        <ReactFlowProvider>
            <div className="flex-layout full-height">
                <div className="flex">
                    <GraphView />
                </div>
                <Sidebar />
            </div>
        </ReactFlowProvider>
    </ColorModeProvider>;
}
