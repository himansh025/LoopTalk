import React from "react";
import type {user} from '../types/type.data'
// import { useAppSelector } from "../hooks/hooks";

interface ProfilePageProps {
  user: user;
}

const Profile: React.FC<ProfilePageProps> = ({ user }) => {
// const User= useAppSelector((state)=>state.auth)
// console.log(User,"efd")

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      {/* Profile Photo */}
      <div className="flex flex-col items-center">
        <img
          src={ "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-md"
        />
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {""}
        </h2>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Bio */}
      {user && (
        <div className="mt-6 text-center">
          <p className="text-gray-700">{""}</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-6 border-t pt-4">
        <p className="text-sm text-gray-500">
          Member since: {user ? new Date("esdv").toDateString() : "N/A"}
        </p>
      </div>

      {/* Edit Button */}
      <div className="mt-6 flex justify-center">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
