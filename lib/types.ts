export interface User {
  id: string
  walletAddress: string
  email?: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  kycStatus: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

export interface Collection {
  id: string
  contractAddress: string
  name: string
  symbol?: string
  description?: string
  creatorId: string
  royaltyPercentage: number
  floorPrice?: number
  totalVolume: number
  totalItems: number
  listedItems: number
  blockchain: string
  ipfsMetadataUri?: string
  createdAt: Date
  updatedAt: Date
}

export interface NFTItem {
  id: string
  collectionId: string
  tokenId: string
  ownerId: string
  name: string
  description?: string
  image: string
  ipfsMetadataUri: string
  category: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  likes: number
  views: number
  attributes?: Record<string, any>
  isListed: boolean
  listPrice?: number
  currency: string
  createdAt: Date
  updatedAt: Date
  collection?: Collection
  owner?: User
}

export interface Transaction {
  id: string
  transactionHash: string
  nftItemId: string
  fromUserId?: string
  toUserId?: string
  transactionType: "mint" | "sale" | "transfer" | "deposit" | "withdrawal"
  price?: number
  currency?: string
  gasFee?: number
  platformFee?: number
  royaltyFee?: number
  blockchain: string
  status: "pending" | "confirmed" | "failed"
  createdAt: Date
  confirmedAt?: Date
}

export interface EscrowTransaction {
  id: string
  nftItemId: string
  buyerId: string
  sellerId: string
  escrowContractAddress?: string
  amount: number
  currency: string
  status: "locked" | "released" | "refunded" | "disputed"
  createdAt: Date
  releasedAt?: Date
  expiresAt?: Date
}

export interface WithdrawalRequest {
  id: string
  userId: string
  nftItemId: string
  destinationAddress: string
  destinationNetwork: string
  withdrawalFee?: number
  verificationCode?: string
  status: "pending" | "verified" | "processing" | "completed" | "failed"
  createdAt: Date
  completedAt?: Date
}

export interface CategoryItem {
  id: string
  name: string
  icon: string
  slug: string
}
