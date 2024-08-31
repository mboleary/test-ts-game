import React from "react";
import { GraphView } from "./views/GraphView";
import { NodeStateProvider } from "./state/nodes/NodeStateProvider";

function MyButton({ title }: { title: string }) {
    return (
      <button onClick={(e) => console.log("hello", e)}>{title}</button>
    );
  }
  
  export function App() {
    return <NodeStateProvider>
        <GraphView />
    </NodeStateProvider>
  }
  