import { useEffect, useState } from "react";
import axiosInstance from "../config/apiconfig";
import { UserPlus, Hash } from "lucide-react";
import { toast } from "react-toastify";

interface SuggestedUser {
    _id: string;
    fullName: string;
    username: string;
    profilePhoto: string;
    sharedHobbiesCount: number;
    sharedHobbies: string[];
}

const FriendSuggestions = () => {
    const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/hobby/suggestions");
                setSuggestions(response.data);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    const sendFriendRequest = async (userId: string) => {
        try {
            await axiosInstance.post(`/friend/send`, { recipientId: userId });
            toast.success("Friend request sent!");
            // Remove user from suggestions list
            setSuggestions(suggestions.filter(u => u._id !== userId));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send request");
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-slate-500">Loading suggestions...</div>;
    }

    if (suggestions.length === 0) {
        return (
            <div className="p-4 text-center text-slate-500">
                <p>No suggestions found based on your hobbies.</p>
                <p className="text-xs mt-2">Try adding more hobbies to your profile!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Suggested Friends</h3>
                <p className="text-xs text-slate-500">Based on shared interests</p>
            </div>
            <div className="divide-y divide-slate-100 max-h-[calc(100vh-300px)] overflow-y-auto">
                {suggestions.map((user) => (
                    <div key={user._id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="relative">
                                <img
                                    src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                                    alt={user.fullName}
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-indigo-100 text-indigo-600 text-[10px] font-bold px-1.5 rounded-full border border-white">
                                    {user.sharedHobbiesCount}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-slate-900 truncate">{user.fullName}</h4>
                                <p className="text-xs text-slate-500 truncate">@{user.username}</p>

                                <div className="mt-2 flex flex-wrap gap-1">
                                    {user.sharedHobbies.slice(0, 3).map((hobby, idx) => (
                                        <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-pink-50 text-pink-700">
                                            <Hash size={10} className="mr-0.5" />
                                            {hobby}
                                        </span>
                                    ))}
                                    {user.sharedHobbies.length > 3 && (
                                        <span className="text-[10px] text-slate-400">+{user.sharedHobbies.length - 3}</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => sendFriendRequest(user._id)}
                                    className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                                >
                                    <UserPlus size={14} />
                                    Connect
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendSuggestions;
