export const nodeTypeBindings: Record<string, string> = {
    default: 'defaultNode',
    graphical_analyser_node: 'CanvasNode'
};

export function getNodeTypeBinding(nodeType: string, bindings: Record<string, string>) {
    if (bindings[nodeType]) return bindings[nodeType];
    return bindings.default;
}