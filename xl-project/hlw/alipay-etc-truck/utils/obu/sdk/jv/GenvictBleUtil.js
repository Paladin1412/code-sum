﻿var a = require('./GenvictDataUtil.js');
var b = [];
var c = '';
var d = '';
var e = '';
var f = '';
var g = [];
var h = 0;
var i = 3;
var j;
var k = false;
var l = [];
var m = [];
var n = 0;
var o = 0;
var p = 0;
var q = "";
var r = 0;
var s;
var t = new Array();
var u = 0;
var v;
var w = false;
const ARTC_SERVICE_UUID = '0000FEE7-0000-1000-8000-00805F9B34FB';
const ARTC_WRTIE_UUID = '0000FEC7-0000-1000-8000-00805F9B34FB';
const ARTC_READ_UUID = '0000FEC8-0000-1000-8000-00805F9B34FB';
const SHORT_ARTC_SERVICE_UUID = 'FEE7';
const SHORT_ARTC_WRTIE_UUID = 'FEC7';
const SHORT_ARTC_READ_UUID = 'FEC8';
const SUCCESS_CODE = '0';
const FAILED_CODE = '1';
const PLOY_SERVICE_FAILE = '2';
const PLOY_NO_AIM_SERVICE = '3';
const PLOY_CHARACTERISTIC_FAILE = '4';
const PLOY_NO_CHARACTERISTIC = '5';
const PLOY_NOTIY_FAILE = '6';
const COS_SUCCESS_CODE = '9000';

function openBle(z) {
	my.openBluetoothAdapter({
		success(res) {
			typeof z === 'function' && z(SUCCESS_CODE)
		}, fail() {
			typeof z === 'function' && z(FAILED_CODE)
		}
	})
};

function closeBle(z) {
	my.closeBluetoothAdapter({
		success(res) {
			typeof z === 'function' && z(SUCCESS_CODE)
		}, fail() {
			typeof z === 'function' && z(FAILED_CODE)
		}
	})
};

function scanBle(z) {
	b = [];
	my.startBluetoothDevicesDiscovery({
		success(res) {
			my.onBluetoothDeviceFound((res) => {
				for (let i = 0; i < res.devices.length; i++) {
					let isHave = false;
					for (let j = 0; j < b.length; j++) {
						if (res.devices[i].deviceId === b[j].deviceId) {
							isHave = true;
							break
						}
					};
					if (!isHave) {
						console.log(res.devices[i].name);
						if (res.devices[i].name.indexOf("GV__GD_FK") == 0 || res.devices[i].name.indexOf("GV_HCB_Q1") == 0 || res.devices[i].name.indexOf("GV__BT_WX") == 0 || res.devices[i].name.indexOf("GENVICT") == 0 || res.devices[i].name.indexOf("GXETC_GV") == 0 || res.devices[i].name.indexOf("GV_BT_WX") == 0 || res.devices[i].name.indexOf("JY") == 0 || res.devices[i].name.indexOf("SD_BT_WX") == 0 || res.devices[i].name.indexOf("GS") == 0 || res.devices[i].name.indexOf("GV") == 0 || res.devices[i].name.indexOf("ETC") == 0) {
							b.push(res.devices[i]);
							z(res.devices[i])
						}
					}
				}
			})
		}, fail() {
			typeof z === 'function' && z(FAILED_CODE)
		}
	})
};

function connectBle(z, A) {
	my.stopBluetoothDevicesDiscovery({
		success(res) {
			console.log('停止搜索')
		}
	});
	c = z.deviceId;
	my.connectBLEDevice({
		deviceId: c,
		success(res) {
			typeof A === 'function' && A(SUCCESS_CODE)
		},
		fail() {
			typeof A === 'function' && A(FAILED_CODE)
		}
	})
};

function deployBle(z) {
	var A = this;
	e = '';
	f = '';
	console.info('c：',c);
	my.getBLEDeviceServices({
		deviceId: c,
		success(res) {
			console.log(res);
			for (let i = 0; i < res.services.length; i++) {
				let serviceuuid = res.services[i].uuid || res.services[i].serviceId;
				console.log('serviceuuid:',serviceuuid);
				if (serviceuuid.toUpperCase() === ARTC_SERVICE_UUID || serviceuuid.toUpperCase() === SHORT_ARTC_SERVICE_UUID) {
					d = serviceuuid;
					my.getBLEDeviceCharacteristics({
						deviceId: c,
						serviceId: d,
						success(res) {
							for (let i = 0; i < res.characteristics.length; i++) {
								let chauuid = res.characteristics[i].uuid || res.characteristics[i].characteristicId;
								if (chauuid.toUpperCase() === ARTC_READ_UUID || chauuid.toUpperCase() === SHORT_ARTC_READ_UUID) {
									f = chauuid
								} else if (chauuid.toUpperCase() === ARTC_WRTIE_UUID || chauuid.toUpperCase() === SHORT_ARTC_WRTIE_UUID) {
									e = chauuid
								}
							};
							if (e.length === 0 || f.length === 0) {
								typeof z === 'function' && z(PLOY_NO_CHARACTERISTIC)
							} else {
								A.openReceiveData((code) => {
									if (code === '0') {
										if (a.protocolType() == "normal") {
											typeof z === 'function' && z(SUCCESS_CODE)
										} else {
											v = z
										}
									} else {
										typeof z === 'function' && z(PLOY_NOTIY_FAILE)
									}
								})
							}
						},
						fail() {
							typeof z === 'function' && z(PLOY_CHARACTERISTIC_FAILE)
						}
					});
					return
				}
			};
			typeof z === 'function' && z(PLOY_NO_AIM_SERVICE)
		},
		fail() {
			typeof z === 'function' && z(PLOY_SERVICE_FAILE)
		}
	})
};

function disconnectBle(z) {
	my.disconnectBLEDevice({
		deviceId: c,
		success(res) {
			deployBle();
			typeof z === 'function' && z(SUCCESS_CODE)
		},
		fail() {
			typeof z === 'function' && z(FAILED_CODE)
		}
	})
};

function openReceiveData(z) {
	my.notifyBLECharacteristicValueChange({
		deviceId: c,
		serviceId: d,
		characteristicId: f,
		state: true,
		success(res) {
			typeof z === 'function' && z(SUCCESS_CODE)
		},
		fail() {
			typeof z === 'function' && z(FAILED_CODE)
		}
	});
	my.onBLECharacteristicValueChange((characteristic) => {
		let hex = characteristic.value;
		// let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
		console.log('接收数据：' + hex);
		if (a.protocolType() == "normal") {
			normalDataResponse(hex)
		} else {
			if (q.length == 0) {
				r = parseInt(hex.substring(4, 8), 16) * 2
			};
			q = q + hex;
			if (q.length == r) {
				let cmdId = q.substring(8, 12);
				if (cmdId == "2711") {
					authResponse()
				} else if (cmdId == "2713") {
					initResponse()
				} else if (cmdId == "2712") {
					let frame = q.substring(16);
					wechatDataResponse(frame)
				}
			} else if (q.length > r) {
				q = "";
				r = 0
			}
		}
	})
};

function initResponse() {
	let bufferArray = a.makeInitResponse();
	let hasErr = false;
	w = true;
	sendData(bufferArray, function (z, A) {
		if (z != 0) {
			hasErr = true
		}
	})
};

function authResponse() {
	let bufferArray = a.makeAuthResponse();
	sendData(bufferArray, function (z, A) {
		if (z != 0) {
			typeof s == 'function' && s(FAILED_CODE)
		}
	})
};

function wechatDataResponse(z) {
	q = "";
	r = 0;
	z = z.substring(8, 8 + parseInt(z.substring(6, 8), 16) * 2);
	if (t.length == 0) {
		if (a.protocolType() == "xinguobiao") {
			let ctl = parseInt(z.substring(2, 6), 16);
			u = ctl - 0x8000
		} else if (a.protocolType() == "genvict") {
			let ctl = parseInt(z.substring(4, 6), 16);
			u = ctl - 0x80 + 1
		}
	};
	t.push(z);
	if (u == t.length) {
		let completeValue = "";
		for (let i = 0; i < t.length; i++) {
			let temp = "" + t[i];
			completeValue += temp.substring(8, temp.length - 2)
		};
		t = new Array();
		u = 0;
		if (parseInt(completeValue.substring(0, 2), 16) != 0x96) {
			typeof j == 'function' && j(SUCCESS_CODE, completeValue)
		}
	}
};

function normalDataResponse(z) {
	q = "";
	r = 0;
	if (t.length == 0) {
		let ctl = parseInt(z.substring(6, 8));
		u = ctl + 1
	};
	t.push(z);
	if (u == t.length) {
		let completeValue = "";
		for (let i = 0; i < t.length; i++) {
			let temp = "" + t[i];
			completeValue += temp.substring(10, temp.length - 2)
		};
		t = new Array();
		u = 0;
		if (parseInt(completeValue.substring(0, 2), 16) != 0x96) {
			typeof j == 'function' && j(SUCCESS_CODE, completeValue)
		}
	}
};

function sendData(z, A) {
	var B = this;
	q = '';
	g = z;
	h = 0;
	j = A;
	m = [];
	l = [];
	t = new Array();
	startSendData()
};

function startSendData() {
	var z = this;
	let buffer = g[h];
	let hex = Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
	console.log('发送数据：' + hex);
	my.writeBLECharacteristicValue({
		deviceId: c,
		serviceId: d,
		characteristicId: e,
		value: hex,
		success(res) {
			i = 3;
			h++;
			if (h < g.length) {
				startSendData()
			} else {
				if (w) {
					typeof v == 'function' && v(SUCCESS_CODE);
					w = false
				}
			}
		},
		fail() {
			console.log('发送失败了：')
		}
	})
};

function initDevice(z) {
	var A = this;
	console.log('接收数据：xxxx');
	A.sendData(a.initDeviceSendData(), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			if (a.protocolType() == "normal") {
				console.log('接收数据：' + res);
				reapdu = res
			};
			typeof z === 'function' && z(code, reapdu)
		} else {
			typeof z === 'function' && z(FAILED_CODE, res)
		}
	})
};

function deviceChannel(z, A) {
	var B = this;
	B.sendData(a.makeDeviceChannelSendData(z), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof A === 'function' && A(code, res)
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function authenChannel(z, A, B) {
	var C = this;
	C.sendData(a.makeAuthenChannelSendData(z, A), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof B === 'function' && B(code, res)
		} else {
			typeof B === 'function' && B(FAILED_CODE, res)
		}
	})
};

function selfDeviceChannel(z, A) {
	var B = this;
	B.sendData(a.makeSelfDeviceChannelSendData(z), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof A === 'function' && A(code, res)
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function deviceAuthenChannel(z, A, B) {
	var C = this;
	C.sendData(a.makeDeviceAuthenSendData(z, A), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof B === 'function' && B(code, res)
		} else {
			typeof B === 'function' && B(FAILED_CODE, res)
		}
	})
};

function cosChannel(z, A, B) {
	var C = this;
	C.sendData(a.makecosSendData(z, A), (code, res) => {
		let stateCode = res.substring(2, 4);
		if (code === '0' && stateCode === '00') {
			let reapdu = res.substring(10, res.length);
			if (a.protocolType() == "genvict") {
				var D = tlvUnpackData(reapdu);
				for (let i = 0; i < D.length; i++) {
					let cosCode = D[i].substring(D[i].length - 4, D[i].length);
					if (cosCode != COS_SUCCESS_CODE) {
						code = FAILED_CODE
					}
				};
				typeof B === 'function' && B(code, D)
			} else {
				typeof B === 'function' && B(code, res)
			}
		} else {
			typeof B === 'function' && B(FAILED_CODE, res)
		}
	})
};

function tlvUnpackData(z) {
	let tlvMode = parseInt(z.substring(2, 4), 16);
	let cosStr;
	let tlvLen;
	var A = new Array();
	if (tlvMode <= 0x80) {
		tlvLen = parseInt(z.substring(2, 4), 16) * 2;
		cosStr = z.substring(4, z.length)
	} else if (tlvMode == 0x81) {
		tlvLen = parseInt(z.substring(4, 6), 16) * 2;
		cosStr = z.substring(6, z.length)
	} else {
		tlvLen = parseInt(z.substring(4, 8), 16) * 2;
		cosStr = z.substring(8, z.length)
	};
	let i = 0;
	let index = 0;
	let dataLen = 0;
	while (tlvLen > 0) {
		dataLen = parseInt(cosStr.substring(2 + index, 4 + index), 16) * 2;
		A[i] = cosStr.substring(4 + index, dataLen + 4 + index);
		index = index + 4 + dataLen;
		i++;
		tlvLen = tlvLen - 4 - dataLen
	};
	return A
};

function gvEsamChannel(z, A, B) {
	var C = this;
	C.sendData(a.makeGVEsamSendData(z, A), (code, res) => {
		let stateCode = res.substring(2, 4);
		if (code === '0' && stateCode === '00') {
			let reapdu = res.substring(10, res.length);
			if (a.protocolType() == "genvict") {
				var D = tlvUnpackData(reapdu);
				for (let i = 0; i < D.length; i++) {
					let cosCode = D[i].substring(D[i].length - 4, D[i].length);
					if (cosCode != COS_SUCCESS_CODE) {
						code = FAILED_CODE
					}
				};
				typeof B === 'function' && B(code, D)
			} else {
				typeof B === 'function' && B(code, res)
			}
		} else {
			typeof B === 'function' && B(FAILED_CODE, res)
		}
	})
};

function transGVEsamCommand(z, A) {
	var B = this;
	B.sendData(a.makeGVtransEsamSendData('20', z), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof A === 'function' && A(code, res)
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function transCommand(z, A, B) {
	var C = this;
	C.sendData(a.maketransSendData(z, A), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof B === 'function' && B(code, res)
		} else {
			typeof B === 'function' && B(FAILED_CODE, res)
		}
	})
};

function obuChannel(z, A) {
	var B = this;
	B.sendData(a.makeObuChannel(z), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof A === 'function' && A(code, res)
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function authenC0(z, A) {
	let send = "C0" + z;
	var B = this;
	B.sendData(a.makeAuthenSendData(send), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof A === 'function' && A(code, res)
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function authenC1(z, A, B, C, D, E, F) {
	let send = "C1" + z + A + B + C + D + E;
	var G = this;
	G.sendData(a.makeAuthenSendData(send), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof F === 'function' && F(code, res)
		} else {
			typeof F === 'function' && F(FAILED_CODE, res)
		}
	})
};

function readCard(z) {
	var A = '0';
	let reapdu = '12'
};

function resetCard(z) {
	var A = this;
	A.sendData(a.makeResetCard(), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(18, res.length - 4);
			typeof z === 'function' && z(code, res)
		} else {
			typeof z === 'function' && z(FAILED_CODE, res)
		}
	})
};

function getICCInfo(z) {
	var A = this;
	var B = new Array();
	B[0] = "00A40000021001";
	B[1] = "00B095002B";
	B[2] = "805C000204";
	var C = "00";
	if (a.protocolType() == "xinguobiao") {
		C = "10"
	};
	A.cosChannel(C, B, function (D, E) {
		if (D == 0 && E[1].length >= 90) {
			var F = new Object();
			F.file0015 = E[1];
			F.provider = E[1].substring(0, 16);
			F.cardType = E[1].substring(16, 18);
			F.cardVersion = E[1].substring(18, 20);
			F.cardId = E[1].substring(20, 40);
			F.signedDate = E[1].substring(40, 48);
			F.expiredDate = E[1].substring(48, 56);
			F.vehicleNumber = E[1].substring(56, 80);
			F.userType = E[1].substring(80, 82);
			if (F.cardVersion == 0x40) {
				F.plateColor = E[1].substring(86, 88);
				F.vehicleModel = E[1].substring(88, 90)
			} else {
				F.plateColor = E[1].substring(88, 90);
				F.vehicleModel = '00'
			};
			F.balance = parseInt(E[2].substring(0, 8), 16);
			typeof z === 'function' && z(D, F)
		} else {
			typeof z === 'function' && z(FAILED_CODE, E)
		}
	})
};

function pinCode(z, A, B, C, D, E) {
	var F = this;
	var G = new Array();
	G[0] = "00A40000021001";
	G[1] = "00200000" + a.numberToHexString(z.length / 2, 1, true) + z;
	G[2] = "805000" + A + "0B" + B + a.numberToHexString(C, 4, true) + D + "10";
	console.log("回复数据：" + G);
	var H = "00";
	if (a.protocolType() == "xinguobiao") {
		H = "10"
	};
	F.cosChannel(H, G, function (I, J) {
		if (I == 0) {
			var K = new Object();
			K.balance = J[2].substring(0, 8);
			K.counter = J[2].substring(8, 12);
			K.random = J[2].substring(16, 24);
			K.mac1 = J[2].substring(24, 32);
			typeof E === 'function' && E(I, K)
		} else {
			typeof E === 'function' && E(FAILED_CODE, J)
		}
	})
};

function loadCreditWrite(z, A, B) {
	var C = this;
	var D = new Array();
	D[0] = "805200000B" + z + A;
	var E = "00";
	if (a.protocolType() == "xinguobiao") {
		E = "10"
	};
	C.cosChannel(E, D, function (F, G) {
		if (F == 0 && G.length == 1) {
			typeof B === 'function' && B(F, G)
		} else {
			typeof B === 'function' && B(FAILED_CODE, G)
		}
	})
};

function transA1reqData(z, A) {
	var B = this;
	B.sendData(a.makeTransA1reqData(z), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(10, res.length - 4);
			let credit_length = 0;
			if (reapdu.length > 14) {
				credit_length = parseInt(res.substring(12, 14), 16) * 2
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			};
			let sign_length = 0;
			if (reapdu.length > 4 + credit_length) {
				sign_length = parseInt(res.substring(16 + credit_length, 16 + credit_length + 2), 16) * 2
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			}; if (res.length > 16 + credit_length + sign_length) {
				var C = new Object();
				C.original = res.substring(14, 14 + credit_length);
				C.sign = res.substring(18 + credit_length, 18 + credit_length + sign_length);
				typeof A === 'function' && A(code, C)
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			}
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function loadCreditT0reqData(z, A) {
	var B = this;
	B.sendData(a.makeLoadCreditT0reqData(z), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(10, res.length - 4);
			let credit_length = 0;
			if (reapdu.length > 14) {
				credit_length = parseInt(res.substring(12, 14), 16) * 2
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			};
			let sign_length = 0;
			if (reapdu.length > 4 + credit_length) {
				sign_length = parseInt(res.substring(16 + credit_length, 16 + credit_length + 2), 16) * 2
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			}; if (res.length > 16 + credit_length + sign_length) {
				var C = new Object();
				C.original = res.substring(14, 14 + credit_length);
				C.sign = res.substring(18 + credit_length, 18 + credit_length + sign_length);
				typeof A === 'function' && A(code, C)
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			}
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function esamMiWen(z, A) {
	var B = this;
	B.sendData(a.makeEsamMiWen(z), (code, res) => {
		if (code === '0') {
			let stateCode = res.substring(res.length - 4);
			let reapdu = res.substring(10, res.length - 4);
			let credit_length = 0;
			if (res.length > 14) {
				credit_length = parseInt(res.substring(12, 14), 16) * 2
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			}; if (res.length > 12 + credit_length) {
				var C = new Object();
				C.original = res.substring(14, 14 + credit_length);
				typeof A === 'function' && A(code, C)
			} else {
				typeof A === 'function' && A(code, "返回不正常包。")
			}
		} else {
			typeof A === 'function' && A(FAILED_CODE, res)
		}
	})
};

function initiateOBU(z) {
	var A = this;
	console.log("initiateOBU");
	var B = new Array();
	B[0] = "00A40000023F00";
	B[1] = "00B0810063";
	A.gvEsamChannel('20', B, function (C, D) {
		if (C === '0') {
			console.log("回复数据：" + D);
			let initiateState = D[1].substring(52, 52 + 2);
			console.log("initiateState：" + initiateState);
			if (initiateState === '02') {
				var E = new Array();
				E[0] = "0059000001";
				A.gvEsamChannel('20', E, function (F, G) {
					typeof z === 'function' && z(F, G)
				});
				console.log("状态1")
			} else if (initiateState === '01') {
				typeof z === 'function' && z(FAILED_CODE, "OBU已激活。");
				console.log("状态2")
			} else if (initiateState === '00') {
				typeof z === 'function' && z(FAILED_CODE, "OBU已失效。");
				console.log("状态3")
			}
		}
	})
};
module.exports = {
	sendData: sendData,
	openBle: openBle,
	closeBle: closeBle,
	scanBle: scanBle,
	connectBle: connectBle,
	deployBle: deployBle,
	disconnectBle: disconnectBle,
	initDevice: initDevice,
	deviceChannel: deviceChannel,
	selfDeviceChannel: selfDeviceChannel,
	cosChannel: cosChannel,
	authenC0: authenC0,
	authenC1: authenC1,
	openReceiveData: openReceiveData,
	deviceAuthenChannel: deviceAuthenChannel,
	gvEsamChannel: gvEsamChannel,
	transGVEsamCommand: transGVEsamCommand,
	transCommand: transCommand,
	resetCard: resetCard,
	getICCInfo: getICCInfo,
	pinCode: pinCode,
	loadCreditWrite: loadCreditWrite,
	authenChannel: authenChannel,
	transA1reqData: transA1reqData,
	loadCreditT0reqData: loadCreditT0reqData,
	esamMiWen: esamMiWen,
	obuChannel: obuChannel,
	initiateOBU: initiateOBU
};
