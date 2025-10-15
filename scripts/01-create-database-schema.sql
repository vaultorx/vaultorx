-- NFT Marketplace Database Schema
-- PostgreSQL schema for compliance, logging, and user management

-- Users table for KYC/AML compliance
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Whitelisted addresses for secure withdrawals
CREATE TABLE IF NOT EXISTS whitelisted_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address VARCHAR(42) NOT NULL,
  label VARCHAR(100),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lock_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, address)
);

-- NFT Collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_address VARCHAR(42) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(20),
  description TEXT,
  creator_id UUID REFERENCES users(id),
  royalty_percentage DECIMAL(5,2) DEFAULT 0,
  floor_price DECIMAL(20,8),
  total_volume DECIMAL(20,8) DEFAULT 0,
  total_items INTEGER DEFAULT 0,
  listed_items INTEGER DEFAULT 0,
  blockchain VARCHAR(20) DEFAULT 'ethereum',
  ipfs_metadata_uri TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NFT Items
CREATE TABLE IF NOT EXISTS nft_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  token_id VARCHAR(100) NOT NULL,
  owner_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ipfs_asset_uri TEXT NOT NULL,
  ipfs_metadata_uri TEXT NOT NULL,
  attributes JSONB,
  is_listed BOOLEAN DEFAULT FALSE,
  list_price DECIMAL(20,8),
  currency VARCHAR(20) DEFAULT 'ETH',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, token_id)
);

-- Transaction history for compliance
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_hash VARCHAR(66) UNIQUE NOT NULL,
  nft_item_id UUID REFERENCES nft_items(id),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  transaction_type VARCHAR(20) NOT NULL, -- 'mint', 'sale', 'transfer', 'deposit', 'withdrawal'
  price DECIMAL(20,8),
  currency VARCHAR(20),
  gas_fee DECIMAL(20,8),
  platform_fee DECIMAL(20,8),
  royalty_fee DECIMAL(20,8),
  blockchain VARCHAR(20) DEFAULT 'ethereum',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP
);

-- Escrow records for secure transactions
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_item_id UUID REFERENCES nft_items(id),
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  escrow_contract_address VARCHAR(42),
  amount DECIMAL(20,8) NOT NULL,
  currency VARCHAR(20) DEFAULT 'USDC',
  status VARCHAR(20) DEFAULT 'locked', -- 'locked', 'released', 'refunded', 'disputed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- Withdrawal requests for security tracking
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  nft_item_id UUID REFERENCES nft_items(id),
  destination_address VARCHAR(42) NOT NULL,
  destination_network VARCHAR(20) NOT NULL,
  withdrawal_fee DECIMAL(20,8),
  verification_code VARCHAR(10),
  verification_code_expires TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'processing', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Activity logs for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_nft_items_owner ON nft_items(owner_id);
CREATE INDEX idx_nft_items_collection ON nft_items(collection_id);
CREATE INDEX idx_nft_items_listed ON nft_items(is_listed) WHERE is_listed = TRUE;
CREATE INDEX idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX idx_transactions_nft ON transactions(nft_item_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_collections_floor_price ON collections(floor_price DESC);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
