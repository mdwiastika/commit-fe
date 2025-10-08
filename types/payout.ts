// Bank types from Flip API
export interface Bank {
  bank_code: string;
  name: string;
  fee: number;
  queue: number;
  status: "OPERATIONAL" | "MAINTENANCE" | "DISABLED";
}

// Payout request interface
export interface PayoutRequest {
  account_number: string;
  bank_code: string;
  amount: number;
  remark?: string;
}

// Payout response interface
export interface PayoutResponse {
  id: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  account_number: string;
  bank_code: string;
  amount: number;
  fee: number;
  created_at: string;
  completed_at?: string;
  failure_reason?: string;
}

// User balance interface
export interface UserBalance {
  available_balance: number;
  pending_payout: number;
  total_balance: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
