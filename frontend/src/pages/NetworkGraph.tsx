import { ReactFlowProvider } from "@xyflow/react";
import GraphVisualization from "../components/Graph/GraphVisualization";
import FriendSuggestions from "../components/FriendSuggestions";

const NetworkGraph = () => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-slate-800">Friends Network</h1>
                <p className="text-slate-500 text-sm">Explore connections based on shared interests</p>
            </div>
            <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
                <div className="flex-1 relative h-full">
                    <ReactFlowProvider>
                        <GraphVisualization />
                    </ReactFlowProvider>
                </div>

                <div className="w-full md:w-80 border-l border-slate-200 bg-white h-full overflow-y-auto p-4 hidden md:block">
                    <FriendSuggestions />
                </div>
            </div>
        </div>
    );
};

export default NetworkGraph;
