import * as RMSOnline from './models/online.interface'
import { RazerOnlineSDK } from "./src/online";

const onlineInstance = ((config: RMSOnline.Config) => new RazerOnlineSDK(config));

import * as RMSOffline from './models/offline.inteface'
import { RazerOfflineSDK } from "./src/offline";

const offlineInstance = ((config: RMSOffline.Config) => new RazerOfflineSDK(config));

export {
  RMSOnline,
  RazerOnlineSDK,
  onlineInstance,
  RMSOffline,
  RazerOfflineSDK,
  offlineInstance
}
