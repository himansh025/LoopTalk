import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Lock, User, Mail } from "lucide-react";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be matched"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
            <UserPlus size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
          <p className="mt-1 text-slate-500">Join us to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            icon={<User className="h-5 w-5" />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            label="Username"
            placeholder="john123"
            icon={<User className="h-5 w-5" />}
            error={errors.username?.message}
            {...register("username")}
          />

          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            icon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
          >
            Register
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Signup;
