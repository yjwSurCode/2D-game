export default {};
// import { errRes, okRes, Res } from '../interface/index';
// import { backendApi } from '../core/old-api';
// import { CM } from '../core/interfaces';

// class BackendService {
// 	async getActInfo(params: { storeCode: string }): Promise<CM.Activity> {
// 		const resp = await backendApi.mustPost('/actClaw/getActInfo', {
// 			data: { storeCode: params.storeCode },
// 		});

// 		return resp.data;
// 	}

// 	async getUsrActInfo(params: { storeCode: string; guid: string; actId: string | number }): Promise<CM.UserActInfo> {
// 		const resp = await backendApi.mustPost('/actClaw/getUserActInfo', {
// 			data: {
// 				storeCode: params.storeCode,
// 				memGuid: params.guid,
// 				actId: params.actId,
// 			},
// 		});

// 		return resp.data;
// 	}

// 	async getTokenInfo(params: { token: string }): Promise<Res<CM.TokenInfo, string>> {
// 		const resp = await backendApi.post('/actClaw/getTokenInfo', {
// 			data: { token: params.token },
// 		});

// 		return resp.isError ? errRes(resp.error.msg || '获取分享信息失败 o(╥﹏╥)o') : okRes(resp.value.data);
// 	}

// 	async getShareToken(params: CM.TokenApplyParams): Promise<string> {
// 		const resp = await backendApi.mustPost('/actClaw/getShareToken', {
// 			data: { ...params },
// 		});

// 		return resp.data.token;
// 	}

// 	async shareHelped(params: { token: string; inviteeGuid: string }): Promise<Res<string, string>> {
// 		const resp = await backendApi.post('/actClaw/shareHelped', {
// 			data: {
// 				token: params.token,
// 				helperMemGuid: params.inviteeGuid,
// 			},
// 		});

// 		return resp.isError ? errRes(resp.error.msg || '助力失败 o(╥﹏╥)o') : okRes(resp.value.msg || '助力成功');
// 	}

// 	async getUserPoints(params: { guid: string; storeCode: string }): Promise<number> {
// 		let resp = await backendApi.mustPost('/draw/getCardId', {
// 			data: {
// 				guid: params.guid,
// 				storeCode: params.storeCode,
// 			},
// 		});

// 		const cardId: string | undefined = resp.data && resp.data.cardId;

// 		if (!cardId) {
// 			throw new Error('获取用户 cardId 异常 o(╥﹏╥)o');
// 		}

// 		resp = await backendApi.mustPost('/draw/getPoints', {
// 			data: {
// 				storeCode: params.storeCode,
// 				cardId,
// 			},
// 		});

// 		const points: number | undefined = resp.data && resp.data.points;

// 		if (points == null) {
// 			throw new Error('获取用户积分异常 o(╥﹏╥)o');
// 		}

// 		return points;
// 	}

// 	async receiveDeliveredCard(params: {
// 		token: string;
// 		storeCode: string;
// 		inviteeGuid: string;
// 		inviteeNickname?: string;
// 		inviteeAvatar?: string;
// 	}): Promise<Res<string, string>> {
// 		const resp = await backendApi.post('/actClaw/receiveDeliveredCard', {
// 			data: {
// 				token: params.token,
// 				storeCode: params.storeCode,
// 				memGuid: params.inviteeGuid,
// 				...(params.inviteeNickname ? { memName: params.inviteeNickname } : {}),
// 				...(params.inviteeAvatar ? { memAvatar: params.inviteeAvatar } : {}),
// 			},
// 		});

// 		return resp.isError ? errRes(resp.error.msg || '领取失败 o(╥﹏╥)o') : okRes(resp.value.msg || '领取成功');
// 	}

// 	async getUserPrizedList(params: {
// 		memGuid: string;
// 		memMd5: string;
// 		storeCode: string;
// 		actId: string;
// 	}): Promise<CM.UserPrize> {
// 		const resp = await backendApi.mustPost('/actClaw/getUserPrizedList', {
// 			data: params,
// 		});
// 		return resp.data;
// 	}

// 	async getCardDeliveredLog(params: { memGuid: string; memMd5: string; actId: string }): Promise<CM.SendRecord[]> {
// 		const resp = await backendApi.mustPost('/actClaw/getCardDeliveredLog', {
// 			data: params,
// 		});
// 		return resp.data || [];
// 	}

// 	async drawPrize(params: {
// 		memGuid: string;
// 		memMd5: string;
// 		storeCode: string;
// 		actId: number | string;
// 	}): Promise<CM.DrawPrizeResult> {
// 		const resp = await backendApi.mustPost('/actClaw/drawPrize', {
// 			data: params,
// 		});

// 		return resp.data;
// 	}

// 	async cardsCombine(params: {
// 		memGuid: string;
// 		memMd5: string;
// 		storeCode: string;
// 		actId: number | string;
// 	}): Promise<void> {
// 		await backendApi.mustPost('/actClaw/cardsCombine', {
// 			data: params,
// 		});
// 	}

// 	async toOrderAdd(params: {
// 		memGuid: string;
// 		memMd5: string;
// 		storeCode: string;
// 		actId: number | string;
// 	}): Promise<void> {
// 		await backendApi.mustPost('/actClaw/toOrderAdd', {
// 			data: params,
// 		});
// 	}
// }

// const backendService = new BackendService();

// export default backendService;
