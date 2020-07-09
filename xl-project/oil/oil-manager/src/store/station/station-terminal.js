import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
class StationTerminalStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable typeModal = 0;//0:新增 1:修改 2 :查看 3：查询
    @action setTypeModal(typeModal){
        this.typeModal = typeModal;
    }

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable stationTerminalObject ={};
    @action setStationTerminalObject(stationTerminalObject){
        this.stationTerminalObject = stationTerminalObject;
    }

    @observable isShowSubmitLoading = false;
    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;
    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable page_num = 0;
    @action setPageNum(page_num) {
        this.page_num = page_num;
    }

    @observable params = null;
    @action setParams(params){
        this.params = params;
    }

    @observable isShowSearchDialog= false;
    @action setIsShowSearchDialog(isShowSearchDialog){
        this.isShowSearchDialog = isShowSearchDialog;
    }

    @observable isShowSearchLoading = false;
    @action setIsShowSearchLoading(isShowSearchLoading) {
        this.isShowSearchLoading = isShowSearchLoading;
    }

    @observable searchPagination = {};
    @action setSearchPagination(searchPagination) {
        this.searchPagination = searchPagination;
    }

    @observable search_page_size = 5;
    @action setSearchPageSize(search_page_size) {
        this.search_page_size = search_page_size;
    }

    @observable search_page_num = 0;
    @action setSearchPageNum(search_page_num) {
        this.search_page_num = search_page_num;
    }

    @observable searchParams = null;
    @action setSearchParams(searchParams){
        this.searchParams = searchParams;
    }

    @observable searchData = null;
    @action setSearchData(searchData){
        this.searchData = searchData;
    }

    @observable operationData = null;
    @action setOperationData(operationData){
        this.operationData = operationData;
    }

    //合作伙伴列表查询
    @observable companyList = [];
    @action getCompanyQuery() {
        if (!this.isShowSearchLoading) {
            this.setIsShowSearchLoading(true);
        }
        const params = {
            page_num:0,
            page_size:0
        }
        http.post('/website/gasstation/company-query',params,response=>{
            this.setIsShowSearchLoading(false);
            response.data&&response.data.map((item,index)=>{item.key = index;});
            this.companyList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowSearchLoading(false);
        });
    }

    //油站列表查询
    @observable stationList = [];
    @action getStationQuery(params) {
        // this.params = params;
        if (!this.isShowSearchLoading) {
            this.setIsShowSearchLoading(true);
        }
        console.log(JSON.stringify(params));
        http.post('/website/gasstation/station-query',params,response=>{
            this.setIsShowSearchLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.search_page_size;
            pagination.current = this.search_page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setSearchPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.stationList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowSearchLoading(false);
        });
    }

    //终端列表查询
    @observable dataList = [];
    @action getStationTerminalQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        console.log(JSON.stringify(params));
        http.post('/website/gasstation/terminal-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = this.page_num;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.dataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //增加
    @action addStationTerminal(terminal_id,merchant_id,merchant_name,station_pk,affiliation,extend_no,defaulted) {
        this.setIsShowSubmitLoading(true);
        const params = {
            terminal_id:isEmpty(terminal_id)?null:trim(terminal_id),
            merchant_id:isEmpty(merchant_id)?null:trim(merchant_id),
            merchant_name:isEmpty(merchant_name)?null:trim(merchant_name),
            station_pk:isEmpty(station_pk)?null:trim(station_pk),
            // affiliation:isEmpty(affiliation)?null:trim(affiliation),
            extend_no:isEmpty(extend_no)?null:trim(extend_no),
            defaulted:defaulted,
        };
        console.log(params);
        http.post('/website/gasstation/terminal-add',params,response=>{
            this.setIsShowSubmitLoading(false);
            if (this.operationData){
                this.setOperationData(null);
            }
            this.setIsShowDialog(false);
            this.getStationTerminalQuery(this.params);
            message.info("添加成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //修改
    @action updateStationTerminal(id,merchant_id,merchant_name,station_pk,affiliation,extend_no,defaulted) {
        this.setIsShowSubmitLoading(true);
        const params = {
            id:isEmpty(id)?null:id,
            merchant_id:isEmpty(merchant_id)?null:trim(merchant_id),
            merchant_name:isEmpty(merchant_name)?null:trim(merchant_name),
            station_pk:isEmpty(station_pk)?null:trim(station_pk),
            // affiliation:isEmpty(affiliation)?null:trim(affiliation),
            extend_no:isEmpty(extend_no)?null:trim(extend_no),
            defaulted:defaulted,
        };
        console.log(params);
        http.post('/website/gasstation/terminal-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            if (this.operationData){
                this.setOperationData(null);
            }
            this.setIsShowDialog(false);
            this.getStationTerminalQuery(this.params);
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //删除
    @action deleteStationTerminal(id){
        this.setIsShowLoading(true);
        http.post('/website/gasstation/terminal-remove',{id:id},response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getStationTerminalQuery(this.params);
        },err=>{
            message.error(err);
        });
    }

}

export default StationTerminalStore;