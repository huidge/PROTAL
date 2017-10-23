import React from 'react';
import { Menu, Row, Col, Icon } from 'antd';
import Logo from '../../styles/images/homePage/logo.png';

function MainHeaders({ location , title}){
  return (
    <div>
      <div style={{paddingTop:'1%',paddingBottom:'1%',width:'1200px',margin:'0 auto',height:'90px'}}>
        <Col >
          <img src={Logo} alt="财联邦" style={{cursor:'pointer'}} onClick={()=>window.location.hash= '/#/'} />
          <span style={{color:' #d1b97f', fontSize: '26px',verticalAlign: 'middle',marginLeft: '10px'}}>财联邦</span>
          <span style={{cursor:'pointer',fontSize:'23px',color:'#d1b97f',float:'right',marginTop:'2%',}} rel="noopener noreferrer">
           {title}
          </span>

        </Col>
      </div>
    </div>
  );
}

export default MainHeaders;
