"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/header";
import { MintSteps } from "@/components/mint-steps";
import { MintUploadStep } from "@/components/mint-upload-step";
import { MintDetailsStep } from "@/components/mint-details-step";
import { MintPricingStep } from "@/components/mint-pricing-step";
import { MintReviewStep } from "@/components/mint-review-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Rocket, Sparkles, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { nftService } from "@/services/nft-service";
import { useSession } from "next-auth/react";

// Zod Schema for form validation
const mintFormSchema = z.object({
  // Step 1: Upload
  file: z
    .instanceof(File, { message: "Please upload a file" })
    .refine(
      (file) => file.size <= 50 * 1024 * 1024,
      "File size must be less than 50MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type.startsWith("audio/") ||
        file.type === "application/json",
      "Please upload an image, video, audio, or JSON file"
    ),

  // Step 2: Details
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  collectionId: z.string().min(1, "Collection is required"),
  category: z.string().min(1, "Category is required"),
  rarity: z.enum(["Common", "Rare", "Epic", "Legendary"]),
  attributes: z
    .array(
      z.object({
        trait_type: z.string().min(1, "Trait type is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .max(20, "Maximum 20 attributes allowed"),

  // Step 3: Pricing
  saleType: z.enum(["fixed", "auction", "not-for-sale"]),
  price: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      "Price must be a positive number"
    ),
  currency: z.enum(["ETH", "WETH", "USDC"]).default("ETH"),
  royalty: z
    .number()
    .min(0, "Royalty must be at least 0%")
    .max(20, "Royalty cannot exceed 20%")
    .default(5),

  // Step 4: Review
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

type MintFormData = z.infer<typeof mintFormSchema>;

const MINT_STEPS = [
  { id: 1, title: "Upload", description: "Upload your digital asset" },
  { id: 2, title: "Details", description: "Add NFT metadata" },
  { id: 3, title: "Pricing", description: "Set price & royalties" },
  { id: 4, title: "Review", description: "Confirm & mint" },
];

export default function CreateClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<MintFormData>({
    resolver: zodResolver(mintFormSchema),
    mode: "onChange",
    defaultValues: {
      saleType: "fixed",
      currency: "ETH",
      royalty: 5,
      attributes: [],
      termsAccepted: false,
      rarity: "Common",
      category: "art",
    },
  });

  const watchedValues = watch();
  const saleType = watch("saleType");

  const handleFileSelect = (file: File | null) => {
    setValue("file", file as any, { shouldValidate: true });
    if (file && file.type && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof MintFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["file"];
        break;
      case 2:
        fieldsToValidate = [
          "name",
          "description",
          "collectionId",
          "category",
          "rarity",
          "attributes",
        ];
        break;
      case 3:
        fieldsToValidate =
          saleType === "not-for-sale"
            ? ["royalty"]
            : ["price", "currency", "royalty"];
        break;
    }

    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setMintError(null); // Clear errors when progressing
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMintError(null); // Clear errors when going back
    }
  };

 const onSubmit = async (data: MintFormData) => {
   if (!session?.user?.email) {
     setMintError("You must be logged in to mint an NFT");
     return;
   }

   // Validate terms acceptance
   if (!data.termsAccepted) {
     setMintError("You must accept the terms and conditions");
     return;
   }

   setIsProcessing(true);
   setMintError(null);

   try {
     console.log("Starting NFT minting process...", {
       name: data.name,
       collectionId: data.collectionId,
       hasFile: !!data.file,
     });

     const response = await nftService.createNFT({
       name: data.name,
       description: data.description || "",
       collectionId: data.collectionId,
       category: data.category,
       rarity: data.rarity,
       attributes:
         data.attributes.length > 0
           ? data.attributes.reduce((acc, attr) => {
               acc[attr.trait_type] = attr.value;
               return acc;
             }, {} as Record<string, any>)
           : undefined,
       image: data.file,
     });

     console.log("NFT creation response:", response);

     if (response.success) {
       console.log("NFT created successfully:", response.data.id);

       // If the NFT should be listed for sale
       if (data.saleType !== "not-for-sale" && data.price) {
         console.log("Listing NFT for sale...");
         await nftService.listNFT(
           response.data.id,
           parseFloat(data.price),
           data.currency
         );
       }

       // Redirect to the newly created NFT
       console.log("Redirecting to NFT page...");
       router.push(`/nft/${response.data.id}`);
     } else {
       console.error("NFT creation failed:", response.message);
       setMintError(response.message || "Failed to mint NFT");
     }
   } catch (error) {
     console.error("Minting failed:", error);
     setMintError("An error occurred while minting your NFT");
   } finally {
     setIsProcessing(false);
   }
 };


  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!watchedValues.file && !errors.file;
      case 2:
        return !!watchedValues.name && !errors.name;
      case 3:
        if (saleType === "not-for-sale") return true;
        return (
          !!watchedValues.price &&
          parseFloat(watchedValues.price) > 0 &&
          !errors.price
        );
      case 4:
        return isValid;
      default:
        return false;
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MintUploadStep
              onFileSelect={handleFileSelect}
              selectedFile={(watchedValues.file as File) ?? null}
            />
            {errors.file && (
              <p className="text-red-400 text-sm mt-2">{errors.file.message}</p>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MintDetailsStep
              name={watchedValues.name ?? ""}
              description={watchedValues.description ?? ""}
              attributes={watchedValues.attributes ?? []}
              collectionId={watchedValues.collectionId ?? ""}
              category={watchedValues.category ?? "art"}
              rarity={watchedValues.rarity ?? "Common"}
              onNameChange={(value) =>
                setValue("name", value, { shouldValidate: true })
              }
              onDescriptionChange={(value) =>
                setValue("description", value, {
                  shouldValidate: true,
                })
              }
              onAttributesChange={(value) =>
                setValue("attributes", value, {
                  shouldValidate: true,
                })
              }
              onCollectionChange={(value) =>
                setValue("collectionId", value, {
                  shouldValidate: true,
                })
              }
              onCategoryChange={(value) =>
                setValue("category", value, { shouldValidate: true })
              }
              onRarityChange={(value) =>
                setValue(
                  "rarity",
                  value as "Common" | "Rare" | "Epic" | "Legendary",
                  { shouldValidate: true }
                )
              }
            />
            {(errors.name ||
              errors.collectionId ||
              errors.category ||
              errors.rarity) && (
              <p className="text-red-400 text-sm mt-2">
                Please fill in all required fields
              </p>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MintPricingStep
              saleType={watchedValues.saleType ?? "fixed"}
              price={watchedValues.price ?? ""}
              currency={watchedValues.currency ?? "ETH"}
              royalty={watchedValues.royalty ?? 5}
              onSaleTypeChange={(value) =>
                setValue("saleType", value, { shouldValidate: true })
              }
              onPriceChange={(value) =>
                setValue("price", value, { shouldValidate: true })
              }
              onCurrencyChange={(value) =>
                setValue("currency", value as "ETH" | "WETH" | "USDC", {
                  shouldValidate: true,
                })
              }
              onRoyaltyChange={(value) =>
                setValue("royalty", value, { shouldValidate: true })
              }
            />
            {errors.price && (
              <p className="text-red-400 text-sm mt-2">
                {errors.price.message}
              </p>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MintReviewStep
              file={(watchedValues.file as File) ?? null}
              preview={preview}
              name={watchedValues.name ?? ""}
              description={watchedValues.description ?? ""}
              attributes={watchedValues.attributes ?? []}
              saleType={watchedValues.saleType ?? "fixed"}
              price={watchedValues.price ?? ""}
              currency={watchedValues.currency ?? "ETH"}
              royalty={watchedValues.royalty ?? 5}
              isProcessing={isProcessing}
              gasFee="0.0045"
              onMint={handleSubmit(onSubmit)} // This should just be handleSubmit(onSubmit)
              termsAccepted={watchedValues.termsAccepted ?? false}
              onTermsAcceptedChange={(value) =>
                setValue("termsAccepted", value, { shouldValidate: true })
              }
            />
            {errors.termsAccepted && (
              <p className="text-red-400 text-sm mt-2">
                {errors.termsAccepted.message}
              </p>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-3 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold">Create NFT</h1>
            </motion.div>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Transform your digital creation into a unique, verifiable asset on
              the blockchain
            </p>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {mintError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-400 text-sm">{mintError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Steps Indicator */}
          <div className="mb-12">
            <MintSteps currentStep={currentStep} steps={MINT_STEPS} />
          </div>

          {/* Step Content with Enhanced Container */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {getStepContent()}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Enhanced Navigation Buttons */}
          {currentStep < 4 && (
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2 px-8"
                >
                  {currentStep === 3 ? "Review" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
