import qs from 'qs';
import { createHmac } from 'crypto';
import axios, { AxiosInstance } from 'axios';
import {
  Config,
  InquireReq,
  InquireRes,
  PerformRefundReq,
  PerformRefundRes,
  PerformScanPayReq,
  PerformScanPayRes,
  ReversalReq,
  ReversalRes,
} from '../models/offline.inteface';

interface RazerOfflineSDKInstance {
  scanPay: (T: PerformScanPayReq) => Promise<PerformScanPayRes>
  refund: (T: PerformRefundReq) => Promise<PerformRefundRes>
  inquire: (T: InquireReq) => Promise<InquireRes>
}

export class RazerOfflineSDK implements RazerOfflineSDKInstance {
  private secretKey: string;
  private applicationCode: string;
  private storeId: string;
  private terminalId: string;

  private version = 'v2';
  private hashType = 'hmac-sha256';

  private apiInstance: AxiosInstance;
  private opaInstance: AxiosInstance;

  constructor({
    storeId,
    applicationCode,
    secretKey,
    terminalId,
  }: Config) {
    this.apiInstance = axios.create({
      baseURL: 'https://api.merchant.razer.com/RMS/API/MOLOPA/',
    });
    this.apiInstance.interceptors.request.use(async (req: any) => {
      req.headers = {
        ...req.headers,
        'content-type':
          'application/x-www-form-urlencoded; application/json; charset=UTF-8',
      };
      return req;
    });

    this.opaInstance = axios.create({
      baseURL: 'https://opa.merchant.razer.com/RMS/API/MOLOPA/',
    });
    this.opaInstance.interceptors.request.use(async (req: any) => {
      req.headers = {
        ...req.headers,
        'content-type':
          'application/x-www-form-urlencoded; application/json; charset=UTF-8',
      };
      return req;
    });

    this.storeId = storeId;
    this.applicationCode = applicationCode;
    this.secretKey = secretKey;
    this.terminalId = terminalId;
  }

  private toHmacKey(key: string): string {
    return createHmac('sha256', this.secretKey).update(key).digest('hex');
  }

  offlineChannel = {
    ['16']: 'ALIPAY',
    ['17']: 'TOUCHNGO',
    ['18']: 'ALIPAY',
    ['19']: 'BOOST',
    ['20']: 'MAYBANKQRPAY',
    ['21']: 'GRABPAY',
    ['22']: 'UNIONPAY',
    ['23']: 'SHOPEEPAY',
    ['24']: 'OTHER',
    ['25']: 'ALIPAY',
    ['26']: 'ATOME',
    ['36']: 'WECHATPAY (CN)',
    ['37']: 'WECHATPAY (MY)',

  };

  async scanPay({
    referenceId,
    authorizationCode,
    currencyCode,
    amount,
  }: PerformScanPayReq): Promise<PerformScanPayRes> {
    const key = `${amount}${this.applicationCode}${authorizationCode}${currencyCode}${this.hashType}${referenceId}${this.storeId}${this.terminalId}${this.version}`;
    const payload = {
      amount,
      applicationCode: this.applicationCode,
      authorizationCode,
      currencyCode,
      hashType: this.hashType,
      referenceId,
      storeId: this.storeId,
      terminalId: this.terminalId,
      version: this.version,
      signature: this.toHmacKey(key),
    };
    const response = await this.opaInstance({
      url: `payment.php`,
      method: 'POST',
      data: qs.stringify(payload),
    });
    return response.data;
  }

  async refund({
    amount,
    currencyCode,
    referenceId,
    paymentReferenceId,
  }: PerformRefundReq): Promise<PerformRefundRes> {
    const key = `${amount}${this.applicationCode}${currencyCode}${this.hashType}${paymentReferenceId}${referenceId}${this.version}`;
    const payload = {
      amount,
      applicationCode: this.applicationCode,
      currencyCode,
      paymentReferenceId,
      referenceId,
      version: this.version,
      hashType: this.hashType,
      signature: this.toHmacKey(key),
    };
    const response = await this.apiInstance({
      url: `refund.php`,
      method: 'POST',
      data: qs.stringify(payload),
    });
    return response.data;
  }

  async inquire({ referenceId }: InquireReq): Promise<InquireRes> {
    const key = `${this.applicationCode}${this.hashType}${referenceId}${this.version}`;
    const response = await this.apiInstance({
      url: `inquiry.php?applicationCode=${this.applicationCode
        }&hashType=${this.hashType}&referenceId=${referenceId}&version=${this.version}&signature=${this.toHmacKey(
          key,
        )}`,
      method: 'GET',
    });
    return response.data;
  }

  async reversal({ referenceId, paymentReferenceId }: ReversalReq): Promise<ReversalRes> {
    const key = `${this.applicationCode}${this.hashType}${paymentReferenceId}${referenceId}${this.version}`;
    const payload = {
      applicationCode: this.applicationCode,
      version: this.version,
      referenceId,
      paymentReferenceId,
      hashType: this.hashType,
      signature: this.toHmacKey(key)
    }
    const response = await this.apiInstance({
      url: `reversal.php`,
      method: 'POST',
      data: qs.stringify(payload)
    });
    return response.data;
  }
}
