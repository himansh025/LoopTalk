import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/apiconfig';
import { ArrowLeft, Mail, User as UserIcon, Calendar, Users, Heart } from 'lucide-react';
import { Loader } from '../components/Loader';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Messages from '../components/Messages';

interface UserProfileData {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    profilePhoto: string;
    gender: string;
    createdAt: string;
    friends: any[];
    hobbies?: string[];
}

const UserProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { user } = useSelector((state: any) => state.auth);

    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingRequests, setPendingRequests] = useState<string[]>([]);
    const [openUserChat, setOpenUserChat] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const url = userId ? `/user/profile?userId=${userId}` : '/user/profile';
                const { data } = await axiosInstance.get(url);
                console.log(data);
                setProfile(data.userProfile);
            } catch (err: any) {
                console.error("Failed to fetch profile:", err);
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    const isFriend = profile?.friends?.some((f: any) => f._id === user?._id || f.id === user?._id);
    const isPending = userId && pendingRequests.includes(userId);

    const handleSendRequest = async () => {
        if (!userId) return;
        try {
            await axiosInstance.post("/friend/send", { recipientId: userId });
            toast.success("Friend request sent!");
            setPendingRequests([...pendingRequests, userId]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send request");
        }
    };

    const handleMessage = () => {
        setOpenUserChat(true);
    };

    if (openUserChat && profile) {
        return <Messages userChat={profile} />;
    }

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-slate-500">
                <p className="text-lg mb-4">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                    {/* Cover / Header */}
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative">
                                <img
                                    src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=6366f1&color=fff`}
                                    alt={profile.fullName}
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                                />
                                <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${true ? 'bg-green-500' : 'bg-slate-300'}`} title="Online Status"></div>
                            </div>
                            {/* Actions */}
                            <div className="flex gap-3">
                                {isFriend ? (
                                    <button
                                        onClick={handleMessage}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm shadow-indigo-200"
                                    >
                                        Message
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSendRequest}
                                        disabled={isPending || !userId}
                                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${isPending
                                                ? "bg-yellow-50 text-yellow-600 border-yellow-200 cursor-not-allowed"
                                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        {isPending ? "Request Sent" : "Add Friend"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
                            <p className="text-slate-500">@{profile.username}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column: Info */}
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">About</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-slate-600">
                                            <Mail size={18} className="mr-3 text-slate-400" />
                                            <span className="text-sm">{profile.email}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <UserIcon size={18} className="mr-3 text-slate-400" />
                                            <span className="text-sm capitalize">{profile.gender}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <Calendar size={18} className="mr-3 text-slate-400" />
                                            <span className="text-sm">Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Heart size={16} />
                                        Hobbies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.hobbies && profile.hobbies.length > 0 ? (
                                            profile.hobbies.map((hobby, index) => (
                                                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                                    {hobby}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No hobbies added yet.</p>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Friends / Content */}
                            <div className="md:col-span-2">
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                            <Users size={20} />
                                            Friends
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                                                {profile.friends?.length || 0}
                                            </span>
                                        </h3>
                                    </div>

                                    {profile.friends && profile.friends.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {profile.friends.map((friend: any) => (
                                                <div key={friend._id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer" onClick={() => navigate(`/user/${friend._id}`)}>
                                                    <img
                                                        src={friend.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName)}`}
                                                        alt={friend.fullName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div className="overflow-hidden">
                                                        <p className="font-medium text-slate-900 truncate">{friend.fullName}</p>
                                                        <p className="text-xs text-slate-500 truncate">@{friend.username}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                            <p className="text-slate-500">No friends yet.</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
