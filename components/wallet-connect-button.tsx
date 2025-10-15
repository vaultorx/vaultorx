"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, Check } from "lucide-react"

const WALLET_OPTIONS = [
  { id: "metamask", name: "MetaMask", icon: "🦊", popular: true },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗", popular: true },
  { id: "coinbase", name: "Coinbase Wallet", icon: "💼", popular: false },
  { id: "phantom", name: "Phantom", icon: "👻", popular: false },
]

interface WalletConnectButtonProps {
  onConnect?: (walletId: string) => void
}

export function WalletConnectButton({ onConnect }: WalletConnectButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)

  const handleConnect = async (walletId: string) => {
    setIsConnecting(walletId)

    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(null)
      setIsConnected(true)
      setConnectedWallet(walletId)
      setIsOpen(false)
      onConnect?.(walletId)
    }, 1500)
  }

  if (isConnected && connectedWallet) {
    return (
      <Button variant="outline" className="gap-2 bg-transparent">
        <Wallet className="h-4 w-4" />
        <span className="font-mono">0x1234...5678</span>
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>Choose your preferred wallet to connect to Opuxvault</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {WALLET_OPTIONS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting !== null}
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="text-left">
                  <p className="font-medium">{wallet.name}</p>
                  {wallet.popular && <p className="text-xs text-muted-foreground">Popular</p>}
                </div>
              </div>
              {isConnecting === wallet.id ? (
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="h-5 w-5 text-muted-foreground opacity-0" />
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  )
}
