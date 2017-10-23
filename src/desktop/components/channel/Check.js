import React from 'react';
import {Table, Icon,Button,Input,DatePicker,Form, Select,InputNumber} from 'antd';
import * as service from '../../services/channel';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';

const { MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;




class Check extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      checks: {},
      checkTime: [],
      page: 1,
      pageSize: 20,
      code: {},
    };
  }

  componentWillMount() {
    const params = {
      userId: JSON.parse(localStorage.user).userId,
      receiveCompanyId: JSON.parse(localStorage.user).relatedPartyId,
    };
    service.fetchCheck(params).then((data)=>{
      if(data.success){
        this.setState({checks:data});
      }
    });

    //获取对账时间
    service.fetchCheckTime({}).then((data)=>{
      this.setState({
        checkTime: data.rows || [],
      })
    });

    //获取快码
    codeService.getCode({checkStatus:'FET.CHECK_STATUS'}).then((data)=>{
      this.setState({
        code: data,
      });
    });
  }

  search(){
    let params = {};
    params.userId = JSON.parse(localStorage.user).userId;
    params.receiveCompanyId = JSON.parse(localStorage.user).relatedPartyId;
    params.paymentCompanyName = this.props.form.getFieldValue('paymentCompanyName');
    params.receiveCompanyName = this.props.form.getFieldValue('receiveCompanyName');
    params.checkPeriod = this.props.form.getFieldValue('checkPeriod');
    params.version = this.props.form.getFieldValue('version');
    service.fetchCheck(params).then((data)=>{
      if(data.success){
        this.setState({checks:data});
      }
    });
  }

  //分页
  tableChange(value){
    let params = {};
    params.userId = JSON.parse(localStorage.user).userId;
    params.receiveCompanyId = JSON.parse(localStorage.user).relatedPartyId;
    params.channelName = this.props.form.getFieldValue('channelName');
    params.checkPeriod = this.props.form.getFieldValue('checkPeriod');
    params.version = this.props.form.getFieldValue('version');
    params.page = value.current;
    params.pageSize = value.pageSize;
    service.fetchCheck(params).then((data)=>{
      if(data.success){
        this.setState({checks:data, pageSize:value.pageSize, page:value.current, });
      }
    });
  }


  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    //表格数据
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    },{
      title: '付款方名称',
      dataIndex: 'paymentCompanyName',
      key: 'paymentCompanyName',
    }, {
      title: '收款方名称',
      dataIndex: 'receiveCompanyName',
      key: 'receiveCompanyName',
    }, {
      title: '对账期间',
      dataIndex: 'checkPeriod',
      key: 'checkPeriod',
    }, {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
    },{
      title: '汇总金额(HKD)',
      dataIndex: 'hkdAmount',
      key: 'hkdAmount',
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record)=>{
        if(text && this.state.code.checkStatus){
          for(let i in this.state.code.checkStatus){
            if(text == this.state.code.checkStatus[i].value){
              return(<div>{this.state.code.checkStatus[i].meaning}</div>)
            }
          }
        }
      }
    },{
      title: '查看详情',
      dataIndex: 'detail',
      key: 'detail',
      render: (text, record) => {
        return(
          <Button className={styles.btn_operation} style={{ height:'32px'}} onClick={() => {
            location.hash = `/channel/checkDetail/${record.checkPeriod}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.version}/${record.paymentCompanyName}/${record.receiveCompanyName}`;
          }}
          >
            查看详情
          </Button>
        )
      }
    }];


    //格式化表格数据
    let data = this.state.checks.rows || [];
    const pageSize =  this.state.pageSize, page = this.state.page;
    const index = pageSize * page - pageSize;
    for(let i = 1; i<= data.length; i++){
      data[i-1].key = index + i;
    }

    return(
      <div className={styles.content}>
        <div className={styles.item_div}>
          <div className={styles.title_sty}>
            <span className={styles.iconL} ></span>
            <font className={styles.title_font2}>对账单列表</font>
          </div>
        </div>

        <div style={{float:'right',marginBottom:'20px'}}>
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('paymentCompanyName', {
              })(
                <Input placeholder="付款方名称" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('receiveCompanyName', {
              })(
                <Input placeholder="收款方名称" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('checkPeriod', {
              })(
                  <Select
                    showSearch
                    style={{ width: '100px' }}
                    placeholder="对账期间"
                  >
                  {
                    this.state.checkTime.map((item)=>
                      <Option key={item} value={item}>{item}</Option>
                    )
                  }
                  </Select>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('version', {
                // initialValue:1,
              })(
                <InputNumber placeholder="版本" min={1} />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('channelName', {
              })(
                <Button style={{float:'right',width:'80px',height:'40px',color:'white',backgroundColor:'#d1b97f'}} size='large' type="primary"  onClick={this.search.bind(this)}>查询</Button>
              )}
            </FormItem>
          </Form>
        </div>

        <div style={{clear:'both'}}>
          <Table
            columns={columns}
            dataSource={data}
            bordered scroll={{x:'100%'}}
            onChange={this.tableChange.bind(this)}
            pagination={{
              showSizeChanger: false,
              pageSizeOptions: ['5','10','20','50'],
              pageSize: this.state.pageSize,
              total:this.state.checks.total || 0,
            }}/>
        </div>
      </div>
    );
  }


}

Check = Form.create()(Check);
export default Check;
