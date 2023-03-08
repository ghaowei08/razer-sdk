import { offlineInstance, onlineInstance } from '..'

// Online SDK
const razerOnlineSdk = onlineInstance({ merchantId: '', verifyKey: '', secretKey: '', callbackUrl: '' })
// Offline SDK
const razerOfflineSDK = offlineInstance({ storeId: '', applicationCode: '', secretKey: '', terminalId: '' })

async function main() {
  try {
    // Online Payment Channel
    await razerOnlineSdk.getChannels()
    // Read Payment Transactions By Date
    await razerOnlineSdk.getTransactionsByDate({ start: new Date('2022-01-01T16:00:00.000Z'), end: new Date() })
    // Read Payment Transaction By Order Id
    await razerOnlineSdk.getTransactionByOrderId({ orderId: 'ORDER123', amount: '5.00' })
    // Read Payment Transaction By Transaction Id
    await razerOnlineSdk.getTransactionByTransactionId({ transactionId: 'TRANSACTION123', amount: '5.00' })
    // Check Transaction Refund Status
    await razerOnlineSdk.checkRefundStatusByOrderId({ orderId: 'ORDER123' })
    // Request Refund
    await razerOnlineSdk.requestRefund({ orderId: 'ORDER123', transactionId: "TRANSACTION123", amount: '5.00' })
    // Online Payment Notify (Callback) skey Verify
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
    // Request Refund Notify (Callback) skey Verify
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
    // Pay by QR Code
    await razerOfflineSDK.scanPay({
      referenceId: 'REFERENCE123',
      authorizationCode: '', // QR Scan Result
      currencyCode: 'MYR',
      amount: '5.00',
    })
    // Request Refund
    await razerOfflineSDK.refund({
      amount: '5.00',
      currencyCode: 'MYR',
      // New Reference Id
      referenceId: 'REFUND123',
      // Original Payment Reference ID
      paymentReferenceId: "REFERENCE123",
    })
    // Inquiry - Check Status
    await razerOfflineSDK.inquire({
      referenceId: 'REFERENCE123',
    })
    // Reversal - Void Payment Within Same Day
    await razerOfflineSDK.reversal({
      referenceId: 'REVERSAL123',
      paymentReferenceId: 'REFERENCE123'
    })
  } catch (err) {
    console.error(err)
  }
}

main()