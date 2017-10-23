import React from 'react';
import {Table, Icon,Button,Input,Row,Col,Form} from 'antd';
import * as styles from '../../styles/sys.css';
import * as portalStyles from '../../styles/portal.css';
import {noticeUpdate,noticeList} from '../../services/notice';
import {handleTableChange}  from '../../utils/table';
import TipModal from "../common/modal/Modal";

var noticeStyle = portalStyles.noticeListNew;

// export default class AnnouncementSummary extends React.Component {
class AnnouncementSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataList:[],
      pagination: {
      },
      // body:{
      //   bigClassName: "公告",
      // }
    };
  }

  detailBody = {
    title:"",
    releasePosition: "GGL",
    userId:JSON.parse(localStorage.user).userId
  };
  componentWillMount() {
    noticeList(this.detailBody).then((data) => {
        const pagination = this.state.pagination;
        pagination.total = data.total;
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        this.setState({
          loading: true,
          dataList: data.rows,
          pagination
        });
      });
  }

  openDetail(record,e){
      var body = {};
      body.announcementId = record.announcementId;
      body.userId = JSON.parse(localStorage.user).userId;
      body.status = "READ";
      body.sourceCode = "ANNOUNCEMENT";
      body.sourceHeaderId = record.articleId;
      // 文章已读标识
      noticeUpdate(body).then((data) => {
      })
      location.hash = "/classroom/reviewDetail/announcement/"+record.articleId;
  }

  //查询公告
  queryAnnouncement(){
    this.detailBody.title = this.props.form.getFieldValue("itemNameAn");
    noticeList(this.detailBody).then((data) => {
        if (data.success) {
        const pagination = {};
        pagination.current = 1;
        pagination.pagesize = 10;
        pagination.total = data.total;
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        this.setState({
          body: this.detailBody,
          dataList: data.rows,
          pagination
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }


  render() {
    const { getFieldDecorator }=this.props.form;
    const columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 1100,
      render: (text, record, index) => {
        // 读取状态
        if(record.status=="NEW"){
          noticeStyle = portalStyles.noticeListNew;
        }else{
          noticeStyle = portalStyles.noticeListRead;
        }
        return(
          <div style={{textAlign:'left'}}>
            <a className={noticeStyle} href="javascript:;" onClick={this.openDetail.bind(this,record)} >{text}</a>
          </div>
        )
      }
    }, {
      title: '日期',
      dataIndex: 'showDate',
      key: 'showDate',
      width: 100,
      render: (text, record, index) => {
        // 读取状态
        if(record.status=="NEW"){
          noticeStyle = portalStyles.noticeListNew;
        }else{
          noticeStyle = portalStyles.noticeListRead;
        }
        return(
          <a className={noticeStyle} href="javascript:;" onClick={this.openDetail.bind(this,record)}  >{text}</a>
        )
      }
    }];

    return (
      <div className={styles.table_border} style={{width:'100%',marginLeft:'0px',marginRight:'0px',fontSize:'16px'}}>
        <div>
          <b className={styles.b_sty} style={{fontSize:'26px'}}>|</b>
          <font style={{fontSize:'20px'}}>公告汇总</font>
        </div>
        <hr className={styles.hr_line}/>

        <Row style={{clear:'both',padding:'15px 0',width:'100%'}}>
            {/*<div style={{float:'left',width:'120px',height:'40px',lineHeight:'40px',color:'#000'}}>
              <span style={{float:'right'}}>公告关键字：</span>
            </div>*/}
            <Form.Item style={{padding:'0',margin:'0 0 0 10px',width:'545px'}} >
                {getFieldDecorator('itemNameAn',{})(
                    <Input style={{width:'100%'}} placeholder="请输入您想查找的关键字" addonAfter={<a style={{color:'#d1b97f'}} onClick={this.queryAnnouncement.bind(this)}>立即搜索</a>} />
                )}
            </Form.Item>
        </Row>
        
        <Table  columns={columns} dataSource={this.state.dataList} pagination={this.state.pagination} showHeader={false} onChange={handleTableChange.bind(this,noticeList,this.detailBody)}/>
        
      </div>
    )

  }
}
// <a className={`${style['img-container']} ${style.l}`} href={`/classroom/reviewDetail/${row.articleId}`}>
export default Form.create()(AnnouncementSummary);