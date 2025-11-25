import { useEffect, useState } from "react";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import { Camera, Mail, User, Calendar, Edit2, X, Check, Shield, MapPin, Phone } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">My Profile</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col md:flex-row h-full justify-between">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5"></div>
              <div className="relative flex flex-col items-center p-8 text-center">
                {/* Profile Image */}
                <div className="group relative mb-6">
                  <div className="relative h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 shadow-2xl">
                    <img
                      src={
                        userData?.profilePhoto ||
                        `https://ui-avatars.com/api/?name=${userData?.fullName}&background=6366f1&color=fff&bold=true&size=256`
                      }
                      alt="Profile"
                      className="h-full w-full rounded-full border-4 border-white object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-3 right-3 rounded-full p-3 shadow-2xl transition-all duration-300 hover:scale-110"
                    onClick={() => setEditModel(true)}
                  >
                    <Edit2 size={18} />
                  </Button>
                </div>

                {/* User Info */}
                <h2 className="mb-2 text-2xl font-bold text-slate-900">
                  {userData?.fullName}
                </h2>
                <p className="mb-1 text-slate-600">@{userData?.username}</p>
                <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Active Now
                </div>

                {/* Stats */}
                <div className="grid w-full grid-cols-3 gap-4 border-t border-slate-200/60 pt-6">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-900">
                      {userData?.friends?.length || 0}
                    </span>
                    <span className="text-sm text-slate-500">Friends</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-900">
                      {userData?.friendRequests?.length || 0}
                    </span>
                    <span className="text-sm text-slate-500">Requests</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-900">
                      {userData?.createdAt
                        ? new Date(userData.createdAt).getFullYear()
                        : "N/A"}
                    </span>
                    <span className="text-sm text-slate-500">Joined</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Personal Information Card */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <User size={20} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Full Name
                      </label>
                      <div className="text-sm font-medium text-slate-900">
                        {userData?.fullName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Email Address
                      </label>
                      <div className="text-sm font-medium text-slate-900">
                        {userData?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Shield size={20} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Gender
                      </label>
                      <div className="text-sm font-medium text-slate-900 capitalize">
                        {userData?.gender || "Not specified"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Joined Date
                      </label>
                      <div className="text-sm font-medium text-slate-900">
                        {userData?.createdAt
                          ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 px-6 py-4 bg-slate-50/50">
                  <Button
                    variant="ghost"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    onClick={() => setEditModel(true)}
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </Card>

              {/* Additional Info Card */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Additional Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Location
                      </label>
                      <div className="text-sm font-medium text-slate-900">
                        {userData?.location || "Not specified"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Phone
                      </label>
                      <div className="text-sm font-medium text-slate-900">
                        {userData?.phone || "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
            <Card className="border-0 bg-white shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
                  <button
                    onClick={() => setEditModel(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* Profile Image Upload */}
                <div className="flex justify-center">
                  <div className="group relative cursor-pointer">
                    <div className="relative h-28 w-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5">
                      <img
                        src={
                          previewImg ||
                          userData?.profilePhoto ||
                          `https://ui-avatars.com/api/?name=${userData?.fullName}&background=6366f1&color=fff&bold=true`
                        }
                        alt="Profile Preview"
                        className="h-full w-full rounded-full border-4 border-white object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
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

                {/* Form Fields */}
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                    onClick={() => setEditModel(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                    isLoading={loading}
                  >
                    <Check size={18} /> Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;