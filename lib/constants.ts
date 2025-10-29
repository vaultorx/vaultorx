export const CATEGORIES: Array<{
  id: string
  name: string
  slug: string
  icon: string
}> = [
  { id: "1", name: "Art", slug: "art", icon: "🎨" },
  { id: "2", name: "Gaming", slug: "gaming", icon: "🎮" },
  { id: "3", name: "Collectibles", slug: "collectibles", icon: "🏆" },
  { id: "4", name: "Music", slug: "music", icon: "🎵" },
  { id: "5", name: "Estate", slug: "estate", icon: "🏠" },
  { id: "6", name: "Memberships", slug: "memberships", icon: "🎫" },
  { id: "7", name: "Photography", slug: "photography", icon: "📷" },
  { id: "8", name: "PFPs", slug: "pfps", icon: "👤" },
  { id: "9", name: "Utility", slug: "utility", icon: "🔧" },
  { id: "10", name: "Fashion", slug: "fashion", icon: "👗" },
  { id: "11", name: "Sports", slug: "sports", icon: "⚽" },
  { id: "12", name: "Identities", slug: "identities", icon: "🆔" },
]

export const SUPPORTED_BLOCKCHAINS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  // { id: "polygon", name: "Polygon", symbol: "MATIC" },
  // { id: "arbitrum", name: "Arbitrum", symbol: "ETH" },
  // { id: "optimism", name: "Optimism", symbol: "ETH" },
]

export const SUPPORTED_CURRENCIES = [
  { id: "ETH", name: "Ethereum", symbol: "ETH" },
  // { id: "WETH", name: "Wrapped Ethereum", symbol: "WETH" },
  // { id: "USDC", name: "USD Coin", symbol: "USDC" },
  // { id: "USDT", name: "Tether", symbol: "USDT" },
]

export const PLATFORM_FEE_BPS = 250 // 2.5%
export const MAX_ROYALTY_BPS = 1000 // 10%
export const WITHDRAWAL_LOCK_HOURS = 24

export const WITHDRAWAL_FEES = {
  ethereum: "0.005",
  // polygon: "0.001",
  // arbitrum: "0.0005",
  // optimism: "0.0005",
  // base: "0.0005",
};