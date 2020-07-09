// pages/stations/index/index.js
import {billApi, stationsApi} from '../../../../http/api';
import {getHttpPost} from '../../../../http/http';
import {formatTime, keepTwoDecimalFull} from "../../../../utils/util";
const app = getApp();
let page_num = 1;
const page_size = 15;
const tabHeight = 90;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_height:`calc(100vh - ${tabHeight}rpx)`,
    isIphoneX:app.globalData.isIphoneX,
    bill_type:2,//0-全部，1-已开票，2-未开票
    is_invoiced:true,//null-全部，true-可开票，false-已开票
    showConsume:false,
    isEmptyList:false,
    isShowOpen:false,
    bill_list:[],
    isShowLoadingMore:false,
    loadingState:'',
    isLoadingFinish:false,
    is_refresh:false,
    show_finish:false,
    load_status:0,//上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
    refresher:true,//下拉刷新状态
    status:0,//1:列表为空 2:网络连接失败
    actual_amount:'',
    etc_card_no:'',
    order_no:'',
    oil_detail:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:'正在加载...',
      mask:true
    });
    this.getBillList();
  },

  /**
   * 选择类型
   */
  showType:function(e){
    const showConsume = this.data.showConsume;
    this.setData({
      showConsume:!showConsume,
    });
  },

  /**
   * 开票类型选择
   */
  onChangeType: function (e) {
    const bill_type = e.currentTarget.dataset.item;

    let bill_data = this.data.bill_list;
    bill_data&&bill_data.map((item)=>{
      item.isSelect = false;
      return item;
    })
    if (bill_type === false){
      this.setData({
        isShowOpen:false,
        bill_list:bill_data,
      })
    }
    this.setData({
      // bill_type:bill_type,
      is_invoiced:bill_type,

      // refresher:true
    });
    this.onRefresh();
  },

  /**
   * 去开票
   */
  goOpenInvoice:function(){
    const {actual_amount,etc_card_no,order_no,order_detail} = this.data;
    const params = {
      from:1,
      invoice_total_money:actual_amount,
      etc_card_no:etc_card_no,
      order_no:order_no,
      invoice_detail:order_detail,
    }
    const details = encodeURIComponent(JSON.stringify(params));
    wx.navigateTo({
      url:"/pages/mine/invoice/create/create?details="+details
    });
  },

  /**
   * 点击列表cell
   */
  onCellClick:function(e){
    const {is_invoiced,bill_list} = this.data;
    let bill_data = bill_list;
    const details = e.currentTarget.dataset.item;
    bill_data&&bill_data.map((item,index)=>{
      if (index == e.currentTarget.dataset.index){
        item.isSelect = true;
      }else {
        item.isSelect = false;
      }
      return item;
    })
    if (is_invoiced === true){
      this.setData({
        isShowOpen:true,
        actual_amount:details.actual_amount,
        order_no:details.order_no,
        etc_card_no:details.etc_card_no,
        order_detail:details.order_detail,
        bill_list:bill_data,
      })
    }
  },

  /**
   * 账单查询
   */
  getBillList:function(){
    wx.showLoading({title:"正在加载...",mask:true});
    const {is_invoiced} = this.data;
    const params = {
      page_num:page_num,
      page_size:page_size,
      is_invoiced:is_invoiced,
    }
    getHttpPost(billApi.gasList,params,res=>{
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      const list = page_num==1?data:this.data.bill_list.concat(data);
      this.setData({
        bill_list:list,
        isEmptyList:list&&list.length?false:true,
        refresher:false,
        load_status:data.length<page_size?2:0,
        status:list&&list.length?0:1,
        load_page:2
      });
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
      let status = this.data.bill_list==null&&err.code==10?2:0;
      this.setData({
        refresher:false,
        status:status,
        load_status:err.code==10?0:this.data.load_status
      })
    });
  },

  //下拉刷新
  onRefresh:function(){
    page_num = 1;
    this.setData({refresher:true})
    this.getBillList();
  },

  //加油上拉加载更多
  onLoadMore:function(){
    page_num++;
    this.setData({load_status:1})
    this.getBillList();
  },

  //网络连接失败 重新加载
  onRetryClick:function(){
    page_num = 1;
    this.getBillList();
  },

  /**
   * 数据处理
   */
  dealResponse:function(data){
    return data&&data.map(item=>{
      const m = item.create_time.substr(5,2);
      const d = item.create_time.substr(8,2);
      const ss = item.create_time.substr(10,6);
      item.invoice_create_time_str = m+'月'+ d+'日'+ss;
      item.oil_price = keepTwoDecimalFull(item.oil_price);
      item.oil_num = keepTwoDecimalFull(item.oil_num);
      item.actual_amount = keepTwoDecimalFull(item.actual_amount);
      item.isSelect = false;
      return item;
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})