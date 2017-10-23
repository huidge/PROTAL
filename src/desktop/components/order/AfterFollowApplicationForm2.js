import { Form, Row, Col, Input, Checkbox ,InputNumber,Select} from 'antd';
import { getCode } from '../../services/code';
import { dataFormat } from '../../utils/common';
import { fetchFollowRenewalDetailService } from '../../services/order';


const FormItem = Form.Item;



class AfterApplicationForm2 extends React.Component {

  state = {
    expand: false,
    checked : false,
    checked2 : false,
    RFRDList:[],
    codeList:{
      balancePaymentMethodCodes: [],
      payMethodCodes: [],
    }

  };

  componentWillMount() {
    const params = {
      orderId: this.props.orderId
    };
    fetchFollowRenewalDetailService(params).then((data) => {
      if(data.success){
        this.setState({
          RFRDList:data.rows
        },()=>{
          if(this.state.RFRDList){
            if(this.state.RFRDList[0] && this.state.RFRDList[0].ddaFlag=='Y'){
              this.setState({
                checked2 : true
              })
            };
            if(this.state.RFRDList[0] && this.state.RFRDList[0].increaseFlag=='Y'){
              this.setState({
                checked : true
              })
            }
          }
        })
      }
    })
    const codeBody = {
      balancePaymentMethodCodes: 'ORD.BALANCE_PAY_METHOD',
      payMethodCodes: 'CMN.PAY_METHOD',
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });

  }


  render() {
    const pmsListCode = this.state.codeList.payMethodCodes;
    const bpmListCode = this.state.codeList.balancePaymentMethodCodes;
    const fields = this.state.RFRDList[0]?this.state.RFRDList[0]:{};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };

    return (
      <Form  onSubmit={this.handleSearch}>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='客户编号' style={{marginBottom:'0'}}>
              {getFieldDecorator('customerNumber',{
                initialValue:fields.customerNumber?fields.customerNumber:''
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='納费编号' style={{marginBottom:'0'}}>
              {getFieldDecorator('payNumber',{
                initialValue:fields.payNumber?fields.payNumber:''
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保费递增' style={{marginBottom:'0'}}>
              {getFieldDecorator('increaseFlag')(
                <Checkbox disabled="disabled" checked={this.state.checked}></Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='已提交DDA' style={{marginBottom:'0'}}>
              {getFieldDecorator('ddaFlag')(
                <Checkbox disabled="disabled" checked={this.state.checked2} ></Checkbox>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='DDA提交日期' style={{marginBottom:'0'}}>
              {getFieldDecorator('ddaSubmitDate',{
                initialValue:fields.ddaSubmitDate?dataFormat(fields.ddaSubmitDate):''
              })(
                <Input disabled={true} style={{color:'#333'}} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='DDA生效日期' style={{marginBottom:'0'}}>
              {getFieldDecorator('ddaEffectiveDate',{
                initialValue:fields.ddaEffectiveDate?dataFormat(fields.ddaEffectiveDate):''
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='首期保费日' style={{marginBottom:'0'}}>
              {getFieldDecorator('firstPayDate',{
                initialValue:fields.firstPayDate?dataFormat(fields.firstPayDate):''
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保单生效日' style={{marginBottom:'0'}}>
              {getFieldDecorator('effectiveDate',{
                initialValue:fields.effectiveDate?dataFormat(fields.effectiveDate):''
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保费到期日' style={{marginBottom:'0'}}>
              {getFieldDecorator('renewalDueDate',{
                initialValue:fields.renewalDueDate?dataFormat(fields.renewalDueDate):''
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='付款方式' style={{marginBottom:'0'}}>
              {getFieldDecorator('payMethod',{
                initialValue:fields.payMethod?fields.payMethod:''
              })(
              <Select disabled={true} style={{color:'#333'}}>
                  {
                    pmsListCode &&
                    pmsListCode.map((item)=>
                      <Option value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='付款方法' style={{marginBottom:'0'}}>
              {getFieldDecorator('balancePaymentMethod',{
                initialValue:fields.balancePaymentMethod?fields.balancePaymentMethod:''
              })(
                <Select disabled={true} style={{color:'#333'}}>
                  {
                    bpmListCode &&
                    bpmListCode.map((item)=>
                      <Option value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='回馈余额' style={{marginBottom:'0'}}>
              {getFieldDecorator('feedbackBalance',{
                initialValue:fields.feedbackBalance?fields.feedbackBalance:''
              })(
                <InputNumber
                  style={{width:'100%',color:'#333'}}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  min={0} step={0}
                  disabled = {true}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='账户余额' style={{marginBottom:'0'}}>
              {getFieldDecorator('accountBalance',{
                initialValue:fields.accountBalance?fields.accountBalance:''
              })(
                <InputNumber
                  style={{width:'100%',color:'#333'}}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  min={0} step={0}
                  disabled = {true}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='本期续保金额' style={{marginBottom:'0'}}>
              {getFieldDecorator('nextPolicyAmount',{
                initialValue:fields.nextPolicyAmount?fields.nextPolicyAmount:''
              })(
                <InputNumber
                  style={{width:'100%',color:'#333'}}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  min={0} step={0}
                  disabled = {true}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

}

AfterApplicationForm2 = Form.create()(AfterApplicationForm2);

export default AfterApplicationForm2;
