/*
 * @Author: lhqin 
 * @Date: 2018-10-01 12:23:55 
 * @Last Modified by: lhqin
 * @Last Modified time: 2018-10-26 01:29:33
 */

<template>
    <div id="addMatters" class="pl20 pr20 pt15">
        <!-- 头部说明 -->
        <div class="title-top">
            <p class="title-left">
                <span class="t-div mr5"></span>
                <span>{{operateName}}</span>
            </p>
            <p class="btn-groups inline-block ml30" @click="backEvt">
                <Button size="small" class="cursor-p w80">
                    <i class="iconfont icon-back"></i>
                    <span>返回</span>
                </Button>
            </p>
        </div>

        <!-- tab切换导航条 -->
        <div class="switch-navigate mt10">
            <p :ref="index" class="inline-block cursor-p switch-default" v-for="(item, index) of tabList" :class="{selected:selected==index}" @click="toggleTabs($event,index)">{{item.title}}</p>
        </div>

        <div>
            <!-- 切换面板组件 -->
            <keep-alive>
                <div :is="currentView" @getCode="getCode"></div>
            </keep-alive>
        </div>

    </div>

</template>
<script>
import mattInfo from '@/pages/sysSetting/receiveFilePanel/mattInfoPanel'
import configInfo from '@/pages/sysSetting/receiveFilePanel/configInfoPanel'
export default {
    data() {
        return {
            savaQuery: '',
            operateName: '新增事项',
            selected: 0, //tab当前选中
            currentView: 'mattInfo', //当前面板组件
            tabList: [ //tab栏标题内容
                {                    title: '事项信息',
                    content: 'mattInfo'
                },
                {
                    title: '配置信息',
                    content: 'configInfo'
                }
            ],
            param: {
                matteVersion: '',
                matteCode: ''
            }
        };
    },
    components: {
        mattInfo,
        configInfo
    },
    methods: {
        toggleTabs($event, index) {
            if (this.savaQuery.type === 'addNew' && this.param.matteCode == '') {//新增点过来，配置信息不可点
                if (index == 1) {
                    return
                }
            } else {
                this.selected = index;
                this.currentView = this.tabList[index].content;
                for (let i = 0; i < this.$children.length; i++) {
                    if (this.$children[i].disa) {
                        this.$children[i].disa();
                    }
                }
            }
        },
        backEvt() {
            this.$router.go(-1);
        },
        getCode(val) {
            this.param.matteCode = val.normalCode;
            this.param.matteVersion = val.normalVersion;
            this.selected = 1;
            this.currentView = this.tabList[1].content;
        }
    },
    mounted() {
        this.savaQuery = this.$route.query;
        let type = this.savaQuery.type;
        switch (type) {
            case 'addNew':
                this.operateName = '新增事项';
                break;
            case 'detail':
                this.operateName = '查看事项';
                break;
            case 'edit':
                this.operateName = '编辑事项';
                break;
            case 'copy':
                this.operateName = '复制事项';
                break;
            case 'change':
                this.operateName = '变更事项';
                break;
            case 'addChild':
                this.operateName = '新增子事项';
                break;
        }
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#addMatters {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;

    .title-top {
        height: 42px;
        border-bottom: 1px dashed #d8d8d8;
    }

    .title-top .title-left {
        display: inline-block;
        position: relative;
        height: 25px;
        vertical-align: middle;
    }

    .title-left {
        .t-div {
            display: inline-block;
            width: 7px;
            height: 100%;
            background-color: #078fea;
            vertical-align: middle;
        }

        span:last-child {
            font-size: 14px;
            font-weight: 1000;
            vertical-align: middle;
        }
    }

    .switch-navigate {
        height: 43px;
        line-height: 43px;
        font-size: 13px;
        border: 1px solid #e4e4e4;
    }

    .switch-navigate p {
        text-align: center;
        width: 133px;
        height: 100%;
    }

    .switch-navigate p:last-child {
        position: relative;
        left: -5px;
    }

    .switch-default {
        background-color: #f2f2f2;
        color: #5e5e5e;
    }

    .a-color-red {
        a {
            color: #288ff4;
        }
    }

    .selected {
        background-color: #1683c8;
        color: #fffffc !important;
    }
}
</style>
