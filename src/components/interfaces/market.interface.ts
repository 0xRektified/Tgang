export interface MarketProduct {
  name: string;
  price: number;
}

export interface IMarketInfo {
  id: string;
  name: string;
  products: MarketProduct[];
}
