"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Key,
} from "lucide-react";
import { toast } from "sonner";

interface SeedPhraseConfigProps {
  onConfigured?: () => void;
}

export function SeedPhraseConfiguration({
  onConfigured,
}: SeedPhraseConfigProps) {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [derivedAddress, setDerivedAddress] = useState("");

  const checkConfigurationStatus = async () => {
    try {
      const response = await fetch("/api/user/seed-phrase");
      const result = await response.json();

      if (result.success) {
        setIsConfigured(result.data.configured);
      }
    } catch (error) {
      console.error("Failed to check configuration status:", error);
    }
  };

  const handleConfigure = async () => {
    if (!seedPhrase.trim()) {
      toast.error("Please enter your seed phrase");
      return;
    }

    setIsConfiguring(true);
    try {
      const response = await fetch("/api/user/seed-phrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seedPhrase: seedPhrase.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setIsConfigured(true);
        setDerivedAddress(result.data.derivedAddress);
        setSeedPhrase("");
        toast.success("Seed phrase configured successfully");
        onConfigured?.();
      } else {
        console.error("Error:", result.error);
        toast(result.error || "Failed to configure seed phrase");
      }
    } catch (error) {
      console.error("Configuration error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to configure seed phrase"
      );
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch("/api/user/seed-phrase", {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setIsConfigured(false);
        setDerivedAddress("");
        toast.success("Seed phrase removed successfully");
      } else {
        throw new Error(result.error || "Failed to remove seed phrase");
      }
    } catch (error) {
      console.error("Removal error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove seed phrase"
      );
    } finally {
      setIsRemoving(false);
    }
  };

  // Check configuration status on component mount
  useEffect(() => {
    checkConfigurationStatus();
  });

  if (isConfigured) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your external wallet is configured and ready for withdrawals.
          </AlertDescription>
        </Alert>

        {derivedAddress && (
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Derived Address</Label>
            <p className="text-xs font-mono mt-1 break-all">{derivedAddress}</p>
            <p className="text-xs text-muted-foreground mt-2">
              This is the address derived from your seed phrase
            </p>
          </div>
        )}

        <Button
          variant="destructive"
          onClick={handleRemove}
          disabled={isRemoving}
          className="w-full"
        >
          {isRemoving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Removing...
            </>
          ) : (
            <>
              <Key className="h-4 w-4 mr-2" />
              Remove Seed Phrase
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Configure your external wallet seed phrase to enable NFT withdrawals.
          Your seed phrase is encrypted and stored securely.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="seed-phrase">Seed Phrase</Label>
        <Textarea
          id="seed-phrase"
          placeholder="Enter your 12 or 24-word seed phrase"
          value={seedPhrase}
          onChange={(e) => setSeedPhrase(e.target.value)}
          rows={4}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Enter your complete seed phrase separated by spaces
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Security Warning:</strong> Never share your seed phrase with
          anyone. We encrypt your seed phrase for secure storage, but always
          ensure you're on the official website.
        </AlertDescription>
      </Alert>

      <Button
        onClick={handleConfigure}
        disabled={isConfiguring || !seedPhrase.trim()}
        className="w-full"
      >
        {isConfiguring ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Configuring...
          </>
        ) : (
          <>
            <Key className="h-4 w-4 mr-2" />
            Configure Seed Phrase
          </>
        )}
      </Button>
    </div>
  );
}
