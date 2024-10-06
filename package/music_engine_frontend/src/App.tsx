import React from "react";
import { GraphView } from "./views/GraphView";
import { ColorModeProvider } from "./components/context/ColorMode";
  
export function App() {
    return <ColorModeProvider>
        <GraphView />
    </ColorModeProvider>;
}
