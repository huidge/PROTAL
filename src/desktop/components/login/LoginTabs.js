import React from 'react';
import {Tabs,} from 'antd';
import * as styles from '../../styles/login.css';
import AFPLogin from "./AFPLogin";
import AdministrationLogin from "./AdministrationLogin";

const TabPane = Tabs.TabPane;

class LoginTabs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      key: "1",
      userType:"CHANNEL",
    };
  }

  componentWillMount() {
  }
  changeUserType(key) {

  if(key == 1){
    this.setState({userType:"CHANNEL"})
  }else{
    this.setState({userType:"ADMINISTRATION"})
  }
}




  render() {
    return (
      <div style={{height:'100%'}} className={styles.bg}>
        <div className={styles.login_sty}>
          <div className={styles.login_modal_sty} >
            {/*<div><h2 style={{fontSize:'20px',textAlign:'center',marginTop:'0px',marginBottom:'13px'}}>登录</h2></div>*/}
            <AFPLogin dispatch={this.props.dispatch} userType={this.state.userType} />
            {/* <Tabs defaultActiveKey="1" onChange={this.changeUserType.bind(this)} style={{width:'282px'}} className={styles.logintabs}>
              <TabPane tab="理财师登录" key="1" >
                <AFPLogin dispatch={this.props.dispatch} userType={this.state.userType} />
              </TabPane>
              <TabPane tab="行政登录" key="2" >
                <AdministrationLogin dispatch={this.props.dispatch} userType={this.state.userType}/>
              </TabPane>
            </Tabs> */}
          </div>
        </div>
      </div>
    );
  }
}

export default LoginTabs;
