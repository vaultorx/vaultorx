"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Scale,
  AlertTriangle,
  Shield,
  Users,
  Globe,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Last updated: January 20, 2024. Please read these terms carefully
              before using Vaultorx.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                {/* Important Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-600 mb-2">
                        Important Legal Notice
                      </h3>
                      <p className="text-sm">
                        By accessing or using Vaultorx, you acknowledge that you
                        have read, understood, and agree to be bound by these
                        Terms of Service. These terms contain important
                        information about your legal rights, including
                        limitations of liability and dispute resolution
                        provisions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agreement to Terms */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    1. Agreement to Terms
                  </h2>
                  <p className="mb-4">
                    These Terms of Service ("Terms") govern your access to and
                    use of Vaultorx's NFT management platform, website, and
                    services (collectively, the "Services"). By accessing or
                    using our Services, you agree to be bound by these Terms and
                    our Privacy Policy.
                  </p>
                  <p>
                    If you are using the Services on behalf of an organization,
                    you are agreeing to these Terms for that organization and
                    promising that you have the authority to bind that
                    organization to these Terms.
                  </p>
                </section>

                {/* Eligibility */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
                  <div className="bg-muted rounded-lg p-6 mb-4">
                    <h3 className="font-semibold mb-3 text-lg">
                      You must meet the following requirements:
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        • Be at least 18 years old or the age of majority in
                        your jurisdiction
                      </li>
                      <li>
                        • Have the legal capacity to enter into binding
                        contracts
                      </li>
                      <li>
                        • Not be prohibited from receiving our Services under
                        applicable laws
                      </li>
                      <li>• Use the Services only for lawful purposes</li>
                      <li>
                        • Maintain the security of your account credentials
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Services Description */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    3. Services Description
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-500" />
                          <CardTitle className="text-lg">
                            NFT Management
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Secure storage, display, and management of your NFT
                          collections across multiple blockchains with advanced
                          security features.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-500" />
                          <CardTitle className="text-lg">
                            Trading Services
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Facilitation of NFT transactions including buying,
                          selling, and transferring digital assets with
                          integrated security protocols.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-lg text-blue-600">
                      Important Disclaimer
                    </h3>
                    <p className="text-sm">
                      Vaultorx is a non-custodial platform. While we provide
                      security features and infrastructure, you retain control
                      and responsibility for your digital assets. We do not
                      store your private keys and cannot recover lost assets.
                    </p>
                  </div>
                </section>

                {/* User Responsibilities */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    4. User Responsibilities
                  </h2>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Account Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>
                            • Maintain the confidentiality of your login
                            credentials
                          </li>
                          <li>
                            • Enable all available security features (2FA,
                            biometrics)
                          </li>
                          <li>
                            • Monitor your account for unauthorized activity
                          </li>
                          <li>
                            • Notify us immediately of any security breaches
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Prohibited Activities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Illegal or fraudulent activities</li>
                          <li>• Money laundering or terrorist financing</li>
                          <li>• Market manipulation or insider trading</li>
                          <li>
                            • Infringement of intellectual property rights
                          </li>
                          <li>• Distribution of malicious content</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Intellectual Property */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    5. Intellectual Property
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Platform IP</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Vaultorx and its original content, features, and
                          functionality are owned by us and are protected by
                          international copyright, trademark, and other
                          intellectual property laws.
                        </p>
                        <ul className="space-y-1 text-sm">
                          <li>• Software and codebase</li>
                          <li>• User interface design</li>
                          <li>• Branding and trademarks</li>
                          <li>• Documentation and content</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Your Content</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          You retain all rights to your NFTs and content. By
                          using our Services, you grant us a limited license to
                          display and process your content solely for providing
                          the Services.
                        </p>
                        <ul className="space-y-1 text-sm">
                          <li>• NFT artwork and metadata</li>
                          <li>• Collection information</li>
                          <li>• Profile content</li>
                          <li>• User-generated content</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Fees and Payments */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    6. Fees and Payments
                  </h2>

                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-lg">
                      Fee Structure
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Transaction Fees</span>
                        <span className="font-semibold">2.5%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Withdrawal Fees</span>
                        <span className="font-semibold">
                          Network Gas + 0.005 ETH
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span>Premium Features</span>
                        <span className="font-semibold">Variable</span>
                      </div>
                    </div>
                    <p className="text-sm mt-4 text-muted-foreground">
                      All fees are subject to change with 30 days notice. Gas
                      fees are determined by blockchain network conditions and
                      are beyond our control.
                    </p>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    7. Limitation of Liability
                  </h2>

                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6 mb-4">
                    <h3 className="font-semibold mb-3 text-lg text-red-600">
                      Important Limitations
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • We are not liable for market fluctuations or NFT value
                        changes
                      </li>
                      <li>
                        • We are not responsible for blockchain network failures
                        or congestion
                      </li>
                      <li>
                        • We are not liable for user error, including incorrect
                        transactions
                      </li>
                      <li>
                        • Total liability is limited to fees paid in the last 6
                        months
                      </li>
                      <li>
                        • We exclude liability for indirect, incidental, or
                        consequential damages
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Dispute Resolution */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    8. Dispute Resolution
                  </h2>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Governing Law</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          These Terms shall be governed by the laws of the State
                          of Delaware, without regard to its conflict of law
                          provisions. The United Nations Convention on Contracts
                          for the International Sale of Goods is expressly
                          excluded.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Arbitration Agreement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Most disputes can be resolved without resorting to
                          litigation. By agreeing to these Terms, you agree to
                          resolve any disputes through binding arbitration
                          rather than in court.
                        </p>
                        <ul className="space-y-1 text-sm">
                          <li>
                            • Arbitration is conducted by a neutral third party
                          </li>
                          <li>• Proceedings are confidential</li>
                          <li>• Class actions and jury trials are waived</li>
                          <li>• Small claims court actions are preserved</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Termination */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">9. Termination</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">By You</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          You may terminate your account at any time by
                          following the account deletion process in your
                          settings. Outstanding fees must be paid before
                          termination.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">By Us</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          We may suspend or terminate your access to the
                          Services for violation of these Terms, illegal
                          activities, or to protect our platform and users.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">
                    10. Contact Information
                  </h2>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">
                            Legal Inquiries
                          </h3>
                          <p>Email: legal@vaultorx.com</p>
                          <p>
                            Address: 123 Blockchain Avenue, Wilmington, DE 19801
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            General Support
                          </h3>
                          <p>Email: support@vaultorx.com</p>
                          <p>Documentation: docs.vaultorx.com</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
