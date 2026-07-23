import type { SearchIdea } from "@/types/search"

export const IDEA_CATEGORIES = [
  "Bitcoin",
  "Ethereum",
  "Stellar",
  "DeFi",
  "Altcoins",
  "NFTs",
  "Layer 2",
] as const

export const IDEA_TAGS = [
  "Technical Analysis",
  "Fundamental Analysis",
  "Trading",
  "Investment",
  "News",
  "Price Prediction",
  "Sustainability",
  "Soroban",
] as const

export const ideas: SearchIdea[] = [
  {
    id: 1,
    title: "Bitcoin likely to break its next major resistance",
    excerpt:
      "Institutional adoption, exchange balances, and market structure point to another Bitcoin breakout after consolidation.",
    author: "CryptoAnalyst",
    publishedAt: "2026-07-22T18:00:00.000Z",
    votes: 124,
    category: "Bitcoin",
    tags: ["Bitcoin", "Technical Analysis", "Price Prediction"],
    premium: true,
  },
  {
    id: 2,
    title: "Ethereum staking growth strengthens the network economy",
    excerpt:
      "Proof of Stake participation and lower energy use create a stronger long-term case for Ethereum adoption.",
    author: "ETHDeveloper",
    publishedAt: "2026-07-21T15:00:00.000Z",
    votes: 88,
    category: "Ethereum",
    tags: ["Ethereum", "Fundamental Analysis", "Sustainability"],
    premium: false,
  },
  {
    id: 3,
    title: "Stellar DeFi ecosystem growth on Soroban",
    excerpt:
      "Soroban smart contracts are gaining traction for low-cost DeFi applications and cross-border financial products.",
    author: "StellarBuilder",
    publishedAt: "2026-07-20T09:30:00.000Z",
    votes: 142,
    category: "Stellar",
    tags: ["Stellar", "DeFi", "Soroban"],
    premium: false,
  },
  {
    id: 4,
    title: "Stablecoin liquidity is reshaping DeFi trading",
    excerpt:
      "Deeper stablecoin markets are improving execution, reducing slippage, and creating new strategies for active traders.",
    author: "DeFiResearcher",
    publishedAt: "2026-07-18T12:15:00.000Z",
    votes: 73,
    category: "DeFi",
    tags: ["DeFi", "Trading", "Fundamental Analysis"],
    premium: true,
  },
  {
    id: 5,
    title: "Layer 2 networks compete on developer experience",
    excerpt:
      "The next phase of Layer 2 adoption will be decided by tooling, interoperability, and reliable user onboarding.",
    author: "RollupEngineer",
    publishedAt: "2026-07-15T08:00:00.000Z",
    votes: 61,
    category: "Layer 2",
    tags: ["Layer 2", "News", "Investment"],
    premium: false,
  },
  {
    id: 6,
    title: "NFT utility is moving beyond collectibles",
    excerpt:
      "Membership, identity, ticketing, and on-chain credentials are emerging as practical NFT use cases.",
    author: "Web3Creator",
    publishedAt: "2026-07-12T16:45:00.000Z",
    votes: 49,
    category: "NFTs",
    tags: ["NFTs", "News", "Fundamental Analysis"],
    premium: false,
  },
  {
    id: 7,
    title: "Altcoin rotation signals to watch this quarter",
    excerpt:
      "Relative strength, liquidity, and developer activity can help distinguish durable altcoin momentum from short-lived hype.",
    author: "MarketScout",
    publishedAt: "2026-07-10T11:00:00.000Z",
    votes: 96,
    category: "Altcoins",
    tags: ["Altcoins", "Technical Analysis", "Trading"],
    premium: true,
  },
  {
    id: 8,
    title: "Bitcoin treasury strategies need stronger risk controls",
    excerpt:
      "Companies adopting Bitcoin should model drawdowns, custody concentration, liquidity needs, and governance before buying.",
    author: "RiskLedger",
    publishedAt: "2026-07-05T13:20:00.000Z",
    votes: 57,
    category: "Bitcoin",
    tags: ["Bitcoin", "Investment", "Fundamental Analysis"],
    premium: false,
  },
]
