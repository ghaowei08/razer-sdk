interface ErrorRes {
  error_code: string;
  error_desc: string;
}
export interface Config {
  merchantId: string;
  verifyKey: string;
  secretKey: string;
  callbackUrl: string;
}

export interface DateRangeReq {
  start: Date;
  end: Date;
}

export interface PaymentTransactionOrderIdReq {
  orderId: string;
  amount: string;
}

export interface PaymentTransactionOrderIdRes {
  StatCode: string;
  StatName: string;
  TranID: string;
  Amount: string;
  Domain: string;
  VrfKey: string;
  Channel: string;
  OrderID: string;
  Currency: string;
  ErrorCode: string;
  ErrorDesc: string;
}

export interface PaymentTransactionTransactionIdReq {
  transactionId: string;
  amount: string;
}

export interface PaymentTransactionTransactionIdRes {
  StatCode: string;
  StatName: string;
  TranID: string;
  Amount: string;
  Domain: string;
  VrfKey: string;
  Channel: string;
  OrderID: string;
  Currency: string;
  ErrorCode: string;
  ErrorDesc: string;
}

export interface PaymentTransactionRes {
  BillingDate: string;
  OrderID: string;
  TranID: string;
  Channel: string;
  Amount: string;
  StatCode: string;
  StatName: string;
  BillingName: string;
  ServiceItem: string;
  BillingEmail: string;
  TransactionRate: string;
  TransactionCost: string;
  TransactionFee?: string;
  BillingMobileNumber: string;
  GST: number;
  NetAmount: string;
  IPAddress: string;
  BankName: string;
  ExpiryDate: string;
  StatusDescription: string;
  SettlementDate: string;
  PaidDate: string;
  CaptureRefID?: string;
  TerminalID: string;
  RefundRefID?: string;
}

interface ChannelLogo {
  '16x16': string,
  '24x24': string,
  '32x32': string,
  '48x48': string,
  '120x43': string,
}

export enum CHANNEL_TYPE {
  internetBanking = 'Internet Banking',
  creditCard = 'Credit Card',
  ewallet = 'E-Wallet',
  overTheCounter = 'Over The Counter',
}

export interface ChannelRes {
  title: string;
  status: boolean;
  canApplePay: boolean;
  canGooglePay: boolean;
  currency: string[];
  channel: string;
  logoUrl: ChannelLogo;
  type?: CHANNEL_TYPE
}

export interface RefundStatusReq {
  orderId: string
}
interface RefundSuccessStatusRes {
  TxnID: string;
  RefID: string;
  RefundID: string;
  Status: string;
  LastUpdate: string;
}


export type RefundStatusRes =
  | RefundSuccessStatusRes
  | ErrorRes;

export interface PerformRefundReq {
  orderId: string;
  transactionId: string;
  amount: string;
}

export interface PerformRefundRes {
  RefundType: string;
  MerchantID: string;
  RefID: string;
  RefundID: number;
  RefundFee: number;
  TxnID: number;
  Amount: string;
  Status: string;
  Signature: string;
}

export interface NotifyReq {
  nbcb: string;
  amount: string;
  orderid: string;
  tranID: string;
  domain: string;
  status: string;
  appcode: string;
  error_code: string;
  error_desc: string;
  skey: string;
  currency: string;
  channel: string;
  extraP?: string;
  paydate: string;
}

export interface RefundNotifyReq {
  RefundType: string;
  MerchantID: string;
  RefID: string;
  RefundID: string;
  TxnID: string;
  Amount: string;
  Status: string;
  Signature: string;
  reason: string;
}

export interface InquireReq {
  referenceId: string;
}

export interface PaymentConfigReq {
  transactionId: string;
  amount: string;
}
