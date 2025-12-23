import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import Loader from "../components/ui/Loader";
import { User, Mail, Calendar, Hash, UserPlus, Check, X, Clock } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<any>(null);
    const [friendshipStatus, setFriendshipStatus] = useState("none");
    const [friendshipId, setFriendshipId] = useState<string | null>(null);
    const [isSender, setIsSender] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`/user/${userId}`);
            setUser(data.user);
            setFriendshipStatus(data.friendshipStatus);
            setFriendshipId(data.friendshipId);
            setIsSender(data.isSender);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch user profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchUserProfile();
    }, [userId]);

    const handleSendRequest = async () => {
        try {
            await axiosInstance.post("/friend/send", { recipientId: userId });
            toast.success("Friend request sent!");
            fetchUserProfile();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send request");
        }
    };

    const handleAcceptRequest = async () => {
        try {
            await axiosInstance.put(`/friend/accept/${friendshipId}`);
            toast.success("Friend request accepted!");
            fetchUserProfile();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to accept request");
        }
    };

    const handleRejectRequest = async () => {
        try {
            await axiosInstance.put(`/friend/reject/${friendshipId}`);
            toast.success("Friend request rejected!");
            fetchUserProfile();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reject request");
        }
    };

    if (loading) return <Loader />;
    if (!user) return <div className="text-center p-10">User not found</div>;

    return (
        <div className=" bg-slate-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Card */}
                <Card className="p-6 flex flex-col md:flex-row items-center gap-6 bg-white shadow-md">
                    <img
                        src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.fullName}`}
                        alt={user.fullName}
                        className="w-32 h-32 rounded-full border-4 border-indigo-100 object-cover"
                    />
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900">{user.fullName}</h1>
                        <p className="text-slate-500">@{user.username}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            {friendshipStatus === "none" && (
                                <Button onClick={handleSendRequest} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                                    <UserPlus size={18} /> Add Friend
                                </Button>
                            )}

                            {friendshipStatus === "pending" && isSender && (
                                <Button disabled className="gap-2 bg-slate-400 cursor-not-allowed">
                                    <Clock size={18} /> Request Sent
                                </Button>
                            )}

                            {friendshipStatus === "pending" && !isSender && (
                                <div className="flex gap-2">
                                    <Button onClick={handleAcceptRequest} className="gap-2 bg-green-600 hover:bg-green-700">
                                        <Check size={18} /> Accept
                                    </Button>
                                    <Button onClick={handleRejectRequest} variant="danger" className="gap-2">
                                        <X size={18} /> Reject
                                    </Button>
                                </div>
                            )}

                            {friendshipStatus === "accepted" && (
                                <Button disabled className="gap-2 bg-green-100 text-green-700 border border-green-200">
                                    <Check size={18} /> Friends
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">About</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600">
                                <User size={18} />
                                <span>{user.gender || "Not specified"}</span>
                            </div>
                            {user.age && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Calendar size={18} />
                                    <span>{user.age} years old</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail size={18} />
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Hobbies */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Hobbies & Interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.hobbies && user.hobbies.length > 0 ? (
                                user.hobbies.map((hobby: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Hash size={14} /> {hobby}
                                    </span>
                                ))
                            ) : (
                                <p className="text-slate-500 italic">No hobbies added yet.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
