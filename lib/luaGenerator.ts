import { Edge } from '@xyflow/react';
import { StoryNode } from './store';

export function generateLuaCode(nodes: StoryNode[], edges: Edge[]): string {
    let lua = `-- Storyboarder Export
local story = {
`;

    nodes.forEach((node) => {
        // Find options/connections from this node
        const outgoingEdges = edges.filter((e) => e.source === node.id);

        lua += `    ["${node.id}"] = {
        text = "${node.data.text.replace(/"/g, '\\"')}",
        image = "${node.data.image || ''}",
        options = {
`;

        // In a real game, you might want mapped text for choices. 
        // Since our edges are simple connections, we'll just link to the target ID.
        if (node.data.options && node.data.options.length > 0) {
            node.data.options.forEach(option => {
                const connectedEdge = outgoingEdges.find(e => e.sourceHandle === option.id);
                if (connectedEdge) {
                    lua += `            { target = "${connectedEdge.target}", text = "${option.text.replace(/"/g, '\\"')}" },\n`;
                }
            });
        } else {
            // Default connection logic (single output)
            outgoingEdges.forEach((edge, index) => {
                lua += `            { target = "${edge.target}", text = "Continue" },\n`;
            });
        }

        lua += `        }
    },\n`;
    });

    lua += `}
return story`;

    return lua;
}
