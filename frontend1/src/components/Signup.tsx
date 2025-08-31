import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Lock, User } from "lucide-react";
import { MdEmail, MdPassword } from "react-icons/md";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be matched"),
});

type SignupFormData = z.infer<typeof registerSchema>;

function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await axiosInstance.post("/user/register", data);
      if (response?.data) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-white to-gray-100 rounded-xl shadow-lg p-8 mt-10">
      <div className="text-center mb-8">
        <div className="bg-indigo-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <UserPlus className="text-indigo-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
        <p className="text-gray-600 mt-2">Join us to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <div className="flex gap-3 ">
            <User className=" text-gray-400" size={18} />
            <input type="text" {...register("fullName")} className="input-field" placeholder="John Doe" />
          </div>
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
         <div className="flex gap-3 ">
            <User className=" text-gray-400" size={18} />
            <input type="text" {...register("username")} className="input-field" placeholder="john123" />
          </div>
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex gap-3 ">
            <MdEmail className=" text-gray-400" size={18} />
            <input type="email" {...register("email")} className="input-field" placeholder="email@example.com" />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
           <div className="flex gap-3 ">
            <Lock className=" text-gray-400" size={18} />
            <input type="password" {...register("password")} className="input-field" placeholder="••••••••" />
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="flex gap-3 ">
            <Lock className=" text-gray-400" size={18} />
            <input type="password" {...register("confirmPassword")} className="input-field" placeholder="••••••••" />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
           <span className="bg-blue-400  px-5 py-1 rounded-2xl text-white">Register</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Signup;
