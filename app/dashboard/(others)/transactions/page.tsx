"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// Mock transactions data
const mockTransactions = [
  {
    id: "tx1",
    type: "purchase",
    nftName: "Digital Dream #1",
    amount: 1.5,
    currency: "ETH",
    from: "0x1234...5678",
    to: "0xabcd...efgh",
    status: "completed",
    timestamp: "2024-01-20 14:30:00",
    txHash: "0x1234567890abcdef",
    gasFee: 0.023,
  },
  {
    id: "tx2",
    type: "sale",
    nftName: "Cosmic Evolution #23",
    amount: 0.9,
    currency: "ETH",
    from: "0xabcd...efgh",
    to: "0x1234...5678",
    status: "completed",
    timestamp: "2024-01-19 11:15:00",
    txHash: "0xabcdef1234567890",
    gasFee: 0.018,
  },
  {
    id: "tx3",
    type: "transfer",
    nftName: "Urban Legend #7",
    amount: 0,
    currency: "ETH",
    from: "0x1234...5678",
    to: "0x9876...5432",
    status: "completed",
    timestamp: "2024-01-18 09:45:00",
    txHash: "0x9876543210fedcba",
    gasFee: 0.015,
  },
  {
    id: "tx4",
    type: "purchase",
    nftName: "Digital Dream #5",
    amount: 2.1,
    currency: "ETH",
    from: "0x5678...1234",
    to: "0x1234...5678",
    status: "pending",
    timestamp: "2024-01-20 16:20:00",
    txHash: "0x567890abcdef1234",
    gasFee: 0.025,
  },
];

export default function TransactionsPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "failed":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "sale":
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      case "transfer":
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      default:
        return <ExternalLink className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesType = selectedType === "all" || tx.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || tx.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      tx.nftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* <Header /> */}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Transactions
          </h1>
          <p className="text-muted-foreground">
            View and manage your NFT transaction history
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Volume
                  </p>
                  <p className="text-2xl font-bold">4.5 ETH</p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold">0.9 ETH</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ArrowUpRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Gas Fees
                  </p>
                  <p className="text-2xl font-bold">0.081 ETH</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <RefreshCw className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <RefreshCw className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  All your NFT transactions in one place
                </CardDescription>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10 w-48"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList
                className="grid grid-cols-4 gap-3 md:max-w-lg mb-4"
              >
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">NFT</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Action</div>
                  </div>

                  {filteredTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center"
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        {getTypeIcon(tx.type)}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                      <div className="col-span-3">
                        <p className="font-medium">{tx.nftName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {tx.txHash}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold">
                          {tx.amount > 0
                            ? `${tx.amount} ${tx.currency}`
                            : "Transfer"}
                        </p>
                        {tx.gasFee > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Gas: {tx.gasFee} ETH
                          </p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Badge className={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No transactions found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
