import { useEffect, useState } from "react";
import axiosInstance from "../config/apiconfig";

const Profile = () => {
  const [userData, setUserData] = useState<any>({});
  const [editModel, setEditModel] = useState(false);
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
    } catch (error: any) {
      console.error("Profile update failed:", error?.message);
    }
  };

  // Edit profile modal
  if (editModel) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <img
                src={ userData?.profilePhoto ||previewImg || "/default-avatar.png"}
                alt="Not yet"
                className="w-24 h-24 text-center rounded-full border  border-sky-600  object-cover mb-2"
              />
         
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                placeholder="image"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                placeholder="Enter your name"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditModel(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main profile view
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      {/* Profile Photo */}
      <div className="flex flex-col items-center">
        <img
          src={userData?.profilePhoto || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-md object-cover"
        />
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {userData?.fullName}
        </h2>
        <p className="text-gray-500">{userData?.email}</p>
      </div>

      {/* Additional Info */}
      <div className="mt-6 border-t pt-4">
        <p className="text-sm text-gray-500">
          Member since:{" "}
          {userData?.createdAt
            ? new Date(userData?.createdAt).toDateString()
            : "N/A"}
        </p>
      </div>

      {/* Edit Button */}
      <div className="mt-6 flex justify-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={() => setEditModel(true)}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
