import { useEffect, useState } from "react";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import { Camera, Mail, User, Calendar, Edit2, X, Check, Shield } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewImg(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <div className="mb-8 flex flex-col items-center justify-center gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <Card className="glass sticky top-6 flex flex-col items-center p-6 text-center">
            <div className="group relative mb-4">
              <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
                <img
                  src={
                    userData?.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${userData?.fullName}`
                  }
                  alt="Profile"
                  className="h-full w-full rounded-full border-4 border-white object-cover"
                />
              </div>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full p-2 shadow-lg"
                onClick={() => setEditModel(true)}
              >
                <Edit2 size={16} />
              </Button>
            </div>

            <h2 className="mb-1 text-xl font-bold text-slate-900">
              {userData?.fullName}
            </h2>
            <p className="mb-4 text-sm text-slate-500">@{userData?.username}</p>

            <div className="flex w-full justify-between border-t border-slate-100 pt-4 text-sm">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">
                  {userData?.friends?.length || 0}
                </span>
                <span className="text-slate-500">Friends</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">
                  {userData?.friendRequests?.length || 0}
                </span>
                <span className="text-slate-500">Requests</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).getFullYear()
                    : "N/A"}
                </span>
                <span className="text-slate-500">Joined</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          <Card className="glass overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="font-semibold text-slate-900">Personal Information</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-600 hover:text-indigo-700"
                onClick={() => setEditModel(true)}
              >
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <div className="flex items-center gap-3 text-slate-700">
                  <User size={18} className="text-slate-400" />
                  <span>{userData?.fullName}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail size={18} className="text-slate-400" />
                  <span>{userData?.email}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Gender
                </label>
                <div className="flex items-center gap-3 text-slate-700">
                  <Shield size={18} className="text-slate-400" />
                  <span className="capitalize">
                    {userData?.gender || "Not specified"}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Joined Date
                </label>
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar size={18} className="text-slate-400" />
                  <span>
                    {userData?.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {editModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
              <button
                onClick={() => setEditModel(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="flex justify-center">
                <div className="group relative cursor-pointer">
                  <img
                    src={
                      previewImg ||
                      userData?.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${userData?.fullName}`
                    }
                    alt="Profile Preview"
                    className="h-24 w-24 rounded-full border-4 border-slate-100 object-cover transition-colors group-hover:border-indigo-100"
                  />
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
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
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={() => setEditModel(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  isLoading={loading}
                >
                  <Check size={18} /> Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
