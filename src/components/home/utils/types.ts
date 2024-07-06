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
