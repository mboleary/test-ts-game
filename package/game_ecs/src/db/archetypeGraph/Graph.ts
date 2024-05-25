import { hasKeys, sameKeys } from "./util/compareKeys";
import { GraphNode } from "./GraphNode";

export class Graph<ValueType, EdgeType> {
  private root: GraphNode<ValueType, EdgeType> | null = null;
  private readonly nodes: GraphNode<ValueType, EdgeType>[] = [];

  constructor(
    initialValue: ValueType
  ) {
    if (initialValue !== undefined) {
      this.root = new GraphNode(initialValue, []);
    }
  }

  public getNodes() {
    return this.nodes;
  }

  public getRootNode() {
    return this.root;
  }

  public setRootNode(value: ValueType) {
    if (this.root) {
      this.root.value = value;
    } else {
      this.root = new GraphNode(value, []);
    }
  }

  // public addNode(value: ValueType, to: GraphNode<ValueType, EdgeType>, edgeKey: EdgeType) {
  //   const node: GraphNode<ValueType, EdgeType> = new GraphNode(value);
  //   to.addGraphNode(edgeKey, node);
  // }

  public addNode(keys: EdgeType[], value: ValueType) {
    if (!this.root) {
      this.root = new GraphNode(value, keys) as GraphNode<ValueType, EdgeType>;
      this.nodes.push(this.root);
      return;
    }

    // @TODO check if the node already exists with that key

    const newGraphNode = new GraphNode(value, keys);

    // traverse graph, find paths with same keys
    let queue = [this.root];
    let visited = new Set();
    let keysSet = new Set(keys);
    while (queue.length > 0) {
      let curr = queue.pop();
      if (curr && !visited.has(curr)) {
        visited.add(curr);
        // Does this have all keys we're looking for?
        if (sameKeys(keys, curr.getKeys())) {
          // This onde has the same keys as what's passed in
          // @TODO throw an error?
          console.warn('Found GraphNode with same keys, handle this!');
        }

        // Look for keys
        const currKeys = curr.getEdgeKeys();
        const currKeysSet = new Set(currKeys);

        // Get keys that lead to what we're looking for
        const matchingKeys = currKeys.filter((val) => keysSet.has(val));
        for (const k of matchingKeys) {
          const toPush = curr.getGraphNode(k);
          if (toPush) {
            queue.push(toPush);
          }
        }

        // Add connect the new node to missing keys
        const missingKeys = keys.filter(val => !currKeysSet.has(val));
        for (const k of missingKeys) {
          curr.addGraphNode(k, newGraphNode);
        }
      }
    }
  }

  public traverse(keys: EdgeType[]): GraphNode<ValueType, EdgeType> | null {
    if (!this.root) return null;

    let curr = this.root;
    for(const key of keys) {
      const next = curr.getGraphNode(key);
      if (next) {
        curr = next;
      } else {
        return null;
      }
    }

    return curr;
  }
}
