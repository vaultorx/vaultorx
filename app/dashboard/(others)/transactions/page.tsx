"use client";

import { useState, useMemo } from "react";
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
import { useTransactions, useTransactionStats } from "@/hooks/use-transactions";

export default function TransactionsPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { transactions, loading, error } = useTransactions({
    type: selectedType === "all" ? undefined : selectedType,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    search: searchQuery || undefined,
  });

  const { stats: transactionStats, loading: statsLoading } =
    useTransactionStats();

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    switch (activeTab) {
      case "purchases":
        return transactions.filter(
          (tx) => tx.transactionType.toLowerCase() === "purchase"
        );
      case "sales":
        return transactions.filter(
          (tx) => tx.transactionType.toLowerCase() === "sale"
        );
      case "transfers":
        return transactions.filter(
          (tx) => tx.transactionType.toLowerCase() === "transfer"
        );
      default:
        return transactions;
    }
  }, [transactions, activeTab]);

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset type filter when changing tabs to avoid conflicts
    if (value !== "all") {
      setSelectedType("all");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load transactions
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
                  <p className="text-2xl font-bold">
                    {statsLoading
                      ? "..."
                      : `${transactionStats.totalVolume.toFixed(1)} ETH`}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {statsLoading
                      ? "..."
                      : `${transactionStats.totalSales.toFixed(1)} ETH`}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {statsLoading
                      ? "..."
                      : `${transactionStats.gasFees.toFixed(3)} ETH`}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : transactionStats.pendingCount}
                  </p>
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

                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                  disabled={activeTab !== "all"}
                >
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
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 gap-3 md:max-w-lg mb-4">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
              </TabsList>

              {/* Loading State */}
              {loading && (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-4 p-4 border-b animate-pulse"
                    >
                      <div className="col-span-2">
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                      <div className="col-span-3">
                        <div className="h-4 bg-muted rounded w-32"></div>
                        <div className="h-3 bg-muted rounded w-24 mt-1"></div>
                      </div>
                      <div className="col-span-2">
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                      <div className="col-span-2">
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                      <div className="col-span-2">
                        <div className="h-6 bg-muted rounded w-16"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="h-8 bg-muted rounded w-8"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Transactions List - All Tabs */}
              {!loading && (
                <>
                  {/* All Transactions */}
                  <TabsContent value="all" className="space-y-4">
                    <TransactionTable
                      transactions={transactions}
                      getTypeIcon={getTypeIcon}
                      getStatusColor={getStatusColor}
                    />
                  </TabsContent>

                  {/* Purchases */}
                  <TabsContent value="purchases" className="space-y-4">
                    <TransactionTable
                      transactions={filteredTransactions}
                      getTypeIcon={getTypeIcon}
                      getStatusColor={getStatusColor}
                    />
                  </TabsContent>

                  {/* Sales */}
                  <TabsContent value="sales" className="space-y-4">
                    <TransactionTable
                      transactions={filteredTransactions}
                      getTypeIcon={getTypeIcon}
                      getStatusColor={getStatusColor}
                    />
                  </TabsContent>

                  {/* Transfers */}
                  <TabsContent value="transfers" className="space-y-4">
                    <TransactionTable
                      transactions={filteredTransactions}
                      getTypeIcon={getTypeIcon}
                      getStatusColor={getStatusColor}
                    />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Separate component for the transaction table to avoid repetition
function TransactionTable({
  transactions,
  getTypeIcon,
  getStatusColor,
}: {
  transactions: any[];
  getTypeIcon: (type: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
        <div className="col-span-2">Type</div>
        <div className="col-span-3">NFT</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Action</div>
      </div>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center"
        >
          <div className="col-span-2 flex items-center gap-2">
            {getTypeIcon(tx.transactionType)}
            <span className="capitalize">{tx.transactionType}</span>
          </div>
          <div className="col-span-3">
            <p className="font-medium">{tx.nftName}</p>
            <p className="text-sm text-muted-foreground truncate">
              {tx.transactionHash}
            </p>
          </div>
          <div className="col-span-2">
            {tx.price && tx.price > 0 ? (
              <p className="font-semibold">
                {tx.price.toFixed(4)} {tx.currency}
              </p>
            ) : (
              <p className="text-muted-foreground">Transfer</p>
            )}
            {tx.gasFee && tx.gasFee > 0 && (
              <p className="text-xs text-muted-foreground">
                Gas: {tx.gasFee.toFixed(4)} ETH
              </p>
            )}
          </div>
          <div className="col-span-2">
            <p className="text-sm">
              {new Date(tx.createdAt).toLocaleDateString()}
            </p>
            {tx.confirmedAt && (
              <p className="text-xs text-muted-foreground">
                {new Date(tx.confirmedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
