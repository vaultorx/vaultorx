import { LucideIcon } from "lucide-react";

// Base types
export interface User {
  id: string;
  username?: string;
  name?: string;
  // walletAddress: string;
  email?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  kycStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  contractAddress: string;
  name: string;
  symbol?: string;
  description?: string;
  creatorId: string;
  royaltyPercentage: number;
  floorPrice?: number;
  totalVolume: number;
  totalItems: number;
  listedItems: number;
  blockchain: string;
  ipfsMetadataUri?: string;
  createdAt: Date;
  updatedAt: Date;
  verified?: boolean;
  category?: string;
  image?: string;
  creator: User;
}

export interface NFTCategory {
  id: string;
  name: string;
  icon: LucideIcon | string;
  color?: string;
  nfts: NFTItem[];
  nftCount?: number;
}
export interface NFTItem {
  id: string;
  collectionId: string;
  tokenId: string;
  ownerId: string;
  name: string;
  description?: string;
  image: string;
  ipfsMetadataUri: string;
  category: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  likes: number;
  views: number;
  attributes?: Record<string, any>;
  isListed: boolean;
  listPrice?: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  collection?: Collection;
  owner?: User;
}

export interface Transaction {
  id: string;
  transactionHash: string;
  nftItemId: string;
  fromUserId?: string;
  toUserId?: string;
  transactionType:
    | "mint"
    | "sale"
    | "transfer"
    | "deposit"
    | "withdrawal"
    | "purchase";
  price?: number;
  currency?: string;
  gasFee?: number;
  platformFee?: number;
  royaltyFee?: number;
  blockchain: string;
  status: "pending" | "confirmed" | "failed" | "completed";
  createdAt: Date;
  confirmedAt?: Date;
  nftName?: string;
  from?: string;
  to?: string;
}

export interface EscrowTransaction {
  id: string;
  nftItemId: string;
  buyerId: string;
  sellerId: string;
  escrowContractAddress?: string;
  amount: number;
  currency: string;
  status: "locked" | "released" | "refunded" | "disputed";
  createdAt: Date;
  releasedAt?: Date;
  expiresAt?: Date;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  nftItemId: string;
  destinationAddress: string;
  destinationNetwork: string;
  withdrawalFee?: number;
  verificationCode?: string;
  status: "pending" | "verified" | "processing" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

// Dashboard specific types
export interface DashboardStats {
  walletBalance: number;
  totalCollections: number;
  totalNFTs: number;
  floorValue: number;
  totalVolume: number;
  monthlySales: number;
  activeExhibitions: number;
  totalSales: number;
  avgSalePrice: number;
  royaltyEarnings: number;
  activeListings: number;
  activeAuctions: number;
  totalBidders: number;
  successRate: number;
  gasFees: number;
  pendingTransactions: number;
}

export interface CollectionStats {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  floorPrice: number;
  totalVolume: number;
  blockchain: string;
  category: string;
  image: string;
  verified: boolean;
}

export interface NFTListing {
  id: string;
  nftName: string;
  collection: string;
  listPrice: number;
  floorPrice: number;
  duration: string;
  views: number;
  likes: number;
  status: "active" | "sold" | "expired" | "cancelled";
}

export interface SaleRecord {
  id: string;
  nftName: string;
  collection: string;
  salePrice: number;
  previousPrice: number;
  saleDate: string;
  buyer: string;
  royalty: number;
  status: "completed" | "refunded" | "disputed";
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  status: "active" | "upcoming" | "ended" | "draft";
  startDate: string;
  endDate: string;
  location: string;
  visitors: number;
  featuredNFTs: number;
  totalNFTs: number;
  curator: string;
  image: string;
  locationType: string;
  venueName?: string;
  views: number;
  likes: number;
  featured: boolean;
  _count?: any;
}

export interface Auction {
  id: string;
  nftItemId: string;
  type:
    | "STANDARD"
    | "RESERVE"
    | "TIMED"
    | "DUTCH"
    | "BLIND"
    | "LOTTERY"
    | "BUY_NOW"
    | "MULTI_TOKEN";
  status: "live" | "upcoming" | "ended" | "cancelled";
  startingPrice?: number;
  reservePrice?: number;
  minimumBid?: number;
  bidIncrement?: number;
  buyNowPrice?: number;
  ticketPrice?: number;
  maxTickets?: number;
  startTime: string;
  endTime: string;
  bidders: number;
  views: number;
  blockchain: string;
  contractAddress?: string;
  tokenStandard: string;
  createdAt: Date;
  updatedAt: Date;
  nftItem?: NFTItem;
  bids?: Bid[];
  tickets?: LotteryTicket[];
}

export interface LotteryTicket {
  id: string;
  auctionId: string;
  buyerId: string;
  tickets: number;
  txHash?: string;
  createdAt: Date;
  auction?: Auction;
  buyer?: User;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  createdAt: Date;
  auction?: Auction;
  bidder?: User;
}

export interface WhitelistedAddress {
  id: string;
  address: string;
  label: string;
  addedAt: Date;
  lockUntil?: Date;
}

export interface RecentActivity {
  id: string;
  type: "sale" | "purchase" | "transfer" | "listing" | "bid" | "mint";
  nftName: string;
  price?: number;
  currency?: string;
  from?: string;
  to?: string;
  txHash?: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon | string;
  href: string;
  color: string;
  enabled: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  timeRange?: string;
}

// Form types
export interface DepositFormData {
  selectedNetwork: string;
  nftContractAddress: string;
  tokenId: string;
}

export interface WithdrawalFormData {
  selectedNFT: string;
  destinationNetwork: string;
  destinationAddress: string;
  verificationCode: string;
  useWhitelisted: boolean;
}

export interface ListingFormData {
  nftId: string;
  price: number;
  currency: string;
  duration: string;
  reservePrice?: number;
}

// Chart data types
export interface PricePerformanceData {
  date: string;
  floorPrice: number;
  averageSale: number;
  yourSales: number;
}

export interface SalesDistributionData {
  collection: string;
  sales: number;
  volume: number;
  percentage: number;
}

export interface VisitorAnalytics {
  date: string;
  visitors: number;
  pageViews: number;
  duration: number;
}
