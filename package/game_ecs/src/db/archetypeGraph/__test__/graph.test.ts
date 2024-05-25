/**
 * Tests the graph implementation
 */

import test, { ExecutionContext } from "ava";
import { ComponentKeyType } from "../../../type/ComponentKey.type";
import { Graph } from "../Graph";

let graph: Graph<string, ComponentKeyType>;

function setup() {
  graph = new Graph("root");
}

function getKey(label: string) {
  return Symbol.for(label);
}

test.beforeEach(() => {
  setup();
});

test("Graph is initialized", (t) => {
  if (graph) t.pass();
});

test.serial("Graph.getRootNode", (t) => {
  const root = graph.getRootNode();

  t.assert(root !== null, "Root is not null");
  t.assert(root?.value === 'root', "Root value is correct");
  t.assert(root?.getKeys().length === 0, "Root node should not have keys");
});

test.serial("Graph.addNode directly to root", (t) => {
  const root = graph.getRootNode();

  function createNode(key: string, t: ExecutionContext) {
    graph.addNode([getKey(key)], key);
  }

  function testForNode(key: string, t: ExecutionContext) {
    const nodeA = root?.getGraphNode(getKey(key));
    t.assert(nodeA, `Node ${key} is not null`);
    t.assert(nodeA?.value === key, `Node ${key} has the correct value`);
    t.assert(nodeA?.getKeys().includes(getKey(key)));
  }

  createNode("A", t);
  createNode("B", t);
  createNode("C", t);

  const edgeArr = root?.getEdgeKeys();

  t.assert(edgeArr, 'edgeArr is defined and not empty');
  t.assert(edgeArr?.includes(getKey("A")), "Edge for A is present");
  t.assert(edgeArr?.includes(getKey("B")), "Edge for B is present");
  t.assert(edgeArr?.includes(getKey("C")), "Edge for C is present");

  testForNode("A", t);
  testForNode("B", t);
  testForNode("C", t);
});

test.serial("Graph.addNode multiple layers", (t) => {
  const root = graph.getRootNode();

  function createNode(keys: string[]) {
    return graph.addNode(keys.map(k => getKey(k)), keys.join());
  }

  // function testForNode(keys: string[], t: ExecutionContext) {
  //   const nodeA = root?.getGraphNode(getKey(key));
  //   t.assert(nodeA, `Node ${key} is not null`);
  //   t.assert(nodeA?.value === key, `Node ${key} has the correct value`);
  //   t.assert(nodeA?.getKeys().includes(getKey(key)));
  // }

  createNode(["A"]);
  createNode(["B", "C"]);
  createNode(["C"]);
  createNode(["A", "D"]);

  const edgeArr = root?.getEdgeKeys();

  t.assert(edgeArr, 'edgeArr is defined and not empty');
  t.assert(edgeArr?.includes(getKey("A")), "Edge for A is present");
  t.assert(edgeArr?.includes(getKey("B")), "Edge for B is present");
  t.assert(edgeArr?.includes(getKey("C")), "Edge for C is present");

  

  // testForNode("A", t);
  // testForNode("B", t);
  // testForNode("C", t);
});
