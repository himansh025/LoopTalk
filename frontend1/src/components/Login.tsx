import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../config/apiconfig";
import { useState } from "react";
import { z } from "zod";
import { useAppDispatch } from "../hooks/hooks";
import { login } from "../store/authSlicer";
import { Lock, LogIn, Mail } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type loginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginFormData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/login", data);
      const userData = response.data;

      dispatch(
        login({
          user: {
            id: userData._id,
            email: userData.email,
            name: userData.fullName,
          },
        })
      );

      sessionStorage.setItem("token", response?.data?.token.userToken);
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-100 rounded-full p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center shadow-sm">
            <LogIn className="text-indigo-600" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                {...register("username")}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                {...register("password")}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
            disabled={isSubmitting || loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
