import React  , { Component } from 'react';
import {Row, Col } from 'antd';
import bx from '../../styles/images/bx.png';
import zq from '../../styles/images/zq.png';
import jj from '../../styles/images/jj.png';
import ymtz from '../../styles/images/ymtz.png';
import zzfw from '../../styles/images/zzfw.png';
import ywzy from '../../styles/images/ywzy.png';
import * as styles from '../../styles/sys.css';

class BusinessChoose extends Component {
  constructor(props){
    super(props);
  }

  render() {

    return (
      <div className={styles.table_border}>
        <b className={styles.b_sty} >|</b>
        <font className={styles.title_font2}>选择业务类型</font>
        <div style={{margin:'20px 33px'}}>
          <Row>
            <Col span={9} style={{height:'277px',width:'498px',marginRight:'-23px',zIndex:'2'}}><img src={bx} alt="" style={{width:'100%',height:'100%'}}/><span style={{left:'150px'}} className={styles.font_div} onClick={()=>location.hash= '/order/insurance/000'}>保险</span></Col>
            <Col span={8} style={{height:'277px',width:'318px',zIndex:'1',marginLeft:'-10px',marginRight:'-10px',}}><img src={zq} alt="" style={{width:'100%'}}/><div style={{left:'60px'}} className={styles.font_div}><span onClick={()=>location.hash= '/production/subscribe/ZQ/ZQ/ZQ'}>债券</span></div></Col>
            <Col span={7} style={{height:'277px',width:'317px',marginLeft:'-10px',marginRight:'-2px',}}><img src={jj} alt="" style={{width:'100%',height:'100%'}}/><div style={{left:'60px'}} className={styles.font_div}>基金</div></Col>
          </Row>
          <Row>
            <Col span={8} style={{height:'274px',width:'389px',marginRight:'-27px',zIndex:'2'}}><img src={ymtz} alt="" style={{width:'100%',height:'100%'}}/><div style={{left:'70px'}} className={styles.font_div2}><span onClick={()=>location.hash= '/production/subscribe/DC/DC/DC'}>移民投资</span></div></Col>
            <Col span={7} style={{height:'274px',width:'370px',marginRight:'-27px',zIndex:'1'}}><img src={zzfw} alt="" style={{width:'100%',height:'100%'}}/><div style={{left:'47px'}} className={styles.font_div2}><span onClick={()=>location.hash= '/production/list/FW'}>增值服务</span></div></Col>
            <Col span={9} style={{height:'274px',width:'389px',marginLeft:'-10px'}}><img src={ywzy} alt="" style={{width:'100%',height:'100%'}}/><div style={{left:'75px'}} className={styles.font_div2}><span onClick={()=>location.hash= '/classroom/business'}>业务支援</span></div></Col>
          </Row>
        </div>

      </div>
      );
    }

  }

export default BusinessChoose;
