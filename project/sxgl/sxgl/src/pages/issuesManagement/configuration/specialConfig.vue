<template>
    <div id="specialConfig">
        <!-- 特别程序配置列表 -->
        <div class="list-wrap">
            <el-table :data="specialData" @selection-change="guideSelChange">
                <el-table-column class="font-max" align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column class="font-max" align="center" prop="linkName" label="环节名称">
                </el-table-column>
                <el-table-column class="font-max" align="left" prop="typeName" label="特别程序种类">
                </el-table-column>
                <el-table-column class="font-max" align="left" prop="specialName" label="特别程序名称">
                </el-table-column>
                <el-table-column class="font-max" align="center" width="120" prop="speTime" label="时限">
                      <template scope="scope">
                        <span>{{scope.row.speTime=='-1'?"无期限":scope.row.speTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column class="font-max" align="center" prop="isVerify" label="是否需要审核">
                    <template scope="scope">
                        <span>{{scope.row.isVerify=='0'? "是":scope.row.isVerify=='1'?"否":''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180" v-if="operType !== 'detail'">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="upSortEvt(specialData[scope.$index].id)" >上移</el-button>
                        <el-button type="text" size="small" @click="downSortEvt(specialData[scope.$index].id)">下移</el-button>
                        <el-button type="text" size="small" @click="editSpecialEvt(specialData[scope.$index].id)">编辑</el-button>
                        <el-button type="text" size="small" @click="delSpecialEvt(specialData[scope.$index].id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增特别程序配置列表 -->
        <el-dialog :title="specialTitle" :visible.sync="specialAddVis" @closed="clearValidate" width="800px" height="600px" :close-on-click-modal="false"> 
            <el-form :model="specialFormData" :rules="specialRules" ref="specialForm" label-width="130px" :label-position="labelPosition" size="small">  
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="环节名称" prop="linkCode">
                            <el-select v-model="specialFormData.linkCode" placeholder="请选择" :popper-append-to-body="false">
                              <el-option  v-for="item in linkCodeGroup" :key="item.value" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="特别程序种类" prop="typeCode">
                             <el-select v-model="specialFormData.typeCode" placeholder="请选择" @change="specialTypeChange" :popper-append-to-body="false">
                                <el-option v-for="item in specialType" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>  
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="特别程序名称" prop="speName">
                             <el-select v-model="specialFormData.speName" placeholder="请选择" :popper-append-to-body="false">
                              <el-option v-for="item in specialNameGroup" :key="item.value" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>  
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min is-required" label="时限" prop="speTime">
                            <!--  @change="limitInput" -->
                            <el-input class="font-min  half-width" v-model.trim="specialFormData.speTime" :disabled="specialFormData.limitChecked ? true : false " @change="changeInput"></el-input>工作日
                            <el-checkbox v-model="specialFormData.limitChecked" @change="limitFormChange">无期限</el-checkbox>
                        </el-form-item>
                    </el-col>  
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="是否需要审核" prop="isVerify">
                           <el-radio-group v-model="specialFormData.isVerify">
                                <el-radio label="0">是</el-radio>
                               <el-radio label="1">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>  
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="特别程序说明" prop="procDesc">
                           <el-input type="textarea" maxlength='200' :rows="2" v-model.trim="specialFormData.procDesc"></el-input>
                        </el-form-item>
                    </el-col>  
                </el-row>
                <!-- 按钮 -->
                <div class="footer">
                    <el-button type="primary" size="small" :disabled="isDisable" @click="saveFormData('specialForm')">确 定</el-button>
                    <el-button size="small"  @click="specialAddVis = false">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import unit from "@/api";   // 公共工具方法
// import UE from '@/components/UE/ue.vue';
export default {
    data() {
        let limitSize = (rule, value, callback) => {
            var that = this;
            if(!that.specialFormData.limitChecked) {
               if(value===""){
                   callback(new Error("请输入时限"));
               }else{
                    let rule = /^([1-9][0-9]{0,2}|0)$/
                    if (!rule.test(value)) {
                        callback(new Error("请输入0到999的整数"));
                    } else {
                        callback();
                    }
                }
            } else {
                callback();
            }
        };
        return {   
            // 特别程序列表数据
            specialData: [{
                guideTitle: '环节名称',
            }],
            value:'',
            // 新增
            linkCodeGroup:[],//环节名称字典项
            specialType: [],//特别程序种类
            specialNameGroup:[],//特别程序名称
            isDisable:false,
            // 特别程序表单数据
            specialFormData: {
                linkCode:'',
                typeCode:'',//特别程序种类
                speName:'',//特别程序名称
                speTime: "",
                limitChecked:false,
                isVerify: '1',
                procDesc: ''
            },
            // isReadonly:false,//新增弹框时限是否只读

            // 测试数据
            version: 1.1,
            code: 'px-s2e-s',
            eventId: '',  // 一件事id

            operType: '', // 操作类型
            specialAddVis: false, // 新增环节配置弹框标志位 
            deleteVis: false,  // 删除弹框显示隐藏标志位
            delPromTips: '确定要删除这条记录吗?',  // 删除提示语
            specialTitle: '',
            curId: '',  // 当前被操作事项id  存储 删除 编辑项
            delPromTips: '确定要删除这条记录吗?',  // 删除提示语
            guideSeldArr: [],  // 指南删除选中项 id
         
            // 指南验证规则
            specialRules: {
                linkCode: [
                    { required: true, message: '请选择环节名称', trigger: 'change' },
                ],
                typeCode:[
                    { required: true, message: '请选择特别程序种类', trigger: 'change' }
                ],
                speName:[
                    { required: true, message: '请选择特别程序名称', trigger: 'change'}
                ],
                isVerify:[
                    { required: true, message: '请选择是否需要选择', trigger: 'change' }
                ],
                speTime:[//时限
                    {
                        required: true,
                        validator: limitSize,
                        trigger: "blur"
                    }
                ],
                procDesc:[
                    {required: false,max:200, message: '长度最大不能超过200', trigger: 'blur'}
                ]
            },
            labelPosition: 'right',
        };
            
    },
    methods: {
        changeInput(val){
            this.specialFormData.speTime=val==''?'':val;
        },
        //新增特别程序-- 特别程序说明验证
        // checkLen(val){
        //     let that = this;
        //     let maxlength = 200;
        //     if(val.length > maxlength){
        //         val = val.substring(0,maxlength);
        //         that.specialFormData.procDesc = val;
        //     }
        // },
        /*
         * 请求特别程序数据
         * 
         */
        getSpecialData() {
            let that = this, 
                url = '/specialProc/getSpecialProcListByMatterCode',
                param = {
                    matterVersion: that.version,  // 事件版本
                    matterCode: that.code,  // 事件code
                    type:1
                };
            unit.ajaxMerPost('/znsj-web' + url, param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    that.specialData = [];
                    for(let i in data) {
                        that.$set(that.specialData, i, data[i]); 
                    }
                }else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);

        },
         /*
         * 上移
         * id: 记录id
         */ 
        upSortEvt(id) {
            let that = this,
                url = '/specialProc/upSort';
            unit.ajaxMerPost('/znsj-web' + url, {
                id: id
            },function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                // 刷新数据
                if(res.data && res.flag) {
                    that.$Message.success("操作成功");
                    // 重新渲染列表数据
                    that.getSpecialData();
                }else {
                    that.$Message.error(data.errMsg || '已经是最高层！');
                }
                
            },function(error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 下移
         * id: 记录id
         */ 
        downSortEvt(id) {
            let that = this,
                url = '/specialProc/downSort';
            unit.ajaxMerPost('/znsj-web' + url, {
                id: id
            },function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                // 刷新数据
                if(res.data&&res.flag) {
                    that.$Message.success("操作成功");
                    // 重新渲染列表数据
                    that.getSpecialData();
                }else {
                    that.$Message.error(data.errMsg || '已经是最底层！');
                }
            },function(error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },

         // 获取字典项
        getDictionarys(pinYin){
            let that = this,
                url = '/dic/getDictionarys',
                param = {
                    pinYinType: pinYin
                };
            unit.ajaxMerPost('/znsj-web' + url, param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    if(pinYin=='HJMC'){//环节名称
                        that.linkCodeGroup = data;
                    }else if(pinYin=='TBCXZL'){//特别程序种类
                        that.specialType = data;
                    }
                }else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);

        },
        /*
         * 编辑、新增特别程序
         */
        editSpecialEvt(id) {
            let that = this,
                url;
            that.curId = id;
            that.getDictionarys('HJMC');
            that.getDictionarys('TBCXZL');
            that.limitFormChange();
            if(id) {  // 根据id获取数据
                url = '/specialProc/getSpecialProcDetail';
                unit.ajaxMerPost('/znsj-web' + url, {
                    id: id
                },function(res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if(res.flag) {
                        that.getDictionarysByDictCode('TBCXZL',data.typeCode,'1');//调用特别程序
                        setTimeout(function() {
                           for(var key in data) {
                                that.specialFormData[key] = data[key];
                            }
                        },300);
                        
                    }else {
                        that.$Message.error(data.errMsg || '数据加载失败！');
                    }
                },function(error) {
                    that.$Message.error(error.errMsg || '数据加载失败！');
                }, that);
                that.specialAddVis = true;
                that.specialTitle = '编辑特别程序';
            }else {
                that.specialTitle = '新增特别程序';
                that.specialAddVis = true;
                that.clearFormData();
            }
        },
         // 获取特别程序种类字典项
            getDictionarysByDictCode(pinYin,dictCode,type){
                let that = this,
                    url = '/dic/getDictionarysByDictCode',
                    param = {
                        pinYinType: pinYin,
                        dictCode: dictCode
                    };
                unit.ajaxMerPost('/znsj-web' + url, param, function(res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if(res.flag) {
                            that.specialNameGroup = data;
                            if(type == "0"){//新增
                                that.specialFormData.speName = '';
                            }
                            // that.specialFormData.speName = '';
                    }else {
                        that.$Message.error(data.errMsg || '数据加载失败！');
                    }
                },function(error) {
                    that.$Message.error(error.errMsg || '数据加载失败！');
                }, that);

            },
        // 新增特别程序  特别程序种类联动
        specialTypeChange(){
            var that = this;
            that.getDictionarysByDictCode('TBCXZL',that.specialFormData.typeCode,"0");

        },
        // 新增特别程序 checkbox勾选
        limitFormChange(){
            var that=this;
            if(that.specialFormData.limitChecked){
                // 重置表单--时限
                let fields = this.$refs['specialForm'].fields
                for (let i = 0; i < fields.length; i++) {
                    if (fields[i].prop === "speTime") {
                        // 通过唯一的prop属性值相同来判别是哪个输入框
                        fields[i].resetField()
                        break
                    }
                }
                that.specialFormData.speTime = -1;
            }else{
                that.specialFormData.speTime = "";
            }
        },
        /*
         * 清空表单数据
         */
        clearFormData() {
            let that = this;
            // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
            if (that.$refs['specialForm'] !== undefined || this.$refs.specialForm !== undefined) {
                that.$refs['specialForm'].resetFields(); 
                that.specialFormData.linkCode = '';
                that.specialFormData.typeCode = '';
                that.specialFormData.speName = '';
                that.specialFormData.speTime = '';
                that.specialFormData.limitChecked = false;
                that.specialFormData.isVerify = '1';
                that.specialFormData.procDesc = '';
                that.specialNameGroup = [];//清空特别程序名称字典项
            }
        },
        /*
         * 保存数据
         */
        saveFormData(formName) {
            var that = this,
                url,
                param;
            that.$refs[formName].validate((valid) => {
                if(!valid) {
                    return;
                }
                let that = this;
                url = that.curId ? '/specialProc/updateSpecialProc' : '/specialProc/addSpecialProc';
                param = that.specialFormData;
                param.matterCode = that.code;//事项编码
                param.matterVersion= that.version;//事项版本
                param.id = that.curId ? that.curId : null;
                that.saveJsonType(url, param); 
            });
        },
        /*
         * 保存数据json字符串形式 编辑
         * id: 记录id
         * type (string, optional): 事件类型：1:事项 2：一件事
         */
        saveJsonType(url, param) {
            let that = this;
            that.isDisable = true;
            unit.ajaxPost('/znsj-web' + url ,param).then(function(res){
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(data.flag) {
                    that.$Message.success(data.data || '保存成功！');
                    that.specialAddVis = false;
                    // 清空表单数据
                    that.clearFormData();
                    // 刷新数据
                    that.getSpecialData();
                    that.isDisable = false;
                }else {
                    that.isDisable = false;
                    that.$Message.error(data.errMsg || '信息保存失败!');
                }
            }).catch(function(error){
                that.isDisable = false;
                that.$Message.error(error.errMsg || '数据加载失败！');
            });
        },
        /*
         * 删除  弹框触发事件
         * id: 记录id
         */
        delSpecialEvt(id) {  
            let that = this,
                idData,tips='确定要删除这条记录吗?';;
            that.curId = id;
            if(id) {
                tips='确定要删除这条记录吗?';
            }else {
                idData = that.guideSeldArr;
                if(idData.length == 0) {
                    that.$Message.warning('请选择要删除的记录！');
                    return;
                }else {
                    tips="确定删除选中的记录吗？";
                    that.curId = idData.join(',');
                }
            }
         
            that.$confirm(tips,'提示',{
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                cancelButtonClass:'fr ml10',
                type: 'warning'
            }).then(()=>{
                that.sureDelEvt();
               
            }).catch(()=>{
               
            });
        },
         /*
         * 确定删除选中记录项
         * 
         */
        sureDelEvt() {
            let that = this,
                type = that.delPropType,
                url = '/specialProc/deleteSpecialProc',  // 接口请求地址
                param = {
                    ids: that.curId
                };
            unit.ajaxMerPost('/znsj-web' + url , param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    // 刷新数据
                    that.getSpecialData();  
                }else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 指南table复选框chang事件
         */ 
        guideSelChange(val) {
            let that = this;
            that.guideSeldArr = [];
            if(val.length >  0) {
                for(let i in val) {
                    that.guideSeldArr.push(val[i].id);
                }
            }
        },
        // 清空表单校验
        clearValidate: function() {
			if (this.$refs["specialForm"]) {
				this.$refs["specialForm"].clearValidate();              
			}
		},
        /*
         * 初始化数据
         */ 
        created() {
            let that = this;       
            that.getSpecialData();   
        }
    },
    // mounted(){
    //     this.clearValidate('specialForm') // 清除整个表单的校验
    // },
    activated() {
        let that = this,
            parent;
        if(that.$parent && that.$parent.param ){
            parent = that.$parent.param;
            that.code = parent.matterCode ? parent.matterCode : '';
            that.version = parent.matterVersion ? parseFloat(parent.matterVersion) : 0;
        }
        that.created();  
    },
};
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
.el-button {
    font-size: 14px !important;
}
.el-textarea textarea{
    resize: none;
}
#specialConfig {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
    // 时限禁用
    .el-input.is-disabled .el-input__inner {
        background-color: #fff; 
        color: #606266;
        cursor: default;
    }
    .el-table {
        border-top:1px solid #ddd;
        border-left:1px solid #ddd;
        border-right:1px solid #ddd;
        font-size: 14px !important;
        color: #515a6e;
        th{
            height: 40px;
            padding:0!important;
            background-color: #f4f6f9;
            border-bottom: 1px solid #ddd !important;
            color: #515a6e;
        }
        td{
            height:48px;
            padding: 0;
        }
    }
    // 弹框样式
    .el-dialog__body {
        padding: 30px 0;
        .el-select {
            width: 100%;
        }
        .half-width{
            width: 50%!important;
            margin-right: 5px;
        }
        .el-checkbox{
            margin-left: 30px;
        }
        .el-textarea__inner{
            height: 80px;
        }
    }
    .el-row {
        padding: 0 20px;
    }
    .el-dialog__header {
        border-bottom: 1px solid #ddd;
    }
    .el-button.is-disabled{
        cursor: pointer;
    }
    // 弹框按钮样式覆盖
    .footer {
        padding:10px 30px 0 0;
        // height: 50px;
        background: #fff;
        text-align: right;
        line-height: 50px;
        border-top: 1px solid #ddd;
    }
    // 改弹框层级
    .el-dialog__wrapper {
        z-index: 1000 !important;
    }
    .hide {
        display: none;
    }
    .editor-label {
        // display: inline-block;
        float: left;
        padding-right: 10px;
        width: 80px;
        height: 28px;
        line-height: 28px;
        text-align: right;
        vertical-align: top;
        .required {
            display: inline-block;
            padding: 0 3px;
            color: red;
        }
    }
    .editor-containers {
        display: inline-block;
        vertical-align: top;
        margin-bottom: 30px;
        width: 675px;
    }
}
</style>
