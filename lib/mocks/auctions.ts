import { Auction, WhitelistedAddress } from "@/lib/types";

export const auctions: Auction[] = [
  {
    id: "au1",
    nftName: "Digital Dream #1",
    collection: "Digital Dreams",
    type: "english",
    status: "live",
    currentBid: 2.5,
    minimumBid: 1.0,
    bidIncrement: 0.1,
    startTime: "2024-01-20 14:00:00",
    endTime: "2024-01-21 14:00:00",
    bidders: 12,
    views: 2450,
    image: "/placeholder.svg",
  },
  {
    id: "au2",
    nftName: "Cosmic Evolution #23",
    collection: "Cosmic Evolution",
    type: "dutch",
    status: "upcoming",
    currentBid: 0.9,
    startingPrice: 2.0,
    reservePrice: 1.5,
    startTime: "2024-01-22 10:00:00",
    endTime: "2024-01-23 10:00:00",
    bidders: 0,
    views: 890,
    image: "/placeholder.svg",
  },
  {
    id: "au3",
    nftName: "Urban Legend #7",
    collection: "Urban Legends",
    type: "english",
    status: "ended",
    finalBid: 3.8,
    winningBidder: "0x1234...5678",
    startTime: "2024-01-15 09:00:00",
    endTime: "2024-01-16 09:00:00",
    bidders: 8,
    views: 3210,
    image: "/placeholder.svg",
  },
];

export const whitelistedAddresses: WhitelistedAddress[] = [
  {
    id: "1",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    label: "My Hardware Wallet",
    addedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "2",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    label: "Cold Storage",
    addedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    lockUntil: new Date(Date.now() + 12 * 60 * 60 * 1000), // Locked for 12 more hours
  },
];
