import { useEffect, useState } from "react";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import { Camera, Mail, User, Calendar, Edit2, X, Check, Shield } from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState<any>({});
  const [editModel, setEditModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    profilePic: null,
  });

  // Fetch profile data
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/user/profile");
        const userProfile = data?.userProfile;
        setUserData(userProfile);
        setFormData({
          fullName: userProfile?.fullName || "",
          email: userProfile?.email || "",
          profilePic: null,
        });
      } catch (error: any) {
        console.error("Fetching profile failed:", error?.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewImg(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const updateData = new FormData();
      updateData.append("fullName", formData.fullName);
      updateData.append("email", formData.email);
      if (formData.profilePic) {
        updateData.append("profilePic", formData.profilePic);
      }

      const { data } = await axiosInstance.put("/user/profile", updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserData(data?.updatedUser);
      setEditModel(false);
      setPreviewImg(null);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Profile update failed:", error?.message);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData._id) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto p-6">
      <div className="mb-8 flex flex-col md:flex-row justify-center gap-4 items-center">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your account settings and preferences.</p>
      </div>

      <div className="   ">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <div className="md:col-span-1 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column - Profile Card */}
            <div className="md:sticky md:top-6 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                    <img
                      src={userData?.profilePhoto || `https://ui-avatars.com/api/?name=${userData?.fullName}`}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-white"
                    />
                  </div>
                  <button
                    onClick={() => setEditModel(true)}
                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1">{userData?.fullName}</h2>
                <p className="text-slate-500 text-sm mb-4">@{userData?.username}</p>

                <div className="w-full pt-4 border-t border-slate-100 flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{userData?.friends?.length || 0}</span>
                    <span className="text-slate-500">Friends</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{userData?.friendRequests?.length || 0}</span>
                    <span className="text-slate-500">Requests</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">
                      {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : 'N/A'}
                    </span>
                    <span className="text-slate-500">Joined</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-semibold text-slate-900">Personal Information</h3>
                  <button
                    onClick={() => setEditModel(true)}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                      <div className="flex items-center gap-3 text-slate-700">
                        <User size={18} className="text-slate-400" />
                        <span>{userData?.fullName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Mail size={18} className="text-slate-400" />
                        <span>{userData?.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Gender</label>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Shield size={18} className="text-slate-400" />
                        <span className="capitalize">{userData?.gender || "Not specified"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Joined Date</label>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Calendar size={18} className="text-slate-400" />
                        <span>{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {editModel && (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
                  <button onClick={() => setEditModel(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="flex justify-center">
                    <div className="relative group cursor-pointer">
                      <img
                        src={previewImg || userData?.profilePhoto || `https://ui-avatars.com/api/?name=${userData?.fullName}`}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 group-hover:border-indigo-100 transition-colors"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer">
                        <Camera size={24} />
                        <input
                          type="file"
                          name="profilePic"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditModel(false)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={18} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
