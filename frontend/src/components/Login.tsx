import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../config/apiconfig";
import { useState } from "react";
import { z } from "zod";
import { login } from "../store/authSlicer";
import { CloudCog, Lock, LogIn, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type loginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      localStorage.setItem("token", response?.data?.token);
      const user = await axiosInstance.get("/user/me");

      dispatch(
        login({
          user: user.data,
          token: response.data.token
        })
      );

      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
            <LogIn size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-1 text-slate-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Username"
            placeholder="Enter your username"
            icon={<Mail className="h-5 w-5" />}
            error={errors.username?.message}
            {...register("username")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting || loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
