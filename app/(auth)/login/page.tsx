"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { LoginSchema, LoginFormData } from "@/lib/validations/auth";
import { authenticate } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [nftData, setNftData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  // Extract NFT data from URL parameters
  useEffect(() => {
    const nftParam = searchParams.get("nft");
    const redirect = searchParams.get("redirect");

    if (nftParam) {
      try {
        const decodedNft = JSON.parse(decodeURIComponent(nftParam));
        setNftData(decodedNft);
      } catch (error) {
        console.error("Failed to parse NFT data:", error);
      }
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await authenticate(undefined, formData);
    if (result) {
      setError(result);
    } else {
      // Successful login - redirect to intended page or dashboard
      const redirect = searchParams.get("redirect");
      const nftParam = searchParams.get("nft");

      if (redirect && nftParam) {
        // Redirect to purchase page with NFT data
        router.push(`${redirect}?nft=${nftParam}`);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-slate-400">
              {nftData
                ? `Complete purchase of ${nftData.name}`
                : "Access your NFT marketplace account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {nftData && (
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <img
                    src={nftData.image}
                    alt={nftData.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {nftData.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {nftData.collectionName}
                    </p>
                    <p className="text-sm text-green-400 font-semibold">
                      {nftData.price} {nftData.currency || "ETH"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    {...register("email")}
                    type="email"
                    className="pl-12 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
                    placeholder="Email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 px-3">
                    {errors.email.message}
                  </p>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="pl-12 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 px-3">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-slate-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-center">
                <span className="text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
