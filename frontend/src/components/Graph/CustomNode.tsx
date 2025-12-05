import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface CustomNodeData extends Record<string, unknown> {
    popularityScore: number;
    username: string;
    fullName: string;
    profilePhoto?: string;
    age?: number;
    friends?: string[];
    hobbies: string[];
    _id: string;
    id: string;
}

const CustomNode: React.FC<NodeProps<React.ComponentProps<any>>> = ({ data }) => {
    const nodeData = data as unknown as CustomNodeData;

    const baseSize = 120;
    const score = nodeData.popularityScore || 0;
    const sizeMultiplier = 1 + (score * 0.1);
    const nodeSize = baseSize * sizeMultiplier;

    // Original color logic: Blue-ish with intensity based on score
    const intensity = Math.min(100 + score * 20, 300);
    const backgroundColor = `rgba(59, 130, ${intensity}, 0.8)`;

    return (
        <div className="relative">
            <Handle type="target" position={Position.Top} className="!bg-slate-400" />

            <div
                className="rounded-lg shadow-lg border-2 border-white transition-all duration-200 hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center p-3 text-white overflow-hidden"
                style={{
                    width: nodeSize,
                    height: nodeSize,
                    backgroundColor,
                }}
            >
                <div className="text-lg font-bold text-center mb-1 leading-tight">
                    {nodeData.username || nodeData.fullName}
                </div>

                {nodeData.age && (
                    <div className="text-sm opacity-90 mb-1">Age: {nodeData.age}</div>
                )}

                <div className="text-xs opacity-80 text-center">
                    Score: {score.toFixed(1)}
                </div>

                <div className="text-xs opacity-70 text-center mt-1">
                    Friends: {nodeData.friends?.length || 0}
                </div>

                <div className="text-xs opacity-70 text-center mt-1">
                    Hobbies: {nodeData.hobbies?.length || 0}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
        </div>
    );
};

export default CustomNode;
