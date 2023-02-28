export {};
// import { Dictionary, randomString } from '../interface/index';
// import { cmsApi } from '../core/api';
// import { FreshChannel, RunningEnv } from '../core/constants';
// import { RTAreaTreeNode } from '../core/interfaces';
// import { NATIVE_BRIDGE } from '../utils/native-utils';
// import { PLATFORM_BRIDGE } from '../utils/platform-utils';
// import { RequestClient } from '../utils/request-utils';

// class CmsService {
// 	async getAreaTree(params: { channel?: FreshChannel }): Promise<RTAreaTreeNode[]> {
// 		const requestData: Dictionary = {
// 			type: 3,
// 		};

// 		if (params.channel) {
// 			requestData.type = params.channel === FreshChannel.YouXian ? 1 : 2;
// 		}

// 		const resp = await cmsApi.mustPost('/couponShare/getAllProvinceCityStoreTMS', {
// 			data: requestData,
// 		});

// 		const format = (arr: any, ancestorIds: string[] = []): RTAreaTreeNode[] => {
// 			if (!Array.isArray(arr) || arr.length <= 0) {
// 				return [];
// 			}

// 			const pid: string = ancestorIds.length ? ancestorIds[ancestorIds.length - 1] : '-1';

// 			let idCounter = 1;

// 			return arr.map<RTAreaTreeNode>((item) => {
// 				const children = item.cityList || item.storeList || [];

// 				const no = `${item.storeNo || item.cityNo || item.provinceNo}`;
// 				const label = item.storeName || item.cityName || item.provinceName;
// 				const id = pid === '-1' ? `${idCounter}` : `${pid}-${idCounter}`;

// 				// 增长 ID
// 				idCounter++;

// 				return {
// 					id,
// 					pid,
// 					ancestorIds,
// 					attrs: { no, label },
// 					...(children.length > 0 ? { children: format(children, [...ancestorIds, id]) } : {}),
// 				};
// 			});
// 		};

// 		return format(resp.data?.allProvinceCityStore || []);
// 	}

// 	async bp(obj: {
// 		page_col: string | number;
// 		page_id: string | number;
// 		col_position?: string | number;
// 		col_pos_content?: string | number;
// 		track_type: string | number;
// 		client_type?: string | number;
// 		store_code?: string;
// 		guid?: string;
// 		remarks?: string;
// 		source?: FreshChannel; // 区分 优鲜和欧尚
// 	}) {
// 		try {
// 			const UDID = `H5_${new Date().getTime()}${randomString(10)}`;

// 			const config: any = {
// 				client_type: obj.client_type || '14',
// 				client_time: new Date().getTime().toString(),
// 				terminal_os: /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) ? 'ios' : 'android',
// 				page_col: `${obj.page_col || ''}`,
// 				page_id: `${obj.page_id || ''}`,
// 				track_type: `${obj.track_type || ''}`,
// 				col_position: `${obj.col_position || ''}`,
// 				col_pos_content: `${obj.col_pos_content || ''}`,
// 				session_id: '',
// 				area_code: '',
// 				udid_first_time: '',
// 				ver: '',
// 				ip: '',
// 				network: '',
// 				gps: '',
// 				remarks: obj.remarks || '',
// 				entry_method: '1',
// 				abtest: '',
// 				access_time: '',
// 			};

// 			const env = await PLATFORM_BRIDGE.getRunningEnv();

// 			if (env === RunningEnv.Ios || env === RunningEnv.Android) {
// 				const nc = await NATIVE_BRIDGE.getNativeCookies();

// 				config.client_type = obj.source === FreshChannel.Auchan ? '5' : '3';
// 				config.udid = nc.yx_deviceId || UDID;
// 				config.session_id = nc.yx_session_id || '';
// 				config.mem_guid = obj.guid || nc.yx_guid || `H5_${new Date().getTime()}${randomString(10)}` || '';
// 				config.ver = nc.yx_version || '';
// 				config.ip = nc.yx_ip || '';
// 				config.gps = nc.yx_gps || '';
// 				config.network = nc.yx_network || '';
// 				config.udid_first_time = nc.yx_udid_first_time || '';
// 				config.area_code = nc.yx_storecode || '';
// 				// config.remarks = JSON.stringify({ cms_id: ci.pageId });
// 				// config.entry_method = '1';
// 				config.abtest = '';
// 				// config.access_time = '';
// 				// config.traffic_channel = terminalOs === 'iPhone os' ? 'APP STORE' : '';
// 			} else {
// 				config.udid = UDID;
// 				config.mem_guid = `H5_${new Date().getTime()}${randomString(10)}`;
// 				config.network = '';

// 				if (env === RunningEnv.WeApp) {
// 					config.client_type = obj.source === FreshChannel.Auchan ? '18' : '16';
// 				} else if (env === RunningEnv.AliApp) {
// 					config.client_type = obj.source === FreshChannel.Auchan ? '19' : '17';
// 				}
// 			}

// 			await cmsApi.get('/point/up2.do', {
// 				params: { data: JSON.stringify([config]) },
// 				responseType: 'text',
// 				responseHandler: RequestClient.DEFAULT_RESPONSE_HANDLER,
// 			});
// 		} catch (e) {
// 			console.warn(e);
// 		}
// 	}
// }

// const cmsService = new CmsService();

// export default cmsService;
