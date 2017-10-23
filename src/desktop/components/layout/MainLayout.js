import styles from './MainLayout.css';
import { Layout, Spin } from 'antd';
import MainHeaders from "./MainHeaders";

const {  Footer } = Layout;

const MainLayout = ({ children, location , title})=>{
  return (
    <div className={styles.normal}>
      <MainHeaders location={location} title={title || ''}/>
      <Spin spinning={false}>
        <div className={styles.content}>
          <div className={styles.main}>
            {children}
          </div>
        </div>
      </Spin>

      <Footer style={{ marginTop:'15px',textAlign: 'center' ,clear:'both'}}>
        <div style={{fontSize:'14px',fontFamily:'Microsoft YaHei',textAlign: 'center'}} id="test">
          <a className={styles.footer} href="#" rel="nofollow" >联系我们</a>|<a  className={styles.footer} href="#" rel="nofollow"  >加入我们</a>|<a  className={styles.footer} href="#" rel="nofollow"  >免责申明</a>|<a  className={styles.footer} href="#" rel="nofollow"  >意见反馈</a>|<a  className={styles.footer} href="#" rel="nofollow"  >友情链接</a><br />
          <div style={{margin:'15px' }} ><font>Copyright &copy; </font><span>{new Date().getFullYear()}</span> <font>FORTUNE FEDERATION . All Rights Reserved </font></div>
        </div>
      </Footer>
    </div>
  );
}

export default MainLayout;
