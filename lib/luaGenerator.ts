import { Edge } from '@xyflow/react';
import { StoryNode } from './store';

export function generateLuaCode(nodes: StoryNode[], edges: Edge[]): string {
    let lua = `-- Storyboarder Export
local story = {
`;

    nodes.forEach((node) => {
        const outgoingEdges = edges.filter((e) => e.source === node.id);
        const data = node.data;

        lua += `    ["${node.id}"] = {
        title = "${(data.title || '').replace(/"/g, '\\"')}",
        visuals = {
            background = "${data.visuals.background}",
            transition = "${data.visuals.transition}",
            characters = { ${data.visuals.characters.map(c => `"${c}"`).join(', ')} }
        },
        audio = {
            bgm = "${data.audio.bgm}",
            sfx = "${data.audio.sfx}"
        },
        dialogue = {
`;

        data.dialogue.forEach((d) => {
            lua += `            { speaker = "${d.speaker.replace(/"/g, '\\"')}", text = "${d.text.replace(/"/g, '\\"')}", image = "${d.image || ''}", animation = "${d.animation || ''}" },\n`;
        });

        lua += `        },
        choices = {
`;

        if (data.choices && data.choices.length > 0) {
            data.choices.forEach(choice => {
                const connectedEdge = outgoingEdges.find(e => e.sourceHandle === choice.id);
                if (connectedEdge) {
                    lua += `            { target = "${connectedEdge.target}", text = "${choice.text.replace(/"/g, '\\"')}" },\n`;
                }
            });
        } else {
            // Default connection logic (single output)
            outgoingEdges.forEach((edge) => {
                lua += `            { target = "${edge.target}", text = "Continue" },\n`;
            });
        }

        lua += `        },
        logic = {
            python = [=[${data.logic.python}]=]
        }
    },\n`;
    });

    lua += `}
return story`;

    return lua;
}
