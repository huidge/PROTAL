import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import CheckDetail from '../../components/channel/CheckDetail';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/qa.css';

const checkDetail = ({ location,dispatch,channel,params})=>{
  const record = params;
  const itemList = [{
    name: '工作台',
    url: '/#/portal/home'
  },{
    name: '对账单列表',
    url: '/#/channel/check'
  },{
    name: '对账单详情',
    url: `/channel/checkDetail/${record.checkPeriod}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.version}/${record.paymentCompanyName}/${record.receiveCompanyName}`,
  }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <CheckDetail
          dispatch={dispatch}
          channel={channel}
          checkPeriod={params.checkPeriod}
          paymentCompanyType={params.paymentCompanyType}
          receiveCompanyType={params.receiveCompanyType}
          paymentCompanyId={params.paymentCompanyId}
          receiveCompanyId={params.receiveCompanyId}
          paymentCompanyName={params.paymentCompanyName}
          receiveCompanyName={params.receiveCompanyName}
          version={params.version} />
      </div>
    </ProtalLayout>
  );
}

export default connect(({ channel }) => ({ channel }))(checkDetail);
