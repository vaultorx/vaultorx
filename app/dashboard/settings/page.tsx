"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Shield,
  Bell,
  Wallet,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SeedPhraseConfiguration } from "@/components/seed-phrase-configuration";
import { useSearchParams } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  name?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  kycStatus: "pending" | "approved" | "rejected";
  walletBalance: number;
  assignedWallet?: string;
  walletAssignedAt?: string;
  externalWalletSeed: string;
  externalWalletConfigured: boolean;
  seedPhraseConfiguredAt: string;
  createdAt: string;
  updatedAt: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  salesAlerts: boolean;
  bidAlerts: boolean;
  exhibitionUpdates: boolean;
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    username: "",
    name: "",
    email: "",
  });

  const [securityForm, setSecurityForm] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const [notificationForm, setNotificationForm] =
    useState<NotificationSettings>({
      emailNotifications: true,
      pushNotifications: true,
      salesAlerts: true,
      bidAlerts: true,
      exhibitionUpdates: true,
    });

     // Handle URL parameter for active tab
     useEffect(() => {
       const tabFromUrl = searchParams.get("tab");
       if (
         tabFromUrl &&
         ["profile", "security", "notifications", "wallet-security"].includes(
           tabFromUrl
         )
       ) {
         setActiveTab(tabFromUrl);
       }
     }, [searchParams]);

     // Update URL when tab changes
     const handleTabChange = (value: string) => {
       setActiveTab(value);
       // Update URL without page reload
       const newUrl = `/dashboard/settings${
         value !== "profile" ? `?tab=${value}` : ""
       }`;
       window.history.pushState({}, "", newUrl);
     };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [profileResponse, notificationsResponse] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/user/notifications"),
      ]);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setUserProfile(profileData.data);
          setProfileForm({
            username: profileData.data.username || "",
            name: profileData.data.name || "",
            email: profileData.data.email,
          });
          setSecurityForm((prev) => ({
            ...prev,
            twoFactorEnabled: profileData.data.twoFactorEnabled,
          }));
        }
      }

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        if (notificationsData.success) {
          setNotificationForm(notificationsData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully");
        setUserProfile((prev) => (prev ? { ...prev, ...profileForm } : null));
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (securityForm.newPassword && securityForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/user/security", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(securityForm),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Security settings updated successfully");
        setSecurityForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        throw new Error(result.error || "Failed to update security settings");
      }
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update security settings"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationForm),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Notification preferences updated");
      } else {
        throw new Error(result.error || "Failed to update notifications");
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update notifications"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      const response = await fetch("/api/user/two-factor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          enabled
            ? "Two-factor authentication enabled"
            : "Two-factor authentication disabled"
        );
        setSecurityForm((prev) => ({ ...prev, twoFactorEnabled: enabled }));
        if (userProfile) {
          setUserProfile((prev) =>
            prev ? { ...prev, twoFactorEnabled: enabled } : null
          );
        }
      } else {
        throw new Error(
          result.error || "Failed to update two-factor authentication"
        );
      }
    } catch (error) {
      console.error("Error updating two-factor:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update two-factor authentication"
      );
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const response = await fetch("/api/user/verify-email", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Verification email sent successfully");
      } else {
        throw new Error(result.error || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification email"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="wallet-security"
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Wallet Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            "/api/user/notifications",
                            {
                              method: "POST",
                            }
                          );
                          const result = await response.json();
                          if (result.success) {
                            toast.success(
                              "Test notification sent successfully"
                            );
                          } else {
                            throw new Error(result.error);
                          }
                        } catch (error) {
                          toast.error("Failed to send test notification");
                        }
                      }}
                    >
                      Send Test Notification
                    </Button> */}
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={profileForm.username}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                            placeholder="Choose a username"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          disabled
                          className="bg-muted"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          {userProfile?.emailVerified ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <>
                              <Badge
                                variant="secondary"
                                className="bg-yellow-500"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Unverified
                              </Badge>
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0"
                                onClick={resendVerificationEmail}
                              >
                                Resend verification email
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <Button type="submit" disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">KYC Status</span>
                      <Badge
                        variant={
                          userProfile?.kycStatus === "approved"
                            ? "default"
                            : userProfile?.kycStatus === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {userProfile?.kycStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">2FA</span>
                      <Badge
                        variant={
                          userProfile?.twoFactorEnabled
                            ? "default"
                            : "secondary"
                        }
                      >
                        {userProfile?.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Member Since</span>
                      <span className="text-sm text-muted-foreground">
                        {userProfile
                          ? new Date(userProfile.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div> */}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSecurityUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={securityForm.currentPassword}
                            onChange={(e) =>
                              setSecurityForm((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={securityForm.newPassword}
                            onChange={(e) =>
                              setSecurityForm((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={securityForm.confirmPassword}
                            onChange={(e) =>
                              setSecurityForm((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            placeholder="Confirm new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" disabled={saving}>
                        <Key className="h-4 w-4 mr-2" />
                        {saving ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">2FA</p>
                          <p className="text-sm text-muted-foreground">
                            {securityForm.twoFactorEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityForm.twoFactorEnabled}
                        onCheckedChange={handleTwoFactorToggle}
                      />
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                      Two-factor authentication adds an additional layer of
                      security to your account by requiring more than just a
                      password to sign in.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationForm.emailNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationForm((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }));
                        handleNotificationUpdate();
                      }}
                    />
                  </div>

                  {/* <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notificationForm.pushNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationForm((prev) => ({
                          ...prev,
                          pushNotifications: checked,
                        }));
                        handleNotificationUpdate();
                      }}
                    />
                  </div> */}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sales Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your items are sold
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.salesAlerts}
                        onCheckedChange={(checked) => {
                          setNotificationForm((prev) => ({
                            ...prev,
                            salesAlerts: checked,
                          }));
                          handleNotificationUpdate();
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bid Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications for new bids
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.bidAlerts}
                        onCheckedChange={(checked) => {
                          setNotificationForm((prev) => ({
                            ...prev,
                            bidAlerts: checked,
                          }));
                          handleNotificationUpdate();
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Exhibition Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Updates about exhibitions you're participating in
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.exhibitionUpdates}
                        onCheckedChange={(checked) => {
                          setNotificationForm((prev) => ({
                            ...prev,
                            exhibitionUpdates: checked,
                          }));
                          handleNotificationUpdate();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet-security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>External Wallet Configuration</CardTitle>
                  <CardDescription>
                    Configure your external wallet seed phrase for withdrawals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SeedPhraseConfiguration />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Wallet Configured
                    </span>
                    <Badge
                      variant={
                        userProfile?.externalWalletConfigured
                          ? "default"
                          : "secondary"
                      }
                    >
                      {userProfile?.externalWalletConfigured
                        ? "Configured"
                        : "Not Configured"}
                    </Badge>
                  </div>
                  {userProfile?.seedPhraseConfiguredAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Configured On</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(
                          userProfile.seedPhraseConfiguredAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Your seed phrase is encrypted and stored securely</p>
                    <p>• Required for all NFT withdrawals</p>
                    <p>• Can be updated at any time</p>
                    <p>• Never share your seed phrase with anyone</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Information</CardTitle>
                    <CardDescription>
                      Your platform wallet details and balance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Wallet Balance</p>
                        <p className="text-2xl font-bold">
                          {userProfile?.walletBalance?.toFixed(4) || "0.0000"}{" "}
                          ETH
                        </p>
                      </div>
                      <Wallet className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/dashboard/transactions">
                        View Transaction History
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/dashboard/deposit">Deposit Funds</a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/dashboard/withdraw">Withdraw Funds</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
