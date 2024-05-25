export class GraphNode<ValueType, EdgeType> {

  private edges: Map<EdgeType, GraphNode<ValueType, EdgeType>> = new Map();

  constructor(
    public value: ValueType,
    private keys: EdgeType[]
  ) {}

  public getKeys() {
    return this.keys;
  }

  public getEdgeKeys() {
    return Array.from(this.edges.keys());
  }

  public getGraphNode(edgeKey: EdgeType) {
    return this.edges.get(edgeKey) || null;
  }

  public getConnectedGraphNodes() {
    return Array.from(this.edges.values());
  }

  public addGraphNode(edgeKey: EdgeType, graphNode: GraphNode<ValueType, EdgeType>) {
    if (this.edges.has(edgeKey)) {
      throw new Error('Edge already exists');
    }
    this.edges.set(edgeKey, graphNode);
  }

  public removeGraphNode(edgeKey: EdgeType) {
    if (!this.edges.has(edgeKey)) {
      throw new Error('No edge with that key exists on this node');
    }
    this.edges.delete(edgeKey);
  }
}
