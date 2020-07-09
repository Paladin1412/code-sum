import React from 'react';
import {Modal,Input,Select, Button} from 'antd';
import {inject,observer} from 'mobx-react';
import "./LeadResultDialog.scss";

@inject("terminalStore")
@observer
class LeadResultDialog extends React.Component{

    onOk=()=>{
        this.props.terminalStore.setIsShowLeadResuleDialog(false);
    }

    onCancel=()=>{
        this.props.terminalStore.setIsShowLeadResuleDialog(false);
    }

    render(){
        const {isShowLeadResuleDialog,isShowLeadResultLoading,uploadResult} = this.props.terminalStore;
        return <Modal 
            centered={true}
            confirmLoading={isShowLeadResultLoading}
            visible={isShowLeadResuleDialog}
            footer={[<Button onClick = {this.onOk} type='primary' key='ok'>确认</Button>]}
            title='上传结果'
            onOk={this.onOk} onCancel={this.onCancel}>
            <div className='shell-lead-result-container'>
                <div className='shell-lead-result-top'>
                    <p className='shell-lead-result-title'>本次上传结果:</p>
                    <a href={uploadResult.check_result_file_urk} download={uploadResult.check_result_file_urk}>下载结果表格</a>
                </div>
                <div className='shell-lead-result-content'>
                    <p className='shell-lead-success'>成功上传<span>{uploadResult.success_count}</span>条数据;</p>
                    <p className='shell-lead-fail'>有<span>{uploadResult.failed_count}</span>条数据上传失败</p>
                </div>        
            </div>
        </Modal>
    }
}

export default LeadResultDialog;