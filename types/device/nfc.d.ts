/**
 *  
 *  
 ## NFC
暂仅支持 HCE（基于主机的卡模拟）模式，即将安卓手机模拟成实体智能卡。
适用机型：支持 NFC 功能，且系统版本为Android5.0及以上的手机
适用卡范围：符合ISO 14443-4标准的CPU卡

 */
declare namespace wx {
  interface HCEErrCodeResponse {
    /**
     * 错误码
          
错误码 | 说明
----- | -----
13000   | 当前设备不支持 NFC
13001	| 当前设备支持 NFC，但系统NFC开关未开启
13002	| 当前设备支持 NFC，但不支持HCE
13003	| AID 列表参数格式错误
13004	| 未设置微信为默认NFC支付应用
13005	| 返回的指令不合法
13006	| 注册 AID 失败

          */
    errCode: string;
  }
  interface HCEBaseResponse extends HCEErrCodeResponse, ErrMsgResponse {}

  interface HCEBaseOptions extends BaseOptions {
    success(res: HCEBaseResponse): void;
  }

  interface GetHCEStateOptions extends HCEBaseOptions {}
  /**
   *  判断当前设备是否支持 HCE 能力。
   * @since 1.7.0
   */
  function getHCEState(options: GetHCEStateOptions): void;

  interface StartHCEOptions extends BaseOptions {
    /**
     * 需要注册到系统的 AID 列表，每个 AID 为 String 类型
     */
    aid_list: string[];
    success(res: HCEBaseResponse): void;
  }

  /**
   * 初始化 NFC 模块。
   * @since 1.7.0
   */
  function startHCE(options: StartHCEOptions): void;

  /**
   * 关闭 NFC 模块。仅在安卓系统下有效。
   * @since 1.7.0
   */
  function stopHCE(options: HCEBaseOptions): void;

  interface OnHCEMessageResponse {
    /**
     * 消息类型
     */
    messageType: number;
    /**
     * 客户端接收到 NFC 设备的指令，此参数当且仅当 messageType=1 时有效
     */
    data?: ArrayBuffer;
    /**
     * 此参数当且仅当 messageType=2 时有效
     */
    reason?: number;
  }

  /**
   * 监听 NFC 设备的消息回调，并在回调中处理。返回参数中 messageType 表示消息类型，目前有如下值：
1：消息为HCE Apdu Command类型，小程序需对此指令进行处理，并调用 sendHCEMessage 接口返回处理指令；
2：消息为设备离场事件
    @since 1.7.0
   */
  function onHCEMessage(callback: ((res: OnHCEMessageResponse) => void)): void;

  interface SendHCEMessageOptions extends HCEBaseOptions {
    /**
     * 二进制数据
     */
    data: ArrayBuffer;
  }

  /**
   * 发送 NFC 消息。仅在安卓系统下有效。
   * @since 1.7.0
@example

```js
const buffer = new ArrayBuffer(1)
const dataView = new DataView(buffer)
dataView.setUint8(0, 0)

wx.startHCE({
  success: function(res) {
    wx.onHCEMessage(function(res) {
      if (res.messageType === 1) {
        wx.sendHCEMessage({data: buffer})
      }
    })
  }
})
```
   */
  function sendHCEMessage(options: SendHCEMessageOptions): void;
}
