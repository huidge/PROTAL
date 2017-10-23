/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import ProductionCompareRadar from './ProductionCompareRadar';
import ProductionCompareTable from './ProductionCompareTable';
import { Row, Col, Button, Table } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { getPublicCode } from '../../services/code';
import QRCode from 'qrcode.react';
import { stringify } from 'qs';
import { generateShortUrl } from '../../services/production';
import fetch from 'dva/fetch';

class ProductionCompare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compareInfo: JSON.parse(localStorage.compareInfo),
      shortUrl: '财联邦',
      //快码值
      codeList: {
        genderList: [],
        payMethodList: [],
        currencyList: [],
        nationList: [],
      }
    };
  }
  componentWillMount() {
    //获取快码值
    const codeBody = {
      genderList: 'HR.EMPLOYEE_GENDER',
      payMethodList: 'CMN.PAY_METHOD',
      currencyList: 'PUB.CURRENCY',
      nationList: 'PUB.NATION',
    };
    getPublicCode(codeBody).then((data)=>{
      if (this.state.compareInfo.minClass != 'GD') {
        data.payMethodList.map((code) => {
          if (this.state.compareInfo.itemList[0].paymentMethod == code.value) {
            this.state.compareInfo.itemList[0].paymentMethodMeaning = code.meaning;
          }
          if (this.state.compareInfo.itemList[1].paymentMethod == code.value) {
            this.state.compareInfo.itemList[1].paymentMethodMeaning = code.meaning;
          }
          if (this.state.compareInfo.itemList[2] && this.state.compareInfo.itemList[2].paymentMethod == code.value) {
            this.state.compareInfo.itemList[2].paymentMethodMeaning = code.meaning;
          }
        });
      }
      this.setState({
        compareInfo: this.state.compareInfo,
        codeList: data
      })
    });
    const compareInfo = {
      minClass: this.state.compareInfo.minClass,
      accessToken: localStorage.access_token,
      itemList: this.state.compareInfo.itemList,
    };
    const urlBody = {
      'longUrl': 'http://melting-ice.com:8081/#/production/compareShare/'+stringify(compareInfo),
    };
    generateShortUrl(urlBody).then((urlData) => {
      if (urlData.success) {
        this.setState({
          shortUrl: urlData.message
        });
      } else {
        document.getElementById('qrcode').style.display = 'none';
      }
    });
  }
  /*雷达图和对比表切换*/
  showDisplay(name) {
    if (name == 'table') {
      document.getElementById("compareRadar").style.display = 'none';
      document.getElementsByName("compareBtn")[1].className = 'ant-btn ant-btn-default';
      document.getElementById("compareTable").style.display = 'block';
      document.getElementsByName("compareBtn")[0].className = 'ant-btn ant-btn-primary';
    } else if (name == 'radar') {
      document.getElementById("compareTable").style.display = 'none';
      document.getElementsByName("compareBtn")[0].className = 'ant-btn ant-btn-default';
      document.getElementById("compareRadar").style.display = 'block';
      document.getElementsByName("compareBtn")[1].className = 'ant-btn ant-btn-primary';
    }
  };
  componentDidMount() {
    document.getElementById("compareTable").style.display = 'none';
    document.getElementsByName("compareBtn")[0].className = 'ant-btn ant-btn-default';
    document.getElementById("compareRadar").style.display = 'block';
    document.getElementsByName("compareBtn")[1].className = 'ant-btn ant-btn-primary';
  }
  render() {
    let columns = [{
      title: '投保对象',
      width: '25%',
      render: (text, record, index) => {
        var gender = '';
        for (var i=0; i<this.state.codeList.genderList.length; i++) {
          if (this.state.codeList.genderList[i].value == record.gender) {
            gender = this.state.codeList.genderList[i].meaning;
          }
        }
        if (record.smokeFlag == 'Y') {
          return (
            <span>
              {record.age}岁{gender}性，吸烟
            </span>
          )
        } else {
          return (
            <span>
              {record.age}岁{gender}性，不吸烟
            </span>
          )
        }
      }
    }];
    let dataSource = [{
      key: 1,
      age: this.state.compareInfo.itemList[0].age,
      gender: this.state.compareInfo.itemList[0].gender,
      smokeFlag: this.state.compareInfo.itemList[0].smokeFlag,
      currency: this.state.compareInfo.itemList[0].currency,
    }];
    if (this.state.compareInfo.minClass == 'GD') {
      columns.push({
        title: '居住地',
        dataIndex: 'livingCity',
        width: '25%',
        render: (text, record, index) => {
          return this.state.codeList.nationList.map((code) => {
            if (text == code.value)
            return code.meaning;
          });
        }
      },{
        title: '币种',
        dataIndex: 'currency',
        width: '25%',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.currencyList.length; i++) {
            if (this.state.codeList.currencyList[i].value == text) {
              return this.state.codeList.currencyList[i].meaning;
            }
          }
          return text||'';
        }
      });
      dataSource[0].livingCity = this.state.compareInfo.itemList[0].livingCity;
    } else {
      columns.push({
        title: '保险金额',
        dataIndex: 'coverage',
        width: '25%',
        render: (text, record, index) => {
          if (text) {
            var currency = '';
            for (var i=0; i<this.state.codeList.currencyList.length; i++) {
              if (this.state.codeList.currencyList[i].value == record.currency) {
                currency = this.state.codeList.currencyList[i].meaning;
              }
            }
            return text + " " +currency;
          } else {
            return "-";
          }
        }
      });
      dataSource[0].coverage = this.state.compareInfo.itemList[0].coverage;
    }
    return (
      <div className={styles.product}>
        {
          this.props.infoDisplay == "none" ?
            <Row style={{paddingTop:'28px',paddingLeft:'12px',paddingRight:'12px'}}>
              <Button name="compareBtn" type="primary" onClick={this.showDisplay.bind(this, 'table')} style={{float:'right'}}>对比表</Button>
              <Button name="compareBtn" type="primary" onClick={this.showDisplay.bind(this, 'radar')} style={{float:'right'}}>雷达图</Button>
            </Row>
            :
            <Row id="info" style={{borderBottom: '12px solid #efefef'}}>
              <Row style={{paddingTop:'28px',paddingLeft:'12px',paddingRight:'12px'}}>
                <span className={commonStyles.iconL}></span>
                <span className={commonStyles.iconR}>投保信息</span>
                <Button name="compareBtn" type="primary" onClick={this.showDisplay.bind(this, 'table')} style={{float:'right'}}>对比表</Button>
                <Button name="compareBtn" type="primary" onClick={this.showDisplay.bind(this, 'radar')} style={{float:'right'}}>雷达图</Button>
              </Row>
              <Row style={{margin: '28px 12px'}}>
                <Table rowKey="key" columns={columns} pagination={false} dataSource={dataSource} />
              </Row>
            </Row>
        }
        <Row id="compareRadar" style={{display: 'block', padding: '28px 12px'}}>
          <ProductionCompareRadar compareInfo={this.state.compareInfo} />
        </Row>
        <Row id="compareTable" style={{display: 'none', padding: '28px 12px'}}>
          <ProductionCompareTable compareInfo={this.state.compareInfo} />
        </Row>
        <Row id='qrcode' style={{textAlign:'center',paddingBottom:'28px'}}>
          <QRCode value={this.state.shortUrl} />
        </Row>
        {/*<Row id='qrcode' style={{textAlign:'center',paddingBottom:'28px'}}>
          <a id='qrcodeGen' href={'http://pan.baidu.com/share/qrcode?w=150&h=150&url=http://melting-ice.com:8081/#/production/compareShare/'+stringify(this.state.compareInfo)} target='qrcodeFrame'></a>
          <iframe id='qrcodeFrame' name="qrcodeFrame" style={{border:0,}}></iframe>
        </Row>*/}
      </div>
    );
  }
}

export default (ProductionCompare);
