/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { connect } from 'dva';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/radar';
import { Row, Col, Table, Icon } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionCompareRadar } from '../../services/production';
import TipModal from "../common/modal/Modal";

class ProductionCompareRadar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: ['#5b9ad2','#74ad4f','#ee9867'],
      compareInfo: this.props.compareInfo,
      productCompare: {
        itemList: [],
        scoreList: [],
      },
    };
  }
  componentWillMount() {
    productionCompareRadar(this.state.compareInfo.itemList).then((data) => {
      if (data.success) {
        /**
         * 渲染雷达图
         */
        //产品名称
        var items = [
          data.rows[0].itemList[0].name1,
          data.rows[0].itemList[0].name2,
          data.rows[0].itemList[0].name3
        ];
        //产品属性和数据
        var attrs = [];
        var score1 = [], score2 = [], score3 = [];
        for (var i=0; i<data.rows[0].scoreList.length; i++) {
          attrs.push({name:data.rows[0].scoreList[i].attrName,max:10});
          score1.push(data.rows[0].scoreList[i].detail1);
          score2.push(data.rows[0].scoreList[i].detail2);
          score3.push(data.rows[0].scoreList[i].detail3);
          //最大最小值
          var arr = [data.rows[0].scoreList[i].detail1,
                    data.rows[0].scoreList[i].detail2,
                    data.rows[0].scoreList[i].detail3];
          if (data.rows[0].scoreList[i].compareRule == "MAX") {
            data.rows[0].scoreList[i].max = Math.max(arr);
          } else if (data.rows[0].scoreList[i].compareRule == "MIN") {
            data.rows[0].scoreList[i].min = Math.min(arr);
          }
          if (data.rows[0].scoreList[i].lineList) {
            for (var j=0; j<data.rows[0].scoreList[i].lineList.length; j++) {
              var arrLine = [data.rows[0].scoreList[i].lineList[j].detail1,
                        data.rows[0].scoreList[i].lineList[j].detail2,
                        data.rows[0].scoreList[i].lineList[j].detail3];
              if (data.rows[0].scoreList[i].lineList[j].compareRule == "MAX") {
                data.rows[0].scoreList[i].lineList[j].max = Math.max.apply(Math,arrLine);
              } else if (data.rows[0].scoreList[i].lineList[j].compareRule == "MIN") {
                data.rows[0].scoreList[i].lineList[j].min = Math.min.apply(Math,arrLine);
              }
            }
          }
        }
        const datas = [{
          value: score1,
          name: data.rows[0].itemList[0].name1,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: this.state.color[0],
            }
          }
        },{
          value: score2,
          name: data.rows[0].itemList[0].name2,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: this.state.color[1],
            }
          }
        },{
          value: score3,
          name: data.rows[0].itemList[0].name3,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: this.state.color[2],
            }
          }
        }];
        /*雷达图数据*/
        const option = {
          tooltip: {},
          textStyle: {
            color: '#000',
          },
          legend: {
            data: items,
          },
          radar: {
            // shape: 'circle',
            indicator: attrs,
            splitArea: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#e6e6e6',
              }
            },
            axisLine: {
              lineStyle: {
                color: '#e6e6e6',
              }
            },
          },
          series: [{
            type: 'radar',
            // areaStyle: {normal: {}},
            data : datas
          }]
        };
        const radar = echarts.init(document.getElementById("radarChart"));
        radar.setOption(option);
        if (this.state.compareInfo.minClass == 'GD') {
          //保障级别/地区
          data.rows[0].itemList.push({
            key: 2,
            attrName: '保障级别',
            name1: this.state.compareInfo.itemList[0].securityLevel,
            name2: this.state.compareInfo.itemList[1].securityLevel,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].securityLevel:null,
          });
          data.rows[0].itemList.push({
            key: 3,
            attrName: '保障地区',
            name1: this.state.compareInfo.itemList[0].securityArea,
            name2: this.state.compareInfo.itemList[1].securityArea,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].securityArea:null,
          });
          //自付选项
          data.rows[0].itemList.push({
            key: 4,
            attrName: '自付选项',
            name1: this.state.compareInfo.itemList[0].selyPay,
            name2: this.state.compareInfo.itemList[1].selyPay,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].selyPay:null,
          });
        } else {
          //缴费年期
          data.rows[0].itemList.push({
            key: 2,
            attrName: '缴费年期',
            name1: this.state.compareInfo.itemList[0].productionAgeLimit,
            name2: this.state.compareInfo.itemList[1].productionAgeLimit,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].productionAgeLimit:null,
          });
          //缴费方式
          data.rows[0].itemList.push({
            key: 3,
            attrName: '缴费方式',
            name1: this.state.compareInfo.itemList[0].paymentMethodMeaning,
            name2: this.state.compareInfo.itemList[1].paymentMethodMeaning,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].paymentMethodMeaning:null,
          });
        }
        //产品名称
        data.rows[0].itemList[0].key = 0;
        //所属公司
        data.rows[0].itemList[1].key = 1;
        data.rows[0].scoreList.map((row, index) => {
          row.key = index;
        });
        this.setState({
          productCompare: data.rows[0]
        });
      } else {
        document.getElementById('compareRadar').style.display = 'none';
        document.getElementById('compareTable').style.display = 'block';
        document.getElementsByName("compareBtn")[0].className = 'ant-btn ant-btn-primary';
        document.getElementsByName('compareBtn')[1].style.display = 'none';
        document.getElementsByName('compareBtn')[1].onClick = ()=>{};
        return;
      }
    });
  }
  render () {
    let columns1 = [{
      dataIndex: 'attrName',
      key: 'attrName',
      className: styles.tableColumnCenter,
      width: '25%'
    },{
      dataIndex: 'name1',
      key: 'name1',
      width: '25%',
      render: (text,record,index) => {
        return <span style={{color:this.state.color[0]}}>{text}</span>;
      }
    },{
      dataIndex: 'name2',
      key: 'name2',
      width: '25%',
      render: (text,record,index) => {
        return <span style={{color:this.state.color[1]}}>{text}</span>;
      }
    }];
    let columns2 = [{
      dataIndex: 'attrName',
      key: 'attrName',
      width: '25%',
      className: styles.tableColumnCenter,
      render: (text, record, index) => {
        return text.replace("#"," - ");
      }
    },{
      dataIndex: 'detail1',
      key: 'detail1',
      width: '25%',
      render: (text,record,index) => {
        if (record.max && record.max == text) {
          return <span style={{color:this.state.color[0]}}>{text} <Icon type="arrow-up" /></span>;
        } else if (record.min && record.min == text) {
          return <span style={{color:this.state.color[0]}}>{text} <Icon type="arrow-down" /></span>;
        }
        return <span style={{color:this.state.color[0]}}>{text||"-"}</span>;
      }
    },{
      dataIndex: 'detail2',
      key: 'detail2',
      width: '25%',
      render: (text,record,index) => {
        if (record.max && record.max == text) {
          return <span style={{color:this.state.color[1]}}>{text} <Icon type="arrow-up" /></span>;
        } else if (record.min && record.min == text) {
          return <span style={{color:this.state.color[1]}}>{text} <Icon type="arrow-down" /></span>;
        }
        return <span style={{color:this.state.color[1]}}>{text||"-"}</span>;
      }
    }];
    if (this.state.compareInfo.itemList.length == 3) {
      columns1.push({
        dataIndex: 'name3',
        key: 'name3',
        width: '25%',
        render: (text,record,index) => {
          return <span style={{color:this.state.color[2]}}>{text}</span>;
        }
      });
      columns2.push({
        dataIndex: 'detail3',
        key: 'detail3',
        width: '25%',
        render: (text,record,index) => {
          if (record.max && record.max == text) {
            return <span style={{color:this.state.color[2]}}>{text} <Icon type="arrow-up" /></span>;
          } else if (record.min && record.min == text) {
            return <span style={{color:this.state.color[2]}}>{text} <Icon type="arrow-down" /></span>;
          }
          return <span style={{color:this.state.color[2]}}>{text||"-"}</span>;
        }
      });
    }
    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row style={{textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold'}}>
            产品比较
          </Row>
          <Row style={{margin: '28px 0px'}}>
            <Table dataSource={this.state.productCompare.itemList}
                   columns={columns1} showHeader={false}
                   pagination={false} rowKey="key" />
          </Row>
          <Row>
            <Col xs={16} sm={16} md={16} lg={16} xl={16} offset={4} id="radarChart" style={{height: '300px'}}>
              雷达图
            </Col>
          </Row>
          <Row>
            <Row>
              <span className={commonStyles.iconL}></span>
              <span className={commonStyles.iconR}>财联邦评分</span>
            </Row>
            <Row style={{margin: '28px 0px'}}>
              <Table dataSource={this.state.productCompare.scoreList}
                     columns={columns2} showHeader={false}
                     pagination={false} rowKey="key" />
            </Row>
          </Row>
          {
            this.state.productCompare.scoreList ?
              this.state.productCompare.scoreList.map((item, index) => {
                for (var i=0; i<item.lineList.length; i++) {
                  item.lineList[i].key = i;
                }
                return (
                  <Row key={index}>
                    <Row>
                      <span className={commonStyles.iconL}></span>
                      <span className={commonStyles.iconR}>{item.attrName}</span>
                    </Row>
                    <Row style={{margin: '28px 0px'}}>
                      <Table dataSource={item.lineList}
                             showHeader={false} columns={columns2}
                             pagination={false} rowKey="key" />
                    </Row>
                  </Row>
                )
              })
              :
              ""
          }
        </Col>
      </Row>
    );
  }
}

export default (ProductionCompareRadar);
