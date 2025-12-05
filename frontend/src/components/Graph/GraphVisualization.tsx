import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    useReactFlow,
    type Connection,
    type Node,
    type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { setGraphData } from "../../store/graphSlice";
import CustomNode from "./CustomNode";
import axiosInstance from "../../config/apiconfig";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";

const nodeTypes: NodeTypes = { custom: CustomNode as any };

const GraphVisualization: React.FC = () => {
    const dispatch = useDispatch();
    const { data } = useSelector((state: any) => state.graph);

    const [connectionSource, setConnectionSource] = useState<string | null>(null);
    const { fitView } = useReactFlow();
    const [loading, setLoading] = useState(false);

    // Memoize node formatting
    const formattedNodes = useMemo(() => {
        if (!data?.nodes?.length) return [];
        return data.nodes.map((n: any) => ({
            id: n.id,
            type: "custom",
            position: n.position || { x: Math.random() * 500, y: Math.random() * 500 },
            data: n.data,
        }));
    }, [data?.nodes]);

    const formattedEdges = useMemo(() => {
        if (!data?.edges?.length) return [];
        return data.edges.map((e: any) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: "smoothstep",
            style: { stroke: "#6b7280", strokeWidth: 2 },
        }));
    }, [data?.edges]);

    const [nodes, setNodes, onNodesChange] = useNodesState(formattedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(formattedEdges);

    // Fetch graph data on mount
    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/hobby/graph");
                dispatch(setGraphData(response.data));
            } catch (error: any) {
                console.error("Failed to fetch graph data:", error);
                toast.error("Failed to load network graph");
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, [dispatch]);

    // Sync local state with Redux state
    useEffect(() => {
        setNodes(formattedNodes);
        setEdges(formattedEdges);
        // Only fit view if we have nodes
        if (formattedNodes.length > 0) {
            setTimeout(() => fitView(), 100);
        }
    }, [formattedNodes, formattedEdges, setNodes, setEdges, fitView]);

    const createRelationship = async (sourceId: string, targetId: string) => {
        if (sourceId === targetId) return;

        setLoading(true);
        try {
            // Check if edge already exists
            const exists = edges.some(
                (e) => (e.source === sourceId && e.target === targetId) ||
                    (e.source === targetId && e.target === sourceId)
            );

            if (exists) {
                toast.info("You are already connected!");
                return;
            }

            // Send friend request via existing API
            await axiosInstance.post(`/friend/send`, { recipientId: targetId });
            toast.success("Friend request sent!");

            // Note: The graph won't update immediately with a new edge until the request is accepted
            // and the backend updates the relationships.
            // For now, we can optimistically add a temporary edge or just wait.

        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to connect";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
            setConnectionSource(null);
        }
    };

    const onNodeClick = useCallback(
        async (_event: React.MouseEvent, node: Node) => {
            if (connectionSource && connectionSource !== node.id) {
                await createRelationship(connectionSource, node.id);
            } else {
                // Toggle selection
                setConnectionSource(connectionSource === node.id ? null : node.id);
            }
        },
        [connectionSource]
    );

    const onConnect = async (connection: Connection) => {
        if (connection.source && connection.target) {
            await createRelationship(connection.source, connection.target);
        }
    };

    if (loading && nodes.length === 0) {
        return <Loader />;
    }

    return (
        <div className="w-full h-full relative bg-slate-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-50"
            >
                <Background />
                <Controls />
            </ReactFlow>

            {connectionSource && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-4 z-10">
                    Select another user to connect
                    <button
                        onClick={() => setConnectionSource(null)}
                        className="ml-2 text-indigo-200 hover:text-white"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border border-slate-200 text-xs text-slate-600 z-10 max-w-xs">
                <p className="font-semibold mb-1">Network Visualization</p>
                <p>• Click a node to select it</p>
                <p>• Click another node to send friend request</p>
                <p>• Drag nodes to rearrange</p>
                <p>• Scroll to zoom</p>
            </div>
        </div>
    );
};

export default GraphVisualization;
