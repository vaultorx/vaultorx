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

// Mock collections data - in production, this would come from an API
const MOCK_COLLECTIONS = [
  { id: "1", name: "Digital Dreams", verified: true },
  { id: "2", name: "Cosmic Evolution", verified: true },
  { id: "3", name: "Urban Legends", verified: false },
];

const CATEGORIES = [
  "art",
  "gaming",
  "photography",
  "3d",
  "animated",
  "collectibles",
  "music",
  "pfps",
  "sports",
  "fashion",
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
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: MintFormData) => {
    if (!session?.user?.email) {
      setMintError("You must be logged in to mint an NFT");
      return;
    }

    setIsProcessing(true);
    setMintError(null);

    try {
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

      if (response.success) {
        // If the NFT should be listed for sale
        if (data.saleType !== "not-for-sale" && data.price) {
          await nftService.listNFT(
            response.data.id,
            parseFloat(data.price),
            data.currency
          );
        }

        // Redirect to the newly created NFT
        router.push(`/nft/${response.data.id}`);
      } else {
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
        return (
          !!watchedValues.name && !errors.name && !!watchedValues.collectionId
        );
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950/20 to-purple-950/20">
      <Header />

      <div className="container mx-auto py-8 px-4 pt-24">
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
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Create NFT
              </h1>
            </motion.div>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Transform your digital creation into a unique, verifiable asset on
              the blockchain
            </p>
          </div>

          {/* Error Display */}
          {mintError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-400 text-sm">{mintError}</p>
            </motion.div>
          )}

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
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <MintUploadStep
                        onFileSelect={handleFileSelect}
                        selectedFile={(watchedValues.file as File) ?? null}
                        // preview={preview}
                      />
                      {errors.file && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.file.message}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <MintDetailsStep
                        name={watchedValues.name ?? ""}
                        description={watchedValues.description ?? ""}
                        attributes={watchedValues.attributes ?? []}
                        // collectionId={watchedValues.collectionId ?? ""}
                        // category={watchedValues.category ?? "art"}
                        // rarity={watchedValues.rarity ?? "Common"}
                        // collections={MOCK_COLLECTIONS}
                        // categories={CATEGORIES}
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
                        // onCollectionChange={(value: any) =>
                        //   setValue("collectionId", value, {
                        //     shouldValidate: true,
                        //   })
                        // }
                        // onCategoryChange={(value: any) =>
                        //   setValue("category", value, { shouldValidate: true })
                        // }
                        // onRarityChange={(value: any) =>
                        //   setValue(
                        //     "rarity",
                        //     value as "Common" | "Rare" | "Epic" | "Legendary",
                        //     { shouldValidate: true }
                        //   )
                        // }
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.name.message}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 3 && (
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
                          setValue(
                            "currency",
                            value as "ETH" | "WETH" | "USDC",
                            { shouldValidate: true }
                          )
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
                  )}

                  {currentStep === 4 && (
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
                        // collection={
                        //   MOCK_COLLECTIONS.find(
                        //     (c) => c.id === watchedValues.collectionId
                        //   )?.name || ""
                        // }
                        // category={watchedValues.category ?? ""}
                        // rarity={watchedValues.rarity ?? "Common"}
                        saleType={watchedValues.saleType ?? "fixed"}
                        price={watchedValues.price ?? ""}
                        currency={watchedValues.currency ?? "ETH"}
                        royalty={watchedValues.royalty ?? 5}
                        isProcessing={isProcessing}
                        gasFee="0.0045"
                        onMint={handleSubmit(onSubmit)}
                        // termsAccepted={watchedValues.termsAccepted ?? false}
                        // onTermsAcceptedChange={(value: any) =>
                        //   setValue("termsAccepted", value, {
                        //     shouldValidate: true,
                        //   })
                        // }
                      />
                      {errors.termsAccepted && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.termsAccepted.message}
                        </p>
                      )}
                    </motion.div>
                  )}
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
                  className="gap-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
                >
                  {currentStep === 3 ? "Review" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Enhanced Progress Info */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-4 text-sm text-slate-500 bg-slate-800/30 rounded-full px-4 py-2 border border-slate-700/50">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Secure Minting</span>
              </div>
              <div className="h-1 w-1 bg-slate-600 rounded-full" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>Gas Optimized</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
