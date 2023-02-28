export {};
// import { Dictionary } from '../interface/index';
// import { RunningEnv } from '../core/constants';
// import { appendQuery, stringifyQuery } from './history-utils';
// import { NATIVE_BRIDGE } from './native-utils';
// import { loadScript } from './script-utils';

// export enum AlipayAppPages {
// 	/** 我的优惠券 */
// 	CouponList = 'couponList',
// 	/** 支付宝领券页 */
// 	AlipayCoupon = 'alipayCoupon',
// }

// class PlatformBridge {
// 	private _runningEnv?: RunningEnv;

// 	async loadAlipaySdk(): Promise<void> {
// 		return loadScript('https://appx/web-view.min.js');
// 	}

// 	async loadWechatSdk(): Promise<void> {
// 		return loadScript('//res.wx.qq.com/open/js/jweixin-1.6.0.js');
// 	}

// 	async getRunningEnv(): Promise<RunningEnv> {
// 		if (this._runningEnv) {
// 			return this._runningEnv;
// 		}

// 		const win: any = window;

// 		// 支付宝小程序
// 		if (/AlipayClient/i.test(navigator.userAgent)) {
// 			const isAliApp = await new Promise<boolean>((resolve) => {
// 				this.loadAlipaySdk().then(() => {
// 					if (win.my && typeof win.my.getEnv === 'function') {
// 						win.my.getEnv((res: any) => {
// 							resolve(res.miniprogram || res.miniProgram);
// 						});
// 					} else {
// 						resolve(false);
// 					}
// 				});
// 			});

// 			this._runningEnv = isAliApp ? RunningEnv.AliApp : RunningEnv.AliClient;
// 			return this._runningEnv;
// 		}

// 		// 微信环境
// 		if (/MicroMessenger/i.test(navigator.userAgent)) {
// 			//ios的 ua 中无 miniProgram，很坑爹,但都有 MicroMessenger（表示是微信浏览器）

// 			const isWeApp = await new Promise<boolean>((resolve) => {
// 				this.loadWechatSdk().then(() => {
// 					if (win.wx && win.wx.miniProgram && typeof win.wx.miniProgram.getEnv === 'function') {
// 						win.wx.miniProgram.getEnv((res: any) => {
// 							resolve(res.miniprogram || res.miniProgram);
// 						});
// 					} else {
// 						resolve(false);
// 					}
// 				});
// 			});

// 			this._runningEnv = isWeApp ? RunningEnv.WeApp : RunningEnv.WeClient;
// 			return this._runningEnv;
// 		}

// 		/* ios */
// 		if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.FNJSBridge) {
// 			this._runningEnv = RunningEnv.Ios;
// 			return this._runningEnv;
// 		}

// 		/* android */
// 		if (win.FNJSBridge) {
// 			this._runningEnv = RunningEnv.Android;
// 			return this._runningEnv;
// 		}

// 		this._runningEnv = RunningEnv.H5;
// 		return RunningEnv.H5;
// 	}

// 	/** 设置页面标题 */
// 	async setPageTitle(title: string) {
// 		const env = await this.getRunningEnv();

// 		if (env === RunningEnv.WeApp) {
// 			document.title = title;

// 			const iframe = document.createElement('iframe');
// 			iframe.style.visibility = 'hidden';
// 			iframe.style.width = '1px';
// 			iframe.style.height = '1px';
// 			iframe.onload = () => {
// 				setTimeout(() => {
// 					document.body.removeChild(iframe);
// 				}, 0);
// 			};
// 			iframe.src = 'about:blank';

// 			document.body.appendChild(iframe);
// 		} else if (env === RunningEnv.Android || env === RunningEnv.Ios) {
// 			NATIVE_BRIDGE.setTitle(title);
// 		} else {
// 			document.title = title;
// 		}
// 	}

// 	/** 跳转新页面 */
// 	async _jumpURL(url: string): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		if (env === RunningEnv.WeApp) {
// 			return this._jumpToWeApp(`/pages/pub/web_view?${stringifyQuery({ url })}`);
// 		}

// 		if (env === RunningEnv.AliApp) {
// 			return this._jumpToAlipayApp(`/pages/url-view/index?${stringifyQuery({ url })}`);
// 		}

// 		if (env === RunningEnv.Ios || env === RunningEnv.Android) {
// 			window.location.href = `fnfresh://openurl?${stringifyQuery({ url })}`;
// 			return;
// 		}

// 		window.location.href = url;
// 	}

// 	/** 跳转新路由 */
// 	async openURL(url: string): Promise<void> {
// 		return this._jumpURL(url);
// 	}

// 	/**
// 	 * 跳转CMS页面
// 	 * @param params 参数
// 	 */
// 	async jumpCms(params: { url: string; aid: string; sid?: string; sdType?: string }): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		const { url, ...rest } = params;

// 		if (env === RunningEnv.WeApp) {
// 			return this._jumpToWeApp(
// 				`/pages/www/cms?${stringifyQuery({
// 					f: appendQuery(url, {
// 						aid: params.aid,
// 						sid: params.sid,
// 					}),
// 					...rest,
// 				})}`,
// 			);
// 		}

// 		if (env === RunningEnv.AliApp) {
// 			return this._jumpToAlipayApp(
// 				`/pages/cms/index?${stringifyQuery({
// 					f: appendQuery(url, {
// 						aid: params.aid,
// 						sid: params.sid,
// 					}),
// 					...rest,
// 				})}`,
// 			);
// 		}

// 		const h5Url = appendQuery(url, rest);

// 		if (env === RunningEnv.Ios || env === RunningEnv.Android) {
// 			window.location.href = `fnfresh://openurl?${stringifyQuery({ url: h5Url })}`;
// 			return;
// 		}

// 		window.location.href = h5Url;
// 	}

// 	/**
// 	 * 跳转门店首页（只支持微信小程序、支付宝小程序）
// 	 * @param params 参数
// 	 */
// 	async jumpStoreIndex(params: { storeCode: string }): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		if (env === RunningEnv.WeApp) {
// 			return this._jumpToWeApp(
// 				`/pages/store/store_membership?${stringifyQuery({
// 					shopId: params.storeCode,
// 				})}`,
// 			);
// 		}

// 		if (env === RunningEnv.AliApp) {
// 			return this._jumpToAlipayApp(
// 				`/pages/store-member/index?${stringifyQuery({
// 					storeCode: params.storeCode,
// 				})}`,
// 			);
// 		}
// 	}

// 	/**
// 	 * 跳转首页（只支持微信小程序、支付宝小程序、 App）
// 	 * @param params 参数
// 	 */
// 	async jumpIndex(): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		if (env === RunningEnv.WeApp) {
// 			return this._switchTabWeApp('/pages/index');
// 		}

// 		if (env === RunningEnv.AliApp) {
// 			return this._switchTabAlipayApp('/pages/index/index');
// 		}

// 		if (env === RunningEnv.Ios || env === RunningEnv.Android) {
// 			window.location.href = 'fnfresh://homepage?isrefresh=1';
// 			return;
// 		}
// 	}

// 	/**
// 	 * 跳转商详（只支持微信小程序、支付宝小程序、APP）
// 	 * @param params 参数
// 	 */
// 	async jumpGoods(params: { storeCode: string; goodsNo: string }): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		if (env === RunningEnv.WeApp || env === RunningEnv.AliApp) {
// 			const search: Dictionary = {
// 				id: params.goodsNo,
// 				merchantStoreId: params.storeCode,
// 				saleStoreId: '002',
// 				isVoucherGoods: 0,
// 				merchantCode: 1,
// 				merchantType: 1,
// 				channelStoreId: '0002',
// 			};

// 			if (env === RunningEnv.WeApp) {
// 				return this._jumpToWeApp(`/pages/www/detail?${stringifyQuery(search)}`);
// 			} else {
// 				return this._jumpToAlipayApp(`/pages/detail/index?${stringifyQuery(search)}`);
// 			}
// 		}

// 		if (env === RunningEnv.Ios || env === RunningEnv.Android) {
// 			const search: Dictionary = {
// 				smseq: params.goodsNo,
// 				merchantStoreId: params.storeCode,
// 				saleStoreId: '002',
// 				isVoucherGoods: 0,
// 				merchantCode: 1,
// 				merchantType: 1,
// 				channelStoreId: '0002',
// 			};
// 			window.location.href = `fnfresh://productdetail?${stringifyQuery(search)}`;
// 			return;
// 		}
// 	}

// 	/**
// 	 * 跳转登录（只支持微信小程序、支付宝小程序、APP）
// 	 * @param params 参数
// 	 */
// 	async jumpLogin(params: { url: string }): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		if (env === RunningEnv.WeApp) {
// 			return this._jumpToWeApp(`/pages/www/authorization?${encodeURIComponent(params.url)}`);
// 		}

// 		if (env === RunningEnv.AliApp) {
// 			return this._jumpToAlipayApp(`/pages/authorized/index?${encodeURIComponent(params.url)}`);
// 		}

// 		if (env === RunningEnv.Ios || env === RunningEnv.Android) {
// 			window.location.href = `fnfresh://login?${stringifyQuery({ url: params.url })}`;
// 			return;
// 		}
// 	}

// 	/**
// 	 * 支付宝小程序 跳转；
// 	 * @param params 参数
// 	 */
// 	async alipayAppNavigateTo(url: AlipayAppPages): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		let formatUrl: string = url;

// 		if (url === AlipayAppPages.CouponList) {
// 			/** 我的优惠券 */
// 			formatUrl = '/pkg-my/pages/coupon-list/index';
// 		} else if (url === AlipayAppPages.AlipayCoupon) {
// 			/** 支付宝领券页 */
// 			formatUrl = '/pkg-www/pages/alipay-coupon/index';
// 		}

// 		if (env === RunningEnv.AliApp) {
// 			this._jumpToAlipayApp(formatUrl);
// 		}
// 	}

// 	/**
// 	 * 发送数据（只支持微信小程序）
// 	 * @param params 参数
// 	 */
// 	async postMessage(params: any): Promise<void> {
// 		const env = await this.getRunningEnv();

// 		if (env === RunningEnv.WeApp) {
// 			const win: any = window;
// 			win.wx.miniProgram.postMessage({ data: params });
// 		}
// 	}

// 	protected _jumpToAlipayApp(url: string) {
// 		const win: any = window;
// 		win.my.navigateTo({ url });
// 	}

// 	protected _jumpToWeApp(url: string) {
// 		const win: any = window;
// 		win.wx.miniProgram.navigateTo({ url });
// 	}

// 	protected _switchTabAlipayApp(url: string) {
// 		const win: any = window;
// 		win.my.switchTab({ url });
// 	}

// 	protected _switchTabWeApp(url: string) {
// 		const win: any = window;
// 		win.wx.miniProgram.switchTab({ url });
// 	}
// }

// export const PLATFORM_BRIDGE = new PlatformBridge();
