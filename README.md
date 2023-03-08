### Description
This is a Razer SDK that allows developers to integrate their application or website with a payment gateway. A payment gateway is a service that authorizes and processes payments between customers and merchants.

Razer Merchant Services can simplify the process of integrating payment processing into your application or website. It provides pre-built functions and tools that allow you to handle payment transactions, securely manage customer information, and receive payments from various sources such as credit cards, debit cards, and digital wallets.

By integrating a payment gateway SDK like Razer Merchant Services, merchants can provide their customers with a convenient and secure way to make payments, while developers can focus on building the core features of their application or website without having to worry about the complexities of payment processing.

### Installation
```bash
# using npm
npm i rm-api-sdk
# using yarn
yarn add rm-api-sdk
```

### Prerequisites
Razer Verify Key & Secret Key
1. Login from [Razer Portal](https://portal.merchant.razer.com)
2. Transaction
3. Settings

### Usage
> Create SDK with Credential
```js
import { offlineInstance, onlineInstance } from '..'

// StoreId === MerchantId <-- Follow Documentation Naming
// Online SDK
const razerOnlineSdk = onlineInstance({ merchantId: '', verifyKey: "", secretKey: "", callbackUrl: '' })
// Offline SDK
const razerOfflineSDK = offlineInstance({ storeId: '', applicationCode: "", secretKey: "", terminalId: '' })
```
#### Online
> Online Payment Channel
```js
await razerOnlineSdk.getChannels()
```
> Read Payment Transactions By Date
```js
await razerOnlineSdk.getTransactionsByDate({start: new Date('2022-01-01T16:00:00.000Z'), end: new Date()})
```
> Read Payment Transaction By Order Id
```js
await razerOnlineSdk.getTransactionByOrderId({ orderId: 'ORDER123', amount: '5.00' })
```
> Read Payment Transaction By Transaction Id
```js
await razerOnlineSdk.getTransactionByTransactionId({ transactionId: 'TRANSACTION123', amount: '5.00' })
```
> Request Refund
```js
await razerOnlineSdk.requestRefund({ orderId: 'ORDER123', transactionId: "TRANSACTION123", amount: '5.00' })
```
> Check Transaction Refund Status 
```js
await razerOnlineSdk.checkRefundStatusByOrderId({ orderId: 'ORDER123' })
```
> Online Payment Notify (Callback) skey Verify
```js
razerOnlineSdk.generateNotifyKey({
  nbcb: '',
  amount: '',
  orderid: '',
  tranID: '',
  domain: '',
  status: '',
  appcode: '',
  error_code: '',
  error_desc: '',
  skey: '',
  currency: '',
  channel: '',
  extraP: '',
  paydate: '',
})
```
> Request Refund Notify (Callback) skey Verify
```js
razerOnlineSdk.generateRefundNotifyKey({
  RefundType: '',
  MerchantID: '',
  RefID: '',
  RefundID: '',
  TxnID: '',
  Amount: '',
  Status: '',
  Signature: '',
  reason: '',
})
```
#### Offline
> Pay by QR Code
```js
await razerOfflineSDK.scanPay({
  referenceId: 'REFERENCE123',
  authorizationCode: '', // QR Scan Result
  currencyCode: 'MYR',
  amount: '5.00',
})
```
> Request Refund
```js
await razerOfflineSDK.refund({
  amount: '5.00',
  currencyCode: 'MYR',
  // New Reference Id
  referenceId: 'REFUND123',
  // Original Payment Reference ID
  paymentReferenceId: "REFERENCE123",
})
```
> Inquiry - Check Status
```js
await razerOfflineSDK.inquire({
  referenceId: 'REFERENCE123',
})
```
> Inquiry - Check Status
```js
await razerOfflineSDK.inquire({
  referenceId: 'REFERENCE123',
})
```
> Reversal - Void Payment Within Same Day
```js
await razerOfflineSDK.reversal({
  referenceId: 'REVERSAL123',
  paymentReferenceId: 'REFERENCE123'
})
```
### Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

### License

[MIT](https://choosealicense.com/licenses/mit/)
