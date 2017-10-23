/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Tabs } from 'antd';
import ProductionListBX from './ProductionListBX';
import ProductionListZQ from './ProductionListZQ';
import ProductionListDC from './ProductionListDC';
import ProductionListFW from './ProductionListFW';

class ProductionListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "1"
    };
  }
  componentWillMount() {
    var key = "1";
    if (this.props.bigClass == 'BX') {
      key = "1";
    } else if (this.props.bigClass == 'ZQ') {
      key = "2";
    } else if (this.props.bigClass == 'JJ') {
      key = "3";
    } else if (this.props.bigClass == 'DC') {
      key = "4";
    } else if (this.props.bigClass == 'FW') {
      key = "5";
    }
    this.setState({key});
  }
  render() {
    return (
      <Tabs style={{padding:"28px 16px"}} defaultActiveKey={this.state.key} type="card">
        <Tabs.TabPane tab={<span onClick={()=>location.hash="/production/list/BX"}>保险</span>} key="1">
          <div>
            <ProductionListBX refresh={this.props.bigClass} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span onClick={()=>location.hash="/production/list/ZQ"}>债券</span>} key="2">
          <div>
            <ProductionListZQ refresh={this.props.bigClass} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span onClick={()=>location.hash="/production/list/JJ"}>基金</span>} key="3">
          <div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span onClick={()=>location.hash="/production/list/DC"}>投资移民</span>} key="4">
          <div>
            <ProductionListDC refresh={this.props.bigClass} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span onClick={()=>location.hash="/production/list/FW"}>增值服务</span>} key="5">
          <div>
            <ProductionListFW refresh={this.props.bigClass} />
          </div>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

export default (ProductionListComponent);
