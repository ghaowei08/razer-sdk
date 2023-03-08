export interface Config {
  storeId: string;
  applicationCode: string;
  secretKey: string;
  terminalId: string;
}

export interface PerformRefundReq {
  referenceId: string;
  currencyCode: string;
  amount: string;
  paymentReferenceId: string;
}

export interface PerformRefundRes {
  amount: string;
  applicationCode: string;
  baseAmount: string;
  baseCurrencyCode: string;
  channelId: string;
  currencyCode: string;
  exchangeRate: string;
  hashType: string;
  molTransactionId: string;
  paymentReferenceId: string;
  referenceId: string;
  signature: string;
  statusCode: string;
  transactionDateTime: string;
  version: string;
}

export interface PerformScanPayReq {
  referenceId: string;
  authorizationCode: string;
  currencyCode: string;
  amount: string;
}

export interface PerformScanPayRes {
  amount: string;
  applicationCode: string;
  authorizationCode: string;
  authorizationCodeType: string;
  baseAmount: string;
  baseCurrencyCode: string;
  channelId: string;
  currencyCode: string;
  errorCode: string;
  exchangeRate: string;
  molTransactionId: string;
  payerId: string;
  referenceId: string;
  statusCode: string;
  transactionDateTime: string;
  version: string;
  signature: string;
}

export interface InquireReq {
  referenceId: string;
}

export interface InquireRes {
  referenceId: string;
  authorizationCode: string;
  currencyCode: string;
  amount: string;
  molTransactionId: string;
  exchangeRate: string;
  baseCurrencyCode: string;
  baseAmount: string;
  statusCode: string;
  errorCode: string;
  transactionDateTime: string;
  hashType: string;
  version: string;
  applicationCode: string;
  channelId: string;
  signature: string;
}

export interface ReversalReq {
  referenceId: string;
  paymentReferenceId: string;
}

export interface ReversalRes {
  applicationCode: string;
  version: string;
  referenceId: string;
  paymentReferenceId: string;
  molTransactionId: string;
  channelId?: string;
  statusCode: string;
  errorCode: string;
  currencyCode: string;
  transactionDateTime: string;
  hashType: string;
  signature: string;
}