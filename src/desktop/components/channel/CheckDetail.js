import React from 'react';
import {Table, Icon,Button,Input,DatePicker,Form, Select,InputNumber} from 'antd';
import { routerRedux } from 'dva/router'
import CheckModal from './CheckModal';
import * as service from '../../services/channel';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';
import TipModal from "../common/modal/Modal";
import {stringify} from 'qs';

const { MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class CheckDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      code: {},
      checkDetails: {},
      visible: false,
      modalParams: {},
      disabled: false,
      exportBody: {
        sqlId: 'FetChannelCheckMapper.getData',
        userId: JSON.parse(localStorage.user).userId,
        checkPeriod: this.props.checkPeriod,
        paymentCompanyType: this.props.paymentCompanyType,
        receiveCompanyType: this.props.receiveCompanyType,
        paymentCompanyId: this.props.paymentCompanyId,
        receiveCompanyId: this.props.receiveCompanyId,
        version: this.props.version,
        paymentCompanyName: this.props.paymentCompanyName,
        receiveCompanyName: this.props.receiveCompanyName,
        access_token: localStorage.access_token,
      }
    };
  }

  componentWillMount() {
    let params = {
      // userId: JSON.parse(localStorage.user).userId,
      checkPeriod: this.props.checkPeriod,
      paymentCompanyType: this.props.paymentCompanyType,
      receiveCompanyType: this.props.receiveCompanyType,
      paymentCompanyId: this.props.paymentCompanyId,
      receiveCompanyId: this.props.receiveCompanyId,
      version: this.props.version,
    };
    service.fetchCheckDetail(params).then((data)=>{
      if(data.success){
        if (data.rows[0] && (data.rows[0].status=='YQR'||data.rows[0].status=='YSX')) {
          this.state.disabled = true;
        } else {
          this.state.disabled = false;
        }
        data.rows.map((row,index) => {
          row.key = index+1;
        });
        this.setState({checkDetails: data});
      }
    });

    params = {
      paymentTypes: 'FET.PAYMENT_TYPE',
      currencyTypes: 'PUB.CURRENCY',
    };
    //获取快码 付款类型
    codeService.getCode(params).then((data)=>{
      this.setState({code: data});
    });
  }

  export() {
    let exportBody = {
      sqlId: 'FetChannelCheckMapper.getData',
      userId: JSON.parse(localStorage.user).userId,
      checkPeriod: this.props.checkPeriod,
      paymentCompanyType: this.props.paymentCompanyType,
      receiveCompanyType: this.props.receiveCompanyType,
      paymentCompanyId: this.props.paymentCompanyId,
      receiveCompanyId: this.props.receiveCompanyId,
      version: this.props.version,
      paymentCompanyName: this.props.paymentCompanyName,
      receiveCompanyName: this.props.receiveCompanyName,
    };
    service.checkExport(exportBody).then((data) => {
      if (!data.success) {
        TipModal.error({content:data.message});
        return;
      }
    })
  }

  clickSearch(){
    const params = {
      // userId: JSON.parse(localStorage.user).userId,
      checkPeriod: this.props.checkPeriod,
      paymentCompanyType: this.props.paymentCompanyType,
      receiveCompanyType: this.props.receiveCompanyType,
      paymentCompanyId: this.props.paymentCompanyId,
      receiveCompanyId: this.props.receiveCompanyId,
      version: this.props.version,
      paymentType: this.props.form.getFieldValue('paymentType'),
      orderNumber: this.props.form.getFieldValue('orderNumber'),
      comments: this.props.form.getFieldValue('comments'),
    };
    service.fetchCheckDetail(params).then((data)=>{
      if(data.success){
        if (data.rows[0] && (data.rows[0].status=='YQR'||data.rows[0].status=='YSX')) {
          this.state.disabled = true;
        } else {
          this.state.disabled = false;
        }
        data.rows.map((row,index) => {
          row.key = index+1;
        });
        this.setState({checkDetails: data});
      }
    });
  }

  //查看所有
  searchAll(){
    const params = {
      // userId: JSON.parse(localStorage.user).userId,
      checkPeriod: this.props.checkPeriod,
      paymentCompanyType: this.props.paymentCompanyType,
      receiveCompanyType: this.props.receiveCompanyType,
      paymentCompanyId: this.props.paymentCompanyId,
      receiveCompanyId: this.props.receiveCompanyId,
      version: this.props.version,
    };
    service.fetchCheckDetail(params).then((data)=>{
      if(data.success){
        if (data.rows[0] && (data.rows[0].status=='YQR'||data.rows[0].status=='YSX')) {
          this.state.disabled = true;
        } else {
          this.state.disabled = false;
        }
        data.rows.map((row,index) => {
          row.key = index+1;
        });
        this.setState({checkDetails: data});
      }
    });
    this.props.form.resetFields();
  }

  //回调
  callback(visiable,disabled){
    this.state.checkDetails.rows.map((row,index) => {
      row.status = 'YQR';
    });
    this.setState({
      visible:visiable,
      disabled: disabled,
    });
  }

  //问题反馈
  feedback(){
    let record = this.props;
    const url =  `/channel/checkFeedback/${record.checkPeriod}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.version}/${record.paymentCompanyName}/${record.receiveCompanyName}/${this.state.checkDetails.rows[0].status}`;
    this.props.dispatch(routerRedux.push(url));
  }

  //显示模态框
  changeVisible(){
    this.setState({visible:true});
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const checkPeriod = this.props.checkPeriod;
    const paymentCompanyName = this.props.paymentCompanyName;
    const receiveCompanyName = this.props.receiveCompanyName;
    
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },{
        title: '付款类型',
        dataIndex: 'paymentType',
        key: 'paymentType',
        render:(text,render)=>{
          if(text && this.state.code.paymentTypes){
            for(let i in this.state.code.paymentTypes){
              if(text == this.state.code.paymentTypes[i].value){
                return this.state.code.paymentTypes[i].meaning;
              }
            }
          }
          return "";
        },
      },{
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '产品名称',
        dataIndex: 'itemName',
        key: 'itemName',
      },{
        title: '供款期',
        dataIndex: 'contributionPeriod',
        key: 'contributionPeriod',
      },{
        title: '订单币种',
        dataIndex: 'orderCurrency',
        key: 'orderCurrency',
        render:(text,render)=>{
          if(text && this.state.code.currencyTypes){
            for(let i in this.state.code.currencyTypes){
              if(text == this.state.code.currencyTypes[i].value){
                return this.state.code.currencyTypes[i].meaning;
              }
            }
          } else {
            return text||"";
          }
        },
      },{
        title: '订单金额',
        dataIndex: 'amount',
        key: 'amount',
      },{
        title: '费率',
        dataIndex: 'rate',
        key: 'rate',
        render:(text)=>{
          if(text){
            return Math.round(text*10000)/100 + '%';
          }
        },
      },{
        title: '汇率',
        dataIndex: 'exchangeRate',
        key: 'exchangeRate',
      },{
        title: '实付HKD',
        dataIndex: 'hkdAmount',
        key: 'hkdAmount',
      },{
        title: '基准日期',
        dataIndex: 'baseDate',
        key: 'baseDate',
        render: (text,record,index) => {
          if (text) {
            const date = new Date(text);
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
          } else {
            return "";
          }
        }
      },{
        title: '预付付款日',
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (text,record,index) => {
          if (text) {
            const date = new Date(text);
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
          } else {
            return "";
          }
        }
      },{
        title: '备注',
        dataIndex: 'comments',
        key: 'comments',
      },];

    return(
      <div className={styles.content}>
        <div className={styles.item_div}>
          <div className={styles.title_sty}>
            <span className={styles.iconL} ></span>
            <font className={styles.title_font2}>{'对账单('+ checkPeriod + '>' + paymentCompanyName + '>' + receiveCompanyName +')'}</font>
          </div>
        </div>

        <div style={{marginBottom:'20px'}}>
          <a href={'/api/channelcheck/export?'+stringify(this.state.exportBody)}>
            <Button type='primary' style={{float:'left',width:'120px',height:'40px',outLine:'none'}}>导出</Button>
          </a>
          <Form layout="inline" style={{float:'right'}}>
            <FormItem>
              {getFieldDecorator('paymentType', {
              })(
                <Select
                  showSearch
                  style={{ width: '150px' }}
                  placeholder="付款类型"
                >
                {
                  this.state.code.paymentTypes &&
                  this.state.code.paymentTypes.map((item)=>
                    <Option key={item.value}>{item.meaning}</Option>
                  )
                }
                </Select>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('orderNumber', {
              })(
                <Input placeholder="订单编号" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('comments', {
              })(
                <Input placeholder="备注" />
              )}
            </FormItem>

            <FormItem>
              <Button type='primary' style={{height:'40px'}} onClick={this.clickSearch.bind(this)}>查询</Button>
            </FormItem>
            <FormItem>
              <Button type='primary' style={{height:'40px'}} onClick={this.searchAll.bind(this)}>全部</Button>
            </FormItem>
          </Form>
        </div>

        <div style={{float:'right',width:'100%'}}>
          <Table scroll={{x:'100%'}} columns={columns} dataSource={this.state.checkDetails.rows} bordered pagination={false}/>
        </div>

        <div style={{clear:'both',width:'100%',textAlign:'center',padding:'10px'}}>
          <Button type='primary' disabled={this.state.disabled} style={{width:'120px',height:'40px'}} onClick={this.changeVisible.bind(this)}>确认</Button>
          <Button type='default' style={{width:'120px',height:'40px', marginLeft:'10px'}} onClick={this.feedback.bind(this)}>问题反馈</Button>
        </div>

        <CheckModal 
          visible={this.state.visible}
          channelId={this.props.receiveCompanyId}
          checkPeriod={this.props.checkPeriod}
          version={this.props.version}
          paymentCompanyId={this.props.paymentCompanyId}
          paymentCompanyType={this.props.paymentCompanyType}
          receiveCompanyId={this.props.receiveCompanyId}
          callback={this.callback.bind(this)}/>
      </div>
    );
  }


}

export default Form.create()(CheckDetail);
