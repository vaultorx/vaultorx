export interface SearchResult {
  collections: CollectionSearchResult[];
  nfts: NFTSearchResult[];
  users: UserSearchResult[];
  exhibitions: ExhibitionSearchResult[];
  meta: {
    query: string;
    collectionsCount: number;
    nftsCount: number;
    usersCount: number;
    exhibitionsCount: number;
  };
}

export interface CollectionSearchResult {
  id: string;
  name: string;
  symbol?: string;
  description?: string;
  image?: string;
  verified: boolean;
  floorPrice?: number;
  totalVolume: number;
  totalItems: number;
  creator: {
    id: string;
    username?: string;
    name?: string;
  };
  _count: {
    nfts: number;
  };
}

export interface NFTSearchResult {
  id: string;
  name: string;
  description?: string;
  image: string;
  listPrice?: number;
  currency: string;
  rarity: string;
  views: number;
  likes: number;
  collection: {
    name: string;
    verified: boolean;
    image?: string;
  };
  owner: {
    id: string;
    username?: string;
    name?: string;
  };
}

export interface UserSearchResult {
  id: string;
  username?: string;
  name?: string;
  email: string;
  createdAt: Date;
}

export interface ExhibitionSearchResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  status: string;
  startDate: Date;
  endDate: Date;
  views: number;
  likes: number;
  creator: {
    id: string;
    username?: string;
    name?: string;
  };
  _count: {
    collections: number;
    nfts: number;
  };
}
