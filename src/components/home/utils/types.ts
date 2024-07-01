export interface Product {
  id: number;
  name: string;
  unlocked: boolean;
  selected: boolean;
  quantity: number;
  maxCarry: number;
  slot: number | null;
}

export interface IUserInfo {
  username: string;
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  amountEarned: number;
}

export interface Transaction {
  type: "success" | "missed";
  product: string;
  quantity: number;
  amountEarned?: number;
}

export interface HomeProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
}
