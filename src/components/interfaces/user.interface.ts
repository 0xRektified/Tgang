export interface Product {
  name: string;
  unlocked: boolean;
  selected: boolean;
  quantity: number;
  maxCarry: number;
  slot: number | null;
}

export interface IUserInfo {
  id: string;
  username: string;
  cashAmount: number;
  products: Product[];
}
