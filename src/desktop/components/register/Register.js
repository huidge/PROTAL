import React from 'react';
import { Form, Input,Modal, Select, Row, Col, Checkbox, Button } from 'antd';
import isFunction from 'lodash/isFunction';
import Modals from '../common/modal/Modal';
import * as styles from '../../styles/register.css';
import * as service from '../../services/register';
import * as loginService from '../../services/login';

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked: true,     //勾选框
      count: 60,         //多少秒后重新发验证码
      liked: true,      //控制发送验证码显示内容
      sendFlag: false,  //控制发送验证码按钮 是否可用的一部分，结合liked 一起控制是否可用
      visible: false,
      registLoading: false,  //点击注册按钮后 让按钮处于加载状态
    };
  }

  //改变Checkbox
  changeBox(){
    this.setState({
      checked:!this.state.checked,
    })
  }



  /**
   * 点击提交按钮执行的函数
   */
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = this.props.form;
        let params = {};
        params.channelName = form.getFieldValue('channelName');
        params.chineseName = form.getFieldValue('channelName');
        params.statusCode = 'REGISTED';
        params.channelSource = 'ONLINE';
        params.contactPerson = form.getFieldValue('channelName');
        params.contactPhone = form.getFieldValue('contactPhone');
        params.phoneCode = form.getFieldValue('phoneCode');

        params.user = {};
        params.user.userName = form.getFieldValue('userName');
        params.user.password = form.getFieldValue('password');
        params.user.repPassword = form.getFieldValue('repPassword');
        params.user.phone = form.getFieldValue('contactPhone');
        params.user.phoneCode = form.getFieldValue('phoneCode');
        params.user.verifiCode = form.getFieldValue('verifiCode');
        params.user.userType = 'CHANNEL';
        params.sessionId = this.state.sessionId;   //验证码 sessionId
        this.setState({ registLoading: true });

        //提交注册信息
        service.submit(params).then((data) => {
          const body ={
            userName: form.getFieldValue('userName'),
            password: form.getFieldValue('password'),
          };
          const params ={
            client_id: 'client2',
            client_secret: 'secret',
            grant_type: 'password',
            username: this.props.form.getFieldValue('userName'),
            password: this.props.form.getFieldValue('password'),
          };
          if(data.success){
            this.setState({ registLoading: false });
            loginService.loginFirst(body).then((data) => {
              if(data && data.success){
                localStorage.clear();           //先清除先前的缓存
                localStorage.sessionId = data.sessionId;
                localStorage.user = JSON.stringify(data.user);
                localStorage.userName = data.user.userName;

                loginService.login(params).then((data) => {
                  if(data !==  null && data.access_token){
                    clearInterval(this.timer);
                    localStorage.access_token = data.access_token;
                    localStorage.currentTime = new Date().getTime();
                    location.hash = '/register/success';
                  }else{
                    localStorage.clear();         //先清除先前的缓存
                    location.hash = '/login';
                  }
                });
              }else{
                Modals.error({content: '自动登录失败！'+ data.message,});
                this.setState({ registLoading: false });
                return;
              }
            });
          }else{
            Modals.error({content: '注册失败！'+ data.message,});
            this.setState({ registLoading: false });
            return;
          }

        }).catch(error => {
          Modals.error({content: '服务器或网络异常，请稍后尝试',});
          this.setState({ registLoading: false });
          return;
        });

      }else{
        // Modals.error({content: '请填写正确注册信息',});
        return;
      }
    });
  }

  //操作不当时清除定时器
  componentWillUnmount() {
    clearTimeout(this.timer);
  }



  //校验密码是否一致
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }

  //验证手机号
  checkPhone = (rule, value, callback) => {
    if(!value){
      this.setState({ sendFlag: false, });
      callback();
    }else{
      let preCode = this.props.form.getFieldValue('phoneCode');
      let regex = /^\d{11}$/,msg='手机号位数不正确(大陆地区为11位)';

      if( preCode ==='00852' || preCode ==='00853'){
        regex = /^\d{8}$/;
        msg='手机号位数不正确(港澳地区为8位)';
      }else if(preCode ==='00886' ){
        regex = /^\d{9}$/;
        msg='手机号位数不正确(台湾地区为9位)';
      }

      if ( value && !regex.test(value)  ) {
        if(isFunction(callback)) {
          this.setState({ sendFlag: false, });
          callback(msg);
        }
      }else if(isFunction(callback)) {
        this.setState({ sendFlag: true, });
        callback();
      }
    }
  }

  //平台协议
  showModal(){
    this.setState({
      visible: true,
    });

  }
  //关闭协议模态框
  handleCancel (e) {
    this.setState({
      visible: false,
    });
  }

  //发送验证码
  handleClick(e){
    if(this.state.liked){
      if(this.props.form.getFieldValue('contactPhone')){
        service.sendVerifiCode({
            phone:this.props.form.getFieldValue('contactPhone'),
            phoneCode:this.props.form.getFieldValue('phoneCode'),
        }).then((data)=>{
          if(data.success){
            this.setState({sessionId:data.sessionId});
          }else{
            Modals.error({content: data.msg,});
            return;
          }
        });

        //开始倒计时
        this.timer = setInterval(function () {
          let count = this.state.count;
          this.state.liked = false;
          count -= 1;
          if (count < 1) {
            this.setState({
              liked: true,
              count: 60,
            });
            clearInterval(this.timer);
          }else{
            this.setState({count: count });
          }
        }.bind(this), 1000);

      }
    }
  }

  //当更改了phoneCode就清空手机号
  handleWebsiteChange = (value) => {
    if(value){
      this.props.form.resetFields(['contactPhone']) ;
      this.setState({
        sendFlag: false,
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 20,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 6,
        },
      },
    };

    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: "86",
    })(
      <Select style={{width:'120px'}} onChange={this.handleWebsiteChange}>
        <Option value="86">+86(大陆)</Option>
        <Option value="00852">+852(香港)</Option>
        <Option value="00853">+853(澳门)</Option>
        <Option value="00886">+886(台湾)</Option>
      </Select>
    );

    //发送验证码按钮上显示的内容
    let text = this.state.liked ? '发送验证码' : this.state.count + '秒后重发';

    return (
      <div className={styles.fieldset_sty}>
        <Form  className={styles.form_sty} style={{marginLeft:'10%' }} onSubmit={this.handleSubmit.bind(this)}>
          <FormItem {...formItemLayout} label="渠道名称">
            {getFieldDecorator('channelName', {
              rules: [{ required: true, message: '请输入渠道名称', whitespace: true }],
            })(
              <Input  />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码',
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="确认密码">
            {getFieldDecorator('repPassword', {
              rules: [{
                required: true, message: '请再次输入密码',
              }, {
                validator: this.checkPassword.bind(this),
              }],
            })(
              <Input type="password"  />
            )}
          </FormItem>
          <FormItem{...formItemLayout} label="联系电话">
            {getFieldDecorator('contactPhone', {
              rules: [{
                required: true, message: '请输入联系电话'
              },{
                validator: this.checkPhone.bind(this),
              }],
            })(
              <Input addonBefore={prefixSelector} size="large" style={{width:'100%',marginRight: 0}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="验证码" >
            <Row gutter={24}>
              <Col span={18}>
                {getFieldDecorator('verifiCode', {
                  rules: [{ required: true, message: '请输入验证码', whitespace: true
                  }],
                })(
                  <Input size="large" />
                )}
              </Col>
              <Col span={6} style={{paddingLeft: 0}}>
                <Button disabled={!(this.state.liked && this.state.sendFlag) } size="large" type='primary' style={{float:'right', height:'40px'}} onClick={this.handleClick.bind(this)}>{text}</Button>
              </Col>
            </Row>
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            {getFieldDecorator('agreement')(
              <div>
                <Checkbox checked={this.state.checked} onChange={this.changeBox.bind(this)}>我已认真阅读并同意</Checkbox> <a style={{marginLeft:'-12px',color:'#d1b97f',fontSize:'16px',fontFamily:'Microsoft YaHei' }} onClick={this.showModal.bind(this)}><b>《财联邦理财系统注册服务协议》</b></a>
              </div>
            )}
          </FormItem>
          <FormItem  {...tailFormItemLayout}>
            <Button disabled={!this.state.checked} type='primary' loading={this.state.registLoading} style={{float:'right', width:'100%',height:'40px'}} htmlType="submit" size="large" >注册</Button>
          </FormItem>
          <FormItem  {...tailFormItemLayout}>
            <div style={{ textAlign:'center',fontSize:'16px',fontFamily:'Microsoft YaHei'}}>
              已注册财联邦账户？<a style={{ color:'#000',}}onClick={()=>location.hash= '/login'} ><span style={{ color:'#d1b97f',}}> 立即登录</span></a>
            </div>
          </FormItem>
        </Form>
        <Modal
          visible={this.state.visible}
          width={600}
          style={{top:25}}
          maskClosable={false}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
          <div >
            <div className={styles.protocol_title}>
              <p style={{margin:'0px 0px'}}>平台协议</p>
            </div>
            <Form>
              <div className={styles.protocol_content}>
                <div style={{textAlign:'center',fontSize:'16px'}}>财联邦线上系统用户注册协议</div>
                一、总则<br/>
                1.1 财联邦线上系统的所有权和运营权归财联邦管理有限公司所有。<br/>
                1.2 用户在注册之前，应当仔细阅读本协议，并同意遵守本协议后方可成为注册用户。一旦注册成功，则用户与财联邦之间自动形成协议关系，用户应当受本协议的约束。用户在使用特殊的服务或产品时，应当同意接受相关协议后方能使用。<br/>
                1.3 本协议细则可由财联邦随时更新，用户应当及时关注并同意，本站不承担通知义务。本站的通知、公告、声明或其它类似内容是本协议的一部分。<br/>
                二、服务内容<br/>
                2.1 财联邦的具体内容由第三方根据实际业务情况向本站提供，相关业务及产品资料及内容的准确性及时性本站不予承担责任。<br/>
                2.2 本站仅提供相关的网络服务及相关业务支持服务，除此之外与相关网络服务有关的设备(如个人电脑、手机、及其他与接入互联网或移动网有关的装置)及所需的费用(如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费、购买网站内相关业务支持增值服务的费用等)均应由用户自行负担。<br/>
                2.3 本站内所示服务费率标准由第三方根据实际业务情况提供和发布，供注册用户参考，不构成正式销售邀约，正式服务费率以实际产生的服务费为准。<br/>
                2.4 在存在明显错误或与实际线下产生的业务不符的情况下，本站有权对网站上显示的产品及订单进行单方面的修改或取消，注册用户有义务对已发现的错误通过邮件或客服通知本站。<br/>
                三、用户帐号<br/>
                3.1 经本站注册系统完成注册程序并通过身份认证的用户即成为正式用户，可以获得本站规定用户所应享有的一切权限；未经认证仅享有本站规定的部分会员权限。财联邦有权对会员的权限设计进行变更。<br/>
                3.2 用户只能按照注册要求使用真实姓名。用户有义务保证密码和帐号的安全，未经本站同意，不得将注册账户交给他人或其他第三方使用。<br/>
                3.3 用户利用该密码和帐号所进行的一切活动引起的任何损失或损害，由用户自行承担全部责任，本站不承担任何责任。如用户发现帐号遭到未授权的使用或发生其他任何安全问题，应立即修改帐号密码并妥善保管，如有必要，请通知本站。因黑客行为或用户的保管疏忽导致帐号非法使用或信息泄露，本站不承担任何责任。<br/>
                3.4 用户通过本站产生的各项业务往来，如有业务纠纷或损失，本站不承担相关责任或赔偿，因本站系统服务过失导致的损失除外。<br/>
                3.5 本站有权对所有注册账户进行不定期审核并对存在以下使用情形的账户给予警告或关停处理：<br/>
                (1) 恶意盗取、下载、挪用本站业务资料的行为；<br/>
                (2) 长期大量占用系统服务资源而并无实际业务操作的行为；<br/>
                (3) 恶意传播、公开系统账号及登录信息，对本站造成损害的行为；<br/>
                (4) 其他本站认为不合理使用或危害本站利益的行为。<br/>
                四、使用规则<br/>
                4.1 遵守中华人民共和国相关法律法规，包括但不限于《中华人民共和国计算机信息系统安全保护条例》、《计算机软件保护条例》、《最高人民法院关于审理涉及计算机网络著作权纠纷案件适用法律若干问题的解释(法释[2004]1号)》、《全国人大常委会关于维护互联网安全的决定》、《互联网电子公告服务管理规定》、《互联网新闻信息服务管理规定》、《互联网著作权行政保护办法》和《信息网络传播权保护条例》等有关计算机互联网规定和知识产权的法律和法规、实施办法。<br/>
                4.2 用户承诺对其上传于本站的所有信息均已经得到相关权利人的合法授权；如用户违反本条规定造成本站被第三人索赔的，用户应全额补偿本站一切费用(包括但不限于各种赔偿费、诉讼代理费及为此支出的其它合理费用)；<br/>
                4.3 当第三方认为用户上传于本站的信息侵犯其权利，并根据《信息网络传播权保护条例》或者相关法律规定向本站发送权利通知书时，用户同意本站可以自行判断决定删除涉嫌侵权信息，除非用户提交书面证据材料排除侵权的可能性，本站将不会自动恢复上述删除的信息；<br/>
                4.4
                (1)不得为任何非法目的而使用网络服务系统；<br/>
                (2)遵守所有与网络服务有关的网络协议、规定和程序；<br/>
                (3)不得利用本站进行任何可能对互联网的正常运转造成不利影响的行为；<br/>
                (4)不得利用本站进行任何不利于本站的行为。<br/>
                4.5 如用户在使用网络服务时违反上述任何规定，本站有权要求用户改正或直接采取一切必要的措施(包括但不限于封停用户、暂停或终止用户使用服务的权利)以减轻用户不当行为而造成的影响。<br/>
                五、隐私保护<br/>
                5.1 本站不对外公开或向第三方提供单个用户的注册资料及用户在使用网络服务时存储在本站的非公开内容，但下列情况除外：<br/>
                (1)事先获得用户的明确授权；<br/>
                (2)根据有关的法律法规要求；<br/>
                (3)按照相关政府主管部门的要求；<br/>
                (4)为维护社会公众的利益。<br/>
                5.2 本站可能会与第三方合作向用户提供相关的网络服务，在此情况下，如该第三方同意承担与本站同等的保护用户隐私的责任，则本站有权将用户的注册资料等提供给该第三方。<br/>
                5.3 在不透露单个用户隐私资料的前提下，本站有权对整个用户数据库进行分析统计及利用。<br/>
                六、版权声明<br/>
                6.1 本站的文字、图片、音频、视频等版权均归财联邦管理有限公司享有或与作者共同享有，未经本站许可，不得任意复制传播或转载。<br/>
                6.2 本站特有的标识、版面设计、编排方式等版权均属财联邦科技有限公司享有，未经本站许可，不得任意复制或转载。<br/>
                6.3 未经本站同意，不得对本站内部任何内容包括且不限于图片、文档、链接、通知等信息做任何形式的公开传播，一经发现，相关用户须承担一切相关法律责任。<br/>
                6.4 恶意转载本站内容的，本站保留将其诉诸法律的权利。<br/>
                七、责任声明<br/>
                7.1 用户明确同意其使用本站网络服务所存在的风险及一切后果将完全由用户本人承担，本站对此不承担任何责任。<br/>
                7.2 本站无法保证网络服务一定能满足用户的要求，也不保证网络服务的及时性、安全性、准确性。<br/>
                7.3 本站不保证为方便用户而设置的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由本站实际控制的任何网页上的内容，本站不承担任何责任。<br/>
                7.4 对于因不可抗力或本站不能控制的原因造成的网络服务中断或其它缺陷，本站不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。<br/>
                7.5 对于站向用户提供的下列产品或者服务的质量缺陷本身及其引发的任何损失，本站无需承担任何责任：<br/>
                (1)本站向用户免费提供的各项网络及业务支持服务；<br/>
                (2)本站向用户赠送的任何产品或者线下服务。<br/>
                7.6 本站有权于任何时间暂时或永久修改或终止本服务(或其任何部分)，而无论其通知与否，本站对用户和任何第三人均无需承担任何责任。<br/>
                八、附则<br/>
                8.1 本协议的订立、执行和解释及争议的解决均应适用香港特别行政区法律。<br/>
                8.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。<br/>
                8.3 本协议解释权及修订权归财联邦管理有限公司所有。<br/>
              </div>
              <FormItem className={styles.button_sty}
                        {...formItemLayout}
              >
                {getFieldDecorator('complete', {
                })(
                  <Button type='default' style={{ width:'205px',height:'40px'}} onClick={this.handleCancel.bind(this)}>同意并继续
                  </Button>
                )}
              </FormItem>

            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}


Register = Form.create()(Register)

export default Register;
