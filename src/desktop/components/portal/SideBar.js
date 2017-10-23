/*
 * show 侧边栏
 * @author:zhouting
 * @version:20170511
 */
import React from 'react';
import { connect } from 'dva';
import { Input ,BackTop } from 'antd';
import style from '../../styles/portal.css';
import icon10 from '../../styles/images/portal/icon-11.png';
import icon11 from '../../styles/images/portal/icon-12.png';
import icon12 from '../../styles/images/portal/icon-13.png';
import icon13 from '../../styles/images/portal/icon13.png';
import weixin from '../../styles/images/portal/weixinpublic.jpg'

 class side extends React.Component{
   constructor(props){
     super(props);
     //this.state = {}
   }
   handleClick(e){
     var sideR = document.getElementsByClassName(style.sideR);
     function back(){
        document.getElementsByClassName(style.sideL)[0].style.right = '0';
        sideR[0].style.display = "none"
      }
     if (sideR[0].style.display == "none") {
       document.getElementsByClassName(style.sideL)[0].style.right = '292px'
       sideR[0].style.display = "block"
     } else{
       back();
     }
   }
   handelMouseOver(index, e){
     var com = document.getElementsByClassName(style.component);
     com[index].style.backgroundColor="#d1b97f";
     if(index==1){
       com[index].lastChild.style.display='block';
     }
   }
   handelMouseOut(index, e){
     var com = document.getElementsByClassName(style.component);
     com[index].style.backgroundColor='';
     if(index==1){
       com[index].lastChild.style.display='none';
     }
   }
  render(){
    return(
    <div>
        <div style={{float:'left'}} className={style.sideL}>
          <div className={style.component} onMouseOver={this.handelMouseOver.bind(this, 0)} onMouseOut={this.handelMouseOut.bind(this,0)} onClick={()=>{location.hash = '/qaBasic/qaConsult'}}>
            <a href="javascipt:;" style={{marginLeft:'14px',marginTop:'10px',width:'54px',height:'49px'}} ><img src={icon10} /></a>
            <span style={{marginTop:'5px',marginLeft:'15px',fontSize:'12px'}}>在线咨询</span>
          </div>
          <div className={style.component} style={{bottom: '1px'}} onClick={this.handleClick} onMouseOver={this.handelMouseOver.bind(this, 1)} onMouseOut={this.handelMouseOut.bind(this, 1)}>
            <a href="javascipt:;" style={{marginLeft:'19px',marginTop:'12px',width:'43px',height:'42px'}}><img src={icon11} /></a>
            <span style={{marginTop:'65px',marginLeft:'15px',fontSize:'12px'}}>扫码关注</span>
            <div className={style.weixin}><img src={weixin} alt=""/></div>
          </div>
          <BackTop className={style.component} style={{bottom: '2px'}} onMouseOver={this.handelMouseOver.bind(this, 2)} onMouseOut={this.handelMouseOut.bind(this,2)}>
            <div style={{marginLeft:'21px',marginTop:'6px',width:'39px',height:'55px'}}><a href="javascipt:;" ><img src={icon12}/></a></div>
            <span style={{marginTop:'65px',marginLeft:'15px',fontSize:'12px'}}>返回顶部</span>
          </BackTop>

        </div>
        {/*<div style={{float:'right',display:'none'}} className={style.sideR}>
            <div>
              <a href="javascript:;" onClick={this.handleClick.bind(this)} title='收起' className={style.back}><img src={icon13} alt=""/></a>
              <span>意见反馈</span>
            </div>
            <div className={style.type}>
              <p>选择您遇到的问题类型或建议类型</p>
              <div className={style.typeT}>
                <span>预约签单</span>
                <span>理赔</span>
                <span>续保</span>
              </div>
              <div className={style.typeT}>
                <span>预约签单</span>
                <span>理赔</span>
                <span>续保</span>
              </div>
            </div>
            <div>
              <textarea name="" id="" cols="40" rows="11" placeholder='我们将根据您的问题和建议，不断提升体验和服务'></textarea>
            </div>
            <div>
              <Input placeholder='请填写您的联系方式QQ、手机号或微信'></Input>
            </div>
            <div className={style.submit}>提交</div>
        </div>*/}
    </div>
    );
  }
}
export default (side);
