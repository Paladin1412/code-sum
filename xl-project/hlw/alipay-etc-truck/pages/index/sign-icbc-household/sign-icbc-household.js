import APIs from "../../../apis/index";
import { showTitledAlert, selectImg, showToast, trimAll, showLoading, hideLoading } from "../../../utils/util";

const app = getApp();
let interval = "";

Page({
	data: {
		activeIndex: 3,
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
		//  白羽 370403198901057292 ；交行 6222623740000095721 ； 15688892323
		//  邓婷  620302199002110621   6217231609001348138   13905307989 工行一类户
		//  夏风鲁  371524199205101651    6228210259028435377  15634131276
		// 王敏  370481199111068142   6228480259048856373  15552866455
		// 穆新芹  370112198511142969  6236682340011080305 15588859875
		// 6236682340011259214 中国建设银行， 霍付全 ， 372922198809224797 , 18566259221 两个手机号试试
		userName: "",//姓名
		certNo: "",//
		cardNo: "",//
		mobile: "",//手机号码
		captcha: "",//收件人
		enableSmallButton: true,
		smallButtonText: "点击发送",
		channelSignedId: "",
		signedId: "",
		oldCardNo: "",					// 发送完短信后保存一下  防止用户更改
		issuer: "",						// 卡片发行方
		disabledInput: false,				// 是否禁用银行卡输入
		hasOldSecond: false,				// 是否存在已签约的二类户
		accountType: "",				// 账户类型
		AccountNumber: "",
		icbcFlag: true,
		sendMsgFlag: false,
		checked:false,
		AshPlacing:false,
		CreditCardIcbc:false   

		

	},
	onItemInput(e) {
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	onChange(e){
		this.setData({checked:e.detail.value})
		this.setData({AshPlacing:e.detail.value})
		console.log(e,109)
	},
	onClear(e) {
		this.setData({
			[e.target.dataset.field]: "",
		});
	},
	checkParams() {
		if (!trimAll(this.data.cardNo)) {
			showToast("请填写银行卡号");
			return false;
		}
		console.log(this.data.cardNo.length, 155)
		if (trimAll(this.data.cardNo.length) < 14) {
			showToast("请填写正确的银行卡号");
			return false;
		}
		if (!trimAll(this.data.userName)) {
			showToast("请填写银行卡账户名");
			return false;
		}
		if (!trimAll(this.data.certNo)) {
			showToast("请填写身份证号");
			return false;
		}
		// if (!trimAll(this.data.cardNo)) {
		// 	showToast("请填写银行卡号");
		// 	return false;
		// }
		if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.mobile))) {
			showToast("手机号码有误，请重填");
			return;
		}
		if (!trimAll(this.data.mobile)) {
			showToast("请填写银行预留手机号");
			return false;
		}
		return true;
	},
	countDown() {
		this.setData({
			enableSmallButton: false,
			smallButtonText: "重新发送(60)",
		});
		let count = 60;
		interval = setInterval(() => {
			count--;
			if (count > 0) {
				this.setData({
					smallButtonText: `重新发送(${count})`
				});
			} else {
				clearInterval(interval);
				this.setData({
					enableSmallButton: true,
					smallButtonText: `重新发送`,
				});
			}
		}, 1000);
	},
	onChange(e){
		this.setData({checked:e.detail.value})
		this.setData({AshPlacing:e.detail.value})
		console.log(e,109)
	},
	onBlur() {
		if (!trimAll(this.data.cardNo)) {
			showToast("请填写银行卡号");
			return false;
		}
		console.log(this.data.cardNo.length, 155)
		if (trimAll(this.data.cardNo.length) < 14) {
			showToast("请填写正确的银行卡号");
			return false;
		}
		showLoading();
		APIs.checkCardBin({ account: this.data.cardNo }).then(({ result }) => {
			hideLoading();
			if (result.account_type == "1") {
				showTitledAlert("签约只支持借记卡，您当前选择的是信用卡，请重新选择银行卡");
				return;
			}
			console.log(result.issuer_code, 96)
			this.setData({ issuer: result.issuer_code, accountType: result.account_type });
			console.log(this.data.issuer, 109)
			if (this.data.issuer == "ICBC") {
				this.setData({ sendMsgFlag: true })
			} else {
				// showToast("请填本行银行卡号");
				// return false;
				this.setData({ sendMsgFlag: true })
				this.setData({ icbcFlag: false })
				return false;
			}
		}).catch(error => {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		});

	},
	async sendMsg() {
		console.log("104")
		showLoading()
		if (!this.checkParams()) {
			hideLoading();
			return;
		}

		try {
			showLoading();
			// 一类户调用通用短信
			let { result } = await APIs.checkCardBin({ account: this.data.cardNo })
			console.log(result, 229)
			if (result.account_type == "1") {
				showTitledAlert("签约只支持借记卡，您当前选择的是信用卡，请重新选择银行卡");
				return;
			}
			this.setData({ issuer: result.issuer_code, accountType: result.account_type });
			if (this.data.issuer === "ICBC") {
				hideLoading()
			} else {
				// showToast("请填本行银行卡号");
				hideLoading()
				// 二类户 先查询是否存在二类户
				console.log("1119")
				let { result } = await APIs.signSecondQueryICBC({ credential_code: this.data.certNo });
				console.log(result, 140)
				hideLoading();
				if (result && result.account) {
					console.log("1212")
					const msg = `您当前身份证${this.data.certNo}下已有二类户账户，将使用已经开通的二类户继续签约，点击“确定”继续`;
					await showTitledAlert(msg);
					this.setData({ disableInput: true, cardNo: result.channel_signed_id, mobile: result.mobile, hasOldSecond: true, AccountNumber: result.channel_signed_id });
					// showLoading();
					// await APIs.sendMsgCommon({ mobile: this.data.mobile });
					// hideLoading();
					// showToast("发送成功");
					// this.countDown();
					this.sign()
				} else {
					console.log("34556")
					const params = {
						credential_code: this.data.certNo,
						username: this.data.userName,
						mobile: this.data.mobile,
						account_type: "SECOND_ACCOUNT",
						credential_type: "01",
						account: this.data.cardNo,
						merchant_code: "truck_obu_etc"
					};
					showLoading();
					let { result } = await APIs.sendMsgICBC(params);
					hideLoading();
					showToast("发送成功");
					this.setData({ signedId: result.signed_id, channelSignedId: result.channel_signed_id });
					this.setData({ oldCardNo: this.data.cardNo, hasOldSecond: false });
					this.countDown();
				}
			}
		} catch (error) {
			hideLoading();
			showToast(error.message);
		}
	},
	async sign() {
		showLoading();
		if (!this.checkParams()) {
			hideLoading();
			return;
		}
		if (!this.data.hasOldSecond) {
			if (!trimAll(this.data.captcha) || trimAll(this.data.captcha.length) != 6) {
				hideLoading();
				showToast("请填正确的验证码");
				return false;
			}
			if (this.data.issuer !== "ICBC" && !this.data.signedId) {
				hideLoading();
				showToast("请先获取验证码");
				return;
			}
			if (this.data.issuer !== "ICBC" && !this.data.channelSignedId) {
				hideLoading();
				showToast("请先获取验证码");
				return;
			}
			if (this.data.oldCardNo != trimAll(this.data.cardNo)) {
				hideLoading();
				showTitledAlert("您更改了银行卡号，请重新发送验证码");
				return;
			}
		}
		try {
			// 一类户签约
			console.log("200")
			if (this.data.issuer === "ICBC") {
			} else {
				// showToast("请填本行银行卡号");
				// hideLoading()
				//	二类户签约
				if (this.data.hasOldSecond) {
					// 签约短信验证2 验证
					console.log("198")
					await APIs.msgValidCommon({ mobile: this.data.mobile, code: this.data.captcha });
				} else {
					const params = {
						channel_signed_id: this.data.channelSignedId,
						chk_no: this.data.captcha
					};
					//签约短信验证
					console.log("206")
					let { result } = await APIs.msgValidICBC(params);
					this.setData({ AccountNumber: result.channel_signed_id })
				}
				//2类户签约
				// const params = {
				// 	sub_channel: "SECOND_ACCOUNT",
				// 	credential_code: this.data.certNo,
				// 	username: this.data.userName,
				// 	mobile: this.data.mobile,
				// 	account: this.data.cardNo
				// };
				// let { result } = await APIs.signSecondApplyICBC(params);
				const params = {
					sub_channel: "SECOND_ACCOUNT",
					credential_code: this.data.certNo,
					mobile: this.data.mobile,
					username: this.data.userName,
					account: this.data.AccountNumber,
					merchant_code: "2101",
					credential_type: "01",
					account_type: "1"
				};
				// let res = await APIs.signApply(params);
                // showToast(res.msg);
				let {msg,result}= await APIs.signApply(params);
				if(msg.indexOf("请勿重复签约")!=-1){
                   await showTitledAlert(msg);
				}
				const params2 = {
					bank_code: "ICBC",
					signed_id:result.signed_id
				};
				//签约成功通知
				
				await APIs.signedNotice(params2);
				hideLoading();
				if (interval) {
					clearInterval(interval);
					this.setData({
						smallButtonText: `点击发送`,
						disableInput: false
					});
				}
			}
			// 跳转到授信页面
			// my.redirectTo({
			// 	url: "/pages/index/empty-page/empty-page?target=credit"
			// });
			my.redirectTo({
				url: "/pages/index/sign-credit-apply/sign-credit-apply"
				// url: "/pages/index/empty-page/empty-page?target=credit" 
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	CreditCard(){
		my.navigateTo({ url: "/pages/index/credit_card/credit_card"});
	},
	 onLoad() {
		let information = app.globalData.information
		this.setData({
			cardNo: information.cardNo,
			mobile: information.mobile,
		})
	// 	const { data: userName } = my.getStorageSync({ "key": "idName" });
	// 	const { data: certNo } = my.getStorageSync({ "key": "idNumber" });
	// 	this.setData({ userName, certNo });
       },
	onShow() {
		const { data: username } = my.getStorageSync({ key: "idName" });//姓名
		const { data: idNumber } = my.getStorageSync({ key: "idNumber" });//身份证号
		this.setData({ userName: username })
		this.setData({ certNo: idNumber })
		const channel = my.getStorageSync({ "key": "source" }) || "";
		if(channel.data == "67"){
			this.setData({CreditCardIcbc:true})
		}else{
			this.setData({AshPlacing:true})
		}
	}
});