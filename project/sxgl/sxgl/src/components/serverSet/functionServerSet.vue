/*
 * @Author: qijiang 
 * @Date: 2018-10-29 10:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-28 09:30:13
 */
<template>
    <div id="functionServerSet">
        <div class="clearfix data-template-main">
            <div class="left-wrap fl">
                <div class="template-search">
                    <el-row>
                        <el-col :span="14">
                            <div class="inline-block common-width">
                                <el-input v-model="queryName" :maxlength="10" size="small" @change="changeQueryName"></el-input>
                            </div>
                        </el-col>
                        <el-col :span="2" class="left-13">
                            <div class="template-search-btn" @click="searchBtn(2)">
                                <i class="iconfont icon-sousuo"></i>
                            </div>
                        </el-col>
                        <el-col :span="2" class="jiahao">
                            <i class="iconfont icon-jiahao1" @click="showTree"></i>
                        </el-col>
                        <el-col :span="2" class="jianhao">
                            <i class="iconfont icon-jianhao" @click="closeTree"></i>
                        </el-col>
                    </el-row>
                </div>
                <Tree ref="treeNode" :data="dataTemplateTree" :render="renderContent"></Tree>
            </div>
            <p class="template-line"></p>
            <div class="right-wrap fr">
                <div class="list-wrap">
                    <div class="table-wrap">
                        <div class="clearfix">
                            <el-button class="fr server-set" type="primary" size="small" @click="matterSet('','',1)">服务配置</el-button>
                        </div>
                        <div class="table-form">
                            <el-table :data="tableList" tooltip-effect="light" @selection-change="changeFun">
                                <el-table-column type="selection" width="50">
                                </el-table-column>
                                <el-table-column label="数据模板名称">
                                    <template scope="scope">
                                        <span :title="scope.row.templateName">{{scope.row.templateName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="要素名称">
                                    <template scope="scope">
                                        <span :title="scope.row.attrName">{{scope.row.attrName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="要素标识">
                                    <template scope="scope">
                                        <span :title="scope.row.attrCode">{{scope.row.attrCode}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="数据类型">
                                    <template scope="scope">
                                        <span :title="scope.row.attrTypeTxt">{{scope.row.attrTypeTxt}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度">
                                    <template scope="scope">
                                        <span :title="scope.row.attrLength">{{scope.row.attrLength}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="功能服务" width="130" align="center">
                                    <template scope="scope">
                                        <el-button class="seted" title="未配置" type="text" size="large" @click="matterSet($event,scope.row, 0)" v-if="!scope.row.serverCode">未配置</el-button>
                                        <el-button title="已配置" type="text" size="large" @click="matterSet($event,scope.row, 0 )" v-if="scope.row.serverCode">已配置</el-button>
                                        <el-button title="重置" type="text" size="large" @click="serverReset($event,scope.row, 0 )" :disabled="!scope.row.serverCode">重置</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" v-if="showGoBtn">
            <el-button size="small" @click="lastStep">上一步</el-button>
            <el-button type="primary" size="small" @click="closeParentDialog">确定</el-button>
        </div>

        <!-- 配置事项 -->
        <el-dialog :title="modelTitle" :visible.sync="modelFlag" width="1270px" :close-on-click-modal="false" :append-to-body="true">
            <functionServerSetModel v-if="modelFlag" ref='modelFlag' @closeDialog="closeDialog" :param="param"></functionServerSetModel>
        </el-dialog>
    </div>
</template>
<script>
import unit from "@/api";   // 公共工具方法
import functionServerSetModel from "@/components/serverSet/functionServerSetModel";
export default {
    components: {
        functionServerSetModel: functionServerSetModel
    },
    props: {
        showGoBtn: { //是否显示上一步、下一步按钮
            type: Boolean,
            default: false
        },
        param: {
            type: Object
        }
    },
    data() {
        return {
            tempId: '', //暂存选中的id
            //是否显示按钮
            showBtn: false,
            subWid: '100%',
            subWrapWid: '96%',

            queryName: '',  //搜索值、模板名称
            dataTemplateTree: [ //树结构列表
                {
                    title: '数据模板',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                })
                            ]);
                    },
                    children: []
                }
            ],

            // 列表数据
            tableList: [],

            modelFlag: false,
            modelTitle: '功能服务配置',
            moreTemplateName: '',  //多功能服务配置要素名,顿号拼接
            moreTempAttrId: ''  //多功能服务配置要素id,逗号拼接
        }
    },
    methods: {
        //修复ie记忆问题
        changeQueryName(val) {
            this.queryName = val == '' ? '' : val;
        },
        //关闭树结构
        closeTree() {
            this.dataTemplateTree[0].expand = false;
        },
        //展开树结构
        showTree() {
            this.dataTemplateTree[0].expand = true;
        },
        //重置服务
        serverReset(e, row, type) {
            let _that = this,
                jsonObj = {
                    dataTempAttrId: row.id,
                    dataTempId: _that.param.dataTemplateId,
                    linkId: _that.param.linkId,
                    funType: _that.param.templateType
                };
            _that.$confirm('确定要清除已配置的服务吗？', '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                unit.ajaxObjPost('/znsj-web/funtion/server/clean', jsonObj, function (res) {
                    if (res.flag == true) {
                        _that.getDetailByTempId(_that.tempId);
                    } else {
                        _that.$Message.warning(res.errMsg || '请求数据失败');
                    }
                }, function (res) {
                    _that.$Message.warning(res.data.errMsg || '请求数据失败');
                }, _that);
            }).catch(() => {

            });
        },
        //表格复选框点击事件
        changeFun(node) {
            this.moreTempAttrId = '';
            this.moreTemplateName = '';
            for (let i = 0; i < node.length; i++) {
                this.moreTempAttrId += node[i].id + ',';
                this.moreTemplateName += node[i].attrName + '、';
            }
            this.moreTempAttrId = this.moreTempAttrId.substr(0, this.moreTempAttrId.length - 1);
            this.moreTemplateName = this.moreTemplateName.substr(0, this.moreTemplateName.length - 1);
        },
        //下拉树渲染
        renderContent(h, { root, node, data }) {
            let styleSet = {  //样式设置
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            },
                iconSet = {
                    type: 'ios-paper-outline'
                },
                that = this,
                classFlag = false;
            if (node.children && node.children.length > 0) {  //有子项的样式以及图标设置
                styleSet = {
                    style: {
                        display: 'inline-block',
                        width: '100%',
                        cursor: 'pointer'
                    },
                    on: {
                        click: (e, node) => {
                            $('.ivu-tree-children .default').removeClass('cur');
                            $(e.target).closest('li').find('.default').addClass('cur');
                            that.tempId = data.id;
                            that.getDetailByTempId(data.id); //点击请求列表
                        }
                    }
                };
                iconSet = {
                    type: 'ios-folder-outline'
                };
                classFlag = true;
            }

            return h('span', styleSet, [
                h('span', [
                    h('Icon', {
                        props: iconSet,
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', {
                        domProps: {
                            innerHTML: data.title
                        },
                        'class': {
                            default: classFlag
                        }
                    })
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                })
            ]);
        },
        /*
        ** 请求左边树的数据
        ** isFirst 是否第一次请求
        */
        getTreeData(isFirst) {
            let _that = this,
                jsonObj = {
                    linkId: _that.param.linkId,
                    queryName: _that.queryName.trim()
                };
            unit.ajaxObjPost('/znsj-web/data/template/selectTree', jsonObj, function (res) {
                if (res.flag == true) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].children.length > 0) {
                            res.data[i].expand = true;  //数据展开
                        }
                    }
                    let index = _that.findIndex(_that.tempId, res.data);
                    $('.ivu-tree-children .default').removeClass('cur');
                    //赋值
                    _that.dataTemplateTree[0].children = res.data;

                    if (_that.tempId && index === '') { //如果有id，该id被选中
                        setTimeout(function () {
                            if (index !== '' || index === 0) {
                                $('.ivu-tree-children .default').eq(index).addClass('cur');
                            }
                        }, 100)
                    } else {
                        _that.tempId = res.data[0].id;
                        setTimeout(function () { //第一请求选中第一个树节点
                            $('.ivu-tree-children .default').eq(0).addClass('cur');
                        }, 100);
                    }

                    //根据树结构，请求列表数据
                    if (isFirst) {
                        _that.getDetailByTempId(res.data[0].id);

                    }
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        /*
        ** 获取列表数据
        ** ids 根据已选中的id获取列表
        */
        getDetailByTempId(ids) {
            let _that = this,
                jsonObj = {
                    linkId: _that.param.linkId,
                    templateIds: ids
                };
            unit.ajaxMerPost('/znsj-web/data/temp/attr/getDetailByTempId', jsonObj, function (res) {
                if (res.flag == true) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].listAttr.length > 0) {
                            $(res.data[i].listAttr).each(function (index, obj) {
                                obj.templateName = res.data[i].templateName;  //去外层数据给内层
                            });
                        }
                    }
                    //赋值
                    _that.tableList = res.data[0].listAttr;
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        //配置事项
        matterSet(e, row, isMult) {
            if (isMult == 0) { //单服务配置
                this.param.tempAttrId = row.id;
                this.param.name = row.attrName;
            } else {  //多服务配置
                if (this.moreTempAttrId == '') {
                    this.$Message.warning('请选择一条或多条记录');
                    return;
                }
                if(this.moreTempAttrId.indexOf(',') == -1) {
                    isMult = 0;
                }
                this.param.tempAttrId = this.moreTempAttrId;
                this.param.name = this.moreTemplateName;
            }
            this.param.dataTemplateId = this.tempId;
            this.param.isMult = isMult;
            this.modelFlag = true;
        },
        //根据id获取Index
        findIndex(id, data) {
            let index = '',
                len = data.length;
            for (let i = 0; i < len; i++) {
                if (data[i].id == id) {
                    index = i;
                }
            }
            return index;
        },
        //搜索按钮
        searchBtn() {            ;
            //点击一次，请求一次数据
            this.getTreeData();
        },
        //关闭弹框
        closeDialog() {
            this.modelFlag = false;
            this.getDetailByTempId(this.tempId);
        },
        //下一步按钮，需要判断数据是否成立完毕
        closeParentDialog() {
            this.$emit('closeDialog', 'next');
        },
        //上一步按钮，需要判断数据是否成立完毕
        lastStep() {
            this.$emit('go', 'last');
        },
        //供父事项调用
        parentHandle() {

        }
    },
    activated() {
        //请求树结构数据
        this.getTreeData(true);
    }
};
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
#functionServerSet {
    .el-dialog__header {
        border-bottom: 0;
    }
    .cur {
        background: #137ddf;
        color: #fff;
    }
    .data-template-main {
        position: relative;
        border-top: 1px solid #e4e4e4;
        border-bottom: 1px solid #e4e4e4;
        .el-table td {
            padding: 5px 0;
        }
        .left-wrap {
            overflow: auto;
            min-height: 600px;
            padding: 20px 10px 0 10px;
            width: 30%;
            .left-13 {
                margin-left: -13px;
                margin-right: 0;
            }
            .jiahao {
                margin-left: 20px;
                height: 32px;
                line-height: 32px;
                i {
                    font-size: 20px;
                    color: #2d8cf0;
                    cursor: pointer;
                }
            }
            .jianhao {
                height: 32px;
                line-height: 32px;
                i {
                    font-size: 20px;
                    color: #2d8cf0;
                    cursor: pointer;
                }
            }
            .common-width {
                width: 100%;
            }
            .template-search-btn {
                position: relative;
                height: 32px;
                width: 32px;
                background-color: #f4f6f9;
                line-height: 32px;
                border-radius: 0 5px 5px 0;
                border: 1px solid #e0e6f1;
                z-index: 99;
                cursor: pointer;
                text-align: center;
                i {
                    font-size: 20px;
                }
            }
            .ivu-tree {
                & > .ivu-tree-children > li > .ivu-checkbox-wrapper {
                    display: none;
                }
                ul {
                    li {
                        width: 98%;
                    }
                }
            }
        }
        .right-wrap {
            padding: 20px 10px 15px 10px;
            width: 70%;
            min-height: 600px;
            .no-data {
                height: 600px;
                line-height: 600px;
                text-align: center;
                .icon-gantanhao {
                    color: #137ddf;
                    font-size: 34px;
                    vertical-align: middle;
                }
            }
            .list-wrap {
                .table-wrap {
                    width: 100%;
                    min-height: 523px;
                    .server-set {
                        width: 120px;
                    }
                    .table-form {
                        margin-top: 10px;
                        border: 1px solid #e0e6f1;
                        border-bottom: none;
                        .el-table {
                            border: none;
                        }
                        //未配置
                        .seted {
                            color: #606266;
                        }
                    }
                }
            }
        }
        .template-line {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 30%;
            width: 1px;
            background: #e4e4e4;
        }
    }
}
</style>
