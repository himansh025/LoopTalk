import { useEffect, useState } from "react";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import { Camera, Mail, User, Calendar, Edit2, X, Check, Shield, MapPin, Phone, Hash, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Loader from "../components/ui/Loader";

const Profile = () => {
  const [userData, setUserData] = useState<any>({});
  const [editModel, setEditModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    profilePic: null,
    age: "",
  });
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("info");

  const fetchRequests = async () => {
    try {
      const { data } = await axiosInstance.get("/friend/pending");
      setPendingRequests(data.requests);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await axiosInstance.put(`/friend/accept/${requestId}`);
      toast.success("Friend request accepted");
      fetchRequests();
      // Refresh profile to update friend count
      const { data } = await axiosInstance.get("/user/profile");
      setUserData(data?.userProfile);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axiosInstance.put(`/friend/reject/${requestId}`);
      toast.success("Friend request rejected");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject");
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/user/profile");
        const userProfile = data?.userProfile;
        setUserData(userProfile);
        setHobbies(userProfile?.hobbies || []);
        setFormData({
          fullName: userProfile?.fullName || "",
          email: userProfile?.email || "",
          age: userProfile?.age || "",
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
    fetchRequests();
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

  const handleAddHobby = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && hobbyInput.trim()) {
      e.preventDefault();
      if (!hobbies.includes(hobbyInput.trim())) {
        setHobbies([...hobbies, hobbyInput.trim()]);
        setHobbyInput("");
      }
    }
  };

  const removeHobby = (hobbyToRemove: string) => {
    setHobbies(hobbies.filter(h => h !== hobbyToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const updateData = new FormData();
      updateData.append("fullName", formData.fullName);
      updateData.append("email", formData.email);
      if (formData.age) updateData.append("age", formData.age);

      // Append hobbies individually or as JSON string depending on backend handling
      // Since backend expects array, we might need to send JSON if using FormData
      // Or we can modify backend to parse JSON string for hobbies
      // For now, let's assume we send a separate request for hobbies or backend handles it

      // Let's use a separate API call for hobbies if needed, but here we'll try to send it
      // Since we are using FormData for file upload, arrays are tricky.
      // Let's send hobbies as JSON string and update backend to parse it if needed
      // OR better: Update user profile first, then update hobbies if they changed

      if (formData.profilePic) {
        updateData.append("profilePic", formData.profilePic);
      }

      // First update profile info and photo
      await axiosInstance.put("/user/profile", updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Then update hobbies and age via JSON request (cleaner)
      await axiosInstance.put("/user/profile", {
        fullName: formData.fullName,
        email: formData.email,
        age: formData.age,
        hobbies: hobbies
      });

      // Refetch profile to get updated data
      const response = await axiosInstance.get("/user/profile");
      setUserData(response.data.userProfile);

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
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-4 md:py-8">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">My Profile</h1>

          <p className="mt-2 md:mt-3 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex  flex-col  md:flex-row ">


          {/* Right Column - Details */}
          <div className="w-full">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "info" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab("hobbies")}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "hobbies" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                Hobbies
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "requests" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                Requests ({pendingRequests.length})
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Personal Information Card */}
              {activeTab === "info" && (
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg md:shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 md:px-6 py-3 md:py-4">
                    <h3 className="text-base md:text-lg font-semibold text-white">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4 rounded-lg p-3 md:p-4 transition-colors hover:bg-slate-50/50">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0">
                        <User size={18} className="md:size-[20px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Full Name
                        </label>
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {userData?.fullName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4 rounded-lg p-3 md:p-4 transition-colors hover:bg-slate-50/50">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                        <Mail size={18} className="md:size-[20px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Email Address
                        </label>
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {userData?.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4 rounded-lg p-3 md:p-4 transition-colors hover:bg-slate-50/50">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                        <Shield size={18} className="md:size-[20px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Gender
                        </label>
                        <div className="text-sm font-medium text-slate-900 capitalize">
                          {userData?.gender || "Not specified"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4 rounded-lg p-3 md:p-4 transition-colors hover:bg-slate-50/50">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                        <Calendar size={18} className="md:size-[20px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Joined Date
                        </label>
                        <div className="text-sm font-medium text-slate-900">
                          {userData?.createdAt
                            ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid w-full grid-cols-3 gap-3 md:gap-4 border-t border-slate-200/60 p-4 md:p-6 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <span className="text-lg md:text-2xl font-bold text-indigo-600">
                        {userData?.friends?.length || 0}
                      </span>
                      <span className="text-xs md:text-sm font-medium text-slate-500">Friends</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <span className="text-lg md:text-2xl font-bold text-purple-600">
                        {userData?.hobbies?.length || 0}
                      </span>
                      <span className="text-xs md:text-sm font-medium text-slate-500">Hobbies</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} className="text-green-500" />
                        <span className="text-lg md:text-2xl font-bold text-green-600">
                          {userData?.popularityScore || 0}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm font-medium text-slate-500">Popularity</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 px-4 md:px-6 py-3 md:py-4 bg-slate-50/50">
                    <Button
                      variant="ghost"
                      className="text-sm md:text-base text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto"
                      onClick={() => setEditModel(true)}
                    >
                      <Edit2 size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </Card>
              )}

              {/* Hobbies & Interests Card */}
              {activeTab === "hobbies" && (
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg md:shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 md:px-6 py-3 md:py-4">
                    <h3 className="text-base md:text-lg font-semibold text-white">Hobbies & Interests</h3>
                  </div>

                  <div className="p-4 md:p-6">
                    {userData?.hobbies && userData.hobbies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userData.hobbies.map((hobby: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-50 text-pink-700 border border-pink-100"
                          >
                            <Hash size={14} className="mr-1 opacity-50" />
                            {hobby}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <p>No hobbies added yet. Edit profile to add some!</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Friend Requests Card */}
              {activeTab === "requests" && (
                pendingRequests.length > 0 ? (
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg md:shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 md:px-6 py-3 md:py-4">
                      <h3 className="text-base md:text-lg font-semibold text-white">Friend Requests</h3>
                    </div>
                    <div className="p-4 md:p-6 space-y-3">
                      {pendingRequests.map((req) => (
                        <div key={req._id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                          <div className="flex items-center gap-3">
                            <img
                              src={req.requester.profilePhoto || `https://ui-avatars.com/api/?name=${req.requester.fullName}`}
                              alt={req.requester.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <h4 className="font-medium text-slate-900 text-sm">{req.requester.fullName}</h4>
                              <p className="text-xs text-slate-500">@{req.requester.username}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAccept(req._id)} className="bg-green-600 hover:bg-green-700 h-8 px-3">
                              <Check size={14} />
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleReject(req._id)} className="h-8 px-3">
                              <X size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <div className="text-center py-10 text-slate-500 bg-white/50 rounded-xl">
                    <p>No pending friend requests.</p>
                  </div>
                )
              )}

              {/* Additional Info Card - Show only in info tab */}
              {activeTab === "info" && (
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg md:shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-4 md:px-6 py-3 md:py-4">
                    <h3 className="text-base md:text-lg font-semibold text-white">Additional Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4 rounded-lg p-3 md:p-4 transition-colors hover:bg-slate-50/50">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 flex-shrink-0">
                        <MapPin size={18} className="md:size-[20px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Location
                        </label>
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {userData?.location || "Not specified"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4 rounded-lg p-3 md:p-4 transition-colors hover:bg-slate-50/50">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-red-100 text-red-600 flex-shrink-0">
                        <Phone size={18} className="md:size-[20px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Phone
                        </label>
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {userData?.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-md mx-3 sm:mx-4 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <Card className="border-0 glass shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-base md:text-lg font-semibold text-white">Edit Profile</h2>
                  <button
                    onClick={() => setEditModel(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={18} className="md:size-[20px]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 p-4 md:p-6">
                {/* Profile Image Upload */}
                <div className="flex justify-center">
                  <div className="group relative cursor-pointer">
                    <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5">
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
                      <Camera size={20} className="md:size-[24px]" />
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
                <div className="space-y-3 md:space-y-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm md:text-base"
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    placeholder="Enter your email address"
                    className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm md:text-base"
                  />

                  <Input
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                    className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm md:text-base"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Hobbies</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Hash className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        value={hobbyInput}
                        onChange={(e) => setHobbyInput(e.target.value)}
                        onKeyDown={handleAddHobby}
                        placeholder="Type hobby and press Enter"
                        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hobbies.map((hobby, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {hobby}
                            <button
                              type="button"
                              onClick={() => removeHobby(hobby)}
                              className="hover:text-indigo-900"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors text-sm md:text-base"
                    onClick={() => setEditModel(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm md:text-base"
                    isLoading={loading}
                  >
                    <Check size={16} className="md:size-[18px]" /> Save Changes
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