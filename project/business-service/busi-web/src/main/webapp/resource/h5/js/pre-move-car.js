/**
 * @author tinglong
 * @time 2018-01-12
 * @description 待挪车
 */
'use strict';
var serverTime = parseInt($('.server-time').val()), // 获取服务器系统时间（时间戳）  时间单位为分钟
    interval = parseInt($('.press-time').val()),  // 获取时间间隔  时间单位为分钟
    maxtime = interval * 60,  // el获取时段  
    angle = 2*Math.PI/maxtime, // 圆的每一刻度所占角度份额
    realtime = 0,  // 实时时间 一圈的实时时间 最大为一圈时间
    totaltime = 0,  // 经历的所有时间
    percent = 0,  // 实时比例
    totalAngle,  // 圆的实时角度
    subValue = 0,  // 小圆点的实时角度
    colorstyle = '#7697fc', // 圆环颜色
    msg = "00:00", 
    timer,
    timerStep,
    stepNum = 0,
    bgIndex = 1,
    REM = $(window).width() / 16, //echarts 适用移动端的 rem 计算
    ID = fly.getQueryString('id'), // 挪车ID
    /*carType = fly.getQueryString('carType'),*/ // 车身颜色字典值 02 蓝色； 01 黄色； 52 绿色；99其它
    stepArrayName = '',
    stepArrayTime = '',
    applyTime, // 申请时间
    firInFlag = true,  // 判断是否是第一次进入页面
    pressedOrNot = 0,  //判断是否被催过 0：否，1：是
    docCan, 
    platForm = util.checkMobilePlatform(),
    vm = window.vm = fly.observable({
        // 返回按钮
        back: function() {
            window.history.back(-1);
        },
        // 挪车完成点击事件
        reSuccessEvent: function(e) {
            var $this = $(e.currentTarget),
                flag = $this.data().flag;  // 点击按钮只能给后台发一次请求标志位
            if(flag == '0') {
                return;
            }
            util.ajaxRequest(CONTEXTPATH + '/apply/finish', {
                    id: ID
                }, function(res) {
                    if(res.flag) {
                        window.location.href = CONTEXTPATH + '/h5/remove-car-evaluate?id=' + ID;  // 跳转到评价页面
                    }else {
                        util.toastHtml(res.message,'','','');
                    }
                }, function(res) {
                    if(platForm) {
                        util.toast('请求数据失败！');
                    }else {
                        util.toastHtml('请求数据失败！','','','');
                    }
            });
            $this.data('flag', '0');
        },
        // 催一催按钮点击事件
        urgeEvent: function(e) {
            var $this = $(e.currentTarget),
                flag = $this.data().flag;
            if(flag != 1) {
                return;
            }
            stepNum = 0;
            pressedOrNot = 1;
            eventhandle.bgChange();
            requestEvent.getMerageData();  
        }
    }),
    eventhandle = {
        /* 时间计时*/
        countUp: function (){ 
            var minutes,
                seconds,
                minute,
                second;
            if(totaltime >= 0){    
                minutes = Math.floor(totaltime/60);    
                seconds = Math.floor(totaltime%60);    
                minute = (minutes < 10)? '0' + minutes : minutes;
                second = (seconds < 10)? '0' + seconds : seconds;
                msg = minute+":"+second; 
                totaltime++; 
            }
            $('.time-text').text(msg);
        },
        // 定时刷新饼图
        setIntervalEvent: function() {
            clearInterval(timer);
            timer = setInterval(function() {
                if(bgIndex < 3) {
                    eventhandle.topCircle();
                } else {
                    eventhandle.realtimeAngle();
                }
            }, 1000);   
        },
        // 定时请求流程数据
        setInterStepEvent:function() {
            clearInterval(timerStep);
            timerStep = setInterval(function() {
                    stepNum++;
                    requestEvent.getMessageStep();
            }, 20000);
        },
        // 背景图改变
        bgChange: function() {
            if(bgIndex == 0 || bgIndex == 1 || (bgIndex == 2 && pressedOrNot != 1)) {  // 是否被催过 0:否，1：是
                /*头部背景图改变*/
                $('.top-banner').addClass('bg-fir-state');
                $('.top-banner').removeClass('bg-sec-state');
                $('.top-banner').removeClass('bg-third-state');
                colorstyle = '#7697fc';

                $('.explain-text').text('正在通知...');
                $('.canvas-wrap').removeClass('hide');
                $('.prompt-message').addClass('hide');
                $('.notice-text').text(interval+ '分钟后可催一催');

                if(bgIndex == 2) {
                    /*催一催按钮状态改变*/
                    $('.btn-left').removeClass('btn-nouse');
                    $('.btn-left').addClass('btn-use');
                    $('.btn-left').data('flag', '1');
                    $('.btn-left').text('催一催');
                }
            }else if(bgIndex == 2 && (pressedOrNot == 1)) {
                    /*头部背景图改变*/
                    $('.top-banner').removeClass('bg-fir-state');
                    $('.top-banner').addClass('bg-sec-state');
                    $('.top-banner').removeClass('bg-third-state');
                    colorstyle = '#b56ff3';

                    /*催一催按钮状态改变*/
                    $('.btn-left').removeClass('btn-use');
                    $('.btn-left').addClass('btn-nouse');
                    $('.btn-left').data('flag', '0');
                    $('.btn-left').text('已催办');

                    $('.explain-text').text('再次通知...');
                    $('.canvas-wrap').removeClass('hide');
                    $('.prompt-message').addClass('hide');
                    $('.notice-text').text('催办已发起，请耐心等待....');

            }else if(bgIndex >= 3) {
                $('.top-banner').removeClass('bg-fir-state');
                $('.top-banner').removeClass('bg-sec-state');
                $('.top-banner').addClass('bg-third-state')
                $('.canvas-wrap').addClass('hide');
                $('.prompt-message').removeClass('hide');
                if(totaltime <= 3600) {
                    if(pressedOrNot != 1) {  // 判断是否点击过催一催
                        $('.btn-left').removeClass('btn-nouse');
                        $('.btn-left').addClass('btn-use');
                        $('.btn-left').data('flag', '1');
                        $('.btn-left').text('催一催');
                    }else if(pressedOrNot == 1){
                        $('.btn-left').removeClass('btn-use');
                        $('.btn-left').addClass('btn-nouse');
                        $('.btn-left').data('flag', '0');
                        $('.btn-left').text('已催办');
                    }
                }else {  // 当超过一小时，用户未处理则按钮不可用
                    $('.btn-left').removeClass('btn-use');
                    $('.btn-left').addClass('btn-nouse');
                    $('.btn-left').data('flag', '0');
                    $('.btn-left').text('催一催');
                    clearInterval(timer);  // 清除定时
                }
            }
            eventhandle.setIntervalEvent();
        },
        // canvas 定时器底部圆
        bottomCircle: function(ctx) {
            ctx.beginPath();
            ctx.strokeStyle = colorstyle;
            ctx.lineWidth = .32*REM;
            ctx.lineCap = "round";
            ctx.arc(3.33*REM, 3.33*REM, 2.80*REM, -0.5 * Math.PI, 1.5 * Math.PI, false);
            ctx.stroke();
        },
        // 创建canvas对象
        createCanWrap: function() {
            docCan = document.createElement("canvas");
            document.getElementById("canvasWrapper").appendChild(docCan);
            docCan.width = 6.66 * REM;
            docCan.height = 6.66 * REM;
        },
        // 上面一层圆
        topCircle: function() {
            var ctx = docCan.getContext('2d');
            ctx.clearRect(0, 0, 6.66 * REM + 1, 6.66 * REM + 1);
            eventhandle.bottomCircle(ctx);  // 下面一层圆
            eventhandle.realtimeAngle();  // 实时计算时间和圆环角度
            subValue = totalAngle - (Math.PI / 2);  // 使小圆点开始位置从圆12点钟位置开始
            // 小圆点
            var x = 3.34 * REM + Math.cos(subValue) * 2.80 * REM, // 小圆点的x轴位置
                y = 3.34 * REM + Math.sin(subValue) * 2.80 * REM; // 小圆点的y轴位置

            /*圆点光晕效果 start*/
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.arc(x, y, .24 * REM, -0.5 * Math.PI, Math.PI * 1.5, false);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, .4)";
            ctx.arc(x, y, .30 * REM, -0.5 * Math.PI, Math.PI * 1.5, false);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, .2)";
            ctx.arc(x, y, .36 * REM, -0.5 * Math.PI, Math.PI * 1.5, false);
            ctx.fill();
            /*圆点光晕效果 end*/

            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255,1)";
            ctx.lineWidth = .32 * REM;
            ctx.lineCap = "round";
            ctx.arc(3.33 * REM, 3.33 * REM, 2.80 * REM, -0.5 * Math.PI, ((-0.5 + 2 * percent) * Math.PI), false);
            ctx.stroke();
        },
        // 实时计算时间和圆环角度
        realtimeAngle: function() {
            eventhandle.countUp();
            if(realtime == maxtime) {
                realtime = 0;
                totalAngle = 0;
                // 判断当前背景图 一个周期变一次 共3个背景图、默认为第一个背景图
                bgIndex++;
                eventhandle.bgChange();
            }else {
                realtime ++;
                percent = realtime/maxtime;
                totalAngle += angle;
            }
        },
        // 判断是app平台还是其他平台 APP平台加特定的样式
        judgePlateForm: function() {
            if (platForm) {
               var style1 = document.createElement('style');
                style1.innerHTML = '.header-wrap {top: 0.9rem !important;}';
                document.head.appendChild(style1);
            }
        },
        // 车牌颜色值判断
        judgeCarType: function(carType) { // 车身颜色字典值 02 蓝色； 01 黄色； 52 绿色；99其它
            $('.car-no').removeClass('hide');
            switch(carType) {
                case '01':
                    $('.car-no').addClass('car-ye');
                    break;
                case '02':
                    $('.car-no').addClass('car-blue');
                    break;
                case '52':
                    $('.car-no').addClass('car-green');
                    break;
                case '99':
                    $('.car-no').addClass('car-other');
                    break;
            }
        }
    },
    requestEvent  = {
        /*查询流程数据获取 */  
        getMessageStep: function() {
            if(firInFlag) {
                if(platForm) {
                    util.mask(true);
                }else {
                    util.maskHtml(true, '');
                }
                firInFlag = false;
            }
            util.ajaxRequest(CONTEXTPATH + '/task/list',{
                id: ID
            },function(res) {
                if(platForm) {
                    util.mask(false);
                }else {
                    util.maskHtml(false, '');
                }
                if(res.flag) {
                    if(res && res.data) {
                        var data = res.data;
                        renderEvent.renderMessageStep(data);    
                    }
                }else {
                    util.toastHtml(res.message,'','','');
                }

                if(stepNum < 6) {  // 访问数据列表7次
                    eventhandle.setInterStepEvent();
                }else if(stepNum >= 6){
                    clearInterval(timerStep);  // 清除定时
                }
            }, function(res) {
                if(platForm) {
                    util.mask(false);
                    util.toast('请求数据失败！')
                }else {
                    util.maskHtml(false, '');
                    util.toastHtml('请求数据失败！','','','');
                }

            });
        },
        /*获取车牌号*/
        getCarNo: function() {
            if(platForm) {
                util.mask(true);
            }else {
                util.maskHtml(true, '');
            }
            util.ajaxRequest(CONTEXTPATH + '/apply/get', {
                        id: ID
                }, function(res) {
                    if(platForm) {
                        util.mask(false);
                    }else {
                        util.maskHtml(false, '');
                    }

                    if(res.flag) {
                        if(res.data) {
                            var data = res.data;
                                stepArrayName = '提交挪车申请',
                                stepArrayTime = data.applyTime;  // 申请时间
                                pressedOrNot = data.pressedOrNot;  // 是否被催过标志 0：否 1：是
                            var carNum = data.carPlateNum,  // 车牌号
                                carType = data.carPlateType;  // 车牌类型
                            eventhandle.judgeCarType(carType); // 车身颜色字典值 02 蓝色； 01 黄色； 52 绿色；99其它
                        
                            $('.car-no .sheng').text(carNum.substring(0,2));  // 渲染车牌号
                            if(carType == '52') {
                                $('.point').addClass('pont-pic');
                                $('.pont-pic').css('top', '-.2rem');
                            }else if(carType == '01' || carType == '02' || carType == '99'){
                                $('.car-no .point').addClass('point-text');
                                $('.car-no .point').text('.');  // 渲染车牌号
                            }
                           
                            $('.car-no .number').text(carNum.substring(2, carNum.length));

                            //发起申请并申请成功时开始计时
                            var nowTime = Date.parse(new Date()),  // 获取当前时间戳  ms
                                subTime = nowTime - stepArrayTime;
                                serverTime = nowTime - serverTime;
                                subTime = subTime - serverTime;
                                totaltime = subTime/1000;  // s
                            bgIndex = Math.ceil(totaltime/maxtime); // 计算转的圈数 
                            totaltime = Math.floor(totaltime); 
                            if(bgIndex == 0) {
                                bgIndex = 1;
                            }
                            if(totaltime > maxtime) {
                                realtime = totaltime - (maxtime*bgIndex);
                            }else if(totaltime <= maxtime) {
                                realtime = totaltime;
                            }
                            totalAngle = realtime*angle;
                            eventhandle.bgChange();
                            // 请求数据
                            requestEvent.getMessageStep();
                        }
                    }else {
                        util.toastHtml(res.message,'','','');
                    }

                },function(res) {
                    if(platForm) {
                        util.mask(false);
                        util.toast('请求数据失败！')
                    }else {
                        util.maskHtml(false, '');
                        util.toastHtml('请求数据失败！','','','');
                    }
            });
        },

        // 获取是否被催过标志位
        getPressedOrNot: function() {
            util.ajaxRequest(CONTEXTPATH + '/apply/get', {
                    id: ID
                }, function(res) {
                    if(res.flag) {
                        if(res.data) {
                            var data = res.data;
                                pressedOrNot = data.pressedOrNot;  // 是否被催过标志 0：否 1：是
                        }
                    }else {
                        util.toastHtml(res.message,'','','');
                    }
                }, function(res) {
                    if(platForm) {
                        util.mask(false);
                        util.toast('请求数据失败！')
                    }else {
                        util.maskHtml(false, '');
                        util.toastHtml('请求数据失败！','','','');
                    }
            });
        },

        /*获取催办是否成功标志位*/
        getMerageData: function() {
            util.ajaxRequest(CONTEXTPATH + '/apply/press', {
                    id: ID
                }, function(res) {
                    if(res.flag) {
                        requestEvent.getMessageStep();
                    }else {
                        util.toastHtml(res.message,'','','');
                    }
                }, function(res) {
                });
        }

    },
    renderEvent  = {  
        /*渲染崔一催流程*/
        renderMessageStep: function(data) {

            var stepArrayItem = {};
                stepArrayItem.eventName = stepArrayName;
                stepArrayItem.eventTime =stepArrayTime;
                data.push(stepArrayItem);

            /*流程背景改变转换*/
            var len = data && data.length;
            if(len > 1) {
                data[0].state = 1 ;
                for(var i = 1; i < len; i++) {
                   data[i].state = 2;
                }
                data[len-1].state = 3;
            }else if(len ==1) {
                data[0].state = 0 ;
            }
            
            /*时间格式转换*/
            for(var i = 0; data && i < len; i++) {
                if(data[i].eventTime) {
                    var dates = util.dateFormatMs(data[i].eventTime);
                    var date = dates.split(' ');
                    data[i].eventTime = date[0] + '&nbsp;&nbsp;&nbsp;' + date[1];
                }
            }
        
            // 模板数据渲染
            $(".step-list").empty();
            var tmpl = fly.template('messageStepTempl', data);
            $(".step-list").append(tmpl);
        } 
    };
$(function() {
    util.refreshHistory('待挪车');  // 地址重定向
    fly.bind(document.body, vm);  
    eventhandle.judgePlateForm();  // 判断平台 APP平台加特定的样式
   /* eventhandle.judgeCarType(); // 判断车牌眼色*/
    eventhandle.createCanWrap(); // 创建canvas对象
    requestEvent.getCarNo();  // 初始化数据 
});