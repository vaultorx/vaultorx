"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, User, Lock, Server, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Last updated: January 20, 2024. Learn how we protect and manage
              your data.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                {/* Introduction */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                  <p className="mb-4">
                    At Vaultorx, we are committed to protecting your privacy and
                    ensuring the security of your personal information. This
                    Privacy Policy explains how we collect, use, disclose, and
                    safeguard your information when you use our NFT management
                    platform.
                  </p>
                  <p>
                    By using Vaultorx, you consent to the data practices
                    described in this policy. If you do not agree with the data
                    practices described in this Privacy Policy, you should not
                    use our platform.
                  </p>
                </section>

                {/* Information We Collect */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    2. Information We Collect
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-500" />
                          <CardTitle className="text-lg">
                            Personal Information
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Name and email address</li>
                          <li>• Wallet addresses</li>
                          <li>• Profile information</li>
                          <li>• Communication preferences</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-green-500" />
                          <CardTitle className="text-lg">Usage Data</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Platform interactions</li>
                          <li>• Transaction history</li>
                          <li>• IP address and device info</li>
                          <li>• Browser type and version</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Server className="h-5 w-5 text-purple-500" />
                          <CardTitle className="text-lg">NFT Data</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Collection information</li>
                          <li>• Transaction details</li>
                          <li>• Smart contract data</li>
                          <li>• Blockchain interactions</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* How We Use Your Information */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    3. How We Use Your Information
                  </h2>
                  <div className="bg-muted rounded-lg p-6 mb-4">
                    <h3 className="font-semibold mb-3 text-lg">
                      Primary Uses:
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        • Provide and maintain our NFT management services
                      </li>
                      <li>
                        • Process transactions and manage your collections
                      </li>
                      <li>
                        • Personalize your experience and improve our platform
                      </li>
                      <li>• Communicate with you about updates and security</li>
                      <li>• Ensure platform security and prevent fraud</li>
                      <li>• Comply with legal obligations and enforce terms</li>
                    </ul>
                  </div>
                </section>

                {/* Data Sharing and Disclosure */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    4. Data Sharing and Disclosure
                  </h2>
                  <p className="mb-4">
                    We do not sell your personal information to third parties.
                    We may share your information only in the following
                    circumstances:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Service Providers</h4>
                        <p className="text-sm text-muted-foreground">
                          Trusted third parties who assist in platform
                          operations, subject to strict data protection
                          agreements.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Legal Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          When required by law, regulation, or legal process, or
                          to protect our rights and users.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Business Transfers</h4>
                        <p className="text-sm text-muted-foreground">
                          In connection with a merger, acquisition, or sale of
                          all or a portion of our assets.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Data Security */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-lg text-green-600">
                      Enterprise-Grade Security
                    </h3>
                    <ul className="space-y-2">
                      <li>• End-to-end encryption for all sensitive data</li>
                      <li>
                        • Multi-factor authentication and biometric security
                      </li>
                      <li>• Regular security audits and penetration testing</li>
                      <li>• Secure blockchain transaction signing</li>
                      <li>• Cold storage for private keys where applicable</li>
                    </ul>
                  </div>
                </section>

                {/* Your Rights */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Access and Control
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Access your personal information</li>
                          <li>• Correct inaccurate data</li>
                          <li>• Delete your account and data</li>
                          <li>• Export your data</li>
                          <li>• Object to processing</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Communication Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Manage email notifications</li>
                          <li>• Control marketing communications</li>
                          <li>• Set transaction alerts</li>
                          <li>• Adjust privacy settings</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Contact Information */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        If you have any questions about this Privacy Policy or
                        our data practices, please contact us:
                      </p>
                      <div className="space-y-2">
                        <p>
                          <strong>Email:</strong> privacy@vaultorx.com
                        </p>
                        <p>
                          <strong>Support:</strong> support@vaultorx.com
                        </p>
                        <p>
                          <strong>Security:</strong> security@vaultorx.com
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Policy Updates */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Policy Updates</h2>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
                    <p>
                      We may update this Privacy Policy from time to time. We
                      will notify you of any changes by posting the new Privacy
                      Policy on this page and updating the "Last updated" date.
                      We will also provide prominent notice within the platform
                      for significant changes.
                    </p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
