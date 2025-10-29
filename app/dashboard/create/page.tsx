"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { MintSteps } from "@/components/mint-steps";
import { MintUploadStep } from "@/components/mint-upload-step";
import { MintDetailsStep } from "@/components/mint-details-step";
import { MintPricingStep } from "@/components/mint-pricing-step";
import { MintReviewStep } from "@/components/mint-review-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardFooter } from "@/components/dashboard-footer";
import CreateClient from "./component/create-client";

const MINT_STEPS = [
  { id: 1, title: "Upload", description: "Upload your asset" },
  { id: 2, title: "Details", description: "Add NFT details" },
  { id: 3, title: "Pricing", description: "Set price & royalties" },
  { id: 4, title: "Review", description: "Review & mint" },
];

export default function CreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<
    Array<{ trait_type: string; value: string }>
  >([]);
  const [saleType, setSaleType] = useState<
    "fixed" | "auction" | "not-for-sale"
  >("fixed");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [royalty, setRoyalty] = useState(5);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMint = async () => {
    setIsProcessing(true);

    // Simulate minting process
    // In production, this would:
    // 1. Upload file to IPFS
    // 2. Create metadata JSON and upload to IPFS
    // 3. Call smart contract safeMint function
    // 4. Wait for transaction confirmation
    // 5. Store NFT data in database

    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or NFT detail page
      router.push("/dashboard");
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedFile !== null;
      case 2:
        return name.trim() !== "";
      case 3:
        return (
          saleType === "not-for-sale" ||
          (price !== "" && Number.parseFloat(price) > 0)
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen">
      <CreateClient />
    </div>
  );
}
