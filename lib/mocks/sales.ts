import {
  SaleRecord,
  NFTListing,
  PricePerformanceData,
  SalesDistributionData,
} from "@/lib/types";

export const salesRecords: SaleRecord[] = [
  {
    id: "s1",
    nftName: "Digital Dream #1",
    collection: "Digital Dreams",
    salePrice: 1.5,
    previousPrice: 1.2,
    saleDate: "2024-01-20",
    buyer: "0x1234...5678",
    royalty: 0.075,
    status: "completed",
  },
  {
    id: "s2",
    nftName: "Cosmic Evolution #23",
    collection: "Cosmic Evolution",
    salePrice: 0.9,
    previousPrice: 0.85,
    saleDate: "2024-01-19",
    buyer: "0xabcd...efgh",
    royalty: 0.045,
    status: "completed",
  },
];

export const activeListings: NFTListing[] = [
  {
    id: "l1",
    nftName: "Urban Legend #7",
    collection: "Urban Legends",
    listPrice: 3.2,
    floorPrice: 2.5,
    duration: "7 days",
    views: 3210,
    likes: 203,
    status: "active",
  },
  {
    id: "l2",
    nftName: "Digital Dream #5",
    collection: "Digital Dreams",
    listPrice: 2.1,
    floorPrice: 1.2,
    duration: "30 days",
    views: 1560,
    likes: 89,
    status: "active",
  },
];

export const pricePerformanceData: PricePerformanceData[] = [
  { date: "2024-01-01", floorPrice: 1.0, averageSale: 1.1, yourSales: 1.2 },
  { date: "2024-01-08", floorPrice: 1.1, averageSale: 1.3, yourSales: 1.5 },
  { date: "2024-01-15", floorPrice: 1.2, averageSale: 1.4, yourSales: 1.8 },
  { date: "2024-01-22", floorPrice: 1.3, averageSale: 1.5, yourSales: 2.1 },
];

export const salesDistributionData: SalesDistributionData[] = [
  { collection: "Digital Dreams", sales: 15, volume: 22.5, percentage: 60 },
  { collection: "Cosmic Evolution", sales: 8, volume: 7.2, percentage: 25 },
  { collection: "Urban Legends", sales: 2, volume: 6.4, percentage: 15 },
];
