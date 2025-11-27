import { Tabs } from '../tabs/Tabs';
import { Tab } from '../tabs/Tab';
import { NewNodePane } from './panes/NewNodePane';
import { NodeEditor } from './panes/NodeEditor';

export function Sidebar() {

    return (
        <aside className="" style={{width: "400px"}}>
            <Tabs initialTab='new_node_pane'>
                <div className="overflow-y" style={{padding: "5px"}}>
                    <Tab id="new_node_pane" title="Nodes">
                        <NewNodePane />
                    </Tab>
                    <Tab id="node_editor_pane" title="Editor">
                        <NodeEditor />
                    </Tab>
                </div>
            </Tabs>
        </aside>
    );
};
