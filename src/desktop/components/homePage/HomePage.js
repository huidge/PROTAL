/*
 * show 首页
 * @author:zhouting
 * @version:20170814
 */
import React from 'react';
import { SectionsContainer, Section } from 'react-fullpage/index';
import CountUp from 'react-countup';
import { zh_tran } from '../common/transferLanguage';
import style from '../../styles/homePage.css';
import logo from '../../styles/images/homePage/logo.png';
import img7 from '../../styles/images/homePage/img7.png';
import img8 from '../../styles/images/homePage/img8.png';
import img9 from '../../styles/images/homePage/img9.png';
import icon1 from '../../styles/images/homePage/icon1.png';
import icon2 from '../../styles/images/homePage/icon2.png';
import icon3 from '../../styles/images/homePage/icon3.png';
import icon4 from '../../styles/images/homePage/icon4.png';
import icon5 from '../../styles/images/homePage/icon5.png';
import icon6 from '../../styles/images/homePage/icon6.png';
import icon10 from '../../styles/images/homePage/icon10.png';
import icon11 from '../../styles/images/homePage/icon11.png';
import icon12 from '../../styles/images/homePage/icon12.png';
import icon13 from '../../styles/images/homePage/icon13.png';
import icon14 from '../../styles/images/homePage/icon14.png';
import icon17 from '../../styles/images/homePage/icon17.png';
import {query} from '../../services/seo';
class homePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        }
    }
    componentDidMount() {
        query().then((data) => {
            if(data.success){
                document.title = data.rows[0].siteTitle;
                document.getElementsByTagName('meta')['keywords'].content = data.rows[0].siteKeywords;
                document.getElementsByTagName('meta')['description'].content = data.rows[0].siteDescription;
            } else {
                message.warn(data.message);
                return;
            }
        })
        document.getElementsByClassName('container')[0].style.padding = 0;
        document.getElementsByClassName('Navigation')[0].style.transform = 'rotate(90deg)';
        for (var i=0; i<5; i++) {
            document.getElementsByClassName('Navigation-Anchor')[i].style.backgroundColor = '#d1b97f';
            document.getElementsByClassName('Navigation-Anchor')[i].href = 'javascript:document.getElementsByClassName("tabNormal")[0].getElementsByTagName("a")['+i+'].click();';
        }
        document.getElementsByClassName('scaleLi')[0].style.height = (window.innerHeight - 270)/2 + "px";
        document.getElementsByClassName('scaleLi')[1].style.height = (window.innerHeight - 270)/2 + "px";
        for(var i=0; i<5; i++){
            if(i/2 != 0 && i/2 != 1 && i/2 != 2){
                document.getElementsByClassName(style.title)[i].style.paddingTop =  (window.innerHeight - 550)/2 + "px";   
            }
        }
        zh_tran('s');
        window.onresize = function() {
          if (document.getElementsByClassName('scaleLi').length > 0) {
            document.getElementsByClassName('scaleLi')[0].style.height = (window.innerHeight - 270)/2 + "px";
            document.getElementsByClassName('scaleLi')[1].style.height = (window.innerHeight - 270)/2 + "px";
          }
          for (var i=0; i<5; i++) {
            if(i/2 != 0 && i/2 != 1 && i/2 != 2){
                document.getElementsByClassName(style.title)[i].style.paddingTop =  (window.innerHeight - 550)/2 + "px";   
            }
          }
        }
    }
    componentWillUnmount() {
        document.getElementsByTagName('body')[0].style.overflow = 'visible';
        window.onresize = null;
    }
    changePage(current) {
        for (var i=0; i<5; i++) {
            document.getElementsByClassName('tabNormal')[0].getElementsByTagName('a')[i].style.color = '#fff';
        }
        document.getElementsByClassName('tabNormal')[0].getElementsByTagName('a')[current].style.color = '#d1b97f';

        this.setState({current});
        if(current == 2){
            for(var i=0;i<3;i++){
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationName='ulAnimation'
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationDuration='6s';
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationTimingFunction='linear';
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationIterationCount='1';
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationName='ulAnimation'
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationDuration='6s';
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationTimingFunction='linear';
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationIterationCount='1';
            }
        }
    }
    render() {
        const options = {
            sectionClassName: 'section',
            anchors: ['','','','',''],
            scrollBar: false,
            navigation: true,
            verticalAlign: false,
            delay:600,
            arrowNavigation: true,
            scrollCallback: (states) => {
                document.getElementsByClassName('tabNormal')[0].getElementsByTagName('a')[states.activeSection].click();
            }
        };
        return(
            <div>
                <div className={style.siteNav}>
                    <div>
                        <img src={logo} alt="" />
                        <span>财联邦</span>
                        <div>
                            <ul className='tabNormal'>
                                <li><a onClick={this.changePage.bind(this, 0)} style={{ color: '#d1b97f', marginLeft: '-16px' }}>首页</a></li>
                                <li><a onClick={this.changePage.bind(this, 1)}>关于我们</a></li>
                                <li><a onClick={this.changePage.bind(this, 2)}>服务支持</a></li>
                                <li><a onClick={this.changePage.bind(this, 3)}>展业平台</a></li>
                                <li><a onClick={this.changePage.bind(this, 4)}>产品覆盖</a></li>
                                <li style={{ marginLeft: '60px' }}>
                                    <a href='/#/login'>
                                        <img src={icon10} style={{ marginRight: '5px' }} />
                                        登录/注册
                                </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={style.container}>
                    <ul className={style.cbSlideshow}>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                    </ul>
                    <SectionsContainer className="container" {...options} activeSection={this.state.current}>
                        <Section className={style.page1}>
                            <div>
                                <div className={style.front}>
                                    <div className={style.title} style={{paddingTop:'200px'}}>
                                        <h1>变革海外资产配置新生态</h1>
                                        <h2 className={style.backLine}>
                                            <span style={{marginRight:'30px'}}></span>
                                            我们为理财师及理财机构，提供全新的海外资产配置服务
                                            <span style={{marginLeft:'30px'}}></span>
                                            </h2>
                                    </div>
                                    <a href='/#/login' className={style.resTop}>立即注册</a>
                                    <ul>
                                        <li>
                                            产生佣金：<span className='num'> <CountUp className="account-balance"
                                                start={0}
                                                end={140275}
                                                useGrouping={true}
                                                separator="," /></span>万元
                                <i></i>
                                        </li>
                                        <li>
                                            交易额突破：<span> <CountUp
                                                start={0} end={1073098}
                                                useGrouping={true}
                                                separator="," /></span>万元
                                <i></i>
                                        </li>
                                        <li>
                                            服务理财师超过：<span> <CountUp
                                                start={0}
                                                end={23067}
                                                useGrouping={true}
                                                separator="," /></span>名
                                </li>
                                    </ul>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page2}>
                            <div>
                                <div className={style.front}>
                                    <div className={style.title}>
                                        <h1>关于我们</h1>
                                        <h2>财联邦依托香港证监会1、2、4、9号牌照，香港保险经纪牌照等合规金融牌照提供服务</h2>
                                    </div>
                                    <div>
                                        <div className={style.about}>
                                            <div style={{ fontSize: '26px' }}>
                                                <p>财联邦是专注海外资产配置行业的服务商，为合作伙伴提供海外资</p>
                                                <p>产配置的一站式解决方案，包括产品供应链服务、自研展业及SaaS平</p>
                                                <p>台、完善的线上线下服务。</p>
                                            </div>
                                            <div>
                                                <ul>
                                                    <li style={{ marginTop: '0', marginLeft: '25px' }}>
                                                        <p>产品</p>
                                                        <p>供应商</p>
                                                        <div>
                                                            <p>银行、证券公司、保险公司</p>
                                                            <p>信托公司、私募基金</p>
                                                        </div>
                                                    </li>
                                                    <li style={{ marginTop: '26px', marginLeft: '-7px' }}>
                                                        财联邦
                                                    <div style={{ marginTop: '65px' }}>
                                                            <p>海外资产配置服务商</p>
                                                        </div>
                                                    </li>
                                                    <li style={{ marginTop: '0', marginLeft: '-5px' }}>
                                                        <p>合作 </p>
                                                        <p>伙伴 </p>
                                                        <div>
                                                            <p>理财师、理财机构互联网金融平台、金融机构</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page3}>
                            <div className={style.info}>
                                <div style={{ height: '100%' }}>
                                    <div className={style.title}>
                                        <h1>合作优势</h1>
                                        <h2>提升海外资产行业对接与转化，协助伙伴创造更佳销售业绩</h2>
                                    </div>
                                    <div className={style.support}>
                                        <ul className="scaleLi">
                                            <li>
                                                <img src={icon1} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>更高收入</span>
                                                <span><span>直签源头供应商，为合作伙伴获取更高收入</span></span>
                                            </li>
                                            <li>
                                                <img src={icon2} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>产品丰富 </span>
                                                <span><span>海量全球优质资产，满足全方位海外资产配置需求</span></span>
                                            </li>
                                            <li>
                                                <img src={icon3} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>培训完善</span>
                                                <span><span>提供线上线下定期培训，提供国际理财师认证服务</span></span>
                                            </li>
                                        </ul>
                                        <ul className="scaleLi">
                                            <li>
                                                <img src={icon4} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>营销转化</span>
                                                <span><span>标准化营销物料输出，提供场地、讲师、活动支持</span></span>
                                            </li>
                                            <li>
                                                <img src={icon5} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>孵化支持 </span>
                                                <span><span>全国省级城市覆盖，支持境外公司注册及牌照申请</span></span>
                                            </li>
                                            <li>
                                                <img src={icon6} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>增值服务</span>
                                                <span><span>提供境外账户协助、高端医疗预约、酒店专车等增值服务</span></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page4}>
                            <div>
                                <div className={style.front}>
                                    <div className={style.title}>
                                        <h1>自研平台</h1>
                                        <h2>财联邦PC端与移动端，提供培训、售前、售中、售后、业绩统计一站式服务</h2>
                                    </div>
                                    <div className={style.selfHelp}>
                                        <img src={img7}/>
                                        <div className={style.det}>
                                            <div>
                                                <span>产品智能对比</span>
                                                <span>投资计划预约</span>
                                            </div>
                                            <div>
                                                <span>客户签单预约</span>
                                                <span>在线服务预约</span>
                                            </div>
                                            <div>
                                                <span>团队成员管理</span>
                                                <span>业绩分析结算</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page5}>
                            <div>
                                <div className={style.frontW}>
                                    <div className={style.title}>
                                        <h1>产品覆盖</h1>
                                        <h2>覆盖全球超过32个国家，筛选超过176种优质海外保险</h2>
                                    </div>
                                    <div className={style.product}>
                                        <img src={icon17}/>
                                        <div>
                                            <ul style={{marginLeft:'-56px'}}>
                                                <li>保险</li>
                                                <li>香港保险</li>
                                                <li>台湾保险</li>
                                                <li>美国保险</li>
                                                <li>离岸保险</li>
                                                <li>新加坡保险</li>
                                            </ul>
                                            <ul style={{marginLeft:'30px'}}>
                                                <li>证券</li>
                                                <li>海外基金</li>
                                                <li>海外证券</li>
                                                <li>智能投顾（ETF)</li>
                                            </ul>
                                            <ul style={{marginLeft:'30px'}}>
                                                <li>房产</li>
                                                <li>泰国房产</li>
                                                <li>澳洲房产</li>
                                                <li>美国房产</li>
                                                <li>英国房产</li>
                                                <li>马来西亚房产</li>
                                            </ul>
                                            <ul style={{marginLeft:'30px'}}>
                                                <li>移民/护照</li>
                                                <li>圣基茨</li>
                                                <li>马耳他</li>
                                                <li>塞浦路斯</li>
                                                <li>多米尼克</li>
                                                <li>圣卢西亚</li>
                                                <li>瓦努阿图</li>
                                            </ul>
                                            <ul style={{marginRight:'-36px' ,float:'right'}}>
                                                <li>至尊服务</li>
                                                <li>全球顶尖医院预约</li>
                                                <li>美国代孕</li>
                                                <li>美国试管婴儿</li>
                                                <li>泰国试管婴儿</li>
                                                <li>赴美生子</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.frontB}>
                                    <ul>
                                        <li><img src={icon12}/>客服热线：0755 - 22933374      00852-38959800</li>
                                        <li><img src={icon13}/>公司地址：  香港尖沙咀海港城永明金融大厦703-4</li>
                                        <li><img src={icon14}/>加盟合作：BD@ff-ftc.hk</li>
                                        <li><img src={icon11}/>招聘邮箱：HR@ff-ftc.hk</li>
                                        <li style={{color:'#9f9f9f'}}>财联邦科技有限公司2017版权所有  粤ICP备14099949号</li>
                                        <li className={style.wx} style={{right:'0px'}}>
                                            <img src={img9} />
                                            <p>客户微信服务号</p>
                                        </li>
                                        <li className={style.wx} style={{right:'130px',marginRight:'25px'}}>
                                            <img src={img8} />
                                            <p>理财师微信服务号</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Section>
                    </SectionsContainer>
                </div>
            </div>
        );
    }
}

export default (homePage);
