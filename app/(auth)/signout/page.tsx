"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate sign out process
    const signOut = async () => {
      try {
        // Add your sign out logic here
        // await signOut()

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSigningOut(false);
        setIsComplete(true);

        // Redirect after success
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("Sign out error:", error);
        setIsSigningOut(false);
      }
    };

    signOut();
  }, [router]);

  return (
    <div className="min-h-screen">

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              {isSigningOut && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Signing Out...</h2>
                  <p className="text-muted-foreground mb-6">
                    Please wait while we securely sign you out of your account.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Clearing session data</p>
                    <p>• Securing your account</p>
                    <p>• Redirecting to login</p>
                  </div>
                </>
              )}

              {isComplete && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Signed Out Successfully
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    You have been securely signed out of your account.
                    Redirecting to login...
                  </p>
                  <Button asChild>
                    <a href="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      Go to Login
                    </a>
                  </Button>
                </>
              )}

              {!isSigningOut && !isComplete && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <LogOut className="h-8 w-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Sign Out Failed</h2>
                  <p className="text-muted-foreground mb-6">
                    There was an issue signing you out. Please try again.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <a href="/dashboard">Back to Dashboard</a>
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
