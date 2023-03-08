import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { createHash, createHmac } from 'crypto';
import moment from 'moment';
import {
  Config,
  ChannelRes,
  DateRangeReq,
  PaymentTransactionTransactionIdReq,
  PaymentTransactionTransactionIdRes,
  NotifyReq,
  PaymentConfigReq,
  PaymentTransactionOrderIdReq,
  PaymentTransactionOrderIdRes,
  PaymentTransactionRes,
  PerformRefundRes,
  PerformRefundReq,
  RefundNotifyReq,
  RefundStatusRes,
  RefundStatusReq,
  CHANNEL_TYPE,
} from '../models/online.interface';

interface RazerOnlineSDKInstance {
  getPaymentConfig: (T: PaymentConfigReq) => string,
  echoBack: (T: NotifyReq) => Promise<void>,
  getChannels: () => Promise<ChannelRes[]>,
  getTransactionsByDate: (T: DateRangeReq) => Promise<PaymentTransactionRes[]>,
  getTransactionByOrderId: (T: PaymentTransactionOrderIdReq) => Promise<PaymentTransactionOrderIdRes>,
  getTransactionByTransactionId: (T: PaymentTransactionTransactionIdReq) => Promise<PaymentTransactionTransactionIdRes>,
  checkRefundStatusByOrderId: (T: RefundStatusReq) => Promise<RefundStatusRes>,
  requestRefund: (T: PerformRefundReq) => Promise<PerformRefundRes>,
  generateNotifyKey: (T: NotifyReq) => string,
  generateRefundNotifyKey: (T: RefundNotifyReq) => string
}

export class RazerOnlineSDK implements RazerOnlineSDKInstance {
  private apiInstance: AxiosInstance;
  private payInstance: AxiosInstance;
  private merchantId: string;
  private secretKey: string;
  private verifyKey: string;
  private callbackUrl: string;

  constructor({
    merchantId,
    verifyKey,
    secretKey,
    callbackUrl,
  }: Config) {
    this.apiInstance = axios.create({
      baseURL: 'https://api.merchant.razer.com/RMS',
    });

    this.apiInstance.interceptors.request.use(async (req: any) => {
      req.headers = {
        ...req.headers,
        'content-type':
          'application/x-www-form-urlencoded; application/json; charset=UTF-8',
      };
      return req;
    });

    this.payInstance = axios.create({
      baseURL: 'https://pay.merchant.razer.com/RMS',
    });

    this.payInstance.interceptors.request.use(async (req: any) => {
      req.headers = {
        ...req.headers,
        'content-type':
          'application/x-www-form-urlencoded; application/json; charset=UTF-8',
      };
      return req;
    });

    this.merchantId = merchantId;
    this.verifyKey = verifyKey;
    this.secretKey = secretKey;
    this.callbackUrl = callbackUrl;
  }

  private toHashKey(key: string): string {
    return createHash('md5').update(key).digest('hex');
  }

  private toHmacKey(key: string): string {
    return createHmac('sha256', this.verifyKey).update(key).digest('hex');
  }

  stringToObject(data: string): any {
    return data
      .split(/\r?\n/g)
      .filter((line) => line.trim())
      .reduce((acc: any, line) => {
        const [key, value] = line.split(':');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});
  }

  getPaymentConfig({ transactionId, amount }: PaymentConfigReq): string {
    const key = `${amount}${this.merchantId}${transactionId}${this.verifyKey}`;
    return this.toHashKey(key);
  }

  async echoBack(req: NotifyReq): Promise<void> {
    await this.payInstance({
      url: `/API/chkstat/returnipn.php`,
      method: 'POST',
      data: qs.stringify({ ...req, treq: '1' }),
    });
  }

  private toChannelType(type: string): CHANNEL_TYPE | undefined {
    switch (type) {
      case 'IB':
        return CHANNEL_TYPE.internetBanking
      case 'CC':
        return CHANNEL_TYPE.creditCard
      case 'EW':
        return CHANNEL_TYPE.ewallet
      case 'OTC':
        return CHANNEL_TYPE.overTheCounter
      default:
        return undefined
    }
  }

  async getChannels(): Promise<ChannelRes[]> {
    const date = moment(new Date()).format('YYYYMMDDHHmmss');
    const skey = this.toHmacKey(`${date}${this.merchantId}`);
    const response = (
      await this.payInstance({
        url: `/API/chkstat/channel_status.php`,
        method: 'POST',
        data: qs.stringify({
          merchantID: this.merchantId,
          datetime: date,
          skey: skey,
        }),
      })
    )
    if (!response.data?.status) throw response.data
    return response.data.result.map((gateway: any): ChannelRes => ({
      title: gateway.title,
      status: gateway.status == 1,
      canApplePay: gateway.applepay_enabled == 1,
      canGooglePay: gateway.googlepay_enabled == 1,
      currency: gateway.currency,
      logoUrl: {
        '16x16': gateway.logo_url_16x16,
        '24x24': gateway.logo_url_24x24,
        '32x32': gateway.logo_url_32x32,
        '48x48': gateway.logo_url_48x48,
        '120x43': gateway.logo_url_120x43,
      },
      channel: gateway.channel_map.seamless.request,
      type: this.toChannelType(gateway.channel_type)
    }));
  }

  async getTransactionsByDate({
    start,
    end,
  }: DateRangeReq): Promise<PaymentTransactionRes[]> {
    const dayStart = moment(start);
    const duration = moment(end).diff(dayStart, 'seconds');
    const toDate = dayStart.format('YYYY-MM-DD HH:mm:ss');
    const key = `${toDate}${this.merchantId}${this.secretKey}`;
    const response = await this.apiInstance({
      url: `/API/PSQ/psq-daily.php?merchantID=${this.merchantId
        }&skey=${this.toHashKey(
          key,
        )}&rdate=${toDate}&rduration=${duration}&version=3&response_type=json&additional_fields=all`,
      method: 'GET',
    });
    return response.data;
  }

  async getTransactionByOrderId({
    orderId,
    amount,
  }: PaymentTransactionOrderIdReq): Promise<PaymentTransactionOrderIdRes> {
    const key = `${orderId}${this.merchantId}${this.verifyKey}${amount}`;
    const response = await this.apiInstance({
      url: `/query/q_by_oid.php?amount=${amount}&domain=${this.merchantId
        }&oID=${orderId}&skey=${this.toHashKey(key)}`,
      method: 'GET',
    });
    return this.stringToObject(response.data);
  }

  async getTransactionByTransactionId({
    transactionId,
    amount,
  }: PaymentTransactionTransactionIdReq): Promise<PaymentTransactionTransactionIdRes> {
    const key = `${transactionId}${this.merchantId}${this.verifyKey}${amount}`;
    const response = await this.apiInstance({
      url: `/q_by_tid.php?amount=${amount}&domain=${this.merchantId
        }&txID=${transactionId}&skey=${this.toHashKey(key)}`,
      method: 'GET',
    });
    return this.stringToObject(response.data);
  }

  async checkRefundStatusByOrderId(
    { orderId }: RefundStatusReq
  ): Promise<RefundStatusRes> {
    const key = `${orderId}${this.merchantId}${this.verifyKey}`;
    const response = await this.apiInstance({
      url: `/API/refundAPI/q_by_refID.php`,
      method: 'POST',
      data: qs.stringify({
        RefID: orderId,
        MerchantID: this.merchantId,
        Signature: this.toHashKey(key),
      }),
    });
    if (response.data.error_code) return response.data;
    return Object.assign({}, response.data[0]);
  }

  async requestRefund({
    orderId,
    transactionId,
    amount,
  }: PerformRefundReq): Promise<PerformRefundRes> {
    const refundType = 'P';
    const key = `${refundType}${this.merchantId}${orderId}${transactionId}${amount}${this.secretKey}`;
    const data = {
      RefundType: refundType,
      MerchantID: this.merchantId,
      RefID: orderId,
      TxnID: transactionId,
      Amount: amount,
      Signature: this.toHashKey(key),
      notify_url: `${this.callbackUrl}/rms/refund-notify`,
    };
    const res = await this.apiInstance({
      url: `/API/refundAPI/index.php`,
      method: 'POST',
      data: qs.stringify(data),
    });
    if (res.data.error_code) throw res.data;
    return res.data;
  }

  generateNotifyKey(data: NotifyReq): string {
    const primaryKey = this.toHashKey(
      `${data.tranID}${data.orderid}${data.status}${this.merchantId}${data.amount}${data.currency}`,
    );
    return this.toHashKey(
      `${data.paydate}${this.merchantId}${primaryKey}${data.appcode}${this.secretKey}`,
    );
  }

  generateRefundNotifyKey(data: RefundNotifyReq): string {
    const key = `${data.RefundType}${data.MerchantID}${data.RefID}${data.RefundID}${data.TxnID}${data.Amount}${data.Status}${this.secretKey}`;
    return this.toHashKey(key);
  }
}
