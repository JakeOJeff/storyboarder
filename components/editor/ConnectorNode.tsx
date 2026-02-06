import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export function ConnectorNode({ selected }: NodeProps) {
    return (
        <div className={`group relative flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm transition-all ${selected ? 'border-[#ec3750] ring-4 ring-[#ec3750]/10' : 'border-zinc-200'}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="!h-2 !w-2 !bg-[#ec3750] !border-white !-left-[4px]"
            />

            <div className={`h-2 w-2 rounded-full transition-colors ${selected ? 'bg-[#ec3750]' : 'bg-zinc-300 group-hover:bg-[#ec3750]/50'}`} />

            <Handle
                type="source"
                position={Position.Right}
                className="!h-2 !w-2 !bg-[#ec3750] !border-white !-right-[4px]"
            />
        </div>
    );
}
