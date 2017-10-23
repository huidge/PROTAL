import React from 'react';
import {Form, Checkbox, Input, Row, Col, Button, Select, DatePicker, Tooltip, Icon, InputNumber, Cascader, Radio} from 'antd';
import moment from 'moment';
import {round, indexOf} from 'lodash';
import * as styles from '../../../styles/appointment.css';
import CodeOption from '../../common/CodeOption';
import * as codeService from '../../../services/code';
import * as service from '../../../services/order';
import Uploads from "../../common/Upload";
import * as  common from '../../../utils/common';
import Modals from "../../common/modal/Modal";
import CustomerLov from "../../common/CustomerLov";
import { NumbericeInput } from "../../common/Input";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8, offset: 2},
  },
  wrapperCol: {
    xs: {span: 20},
    sm: {span: 8},
  },
};


const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 20,
      offset: 0,
    },
    sm: {
      span: 8,
      offset: 10,
    },
  },
};


let uuidBeneficicry = 3333;

class InsureOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: {},                                 //快码
      options: [],                              //级联
      ordCustomerIdI:'',
      ordCustomerIdA:'',
      insurantCustomer: {},                     //受保人
      appliacntCustomer: {},                    //投保人
      ordBeneficiary: [],                       //受益人
      increaseFlag: false,                      //保费递增
      checkboxP: true,                          //受保人是否与投保人相同 复选框
      disableButton: false,                     //下一步 按钮是否可用
      femaleFlag: true,
      femaleFields:[
        {
          fieldId: 'pregnancyFlag',
          fieldDesc: 'pregnancyDesc',
          fieldId2: 'pregnancyFlagOTHER123456',
          fieldDesc2: 'pregnancyDescOTHER123456',
          content: '您现在是否怀孕？'
        },
        {
          fieldId: 'downTestFlag',
          fieldDesc: 'downTestDesc',
          fieldId2: 'downTestFlagOTHER123456',
          fieldDesc2: 'downTestDescOTHER123456',
          content: '曾否或将接受唐氏综合症的测试？'
        },
        {
          fieldId: 'gynecologyFlag',
          fieldDesc: 'gynecologyDesc',
          fieldId2: 'gynecologyFlagOTHER123456',
          fieldDesc2: 'gynecologyDescOTHER123456',
          content: '您曾否因为妇科问题而看医生，例如：两次经期间之出血、盆腔炎疾病、子宫颈部或乳房异常？'
        },
        {
          fieldId: 'complicationFlag',
          fieldDesc: 'complicationDesc',
          fieldId2: 'complicationFlagOTHER123456',
          fieldDesc2: 'complicationDescOTHER123456',
          content: '在过去十年内，您曾否在怀孕期间患有并发症(例如：宫外孕、弥漫性血管内凝血、糖尿病或高血压等)？'
        },
        {
          fieldId: 'gynecologyOthFlag',
          fieldDesc: 'gynecologyOthDesc',
          fieldId2: 'gynecologyOthFlagOTHER123456',
          fieldDesc2: 'gynecologyOthDescOTHER123456',
          content: '您曾否接受或被建议接受或打算接受乳房X光像、乳房或盆腔超声波检查、子宫颈细胞涂片检查、锥形切片检查或阴道镜检查？'
        },
      ],
      fields: [
        {
          fieldId: 'smokeFlag',
          fieldDesc: 'smokeDesc',
          fieldId2: 'smokeFlagOTHER123456',
          fieldDesc2: 'smokeDescOTHER123456',
          content: '是否吸烟'
        },
        {
          fieldId: 'drinkFlag',
          fieldDesc: 'drinkDesc',
          fieldId2: 'drinkFlagOTHER123456',
          fieldDesc2: 'drinkDescOTHER123456',
          content: '是否饮酒'
        },
        {
          fieldId: 'drugFlag',
          fieldDesc: 'drugDesc',
          fieldId2: 'drugFlagOTHER123456',
          fieldDesc2: 'drugDescOTHER123456',
          content: '您是否服用任何成瘾药物或毒品'
        },
        {
          fieldId: 'dangerousFlag',
          fieldDesc: 'dangerousDesc',
          fieldId2: 'dangerousFlagOTHER123456',
          fieldDesc2: 'dangerousDescOTHER123456',
          content: '您是否出于因工作或娱乐目的，参与或计划参与任何危险性活动？例如潜水、赛车、飞行（以乘客身份搭乘商业性民航客机除外）'
        },
        {
          fieldId: 'abroadFlag',
          fieldDesc: 'abroadDesc',
          fieldId2: 'abroadFlagOTHER123456',
          fieldDesc2: 'abroadDescOTHER123456',
          content: '过去12月内，您是否曾在居住地址以外的国家逗留？'
        },
        {
          fieldId: 'disabilityFlag',
          fieldDesc: 'disabilityDesc',
          fieldId2: 'disabilityFlagOTHER123456',
          fieldDesc2: 'disabilityDescOTHER123456',
          content: '是否有任何缺陷、断肢、先天及/或后天的身体残疾？'
        },
        {
          fieldId: 'spiritFlag',
          fieldDesc: 'spiritDesc',
          fieldId2: 'spiritFlagOTHER123456',
          fieldDesc2: 'spiritDescOTHER123456',
          content: '是否有大脑性麻痹、癫痫、中风、抑郁或其他精神失常？'
        },
        {
          fieldId: 'endocrineFlag',
          fieldDesc: 'endocrineDesc',
          fieldId2: 'endocrineFlagOTHER123456',
          fieldDesc2: 'endocrineDescOTHER123456',
          content: '是否 糖尿病、甲状腺或其他内分泌失调？'
        },
        {
          fieldId: 'faceFlag',
          fieldDesc: 'faceDesc',
          fieldId2: 'faceFlagOTHER123456',
          fieldDesc2: 'faceDescOTHER123456',
          content: '是否有眼睛、鼻子、喉或耳朵之疾病/功能失常？'
        },
        {
          fieldId: 'respirationFlag',
          fieldDesc: 'respirationDesc',
          fieldId2: 'respirationFlagOTHER123456',
          fieldDesc2: 'respirationDescOTHER123456',
          content: '是否有哮喘、肺炎、肺结核或呼吸系统疾病？'
        },
        {
          fieldId: 'threeFlag',
          fieldDesc: 'threeDesc',
          fieldId2: 'threeFlagOTHER123456',
          fieldDesc2: 'threeDescOTHER123456',
          content: '是否有血脂高或高血压？三高症状？'
        },
        {
          fieldId: 'cycleFlag',
          fieldDesc: 'cycleDesc',
          fieldId2: 'cycleFlagOTHER123456',
          fieldDesc2: 'cycleDescOTHER123456',
          content: '是否有胸痛、心悸、心脏血管或循环系统疾病？'
        },
        {
          fieldId: 'digestionFlag',
          fieldDesc: 'digestionDesc',
          fieldId2: 'digestionFlagOTHER123456',
          fieldDesc2: 'digestionDescOTHER123456',
          content: '是否有溃疡、疝气、痔疮、肠胃不适或消化系统疾病？'
        },
        {
          fieldId: 'liverFlag',
          fieldDesc: 'liverDesc',
          fieldId2: 'liverFlagOTHER123456',
          fieldDesc2: 'liverDescOTHER123456',
          content: '是否有肝炎或带菌、胆囊、胆管及其他肝脏之疾病/功能失常？'
        },
        {
          fieldId: 'reproductionFlag',
          fieldDesc: 'reproductionDesc',
          fieldId2: 'reproductionFlagOTHER123456',
          fieldDesc2: 'reproductionDescOTHER123456',
          content: '是否有肾脏、膀胱、前列腺或生殖系统之疾病/功能失常或结石？'
        },
        {
          fieldId: 'jointFlag',
          fieldDesc: 'jointDesc',
          fieldId2: 'jointFlagOTHER123456',
          fieldDesc2: 'jointDescOTHER123456',
          content: '是否有神经炎、关节炎、通风症、脊柱裂、其他肢体关节、脊柱或肌肉骨骼疾病？'
        },
        {
          fieldId: 'tumorFlag',
          fieldDesc: 'tumorDesc',
          fieldId2: 'tumorFlagOTHER123456',
          fieldDesc2: 'tumorDescOTHER123456',
          content: '是否有任何囊肿、肿瘤或癌症？'
        },
        {
          fieldId: 'bloodFlag',
          fieldDesc: 'bloodDesc',
          fieldId2: 'bloodFlagOTHER123456',
          fieldDesc2: 'bloodDescOTHER123456',
          content: '是否有任何种类之贫血症或血友病或其他有关血液之疾病？'
        },
        {
          fieldId: 'aidsFlag',
          fieldDesc: 'aidsDesc',
          fieldId2: 'aidsFlagOTHER123456',
          fieldDesc2: 'aidsDescOTHER123456',
          content: '您曾否接受/想接受爱滋病有关或任何性传染病的医药建议辅导或治疗？'
        },
        {
          fieldId: 'aidsTestFlag',
          fieldDesc: 'aidsTestDesc',
          fieldId2: 'aidsTestFlagOTHER123456',
          fieldDesc2: 'aidsTestDescOTHER123456',
          content: '您曾否接受艾滋病抗体测试？如有，请注明日期及原因。'
        },
        {
          fieldId: 'skinFlag',
          fieldDesc: 'skinDesc',
          fieldId2: 'skinFlagOTHER123456',
          fieldDesc2: 'skinDescOTHER123456',
          content: '过去三个月内有否连续一星期以上出现疲倦、体重下降、腹泻、淋巴肿大或不正常的皮肤破损？'
        },
        {
          fieldId: 'otherFlag',
          fieldDesc: 'otherDesc',
          fieldId2: 'otherFlagOTHER123456',
          fieldDesc2: 'otherDescOTHER123456',
          content: '您是否患有任何上文未有提及的心理或生理疾病、或意外？'
        },
        {
          fieldId: 'otherTreatFlag',
          fieldDesc: 'otherTreatDesc',
          fieldId2: 'otherTreatFlagOTHER123456',
          fieldDesc2: 'otherTreatDescOTHER123456',
          content: '您有否因上述疾病及/或意外而正在接受诊治或药物治疗？'
        },
        {
          fieldId: 'examinationFlag',
          fieldDesc: 'examinationDesc',
          fieldId2: 'examinationFlagOTHER123456',
          fieldDesc2: 'examinationDescOTHER123456',
          content: '在过去五年内您曾否因疾病或不适而接受X光、超声波检查、磁力共振、电脑扫描、细胞组织化验、心电图、血液或小便检查？'
        },
        {
          fieldId: 'hereditaryFlag',
          fieldDesc: 'hereditaryDesc',
          fieldId2: 'hereditaryFlagOTHER123456',
          fieldDesc2: 'hereditaryDescOTHER123456',
          content: '您的父母、兄弟姊妹或子女曾否被诊断患有心脏病、中风、高血压、糖尿病、肝病、肾病、精神病、肿瘤或癌症、唐氏综合症、脊柱裂、系统性红斑狼疮、先天的身体残疾或任何遗传疾病？'
        },
      ],
    };
  }

  componentWillMount() {
    let params = {
      genderList: 'HR.EMPLOYEE_GENDER',
      nationalList: 'PUB.NATION',                             //国籍
      provinceList: 'PUB.PROVICE',                            //省份
      cityList: 'PUB.CITY',                                   //城市
      marryList: 'CTM.MARITAL_STATUS',                        //婚姻状况
      certificateList: 'CTM.CERTIFICATE_TYPE',                //证件类型
      diplomaList: 'PUB.EDUCATION',                          //教育程度 CTM.DIPLOMA_TYPE
      firstPayMethodList: 'ORD.FIRST_PAYMENT_METHOD',         //首期供款付款方式
      renewalPayMethodList: 'ORD.RENEWAL_PAYMENT_METHOD',     //续期供款付款方式
      phoneCodeList:'PUB.PHONE_CODE',                         //电话代码
      relationshipList: 'ORD.RELATIONSHIP',                   //与受保人关系
    };
    codeService.getCode(params).then((data) => {
      const options = common.npcCascade(data);
      this.setState({options: options, code: data,});
    });
    //初始化数据
    const orderId = this.props.orderId;
    let insureance = this.props.insureance || {};

    if(orderId && orderId != '000'){
      //基础信息
      const checkboxP = insureance.sameFlag == 'SELF' ? true : false;
      const increaseFlag = insureance.increaseFlag == 'Y' ? true : false;
      if(insureance.firstPaymentMethod){
        insureance.firstPaymentMethod = insureance.firstPaymentMethod.split(',');
      }
      if(insureance.renewalPaymentMethod){
        insureance.renewalPaymentMethod = insureance.renewalPaymentMethod.split(',');
      }

      //查询客户
      service.getOrdCustomer({orderId: orderId}).then((data)=>{
        if(data.success){
          let customers = data.rows || [], insurantCustomer = {}, appliacntCustomer = {}, ordCustomerIdI = '', ordCustomerIdA = '';

          for(let i in customers){
            customers[i].birthDate=(customers[i].birthDate.substr(0,10))+" 00:00:00";
            if(customers[i].customerType == 'INSURANT'){
              ordCustomerIdI = customers[i].ordCustomerId;      
              insurantCustomer = customers[i];
              insurantCustomer.customerId = insureance.insurantCustomerId;
              insurantCustomer.premiumRate = this.getNumber(insurantCustomer.premiumRate, true) || 0;
            }else if(customers[i].customerType == 'APPLICANT'){
              ordCustomerIdA = customers[i].ordCustomerId;             
              appliacntCustomer = customers[i];
              appliacntCustomer.customerId = insureance.applicantCustomerId;
              appliacntCustomer.premiumRate = this.getNumber(appliacntCustomer.premiumRate, true) || 0;
            }
          }
          this.setState({insurantCustomer:insurantCustomer, appliacntCustomer, ordCustomerIdI, ordCustomerIdA});
        }
      });

      //查受益人
      service.getOrdBeneficiary({orderId: orderId}).then((data)=>{
        if(data.success){
          let ordBeneficiary = data.rows || [];
          for(let i in ordBeneficiary){
            ordBeneficiary[i].__status = 'update';
            ordBeneficiary[i].rate = this.getNumber(ordBeneficiary[i].rate, true) || 0;
          }
          this.setState({ordBeneficiary});
        }
      });

      //查看附件
      service.getOrdFile({orderId: orderId}).then((data)=>{
        if(data.success){
          let files = data.rows || [], fileOther = [];
          for(let i in files){
            if(files[i].fileSeq > 8){
              fileOther.push(files[i]);
            }else{
              const fieldName = 'file'+ files[i].fileSeq;
              const file = [files[i]];
              insureance[fieldName] = common.initFile(file);
            }
          }
          insureance.fileOther = common.initFile(fileOther);
          this.setState({insureance,});
        }
      });

      this.setState({insureance, checkboxP, increaseFlag });

    }else{
      this.setState({insureance});
    }
  }

  //受保人信息中选择客户 LOV
  customerISelect(e){
    let insurantCustomer = e.record;   
    insurantCustomer.premiumRate = this.getNumber(insurantCustomer.premiumRate, true) || 0;
    this.setState({insurantCustomer}, ()=>{
      //let fields = ['idArea', 'mailingArea', 'companyArea'];
      let fields = ['idArea', 'mailingArea'];
      for(let field in e.record){
        fields.push(field);
      }
      this.props.form.resetFields(fields);

      //校验交易路线
      const insureance = this.props.insureance || {};
      let ordAddition =insureance.ordAddition;
      let itemIds = [];
      for(let i in ordAddition ){
        itemIds.push({itemId:ordAddition[i].itemId, sublineItemName: ordAddition[i].sublineItemName });
      }
      const birthDate = e.record.birthDate? moment(e.record.birthDate).format('YYYY-MM-DD') : null;
      const params ={
        channelId: insureance.channelId || JSON.parse(localStorage.user).relatedPartyId,
        birthDate: birthDate,
        currency: insureance.currency || '',
        payMethod: insureance.payMethod || '',
        contributionPeriod: insureance.contributionPeriod,
        itemId: insureance.itemId,
        effectiveDate: insureance.reserveDate || '',
        additionRiskList: itemIds || [],
      }
      service.fetchCommission(params).then((data)=>{
        if(data.success && data.rows.length > 0){
          this.setState({disableButton: false});
        }else{
          this.setState({disableButton: true});
          Modals.error({content:'您选择的产品无转介费率，暂时无法预约，请联系您的上级！'});
          return;
        }
      });
    });
  }

  //投保人信息中选择客户 LOV
  customerASelect(e){
    let appliacntCustomer = e.record;
    appliacntCustomer.premiumRate = this.getNumber(appliacntCustomer.premiumRate, true) || 0;
    this.setState({ appliacntCustomer },()=>{
      let fields = ['idAreaOTHER123456', 'mailingAreaOTHER123456', 'companyAreaOTHER123456'];
      for(let field in e.record){
        fields.push(field+'OTHER123456');
      }
      this.props.form.resetFields(fields);
    });
  }

  //获取百分比的数据
  getNumber(number, flag){
    if(number && !isNaN(number)){
      if(flag){
        if(number <= 1)
          number = number * 100;
        number = round(number, 2);
      }else{
        number = number/100;
        number = round(number, 4);
      }
      return number;
    }
    return null;
  }


  //保存按钮
  saveInfo(){
    let insureance = this.beforeSubmit();

    //如果是新增
    if(!this.props.orderId || this.props.orderId == '000'){
      insureance.channelCommissionLineId = '';
      insureance.signSupplierId = '';
      insureance.status = 'UNSUBMITTED';
      insureance.orderType = 'INSURANCE';
      insureance.__status =  'add';
    }else if(this.props.orderId && this.props.orderId != '000'){
      if(insureance.dealPath){
        insureance.status = 'DATA_APPROVING';
        insureance.hisStatus = 'DATA_APPROVING';                      //日志状态
        insureance.hisDesc = '预约资料审核中，请耐心等待';              //日志描述
      }
      insureance.__status =  'update';
    }
    insureance.ordCustomer = insureance.customers || [];

    service.submitOrder([insureance]).then((data) => {
      if(data.success){

        Modals.success({content:'保存成功',url:'/order/summary', closable:false, count:2});

        //2、提交客户信息
        // let customers = insureance.customers || [];
        // for(let i in customers){
        //   customers[i].orderId = data.rows[0].orderId;
        // }
        // service.submitOrdCustomer(customers).then((data) => {
        //   if(data.success){
        //     Modals.success({content:'保存成功', url:'/order/summary'});
        //   }else{
        //     Modals.error({content:'保存失败，请联系系统管理员'});
        //     return;
        //   }
        // });
      }else{
        Modals.error({content:'保存失败，请联系系统管理员'});
        return;
      }
    });
  }


  //提交至行政 按钮
  submitInfo(){
    this.props.form.validateFields((err, value) => {
      if (!err) {

        let insureance = this.beforeSubmit();

        //如果是新增
        if (!this.props.orderId || this.props.orderId == '000') {
          insureance.channelCommissionLineId = '';
          insureance.signSupplierId = '';
          insureance.status = 'UNSUBMITTED';
          insureance.orderType = 'INSURANCE';
          insureance.__status = 'add';
        } else if (this.props.orderId && this.props.orderId != '000') {
          if (insureance.dealPath) {
            if(insureance.status=="NEED_REVIEW"){//保单状态为需复查时，才可以更新状态为预审中
              insureance.status = 'DATA_APPROVING';
              insureance.hisStatus = 'DATA_APPROVING';                      //日志状态
              insureance.hisDesc = '预约资料审核中，请耐心等待';              //日志描述
              insureance.__status = 'update';
            }else{
              insureance.status=insureance.status;
            }
          }
        }
        insureance.ordCustomer = insureance.customers || [];

        service.submitOrder([insureance]).then((data) => {
          if (data.success) {
            Modals.success({content: '您的预约已提交成功，行政会及时处理！', url: '/order/summary', closable:false, count:2});
          } else {
            Modals.error({content: '保存失败，请联系系统管理员'});
            return;
          }
        });
      }else{
        Modals.error({content:'请先填写完必填信息'});
        return;
      }
    });
  }


  //下一步
  clickNext() {
    this.props.form.validateFields((err, value) => {
      if (!err) {

        const insureance = this.props.insureance || {};
        let ordAddition =insureance.ordAddition;
        let itemIds = [];
        for(let i in ordAddition ){
          itemIds.push({itemId:ordAddition[i].itemId, sublineItemName: ordAddition[i].sublineItemName });
        }
        const birthDate = moment(value.birthDate).format('YYYY-MM-DD');
        const params ={
          channelId: insureance.channelId || JSON.parse(localStorage.user).relatedPartyId,
          birthDate: birthDate,
          prdSupplierId: insureance.productSupplierId,
          currency: insureance.currency || '',
          payMethod: insureance.payMethod || '',
          contributionPeriod: insureance.contributionPeriod,
          itemId: insureance.itemId,
          effectiveDate: insureance.reserveDate || '',
          additionRiskList: itemIds || [],
          ReservationRemarks:insureance.description
        }
        // console.log(params.ReservationRemarks);
        service.fetchCommission(params).then((data)=>{
          if(data.success && data.rows.length > 0){
            let insureance = this.beforeSubmit();
            this.props.goNext('SUPPILER', insureance);
          }else{
            this.setState({disableButton: true});
            Modals.error({content:'您选择的产品无转介费率，暂时无法预约，请联系您的上级！'});
            return;
          }
        });

        // let insureance = this.beforeSubmit();
        // this.props.goNext('SUPPILER', insureance);
      }else{
        Modals.error({content:'请先填写完必填信息'});
        return;
      }
    });
  }

  //提交或保存之前的数据收集
  beforeSubmit(){

    //如果 localStorage 中已经缓存了数据，则取出数据
    let insureance = this.props.insureance || {};

    //取出当 前界面表单 的所有数据
    const values = this.props.form.getFieldsValue();

    //基本信息
    // insureance.channelId = this.state.insureance.channelId || JSON.parse(localStorage.user).relatedPartyId || '';
    insureance.hkContactPerson = values.hkContactPerson || '';
    insureance.hkContactPhoneCode = values.hkContactCode || '';                 //赴港联系电话 代码
    insureance.hkContactPhone = values.hkContactPhone || '';                    //赴港联系电话
    insureance.description = values.description || '';                   //赴港联系电话
    // insureance.description = values.description || '';                   //预约备注
    //console.log(insureance.description);                                        //打印预约备注
    insureance.submitDate = moment().format('YYYY-MM-DD HH:mm:ss');             //提交日期

    insureance.backFlag = values.backFlag;                   //与投保人之关系
    insureance.backDate = values.backDate? moment(values.backDate).format('YYYY-MM-DD') : '';   //回溯日期
    insureance.sameFlag = values.sameFlag;                    //与投保人之关系

    insureance.increaseFlag = this.state.increaseFlag ? 'Y' : 'N';

    insureance.firstPaymentMethod = values.firstPaymentMethod ? values.firstPaymentMethod.join(",") : '';
    insureance.renewalPaymentMethod = values.renewalPaymentMethod ? values.renewalPaymentMethod.join(",") : '';
    insureance.renewalOther = values.renewalOther || '';

    //获取附件
    insureance.fileIds = this.getFileIds() || [];

    //获取受益人
    insureance.ordBeneficiary = this.getBeneficiary() || [];

    //获取客户，放到一个数组
    insureance.customers = this.getOrderCustomer() || [];

    if(this.props.orderId && this.props.orderId !='000'){
      insureance.customers[0].ordCustomerId = this.state.ordCustomerIdI || '';
      insureance.customers[1].ordCustomerId = this.state.ordCustomerIdA || '';

      //申请书状态是“已寄出”、“已誊抄无需邮寄”、“已誊抄需邮寄”、“已收到”时,修改了订单内容，申请书状态变成“有更改”
      let bookStatus = ['MAILED', 'TRANSCRIBED_NONEED_MAIL', 'TRANSCRIBED_NEED_MAIL', 'RECEIPTED'];
      if(indexOf(bookStatus, insureance.applicationStatus) >= 0){
        insureance.applicationStatus = 'CHANGED';
      }
    }

    insureance.customers[0].coverType = 'F';
    insureance.customers[1].coverType = 'F';
    insureance.insurantCustomerId = insureance.customers[0].customerId;
    insureance.applicantCustomerId = insureance.customers[1].customerId;

    if(!insureance.customers[0].chineseName){
      insureance.customers = [];
    }else if(insureance.customers.length > 0 && (!insureance.customers[1].chineseName) ){
      insureance.customers = [insureance.customers[0]]
    }
    // localStorage.insureance = JSON.stringify(insureance);
    return insureance;
  }

  //获取受益人信息
  getBeneficiary() {
    let ordBeneficiary = this.state.ordBeneficiary || [];
    ordBeneficiary.map((item, index) => {
      //格式化 比例
      if(item.rate && !isNaN(item.rate)){
        item.rate = parseFloat(item.rate/100).toFixed(4);
      }

      //英文名字转大写
      if(item.englishName){
        item.englishName = item.englishName.toUpperCase();
      }
    });

    return ordBeneficiary;
  }

  //获取投保人和受保人 信息
  getOrderCustomer() {
    //有 OTHER123456 的是 投保人  customerI:受保人  customerA：投保人
    let values = this.props.form.getFieldsValue() || {}, customerI = {}, customerA = {};

    for (let field in values) {

      //投保人
      if (field.indexOf('OTHER123456') >= 0) {
        let fieldReal = field.replace('OTHER123456', '');
        customerA[fieldReal] = values[field];
        if(fieldReal == 'idArea'){
          const idArea = values[field];
          customerA.identityNation = idArea.length > 0 ? idArea[0] : null;
          customerA.identityProvince = idArea.length > 1 ? idArea[1] : null;
          customerA.identityCity = idArea.length > 2 ? idArea[2] : null;
        }

        if(fieldReal == 'mailingArea'){
          const mailingArea = values[field];
          customerA.postNation = mailingArea.length > 0 ? mailingArea[0] : null;
          customerA.postProvince = mailingArea.length > 1 ? mailingArea[1] : null;
          customerA.postCity = mailingArea.length > 2 ? mailingArea[2] : null;
        }

        // if(fieldReal == 'companyArea'){
        //   const companyArea = values[field];
        //   customerA.companyNation = companyArea.length > 0 ? companyArea[0] : null;
        //   customerA.companyProvince = companyArea.length > 1 ? companyArea[1] : null;
        //   customerA.companyCity = companyArea.length > 2 ? companyArea[2] : null;
        // }

        if(fieldReal == 'premiumRate' && values[field] && !isNaN(values[field]) ){
          customerA.premiumRate = parseFloat(values[field]/100).toFixed(4);
        }

        if(fieldReal == 'englishName' && values[field] ){
          customerA.englishName = values[field].toUpperCase();
        }

        if(fieldReal == 'identityNumber'){
          if (!(values[field].length < 18)) {
            var day = values[field].substr(6, 8);
            var y = day.substr(0, 4);
            var m = day.substr(4, 2);
            var d = day.substr(6, 2);
            d = parseInt(d);
            var bD = y + "-" + m + "-" + d;
            customerA.birthDate = moment(bD).format('YYYY-MM-DD');//出生日期
          } else {
            customerA.birthDate = moment(values.birthDateOTHER123456).format('YYYY-MM-DD');  //出生日期
          }
        }
       
        // customerA.identityEffectiveDate =moment(values.identityEffectiveDateOTHER123456).format('YYYY-MM-DD');  //身份证有效期
        // customerA.certificateEffectiveDate =moment(values.certificateEffectiveDateOTHER123456).format('YYYY-MM-DD');  //证件有效期
        customerA.badEffactiveDate =moment(values.badEffactiveDateOTHER123456).format('YYYY-MM-DD');  //证件有效期

        customerA.phoneCode = values.codeOTHER123456;

        //受保人
      }else{
        customerI[field] = values[field];

        if(field == 'idArea'){
          const idArea = values[field];
          customerI.identityNation = idArea.length > 0 ? idArea[0] : null;
          customerI.identityProvince = idArea.length > 1 ? idArea[1] : null;
          customerI.identityCity = idArea.length > 2 ? idArea[2] : null;
        }
        if(field == 'mailingArea'){
          const mailingArea = values[field];
          customerI.postNation = mailingArea.length > 0 ? mailingArea[0] : null;
          customerI.postProvince = mailingArea.length > 1 ? mailingArea[1] : null;
          customerI.postCity = mailingArea.length > 2 ? mailingArea[2] : null;
        }
        // if(field == 'companyArea'){
        //   const companyArea = values[field];
        //   customerI.companyNation = companyArea.length > 0 ? companyArea[0] : null;
        //   customerI.companyProvince = companyArea.length > 1 ? companyArea[1] : null;
        //   customerI.companyCity = companyArea.length > 2 ? companyArea[2] : null;
        // }

        if(field == 'premiumRate' && values[field] && !isNaN(values[field]) ){
          customerI.premiumRate = parseFloat(values[field]/100).toFixed(4);
        }

        if(field == 'englishName' && values[field] ){
          customerI.englishName = values[field].toUpperCase();
        }
        
        if (!(values.identityNumber.length < 18)) {
          var day = values.identityNumber.substr(6, 8);
          var y = day.substr(0, 4);
          var m = day.substr(4, 2);
          var d = day.substr(6, 2);
          d = parseInt(d);
          var bD = y + "-" + m + "-" + d;

          customerI.birthDate = moment(bD).format('YYYY-MM-DD');//出生日期更改------
        } else {
          customerI.birthDate = moment(values.birthDate).format('YYYY-MM-DD');  //出生日期
        }
        

        // customerI.identityEffectiveDate =moment(values.identityEffectiveDate).format('YYYY-MM-DD');  //身份证有效期
        // customerI.certificateEffectiveDate =moment(values.certificateEffectiveDate).format('YYYY-MM-DD');  //证件有效期
        customerI.badEffactiveDate =moment(values.badEffactiveDate).format('YYYY-MM-DD');  //证件有效期

        customerI.phoneCode = values.code;
      }
    }


    let result = [];
    //如果同一人
    if(this.state.checkboxP){
      for(let field in customerI){
        customerA[field] = customerI[field];
      }

      customerI.customerType = 'INSURANT';
      customerI.__status = this.props.orderId == '000' ? 'add': 'update';
      customerI.customerId = customerI.chineseName ? customerI.chineseName.value : '';
      customerI.chineseName = customerI.chineseName ? customerI.chineseName.meaning : '';


      customerA.customerType = 'APPLICANT';
      customerA.__status = this.props.orderId == '000' ? 'add': 'update';
      customerA.customerId = customerA.chineseName ? customerA.chineseName.value : '';
      customerA.chineseName =  customerA.chineseName ? customerA.chineseName.meaning : '';

      result.push(customerI);
      result.push(customerA);

    }else{
      customerI.customerType = 'INSURANT';
      customerI.__status = this.props.orderId == '000' ? 'add': 'update';
      customerI.customerId = customerI.chineseName ? customerI.chineseName.value : '';
      customerI.chineseName = customerI.chineseName ? customerI.chineseName.meaning : '';


      customerA.customerType = 'APPLICANT';
      customerA.__status = this.props.orderId == '000' ? 'add': 'update';
      customerA.customerId = customerA.chineseName ? customerA.chineseName.value : '';
      customerA.chineseName =  customerA.chineseName ? customerA.chineseName.meaning : '';

      result.push(customerI);
      result.push(customerA);
    }
    return result;
  }

  //获取附件
  getFileIds(){
    const values = this.props.form.getFieldsValue();
    //附件表
    let fileIds = [0];
    fileIds.push(common.formatFile(values.file1 || [], true ));
    fileIds.push(common.formatFile(values.file2 || [], true ));
    fileIds.push(common.formatFile(values.file3 || [], true ));
    fileIds.push(common.formatFile(values.file4 || [], true ));
    fileIds.push(common.formatFile(values.file5 || [], true ));
    fileIds.push(common.formatFile(values.file6 || [], true ));
    fileIds.push(common.formatFile(values.file7 || [], true ));
    fileIds.push(common.formatFile(values.file8 || [], true ));

    let fileOther = common.formatFile(values.fileOther || [], false ) || [];
    fileOther.map((item, index)=>{ fileIds.push(item.fileId); });
    return fileIds;
  }


  //点击单选按钮时触发
  onChange(fieldId, flag, e) {
    //受保人
    if (flag == 'I') {
      let insurantCustomer = this.state.insurantCustomer || {};
      insurantCustomer[fieldId] = e.target.value;
      this.setState({insurantCustomer});

      //投保人
    } else if (flag == 'A') {
      fieldId = fieldId.replace('OTHER123456', '');
      let appliacntCustomer = this.state.appliacntCustomer || {};
      appliacntCustomer[fieldId] = e.target.value;
      this.setState({appliacntCustomer});
    }
  }

  //投保人与受保人相同
  changeCheckbox(e) {

    if(e == 'SELF'){
      this.setState({checkboxP: true}, () => {
        this.props.form.validateFields([
          'identityEffectiveDate',
          'phone',
          'companyName',
          'industry',
          //'companyArea',
          'companyAddress',
          'position',
          'job',
          'income',
          'premiumSource',
          'amountPerMonth',
          'currentAssets',
          'fixedAssets',
          'premiumRate',
          'liabilities',
          'badFlag',
          'compensateFlag',
        ], { force: true });
      });
    }else{
      this.setState({checkboxP: false},()=>{
        this.props.form.validateFields([
          'identityEffectiveDate',
          'phone',
          'companyName',
          'industry',
          //'companyArea',
          'companyAddress',
          'position',
          'job',
          'income',
          'premiumSource',
          'amountPerMonth',
          'currentAssets',
          'fixedAssets',
          'premiumRate',
          'liabilities',
          'badFlag',
          'compensateFlag',
        ], { force: true });
      });
    }


  }

  //递增复选框 onChange 事件
  handleChange(e){
    this.setState({increaseFlag:e.target.checked,});
  }

  //验证手机号-不同电话代码使用不同正则
  checkPhone(rule, value, callback) {
    const phone = rule.field;
    let phoneCode = phone.replace('Phone','Code');

    phoneCode = phoneCode.replace('phone','code');

    phoneCode = this.props.form.getFieldValue(phoneCode);
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( phoneCode ==='00852' || phoneCode ==='00853' ){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(phoneCode ==='00886' ){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }

    if ( value && !regex.test(value)  ) {
      callback(msg);
    } else {
      callback();
    }
  }

  //校验手机号
  clearPhone (value){
    if(value){
      this.props.form.setFieldsValue({hkContactPhone:''}) ;
    }
  }

  //校验 比例
  checkRate(rule, value, callback){
    if(!value && value !== 0){
      if(rule.field == 'premiumRate'){
        if(this.state.checkboxP){
            callback('请输入您每年承担的保费占您个人收入比例');
          }else{
            callback();
          }
        }

        if(rule.field == 'premiumRateOTHER123456'){
          callback('请输入您每年承担的保费占您个人收入比例');
        }

        if(rule.field.indexOf('rate-') >= 0){
           callback('请输入分配比率(总和100%)');
        }

    }else{
      if(rule.field){
        const regex = /^(\d{1,2}(\.\d{1,2})?|100)$/;
        if(!regex.test(value)){
          if(/^[0]+(.[0]{1,100})?$/.test(value)){
            callback();
          }else{
            callback('请输入0-100 以内的数字，保留两位小数');
          }
        }else{
          callback();
        }
      }
    }
  }


  //添加受益人
  beneficicaryCreate() {
    uuidBeneficicry += 1;
    const {form} = this.props;
    const beneficiaryKeys = form.getFieldValue('beneficiaryKeys');
    const nextKeys = beneficiaryKeys.concat(uuidBeneficicry);
    form.setFieldsValue({beneficiaryKeys: nextKeys,});

    let ordBeneficiary = this.state.ordBeneficiary || [];
    ordBeneficiary.push({
      ordBeneficiaryId: '',
      age: '',
      chineseName: '',
      englishName: '',
      identityNumber: '',
      relationship: '',
      rate: '',
      __status: 'add',
    });
    this.setState({ordBeneficiary});
  }

  //删除动态增加的受益人信息
  beneficiaryDelete(k, index){
    const orderId = this.props.orderId, { form } = this.props;
    const beneficiaryKeys = form.getFieldValue('beneficiaryKeys');
    let ordBeneficiary = this.state.ordBeneficiary || [];

    if(!orderId || orderId == '000'){
      if (beneficiaryKeys.length === 0) return;
      ordBeneficiary = ordBeneficiary.filter((item, i) => index != i);
      this.setState({ordBeneficiary});
      form.setFieldsValue({ beneficiaryKeys: beneficiaryKeys.filter(key => key !== k),});
    }else if(orderId || orderId != '000'){
      let realDelete = ordBeneficiary[index];
      if(realDelete.ordBeneficiaryId){
        Modals.warning(this.realDelet.bind(this, k, index, realDelete.ordBeneficiaryId), '确定要删除吗？');
      }else{
        if (beneficiaryKeys.length === 0) return;
        ordBeneficiary = ordBeneficiary.filter((item, i) => index != i);
        this.setState({ordBeneficiary});
        form.setFieldsValue({ beneficiaryKeys: beneficiaryKeys.filter(key => key !== k),});
      }
    }
  }

  //真正的删除数据库中的数据  受益人
  realDelet(k, index, ordBeneficiaryId, flag){
    if(!flag) return;
    if(ordBeneficiaryId){
      service.beneficiaryRemove([{ ordBeneficiaryId }]).then((data)=>{
        if(data.success){
          const { form } = this.props;
          const keys = form.getFieldValue('beneficiaryKeys');
          if (keys.length === 0) return;

          let ordBeneficiary = this.state.ordBeneficiary || [];
          ordBeneficiary = ordBeneficiary.filter((item, i) => index != i);
          this.setState({ordBeneficiary});
          form.setFieldsValue({beneficiaryKeys: keys.filter(key => key !== k),});
        }else{
          Modals.error({content:'删除失败!' + data.message});
        }
      });
    }
  }

  //身份证地址改变
  idAdressChange(fieldName, value){
    if(value){
      const changeV = this.props.form.getFieldValue(fieldName);
      if(changeV && changeV.length <= 0 ){
        this.props.form.setFieldsValue( {[fieldName]: value,} );
      }
    }
  }

  //身份证详细地址 改变
  idAdressDetailChange(fieldName){
    const value = this.props.form.getFieldValue(fieldName);
    if(fieldName == 'identityAddress'){
      const changeV = this.props.form.getFieldValue('postAddress');
      if(!changeV || changeV == ' '){
        this.props.form.setFieldsValue( {postAddress: value,} );
      }
    }else if(fieldName == 'identityAddressOTHER123456'){
      const changeV = this.props.form.getFieldValue('postAddressOTHER123456');
      if(!changeV || changeV == ' '){
        this.props.form.setFieldsValue( {postAddressOTHER123456: value,} );
      }
    }
  }

  //出生日期改变时，校验交易路线
  insurBirthdayCahnge(value){
    if(value){
      const setNumber=(identifyNumber,newDate)=>{
        let arr=[];
        for(var i=0;i<identifyNumber.length;i++){
          arr.push(identifyNumber[i]);
        }
        arr.splice(6,8,newDate);
        arr=arr.join("");
        return arr;
      }
      var newD=moment(value).format('YYYY-MM-DD');
      newD=newD.replace(/-/g,"");
      var cardId=this.props.form.getFieldValue("identityNumber");
      //获取身份证号码，并在更改出生日期的时候更改身份证号码
      if(!(cardId.length<18)){
        this.props.form.setFieldsValue({identityNumber:setNumber(cardId,newD)});
      }
      

      if(this.props.orderId && this.props.orderId != '000' && this.state.insureance && this.state.insureance.dealPath){
        const insurantBirthDate = moment(value).format('YYYY-MM-DD');
        service.validateUpdateOrder({
          insurantBirthDate: insurantBirthDate,
          orderId: this.props.orderId,
        }).then((data)=>{
          if(!data.success){
            this.setState({disableButton: true});
            Modals.error({content:'您选择的产品与主险交易路线不一致，暂时无法预约，请联系您的上级！'});
            return;
          }else{
            this.setState({disableButton: false});
          }
        });
      }else{
        const insureance = this.props.insureance || {};

        let ordAddition =insureance.ordAddition;
        let itemIds = [];
        for(let i in ordAddition ){
          itemIds.push({itemId:ordAddition[i].itemId, sublineItemName: ordAddition[i].sublineItemName });
        }
        const birthDate = moment(value).format('YYYY-MM-DD');
        const params ={
          channelId: insureance.channelId || JSON.parse(localStorage.user).relatedPartyId,
          birthDate: birthDate,
          currency: insureance.currency || '',
          payMethod: insureance.payMethod || '',
          contributionPeriod: insureance.contributionPeriod,
          itemId: insureance.itemId,
          effectiveDate: insureance.reserveDate || '',
          additionRiskList: itemIds || [],
        }
        service.fetchCommission(params).then((data)=>{
          if(data.success && data.rows.length > 0){
            this.setState({disableButton: false});
          }else{
            this.setState({disableButton: true});
            Modals.error({content:'您选择的产品无转介费率，暂时无法预约，请联系您的上级！'});
            return;
          }
        });
      }
    }
  }

  //出生年月不可选日期
  disabledStartDate(current) {
    if(!current){
      return false;
    }
    var date = new Date();
    current = new Date(current);
    date = moment(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+(date.getDate()),"YYYY/MM/DD");
    current = moment(current.getFullYear()+"/"+(current.getMonth()+1)+"/"+(current.getDate()),"YYYY/MM/DD")
    return date.valueOf() < current.valueOf();
  }


  //受益人字段发生改变
  onFieldChange(index, fieldName, value){
    let ordBeneficiary = this.state.ordBeneficiary || [];
    ordBeneficiary[index][fieldName] = value.target ? value.target.value : value;
    this.setState({ ordBeneficiary });
  }


  //初始化地区
  initLocation(insurantCustomer, appliacntCustomer){
    let postI = [], identifyI = [],companyI = [], postA = [], identifyA = [], companyA = [];

    //受保人
    if(insurantCustomer.identityNation){
      identifyI.push(insurantCustomer.identityNation);
      identifyI.push(insurantCustomer.identityProvince);
      identifyI.push(insurantCustomer.identityCity);
    }
    if(insurantCustomer.postNation){
      postI.push(insurantCustomer.postNation);
      postI.push(insurantCustomer.postProvince);
      postI.push(insurantCustomer.postCity);
    }
    if(insurantCustomer.companyNation){
      companyI.push(insurantCustomer.companyNation);
      companyI.push(insurantCustomer.companyProvince);
      companyI.push(insurantCustomer.companyCity);
    }

    //投保人
    if(appliacntCustomer.identityNation){
      identifyA.push(appliacntCustomer.identityNation);
      identifyA.push(appliacntCustomer.identityProvince);
      identifyA.push(appliacntCustomer.identityCity);
    }
    if(appliacntCustomer.postNation){
      postA.push(appliacntCustomer.postNation);
      postA.push(appliacntCustomer.postProvince);
      postA.push(appliacntCustomer.postCity);
    }
    if(appliacntCustomer.companyNation){
      companyA.push(appliacntCustomer.companyNation);
      companyA.push(appliacntCustomer.companyProvince);
      companyA.push(appliacntCustomer.companyCity);
    }

    return {postI, identifyI, companyI, postA, identifyA, companyA};
  }


  render() {
    const {form} = this.props;
    const {getFieldDecorator, getFieldValue,setFieldsValue } = this.props.form;
    const insureance = this.state.insureance, orderId = this.props.orderId;
    const editFlag = insureance.editFlag || false;
    const upClass = editFlag ? styles['has-remove'] : styles['no-remove'];
    let insurantCustomer = this.state.insurantCustomer || {},         //受保人
      appliacntCustomer = this.state.appliacntCustomer || {},         //投保人
      ordBeneficiary = this.state.ordBeneficiary || [];               //受益人
      //受保人身份证号码
      //页面载入，读取身份证号码当中的生日。
    if (insurantCustomer.identityNumber) {
      if (!(insurantCustomer.identityNumber.length < 18)) {
        var ind1 = insurantCustomer.identityNumber;
        ind1 = ind1.substr(6, 8);
        var indY = ind1.substr(0, 4);
        var indM = ind1.substr(4, 2);
        var indD = ind1.substr(6, 2);
        var indBd = indY + "-" + indM + "-" + indD;
        insurantCustomer.birthDate = indBd;
      }
    }
    if (appliacntCustomer.identityNumber) {
      if (!(appliacntCustomer.identityNumber.length < 18)) {
        var app1 = appliacntCustomer.identityNumber;
        app1 = app1.substr(6, 8);
        var appY = app1.substr(0, 4);
        var appM = app1.substr(4, 2);
        var appD = app1.substr(6, 2);
        var appBd = appY + "-" + appM + "-" + appD;
        appliacntCustomer.birthDate = appBd;
      }
    }
    const {postI,identifyI,companyI,postA,identifyA,companyA} = this.initLocation(insurantCustomer, appliacntCustomer);

    let femaleFlag = true;
    if(this.state.checkboxP){
      const sex = this.props.form.getFieldValue('sex') || '';
      if(sex == 'M'){femaleFlag = false;}
    }else{
      const sex = this.props.form.getFieldValue('sex') || '';
      const sexOther = this.props.form.getFieldValue('sexOTHER123456') || '';
      if(sex == 'M' && sexOther == 'M'){
        femaleFlag = false;
      }
    }
    //如果是修改
    if(orderId && orderId != '000'){
      //受益人
      if(ordBeneficiary.length > 0){
        let numbers = [];
        for(let i in ordBeneficiary){
          numbers.push(i);
        }
        getFieldDecorator('beneficiaryKeys', { initialValue: numbers});
      }else{
        getFieldDecorator('beneficiaryKeys', {initialValue: []});
      }
    }else{
      getFieldDecorator('beneficiaryKeys', {initialValue: []});
    }

    const beneficiaryKeys = getFieldValue('beneficiaryKeys');
    const beneficiaryItems = beneficiaryKeys.map((k, index) => {
      return (
        <div>
          { index === 0 ? '' : <hr style={{marginBottom: '3%'}}/> }
          {
            editFlag &&
            <FormItem  style={{marginRight:'200px'}}  >
              <Tooltip placement="rightBottom" title="删除本条记录" >
                <Icon onClick={this.beneficiaryDelete.bind(this, k, index)} type="close" style={{cursor: 'pointer',float:'right',fontSize:'16px',fontWeight:'bold'}} disabled={beneficiaryKeys.length === 1}/>
              </Tooltip>
            </FormItem>
          }

          <div style={{display:'none'}}>
            <FormItem>
              {getFieldDecorator(`ordBeneficiaryId-${k}`, {
                initialValue:ordBeneficiary[index]?ordBeneficiary[index].ordBeneficiaryId : '',
              })(
                <Input />
              )}
            </FormItem>
          </div>

          <FormItem {...formItemLayout} label="中文姓名" className={styles.formitem_sty}  >
            {getFieldDecorator(`chineseName-${k}`, {
              rules: [
                {required:true, message:'请输入中文姓名'},
                {pattern:/^[A-Z\u4e00-\u9fa5\uF900-\uFAD9\u3400-\u4DB5\u0020]*$/, message:'请输入汉字、大写英文字母或空格'},
              ],
              initialValue:ordBeneficiary[index]?ordBeneficiary[index].chineseName : '',
            })(
              <Input
                disabled={!editFlag}
                onChange={this.onFieldChange.bind(this, index, 'chineseName')} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="英文拼音姓名" className={styles.formitem_sty}  >
            {getFieldDecorator(`englishName-${k}`, {
              rules: [
                {required:true, message:'请输入英文拼音姓名'},
                {message:'请输入英文字母，姓名之间用空格隔开', pattern: /^([A-Za-z])+\ ([A-Za-z ])+$/ }
              ],
              initialValue:ordBeneficiary[index]?ordBeneficiary[index].englishName : '',
            })(
              <Input
                disabled={!editFlag}
                onChange={this.onFieldChange.bind(this, index, 'englishName')}
                style={{textTransform:'uppercase'}}
                placeholder='姓和名之间留空，例如ZHANG SANFENG'
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="年龄" className={styles.formitem_sty}  >
            {getFieldDecorator(`age-${k}`, {
              rules: [
                {required: true, message: '请输入年龄', whitespace: true, type:'number'},
                {pattern:/^[0-9]\d*$/, message:'请输入0或正整数'},
              ],
              initialValue:ordBeneficiary[index]?ordBeneficiary[index].age : '',
            })(
              <InputNumber
                disabled={!editFlag}
                min={0}
                max={300}
                step={1}
                onChange={this.onFieldChange.bind(this, index, 'age')}
                className={styles.number_input}
                style={{width:'100%'}}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="身份证/护照号码" className={styles.formitem_sty}  >
            {getFieldDecorator(`identityNumber-${k}`, {
              rules: [
                {required: true, message:'请输入身份证/护照号码'},
                // {pattern:/^[A-Za-z0-9]+$/, message:'请输入数字或字母'},
              ],
              initialValue:ordBeneficiary[index]?ordBeneficiary[index].identityNumber : '',
            })(
              <Input
                disabled={!editFlag}
                onChange={this.onFieldChange.bind(this, index, 'identityNumber')} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="与受保人关系" className={styles.formitem_sty} >
            {getFieldDecorator(`relationship-${k}`, {
                rules: [{required: true, message: '请输入与被保人关系', whitespace: true,}],
                initialValue:ordBeneficiary[index]?ordBeneficiary[index].relationship : '',
            })(
              <Input
                disabled={!editFlag}
                onChange={this.onFieldChange.bind(this, index, 'relationship')} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="分配比率(总和100%)" className={styles.formitem_sty}  >
            {getFieldDecorator(`rate-${k}`, {
              rules: [
                {required: true, message: ' '},
                {validator: this.checkRate.bind(this),}
              ],
              initialValue:ordBeneficiary[index]?ordBeneficiary[index].rate : '',
            })(
              <NumbericeInput
                disabled={!editFlag}
                onChange={this.onFieldChange.bind(this, index, 'rate')}
                style={{width:'100%'}}
                addonAfter={<span style={{fontSize:'15px'}}>%</span>}
                className={styles.number_input}/>
            )}
          </FormItem>
        </div>
      );
    });


    return (
      <div className={`${styles.table_border} ${styles.form_sty}`}>
        <Form >
          <div className='disableds'>

          {/*基本信息*/}
          <div className={styles.item_div}>
            <div className={styles.title_sty}>
              <span className={styles.iconL} ></span>
              <font className={styles.title_font2}>基本信息</font>
            </div>
            <FormItem {...formItemLayout} label="赴港联系人" className={styles.formitem_sty} >
              {getFieldDecorator('hkContactPerson', {
                rules: [
                  {required: true, message: '请输入赴港联系人', whitespace: true },
                  // {pattern:/^[A-Z\u4e00-\u9fa5\uF900-\uFAD9\u3400-\u4DB5\u0020]*$/, message:'请输入汉字、大写英文字母或空格'},
                ],
                initialValue: insureance.hkContactPerson,
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话" className={styles.formitem_sty} >
              {getFieldDecorator('hkContactPhone', {
                rules: [
                  {required: true, message: '联系电话必输',},
                  {validator: this.checkPhone.bind(this),}
                ],
                initialValue: insureance.hkContactPhone,
              })(
                <Input
                  disabled={!editFlag}
                  addonBefore= {getFieldDecorator('hkContactCode', {
                                  initialValue: insureance.hkContactPhoneCode || '86',
                                })(
                                  <CodeOption disabled={!editFlag} codeList={this.state.code.phoneCodeList} width={125} placeholder=" " onChange={this.clearPhone.bind(this)}/>
                                )}
                  size="large"
                  style={{width:'100%',marginRight: 0}} />
              )}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="保费递增" className={styles.formitem_sty}>*/}
              {/*{getFieldDecorator('increaseFlag')(*/}
                {/*<Checkbox disabled={!editFlag} checked={this.state.increaseFlag} className={styles.checkbox_sty} onChange={this.handleChange.bind(this)}/>*/}
              {/*)}*/}
            {/*</FormItem>*/}


            <FormItem {...formItemLayout} label="保单回溯" className={styles.formitem_sty}>
              {getFieldDecorator('backFlag',{
                initialValue: insureance.backFlag || 'N',
              })(
                <Select showSearch optionFilterProp="children" disabled={!editFlag}>
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>

            {
              getFieldValue('backFlag') === 'Y' &&
              <FormItem {...formItemLayout} label="保单回溯至" className={styles.formitem_sty}>
                {getFieldDecorator('backDate',{
                  rules: [
                    {required: true, message: '保单回溯日期必选', whitespace: true,type: 'object'}
                  ],
                  initialValue:insureance.backDate ? moment(insureance.backDate, 'YYYY-MM-DD') : '',
                })(
                  <DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder="请选择保单回溯日期"/>
                )}
              </FormItem>
            }


            {/*<FormItem {...formItemLayout} label="保单回溯至" className={styles.formitem_sty}>*/}
              {/*{getFieldDecorator('backDate',{*/}
                {/*initialValue:insureance.backDate ? moment(insureance.backDate, 'YYYY-MM-DD') : '',*/}
              {/*})(*/}
                {/*<DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder="请选择回溯日期"/>*/}
              {/*)}*/}
            {/*</FormItem>*/}

            <FormItem {...formItemLayout} className={styles.formitem_sty} label="首期供款付款方式">
              {getFieldDecorator('firstPaymentMethod', {
                rules: [{type: 'array', required: true, message: '首期供款付款方式必选', whitespace: true}],
                initialValue: insureance.firstPaymentMethod || [],
              })(
                <Select
                  disabled={!editFlag}
                  className={styles['ord-select']}
                  mode="multiple"
                  optionFilterProp="children"
                  showSearch={true}
                  placeholder=" ">
                  {
                    this.state.code.firstPayMethodList &&
                    this.state.code.firstPayMethodList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} className={styles.formitem_sty} label="续期供款付款方式">
              {getFieldDecorator('renewalPaymentMethod', {
                rules: [{type: 'array', required: true, message: '续期供款付款方式必选', whitespace: true}],
                initialValue: insureance.renewalPaymentMethod || [],
              })(
                <Select
                  disabled={!editFlag}
                  className={styles['ord-select']}
                  mode="multiple"
                  optionFilterProp="children"
                  showSearch={true}
                  placeholder=" " >
                  {
                    this.state.code.renewalPayMethodList &&
                    this.state.code.renewalPayMethodList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>


            {
              getFieldValue('renewalPaymentMethod') &&
              getFieldValue('renewalPaymentMethod').length > 0 &&
              getFieldValue('renewalPaymentMethod').filter((item) => item == 'OTHER').length > 0 &&
              <FormItem {...tailFormItemLayout} className={styles.formitem_sty}>
                {getFieldDecorator('renewalOther', {
                  rules: [{required: true, message: '其他付款方式必输', whitespace: true}],
                  initialValue: insureance.renewalOther,
                })(
                  <Input disabled={!editFlag}/>
                )}
              </FormItem>
            }
          </div>


          {/*受益人资料*/}
          <div className={styles.item_div}>
            <div className={styles.title_sty}>
              <span className={styles.iconL} ></span>
              <font className={styles.title_font2}>受益人资料</font>
            </div>

            {beneficiaryItems}

            <FormItem {...tailFormItemLayout} className={styles.formitem_sty}>
              <Button
                disabled={!editFlag}
                onClick={this.beneficicaryCreate.bind(this)}
                type='default'
                style={{width:'100%',height:'40px'}} >
                <Icon type="user-add"/> 添加更多受益人
              </Button>
            </FormItem>
          </div>


          {/*受保人个人信息*/}
          <div className={styles.item_div}>
            <div className={styles.title_sty}>
              <span className={styles.iconL} ></span>
              <font className={styles.title_font2}>受保人个人信息</font>
              <p className ={styles.fromMsg}>请保证以下所填信息的真实性，否则影响签单；如有疑问，请与预约行政联系</p>
            </div>

            <FormItem {...formItemLayout} className={styles.formitem_sty} label="与投保人之关系">
              {getFieldDecorator('sameFlag', {
                rules: [{required: true, message: '请选择与投保人之关系', whitespace: true}],
                initialValue: insureance.sameFlag || 'SELF',
              })(
                <CodeOption disabled={!editFlag} showSearch={true} codeList={this.state.code.relationshipList} onChange={this.changeCheckbox.bind(this)} placeholder=" " />
              )}
            </FormItem>

            <FormItem label="中文姓名" {...formItemLayout}>
              {getFieldDecorator('chineseName', {
                rules: [{
                  required: true,
                  validator: (rule,value,callback) => {
                    if (value && (!value.value || !value.meaning)) {
                      callback('请选择客户');
                    } else {
                      callback();
                    }
                  }
                }],
                initialValue: {value: insurantCustomer.customerId || '', meaning: insurantCustomer.chineseName || ''},
              })(
                <CustomerLov
                  disabled={!editFlag}
                  params={{channelId: insureance.channelId}}
                  lovCode='ORD_CUSTOMER'
                  width="100%"
                  onChange={this.customerISelect.bind(this)}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="英文拼音姓名" className={styles.formitem_sty} >
              {getFieldDecorator('englishName', {
                rules: [
                  {required: true,message:'请输入英文拼音姓名'},
                  {message:'请输入英文字母，姓名之间用空格隔开', pattern: /^([A-Za-z])+\ ([A-Za-z ])+$/ }
                ],
                initialValue: insurantCustomer.englishName || '',
              })(
                <Input type="text" style={{textTransform:'uppercase'}} disabled={!editFlag} placeholder='姓和名之间留空，例如ZHANG SANFENG'/>
              )}
            </FormItem>
            <FormItem className={styles.formitem_sty}
                      {...formItemLayout}
                      label="出生日期"
            >
              {getFieldDecorator('birthDate', {
                rules: [{type: 'object', required: true, message: '出生日期必选'}],
                initialValue:insurantCustomer.birthDate ? moment(insurantCustomer.birthDate, 'YYYY-MM-DD') : '',
              })(
                <DatePicker
                  disabled={!editFlag}
                  format="YYYY-MM-DD"
                  style={{width: '100%'}}
                  placeholder="请选择或输入出生日期，例如1990-01-01"
                  disabledDate={this.disabledStartDate.bind(this)}
                  onChange={this.insurBirthdayCahnge.bind(this)}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="性别">
              {getFieldDecorator('sex', {
                rules: [{required: true, message: '性别必选', whitespace: true}],
                initialValue: insurantCustomer.sex || '',
              })(
                <Select disabled={!editFlag} showSearch optionFilterProp="children">
                  <Option value="M">男</Option>
                  <Option value="F">女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="国籍">
              {getFieldDecorator('nationality', {
                rules: [{required: true, message: '国籍必选', whitespace: true}],
                initialValue: insurantCustomer.nationality || '',
              })(
                <Select
                  disabled={!editFlag}
                  placeholder=" "
                  showSearch
                  optionFilterProp="children" >
                  {
                    this.state.code.nationalList &&
                    this.state.code.nationalList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="身高(cm)" className={styles.formitem_sty}>
              {getFieldDecorator('height', {
                rules: [{type: 'number', required: true, message: '身高必输', whitespace: true}],
                initialValue: insurantCustomer.height || '',
              })(
                <InputNumber disabled={!editFlag} className={styles.number_input} min={1} style={{width:'100%'}}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="体重(kg)" className={styles.formitem_sty}>
              {getFieldDecorator('weight', {
                rules: [{type: 'number', required: true, message: '体重必输', whitespace: true}],
                initialValue: insurantCustomer.weight || '',
              })(
                <InputNumber disabled={!editFlag} className={styles.number_input} min={1} style={{width:'100%'}}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="教育程度">
              {getFieldDecorator('education', {
                rules: [{required: true, message: '教育程度必选', whitespace: true}],
                initialValue: insurantCustomer.education || '',
              })(
                <Select
                  disabled={!editFlag}
                  placeholder=" "
                  showSearch
                  optionFilterProp="children" >
                  {
                    this.state.code.diplomaList &&
                    this.state.code.diplomaList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="婚姻状况">
              {getFieldDecorator('marriageStatus', {
                rules: [{required: true, message: '婚姻状况必选', whitespace: true}],
                initialValue: insurantCustomer.marriageStatus || '',
              })(
                <Select
                  disabled={!editFlag}
                  placeholder=" "
                  showSearch
                  optionFilterProp="children" >
                  {
                    this.state.code.marryList &&
                    this.state.code.marryList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="是否美国公民或税务居民">
              {getFieldDecorator('americanCitizenFlag', {
                rules: [{required: true, message: '是否美国公民或税务居民必选', whitespace: true}],
                initialValue: insurantCustomer.americanCitizenFlag || '',
              })(
                <Select disabled={!editFlag} showSearch optionFilterProp="children">
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="身份证号" className={styles.formitem_sty} >
              {getFieldDecorator('identityNumber', {
                rules: [
                  {required: true,message:'请输入身份证号'},
                  // {pattern:/^[A-Za-z0-9\(\)]+$/, message:'请输入数字或字母或英文括号'},
                ],
                initialValue: insurantCustomer.identityNumber || '',
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            <FormItem className={styles.formitem_sty} {...formItemLayout} label="身份证有效期">
              {getFieldDecorator('identityEffectiveDate', {
                rules: [
                  {required: this.state.checkboxP, message: '身份证有效期必选',},
                ],
                initialValue:insurantCustomer.identityEffectiveDate || '',
              })(
                <Input disabled={!editFlag}/>
                //<DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="其他证件">
              {getFieldDecorator('certificateType', {
                initialValue: insurantCustomer.certificateType || '',
              })(
                <Select
                  disabled={!editFlag}
                  placeholder=" "
                  showSearch
                  optionFilterProp="children" >
                  {
                    this.state.code.certificateList &&
                    this.state.code.certificateList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="证件号码" className={styles.formitem_sty} >
              {getFieldDecorator('certificateNumber', {
                initialValue: insurantCustomer.certificateNumber || '',
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            <FormItem className={styles.formitem_sty} {...formItemLayout} label="证件有效期">
              {getFieldDecorator('certificateEffectiveDate', {
                initialValue:insurantCustomer.certificateEffectiveDate || '',
              })(
                <Input disabled={!editFlag}/>
               // <DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
              )}
            </FormItem>
            {/*<FormItem className={styles.formitem_sty} {...formItemLayout} label="身份证地址">
              {getFieldDecorator('idArea', {
                rules: [{type: 'array', required: true, message: '身份证地址必选', whitespace: true}],
                initialValue:identifyI || [],
              })(
                <Cascader disabled={!editFlag} showSearch options={this.state.options} onChange={this.idAdressChange.bind(this,'mailingArea')} placeholder=" "/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址" className={styles.formitem_sty} >
              {getFieldDecorator('identityAddress', {
                rules: [{required: true, message: '详细地址必输', whitespace: true}],
                initialValue: insurantCustomer.identityAddress || '',
              })(
                <Input disabled={!editFlag} onBlur={this.idAdressDetailChange.bind(this,'identityAddress')}/>
              )}
            </FormItem>*/}
            
             <FormItem {...formItemLayout} label="身份证详细地址" className={styles.formitem_sty} >
              {getFieldDecorator('identityAddress', {
                rules: [{required: true, message: '详细地址必输', whitespace: true}],
                initialValue: insurantCustomer.identityAddress || '',
              })(
                <Input disabled={!editFlag} onBlur={this.idAdressDetailChange.bind(this,'identityAddress')}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} className={styles.formitem_sty} label="是否以身份证作为地址证明">
              {getFieldDecorator('identityFlag', {
                rules: [{required: true, message: '是否以身份证作为地址证明必选', whitespace: true}],
                initialValue: insurantCustomer.identityFlag || '',
              })(
                <Select disabled={!editFlag} showSearch optionFilterProp="children">
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem className={styles.formitem_sty} {...formItemLayout} label="邮寄通讯地址">
              {getFieldDecorator('mailingArea', {
                rules: [{ type: 'array', required: true, message: '邮寄通讯地址必选', whitespace: true }],
                initialValue: postI || [],
              })(
                <Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" " />
                )}
            </FormItem>
            {/*是否以身份证作为地址证明*/}
            {
              (getFieldValue('identityFlag') === "Y") &&
                <FormItem {...formItemLayout} label="详细地址" className={styles.formitem_sty} >
                  {getFieldDecorator('identityAddress', {
                    rules: [{ required: true, message: '详细地址必输', whitespace: true }],
                    initialValue: insurantCustomer.identityAddress || '',
                  })(
                    <Input disabled={!editFlag} onBlur={this.idAdressDetailChange.bind(this, 'identityAddress')} />
                    )}
                </FormItem>
            }

            {
              (getFieldValue('identityFlag') === "N") &&
                <FormItem className={styles.formitem_sty} {...formItemLayout} label="详细地址">
                  {getFieldDecorator('mailingArea', {
                    rules: [{ type: 'array', required: true, message: '邮寄通讯地址必选', whitespace: true }],
                    initialValue: postI || [],
                  })(
                    //<Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" " />
                    <Input disabled={!editFlag}/>
                    )}
                </FormItem>
            }

            {/*<FormItem className={styles.formitem_sty} {...formItemLayout} label="邮寄通讯地址">
              {getFieldDecorator('mailingArea', {
                rules: [{type: 'array', required: true, message: '邮寄通讯地址必选', whitespace: true}],
                initialValue:postI || [],
              })(
                <Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" "/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址" className={styles.formitem_sty} >
              {getFieldDecorator('postAddress', {
                rules: [{required: true, message: '详细地址必输', whitespace: true}],
                initialValue: insurantCustomer.postAddress || '',
              })(
                <Input disabled={!editFlag} />
              )}
            </FormItem>*/}
            <FormItem {...formItemLayout} label="联系电话" className={styles.formitem_sty} >
              {getFieldDecorator('phone', {
                rules: [{
                  required: this.state.checkboxP, message: '联系电话必输'
                },{
                  validator: this.checkPhone.bind(this),
                }],
                initialValue: insurantCustomer.phone || '',
              })(
                <Input  disabled={!editFlag}
                        addonBefore={getFieldDecorator('code', {
                          initialValue: insurantCustomer.phoneCode ||'86',
                        })(
                          <CodeOption disabled={!editFlag} codeList={this.state.code.phoneCodeList} width={125} placeholder=" "/>
                        )}
                       style={{width:'100%',marginRight: 0}}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="电子邮箱" className={styles.formitem_sty} >
              {getFieldDecorator('email', {
                rules: [
                  { message: '邮箱格式不正确',pattern:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ },
                  { required: true, message: '请输入电子邮箱', }
                ],
                initialValue: insurantCustomer.email || '',
              })(
                <Input disabled={!editFlag} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="公司名称" className={styles.formitem_sty} >
              {getFieldDecorator('companyName', {
                rules: [
                  {required: this.state.checkboxP,message: '公司名称必输',}
                ],
                initialValue: insurantCustomer.companyName || '',
              })(
                <Input disabled={!editFlag} placeholder="如少于一年，请说明先前的工作"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="公司业务性质(行业)" className={styles.formitem_sty} >
              {getFieldDecorator('industry', {
                rules: [
                  {required: this.state.checkboxP,message: '公司业务性质(行业)必输',}
                ],
                initialValue: insurantCustomer.industry || '',
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            {/*<FormItem className={styles.formitem_sty} {...formItemLayout} label="公司地址">
              {getFieldDecorator('companyArea', {
                rules: [{required: this.state.checkboxP, message: '请选择公司地址', whitespace: true,type: 'array'}],
                initialValue:companyI || [],
              })(
                <Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" "/>
              )}
            </FormItem>*/}
            <FormItem {...formItemLayout} label="公司详细地址" className={styles.formitem_sty} >
              {getFieldDecorator('companyAddress', {
                rules: [
                  {required: this.state.checkboxP,message: '请输入详细地址',}
                ],
                initialValue: insurantCustomer.companyAddress || '',
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="职位" className={styles.formitem_sty} >
              {getFieldDecorator('position', {
                rules: [
                  {required: this.state.checkboxP, message: '职位必输',},
                ],
                initialValue: insurantCustomer.position || '',
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="职务" className={styles.formitem_sty} >
              {getFieldDecorator('job', {
                rules: [
                  {required: this.state.checkboxP,message: '职务必输',}
                ],
                initialValue:insurantCustomer.job || '',
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="月收入水平(港币)" className={styles.formitem_sty}>
              {getFieldDecorator('income', {
                rules: [
                  { required: this.state.checkboxP, message: '月收入水平(港币)（整数）', pattern:/^-?\d+(\.)?$/ },
                ],
                initialValue: insurantCustomer.income=== 0?0:insurantCustomer.income || '',
              })(
                <InputNumber
                  disabled={!editFlag}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  className={styles.number_input}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="保费资金来源" className={styles.formitem_sty} >
              {getFieldDecorator('premiumSource', {
                rules: [
                  { required: this.state.checkboxP, message: '保费资金来源必输',},
                ],
                initialValue: insurantCustomer.premiumSource || '',
              })(
                <Input disabled={!editFlag}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="您每月支出约多少" className={styles.formitem_sty}>
              {getFieldDecorator('amountPerMonth', {
                rules: [
                  { required: this.state.checkboxP, message: '您每月支出约多少（整数）', pattern:/^-?\d+(\.)?$/ },
                ],
                initialValue: insurantCustomer.amountPerMonth=== 0?0:insurantCustomer.amountPerMonth || '',
              })(
                <InputNumber
                  disabled={!editFlag}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  className={styles.number_input}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="您持有多少流动资产" className={styles.formitem_sty}>
              {getFieldDecorator('currentAssets', {
                rules: [
                  { required: this.state.checkboxP,message: '您持有多少流动资产（整数）', pattern:/^-?\d+(\.)?$/ },
                ],
                initialValue: insurantCustomer.currentAssets=== 0?0:insurantCustomer.currentAssets || '',
              })(
                <InputNumber
                  disabled={!editFlag}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  className={styles.number_input}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="年持有不动资产的总值" className={styles.formitem_sty}>
              {getFieldDecorator('fixedAssets', {
                rules: [
                  { required: this.state.checkboxP, message: '年持有不动资产的总值（整数）', pattern:/^-?\d+(\.)?$/ },
                ],
                initialValue: insurantCustomer.fixedAssets=== 0?0:insurantCustomer.fixedAssets || '',
              })(
                <InputNumber
                  disabled={!editFlag}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  className={styles.number_input}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="您每年承担的保费占您个人收入比例约为多少" className={styles.formitem_sty}>
              {getFieldDecorator('premiumRate', {
                rules: [
                  {required: this.state.checkboxP, message: ' '},
                  {validator: this.checkRate.bind(this),}
                ],
                initialValue: insurantCustomer.premiumRate === 0 ? 0:insurantCustomer.premiumRate || '',
              })(
                <NumbericeInput
                  disabled={!editFlag}
                  style={{width:'100%'}}
                  addonAfter={<span style={{fontSize:'15px'}}>%</span>}
                  className={styles.number_input}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="您现时负债大约多少" className={styles.formitem_sty}>
              {getFieldDecorator('liabilities', {
                rules: [
                  { required: this.state.checkboxP, message: '您现时负债大约多少（整数）', pattern:/^-?\d+(\.)?$/ },
                ],
                initialValue: insurantCustomer.liabilities=== 0?0:insurantCustomer.liabilities || '',
              })(
                <InputNumber
                  disabled={!editFlag}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  className={styles.number_input}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <Row span={24}>
              <Col span={2}></Col>
              <Col span={8}>
                <div style={{fontSize:'16px',fontFamily:'Microsoft YaHei',float: 'right', paddingRight: '10px'}}>
                  {
                    this.state.checkboxP &&
                    <span style={{color:'#f04134'}}>* </span>
                  }
                  <span style={{color:'rgba(0, 0, 0, 0.65)'}}>您是否曾被保险公司拒保、推迟承保、增加保费或更改受保条件?</span>
                </div>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('badFlag', {
                    rules: [
                      { required: this.state.checkboxP, message: '必选',}
                    ],
                    initialValue: insurantCustomer.badFlag || 'N',
                  })(
                    <Select disabled={!editFlag} showSearch optionFilterProp="children" >
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              {/*保险是否被退保*/}
            </Row>
            {
              ( getFieldValue('badFlag') === "Y") &&
              <div>
                <FormItem {...formItemLayout} label="承保保险公司" className={styles.formitem_sty} >
                  {getFieldDecorator('badInsuranceName', {
                    rules: [{required: true, message: '承保保险公司必输', whitespace: true}],
                    initialValue: insurantCustomer.badInsuranceName || '',
                  })(
                    <Input disabled={!editFlag}/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="保险种类" className={styles.formitem_sty} >
                  {getFieldDecorator('badInsuranceType', {
                    rules: [{required: true, message: '保险种类必输', whitespace: true}],
                    initialValue: insurantCustomer.badInsuranceType || '',
                  })(
                    <Input disabled={!editFlag}/>
                  )}
                </FormItem>
                <FormItem className={styles.formitem_sty} {...formItemLayout} label="保单生效年月">
                  {getFieldDecorator('badEffactiveDate', {
                    rules: [{type: 'object', required: true, message: '保单生效年月必选'}],
                    initialValue:insurantCustomer.badEffactiveDate ? moment(insurantCustomer.badEffactiveDate, 'YYYY-MM-DD') : '',
                  })(
                    <DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
                  )}
                </FormItem>
              </div>
            }
            <Row span={24}>
              <Col span={2}></Col>
              <Col span={8}>
                <div style={{fontSize:'16px',fontFamily:'Microsoft YaHei',float: 'right', paddingRight: '10px'}}>
                  {
                    this.state.checkboxP &&
                    <span style={{color:'#f04134'}}>* </span>
                  }
                  <span style={{color:'rgba(0, 0, 0, 0.65)'}}>您是否因意外、伤病或健康理由而申请社会福利或社会赔偿?</span>
                </div>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('compensateFlag', {
                    rules: [
                      {required: this.state.checkboxP, message: '必选',},
                    ],
                    initialValue: insurantCustomer.compensateFlag || 'N',
                  })(
                    <Select disabled={!editFlag} showSearch optionFilterProp="children" >
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
                  {/*是否意外*/}
            {/* {
              (getFieldValue('compensateFlag') === "Y") &&
              <div>
                <FormItem {...formItemLayout} label="承保保险公司" className={styles.formitem_sty} >
                  {getFieldDecorator('compensateInsuranceName', {
                    rules: [{required: true, message: '承保保险公司必输', whitespace: true}],
                    initialValue: insurantCustomer.compensateInsuranceName || '',
                  })(
                    <Input disabled={!editFlag}/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="保险种类" className={styles.formitem_sty} >
                  {getFieldDecorator('compensateInsuranceType', {
                    rules: [{required: true, message: '保险种类必输', whitespace: true}],
                    initialValue: insurantCustomer.compensateInsuranceType || '',
                  })(
                    <Input disabled={!editFlag}/>
                  )}
                </FormItem>
                <FormItem className={styles.formitem_sty} {...formItemLayout} label="保单生效年月">
                  {getFieldDecorator('compensateEffactiveDate', {
                    rules: [{type: 'object', required: true, message: '保单生效年月必选'}],
                    initialValue:insurantCustomer.compensateEffactiveDate ? moment(insurantCustomer.compensateEffactiveDate, 'YYYY-MM-DD') : '',
                  })(
                    <DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
                  )}
                </FormItem>
              </div>
            } */}
            <Row span={24}>
              <Col span={2}></Col>
              <Col span={8}>
                <div style={{fontSize:'16px',fontFamily:'Microsoft YaHei',float: 'right', paddingRight: '10px'}}>
                  {
                    this.state.checkboxP &&
                    <span style={{color:'#f04134'}}>* </span>
                  }
                  <span style={{color:'rgba(0, 0, 0, 0.65)'}}>您是否有现行生效（包括在申请中）之保险保障？</span>
                </div>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('guaranteeFlag', {
                    rules: [
                      {required: this.state.checkboxP, message: '必选',},
                    ],
                    initialValue: insurantCustomer.guaranteeFlag || 'N',
                  })(
                    <Select disabled={!editFlag} showSearch optionFilterProp="children" >
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {/*是否有保障*/}
            {
              (getFieldValue('guaranteeFlag') === "Y") &&
              <div>
                <FormItem {...formItemLayout} label="承保保险公司" className={styles.formitem_sty} >
                  {getFieldDecorator('guaranteeInsuranceName', {
                    rules: [{required: false, message: '承保保险公司必输', whitespace: true}],
                    initialValue: insurantCustomer.guaranteeInsuranceName || '',
                  })(
                    <Input disabled={!editFlag}/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="保险种类" className={styles.formitem_sty} >
                  {getFieldDecorator('guaranteeInsuranceType', {
                    rules: [{required: false, message: '保险种类必输', whitespace: true}],
                    initialValue: insurantCustomer.guaranteeInsuranceType || '',
                  })(
                    <Input disabled={!editFlag}/>
                  )}
                </FormItem>
                <FormItem className={styles.formitem_sty} {...formItemLayout} label="保单生效年月">
                  {getFieldDecorator('guaranteeEffactiveDate', {
                    rules: [{type: 'object', required: false, message: '保单生效年月必选'}],
                    initialValue:insurantCustomer.guaranteeEffactiveDate ? moment(insurantCustomer.guaranteeEffactiveDate, 'YYYY-MM-DD') : '',
                  })(
                    <DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
                  )}
                </FormItem>
              </div>
            }
          </div>

          {/*持有人个人信息*/}

          { !this.state.checkboxP &&
            <div className={styles.item_div}>
              <div className={styles.title_sty}>
                <span className={styles.iconL} ></span>
                <font className={styles.title_font2}>持有人个人信息</font>
              </div>
              <FormItem label="中文姓名" {...formItemLayout}>
                {getFieldDecorator('chineseNameOTHER123456', {
                  rules: [{
                    required: true,
                    validator: (rule,value,callback) => {
                      if (value && (!value.value || !value.meaning)) {
                        callback('请选择客户');
                      } else {
                        callback();
                      }
                    }
                  }],
                  initialValue: {value: appliacntCustomer.customerId || '', meaning: appliacntCustomer.chineseName || ''},
                })(
                  <CustomerLov
                    disabled={!editFlag}
                    lovCode='ORD_CUSTOMER'
                    params={{channelId: insureance.channelId}}
                    width="100%"
                    onChange={this.customerASelect.bind(this)} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="英文拼音姓名" className={styles.formitem_sty} >
                {getFieldDecorator('englishNameOTHER123456', {
                  rules: [
                    {required: true,message:'英文拼音姓名必输'},
                    {message:'请输入英文字母，姓名之间用空格隔开', pattern: /^([A-Za-z])+\ ([A-Za-z ])+$/ }
                  ],
                  initialValue: appliacntCustomer.englishName || '',
                })(
                  <Input type="text" style={{textTransform:'uppercase'}} disabled={!editFlag} placeholder='姓和名之间留空，例如ZHANG SANFENG'/>
                )}
              </FormItem>
              <FormItem className={styles.formitem_sty} {...formItemLayout}  label="出生日期" >
                {getFieldDecorator('birthDateOTHER123456', {
                  rules: [{type: 'object', required: true, message: '出生日期必选'}],
                  initialValue:appliacntCustomer.birthDate ? moment(appliacntCustomer.birthDate, 'YYYY-MM-DD') : '',
                })(
                  <DatePicker
                    disabled={!editFlag}
                    format="YYYY-MM-DD"
                    style={{width: '100%'}}
                    disabledDate={this.disabledStartDate.bind(this)}
                    placeholder="请选择或输入出生日期，例如1990-01-01"/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} className={styles.formitem_sty} label="性别">
                {getFieldDecorator('sexOTHER123456', {
                  rules: [{required: true, message: '性别必选', whitespace: true}],
                  initialValue: appliacntCustomer.sex || '',
                })(
                  <Select disabled={!editFlag} showSearch optionFilterProp="children">
                    <Option value="M">男</Option>
                    <Option value="F">女</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} className={styles.formitem_sty} label="国籍">
                {getFieldDecorator('nationalityOTHER123456', {
                  rules: [{required: true, message: '国籍必选', whitespace: true}],
                  initialValue: appliacntCustomer.nationality || '',
                })(
                  <Select
                    disabled={!editFlag}
                    placeholder=" "
                    showSearch
                    optionFilterProp="children" >
                    {
                      this.state.code.nationalList &&
                      this.state.code.nationalList.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="身高(cm)" className={styles.formitem_sty}>
                {getFieldDecorator('heightOTHER123456', {
                  rules: [{type: 'number', required: true, message: '身高必输', whitespace: true}],
                  initialValue: appliacntCustomer.height || '',
                })(
                  <InputNumber disabled={!editFlag} className={styles.number_input} min={1} style={{width:'100%'}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="体重(kg)" className={styles.formitem_sty}>
                {getFieldDecorator('weightOTHER123456', {
                  rules: [{type: 'number', required: true, message: '体重必输', whitespace: true}],
                  initialValue: appliacntCustomer.weight || '',
                })(
                  <InputNumber disabled={!editFlag} className={styles.number_input} min={1} style={{width:'100%'}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} className={styles.formitem_sty} label="教育程度">
                {getFieldDecorator('educationOTHER123456', {
                  rules: [{required: true, message: '教育程度必选', whitespace: true}],
                  initialValue: appliacntCustomer.education || '',
                })(
                  <Select
                    disabled={!editFlag}
                    placeholder=" "
                    showSearch
                    optionFilterProp="children" >
                    {
                      this.state.code.diplomaList &&
                      this.state.code.diplomaList.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} className={styles.formitem_sty} label="婚姻状况">
                {getFieldDecorator('marriageStatusOTHER123456', {
                  rules: [{required: true, message: '婚姻状况必选', whitespace: true}],
                  initialValue: appliacntCustomer.marriageStatus || '',
                })(
                  <Select
                    disabled={!editFlag}
                    placeholder=" "
                    showSearch
                    optionFilterProp="children" >
                    {
                      this.state.code.marryList &&
                      this.state.code.marryList.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} className={styles.formitem_sty} label="是否美国公民或税务居民">
                {getFieldDecorator('americanCitizenFlagOTHER123456', {
                  rules: [{required: true, message: '是否美国公民或税务居民必选', whitespace: true}],
                  initialValue: appliacntCustomer.americanCitizenFlag || '',
                })(
                  <Select disabled={!editFlag} showSearch optionFilterProp="children">
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="身份证号" className={styles.formitem_sty} >
                {getFieldDecorator('identityNumberOTHER123456', {
                  rules: [
                    {required: true,message:'请输入身份证号'},
                    // {pattern:/^[A-Za-z0-9\(\)]+$/, message:'请输入数字或字母或英文括号'},
                  ],
                  initialValue: appliacntCustomer.identityNumber || '',
                })(
                  <Input disabled={!editFlag} />
                )}
              </FormItem>
              <FormItem className={styles.formitem_sty} {...formItemLayout} label="身份证有效期">
                {getFieldDecorator('identityEffectiveDateOTHER123456', {
                  rules: [{required: true, message: '身份证有效期必选'}],
                  initialValue:appliacntCustomer.identityEffectiveDate || '',
                })(
                  <Input disabled={!editFlag}/>
                  //<DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} className={styles.formitem_sty} label="其他证件">
                {getFieldDecorator('certificateTypeOTHER123456', {
                  initialValue: appliacntCustomer.certificateType || '',
                })(
                  <Select
                    disabled={!editFlag}
                    placeholder=" "
                    showSearch
                    optionFilterProp="children" >
                    {
                      this.state.code.certificateList &&
                      this.state.code.certificateList.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="证件号码" className={styles.formitem_sty} >
                {getFieldDecorator('certificateNumberOTHER123456', {
                  initialValue: appliacntCustomer.certificateNumber || '',
                })(
                  <Input disabled={!editFlag} />
                )}
              </FormItem>
              <FormItem className={styles.formitem_sty} {...formItemLayout} label="证件有效期" >
                {getFieldDecorator('certificateEffectiveDateOTHER123456', {
                  initialValue:appliacntCustomer.certificateEffectiveDate || '',
                })(
                  <Input disabled={!editFlag}/>
                  //<DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
                )}
              </FormItem>
              {/*<FormItem className={styles.formitem_sty} {...formItemLayout} label="身份证地址">
                {getFieldDecorator('idAreaOTHER123456', {
                  rules: [{type: 'array', required: true, message: '身份证地址必选', whitespace: true}],
                  initialValue:identifyA || [],
                })(
                  <Cascader disabled={!editFlag} showSearch options={this.state.options} onChange={this.idAdressChange.bind(this,'mailingAreaOTHER123456')} placeholder=" "/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="详细地址" className={styles.formitem_sty} >
                {getFieldDecorator('identityAddressOTHER123456', {
                  rules: [{required: true, message: '详细地址必输', whitespace: true}],
                  initialValue: appliacntCustomer.identityAddress || '',
                })(
                  <Input disabled={!editFlag} onBlur={this.idAdressDetailChange.bind(this,'identityAddressOTHER123456')}/>
                )}
              </FormItem>*/}
              <FormItem {...formItemLayout} label="身份证详细地址" className={styles.formitem_sty} >
                {getFieldDecorator('identityAddressOTHER123456', {
                  rules: [{required: true, message: '详细地址必输', whitespace: true}],
                  initialValue: appliacntCustomer.identityAddress || '',
                })(
                  <Input disabled={!editFlag} onBlur={this.idAdressDetailChange.bind(this,'identityAddressOTHER123456')}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} className={styles.formitem_sty} label="是否以身份证作为地址证明">
                {getFieldDecorator('identityFlagOTHER123456', {
                  rules: [{required: true, message: '是否以身份证作为地址证明必选', whitespace: true}],
                  initialValue: appliacntCustomer.identityFlag || '',
                })(
                  <Select disabled={!editFlag} showSearch optionFilterProp="children">
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem className={styles.formitem_sty} {...formItemLayout} label="邮寄通讯地址">
                {getFieldDecorator('mailingAreaOTHER123456', {
                  rules: [{type: 'array', required: true, message: '邮寄通讯地址必选', whitespace: true}],
                  initialValue:postA || [],
                })(
                  <Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" "/>
                )}
              </FormItem>
              {/*是否以身份证作为地址证明*/}
              {
                (getFieldValue('identityFlagOTHER123456') === "Y") &&
                <FormItem {...formItemLayout} label="详细地址" className={styles.formitem_sty} >
                  {getFieldDecorator('identityAddressOTHER123456', {
                    rules: [{ required: true, message: '详细地址必输', whitespace: true }],
                    initialValue: appliacntCustomer.identityAddress || '',
                  })(
                    <Input disabled={!editFlag} onBlur={this.idAdressDetailChange.bind(this, 'identityAddressOTHER123456')} />
                    )}
                </FormItem>
              }
              {
                (getFieldValue('identityFlagOTHER123456') === "N") &&
                <FormItem className={styles.formitem_sty} {...formItemLayout} label="详细地址">
                {getFieldDecorator('mailingAreaOTHER123456', {
                  rules: [{type: 'array', required: true, message: '邮寄通讯地址必选', whitespace: true}],
                  initialValue:postA || [],
                })(
                  //<Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" "/>
                  <Input disabled={!editFlag} />
                )}
              </FormItem>
              }
              {/*<FormItem className={styles.formitem_sty} {...formItemLayout} label="邮寄通讯地址">
                {getFieldDecorator('mailingAreaOTHER123456', {
                  rules: [{type: 'array', required: true, message: '邮寄通讯地址必选', whitespace: true}],
                  initialValue:postA || [],
                })(
                  <Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" "/>
                )}
              </FormItem>*/}
              {/*<FormItem {...formItemLayout} label="详细地址" className={styles.formitem_sty} >
                {getFieldDecorator('postAddressOTHER123456', {
                  rules: [{required: true, message: '详细地址必输', whitespace: true}],
                  initialValue: appliacntCustomer.postAddress || '',
                })(
                  <Input disabled={!editFlag} />
                )}
              </FormItem>*/}
              <FormItem {...formItemLayout} label="联系电话" className={styles.formitem_sty} >
                {getFieldDecorator('phoneOTHER123456', {
                  rules: [{
                    required: true, message: '联系电话必输'
                  },{
                    validator: this.checkPhone.bind(this),
                  }],
                  initialValue: appliacntCustomer.phone || '',
                })(
                  <Input  disabled={!editFlag}
                          addonBefore={getFieldDecorator('codeOTHER123456', {
                            initialValue:appliacntCustomer.phoneCode || '86',
                          })(
                            <CodeOption disabled={!editFlag} codeList={this.state.code.phoneCodeList} width={125} placeholder=" "/>
                          )}
                        style={{width:'100%',marginRight: 0}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="电子邮箱" className={styles.formitem_sty} >
                {getFieldDecorator('emailOTHER123456', {
                  rules: [
                    { message: '邮箱格式不正确',pattern:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ },
                    { required: true, message: '请输入电子邮箱', }
                  ],
                  initialValue: appliacntCustomer.email || '',
                })(
                  <Input disabled={!editFlag}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="公司名称" className={styles.formitem_sty} >
                {getFieldDecorator('companyNameOTHER123456', {
                  rules: [{required: true, message: '公司名称必输', whitespace: true}],
                  initialValue: appliacntCustomer.companyName || '',
                })(
                  <Input disabled={!editFlag} placeholder="如少于一年，请说明先前的工作"/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="公司业务性质(行业)" className={styles.formitem_sty} >
                {getFieldDecorator('industryOTHER123456', {
                  rules: [{required: true, message: '公司业务性质(行业)必输', whitespace: true}],
                  initialValue: appliacntCustomer.industry || '',
                })(
                  <Input disabled={!editFlag}/>
                )}
              </FormItem>
              {/*<FormItem className={styles.formitem_sty} {...formItemLayout} label="公司地址">
                {getFieldDecorator('companyAreaOTHER123456', {
                  rules: [{required: true, message: '请选择公司地址', whitespace: true,type: 'array'}],
                  initialValue:companyA || [],
                })(
                  <Cascader disabled={!editFlag} showSearch options={this.state.options} placeholder=" "/>
                )}
              </FormItem>*/}
              <FormItem {...formItemLayout} label="公司详细地址" className={styles.formitem_sty} >
                {getFieldDecorator('companyAddressOTHER123456', {
                  rules: [{
                    required: true,
                    message: '请输入详细地址',
                  }],
                  initialValue: appliacntCustomer.companyAddress || '',
                })(
                  <Input disabled={!editFlag}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="职位" className={styles.formitem_sty} >
                {getFieldDecorator('positionOTHER123456', {
                  rules: [{required: true, message: '职位必输', whitespace: true}],
                  initialValue: appliacntCustomer.position || '',
                })(
                  <Input disabled={!editFlag}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="职务" className={styles.formitem_sty}>
                {getFieldDecorator('jobOTHER123456', {
                  rules: [{required: true, message: '职务必输', whitespace: true}],
                  initialValue: appliacntCustomer.job || '',
                })(
                  <Input disabled={!editFlag}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="月收入水平(港币)" className={styles.formitem_sty}>
                {getFieldDecorator('incomeOTHER123456', {
                  rules: [
                    { required: true, message: '月收入水平(港币)（整数）', pattern:/^-?\d+(\.)?$/ },
                  ],
                  initialValue: appliacntCustomer.income=== 0?0:appliacntCustomer.income || '',
                })(
                  <InputNumber
                    disabled={!editFlag}
                    formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                    className={styles.number_input}
                    style={{width:'100%'}}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="保费资金来源" className={styles.formitem_sty}  >
                {getFieldDecorator('premiumSourceOTHER123456', {
                  rules: [{required: true, message: '保费资金来源必输', whitespace: true}],
                  initialValue: appliacntCustomer.premiumSource || '',
                })(
                  <Input disabled={!editFlag}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="您每月支出约多少" className={styles.formitem_sty}>
                {getFieldDecorator('amountPerMonthOTHER123456', {
                  rules: [
                    { required: true, message: '请输入您每月支出约多少（整数）', pattern:/^-?\d+(\.)?$/ },
                  ],
                  initialValue: appliacntCustomer.amountPerMonth=== 0?0:appliacntCustomer.amountPerMonth || '',
                })(
                  <InputNumber
                    disabled={!editFlag}
                    formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                    className={styles.number_input}
                    style={{width:'100%'}}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="您持有多少流动资产" className={styles.formitem_sty}>
                {getFieldDecorator('currentAssetsOTHER123456', {
                  rules: [
                    { required: true, message: '请输入您持有多少流动资产（整数）', pattern:/^-?\d+(\.)?$/ },
                  ],
                  initialValue: appliacntCustomer.currentAssets=== 0?0:appliacntCustomer.currentAssets || '',
                })(
                  <InputNumber
                    disabled={!editFlag}
                    formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                    className={styles.number_input}
                    style={{width:'100%'}}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="年持有不动资产的总值" className={styles.formitem_sty}>
                {getFieldDecorator('fixedAssetsOTHER123456', {
                  rules: [
                    { required: true, message: '请输入年持有不动资产的总值（整数）', pattern:/^-?\d+(\.)?$/ },
                  ],
                  initialValue: appliacntCustomer.fixedAssets=== 0?0:appliacntCustomer.fixedAssets || '',
                })(
                  <InputNumber
                    disabled={!editFlag}
                    formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                    className={styles.number_input}
                    style={{width:'100%'}}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="您每年承担的保费占您个人收入比例约为多少" className={styles.formitem_sty}>
                {getFieldDecorator('premiumRateOTHER123456', {
                  rules: [
                    {required: true, message: ' '},
                    {validator: this.checkRate.bind(this), },
                  ],
                  initialValue: appliacntCustomer.premiumRate === 0 ? 0:appliacntCustomer.premiumRate || '',
                })(
                  <NumbericeInput
                    disabled={!editFlag}
                    style={{width:'100%'}}
                    addonAfter={<span style={{fontSize:'15px'}}>%</span>}
                    className={styles.number_input}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="您现时负债大约多少" className={styles.formitem_sty}>
                {getFieldDecorator('liabilitiesOTHER123456', {
                  rules: [
                    { required: true, message: '请输入您现时负债大约多少（整数）', pattern:/^-?\d+(\.)?$/ },
                  ],
                  initialValue: appliacntCustomer.liabilities=== 0?0:appliacntCustomer.liabilities || '',
                })(
                  <InputNumber
                    disabled={!editFlag}
                    formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                    className={styles.number_input}
                    style={{width:'100%'}}
                  />
                )}
              </FormItem>
              <Row span={24}>
                <Col span={2}></Col>
                <Col span={8}>
                  <div style={{fontSize:'16px',fontFamily:'Microsoft YaHei',float: 'right', paddingRight: '10px'}}>
                    <span style={{color:'#f04134'}}>* </span>
                    <span style={{color:'rgba(0, 0, 0, 0.65)'}}>您是否曾被保险公司拒保、推迟承保、增加保费或更改受保条件?</span>
                  </div>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('badFlagOTHER123456', {
                      rules: [{required: true, message: '必选', whitespace: true}],
                      initialValue: appliacntCustomer.badFlag || 'N',
                    })(
                      <Select disabled={!editFlag} showSearch optionFilterProp="children">
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row span={24}>
                <Col span={2}></Col>
                <Col span={8}>
                  <div style={{fontSize:'16px',fontFamily:'Microsoft YaHei',float: 'right', paddingRight: '10px'}}>
                    <span style={{color:'#f04134'}}>* </span>
                    <span style={{color:'rgba(0, 0, 0, 0.65)'}}>您是否因意外、伤病或健康理由而申请社会福利或社会赔偿?</span>
                  </div>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('compensateFlagOTHER123456', {
                      rules: [{required: true, message: '必选', whitespace: true}],
                      initialValue: appliacntCustomer.compensateFlag || 'N',
                    })(
                      <Select disabled={!editFlag} showSearch optionFilterProp="children" >
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>

              {
                (getFieldValue('compensateFlagOTHER123456') == "Y" || getFieldValue('badFlagOTHER123456') == "Y") &&
                <div>
                  <FormItem {...formItemLayout} label="承保保险公司" className={styles.formitem_sty}>
                    {getFieldDecorator('badInsuranceNameOTHER123456', {
                      rules: [{required: true, message: '承保保险公司必输', whitespace: true}],
                      initialValue: appliacntCustomer.badInsuranceName || '',
                    })(
                      <Input disabled={!editFlag}/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="保险种类" className={styles.formitem_sty}>
                    {getFieldDecorator('badInsuranceTypeOTHER123456', {
                      rules: [{required: true, message: '保险种类必输', whitespace: true}],
                      initialValue: appliacntCustomer.badInsuranceType || '',
                    })(
                      <Input disabled={!editFlag}/>
                    )}
                  </FormItem>
                  <FormItem className={styles.formitem_sty} {...formItemLayout}label="保单生效年月">
                    {getFieldDecorator('badEffactiveDateOTHER123456', {
                      rules: [{type: 'object', required: true, message: '保单生效年月必选'}],
                      initialValue:appliacntCustomer.badEffactiveDate ? moment(appliacntCustomer.badEffactiveDate, 'YYYY-MM-DD') : '',
                    })(
                      <DatePicker disabled={!editFlag} format="YYYY-MM-DD" style={{width: '100%'}} placeholder=" "/>
                    )}
                  </FormItem>
                </div>
              }
            </div>
          }
          </div>

          {/*健康信息*/}
          <div className={styles.item_div}>
            <div className={styles.title_sty}>
              <span className={styles.iconL} ></span>
              <font className={styles.title_font2}>健康信息</font>
            </div>
            <div style={{color:'#f04134',textAlign:'center',fontSize:'16px',marginBottom:'15px'}}>
              客户的健康状况是保险公司重要的核保参考依据，以下健康信息系统默认选项否，请根据客户健康状况如实披露。
            </div>

            <table className={styles.table1}>
              <tbody>
              <tr style={{background: '#E2DCCC'}}>
                <th style={{width:'520px'}}>健康信息</th>
                <th>受保人</th>
                { !this.state.checkboxP &&
                <th>投保人</th>
                }
              </tr>
              {
                this.state.fields.map((item) => {
                  const fieldId = item.fieldId;
                  const fieldDesc = item.fieldDesc;
                  const fieldId2 = item.fieldId2;
                  const fieldDesc2 = item.fieldDesc2;
                  return (
                    <tr key={fieldId}>
                      <td >
                        <label style={{marginRight: '12px'}}>{item.content}</label>
                        {
                          insurantCustomer[fieldId] === 'Y' &&
                          <FormItem label="受保人" className={styles.rad}>
                            {getFieldDecorator('' + fieldDesc + '', {
                              rules: [
                                {required: true, message: '必输', whitespace: true}
                              ],
                              //validateTrigger: 'onBlur',
                              //trigger: 'onBlur',
                              initialValue: insurantCustomer[fieldDesc]
                            })(
                              <Input disabled={!editFlag} type="textarea" size='large' placeholder='受保人：请详述'/>
                            )}
                          </FormItem>
                        }

                        {
                          !this.state.checkboxP &&
                          appliacntCustomer[fieldId2.replace('OTHER123456', '')] === 'Y' &&
                          <FormItem label="投保人" className={styles.rad}>
                            {getFieldDecorator('' + fieldDesc2 + '', {
                              rules: [{required: true, message: '必输', whitespace: true}],
                              initialValue: appliacntCustomer[fieldDesc2.replace('OTHER123456', '')]
                            })(
                              <Input disabled={!editFlag} type="textarea" size='large' placeholder='投保人：请详述'/>
                            )}
                          </FormItem>
                        }
                      </td>

                      <td >
                        <FormItem className={styles.rad}>
                          {getFieldDecorator('' + fieldId + '', {
                            rules: [{required: true, message: '请选择', whitespace: true}],
                            initialValue: insurantCustomer[fieldId] || 'N'
                          })(
                            <RadioGroup disabled={!editFlag} onChange={this.onChange.bind(this, item.fieldId, 'I')}>
                              <Radio value='Y'>是</Radio>
                              <Radio value='N'>否</Radio>
                            </RadioGroup>
                          )}
                        </FormItem>
                      </td>

                      {
                        !this.state.checkboxP &&
                        <td >
                          <FormItem className={styles.rad}>
                            {getFieldDecorator('' + fieldId2 + '', {
                              rules: [{required: true, message: '请选择', whitespace: true}],
                              initialValue: appliacntCustomer[fieldId2.replace('OTHER123456', '')] || 'N'
                            })(
                              <RadioGroup disabled={!editFlag} onChange={this.onChange.bind(this, item.fieldId2, 'A')}>
                                <Radio value='Y'>是</Radio>
                                <Radio value='N' >否</Radio>
                              </RadioGroup>
                            )}
                          </FormItem>
                        </td>
                      }
                    </tr>
                  );
                })
              }





              {
               femaleFlag &&
                this.state.femaleFields.map((item) => {
                  const fieldId = item.fieldId;
                  const fieldDesc = item.fieldDesc;
                  const fieldId2 = item.fieldId2;
                  const fieldDesc2 = item.fieldDesc2;
                  return (
                    <tr key={fieldId}>
                      <td >
                        <label style={{marginRight: '12px'}}>{item.content}</label>
                        {
                          insurantCustomer[fieldId] === 'Y' &&
                          <FormItem label="受保人" className={styles.rad}>
                            {getFieldDecorator('' + fieldDesc + '', {
                              rules: [{required: true, message: '必输', whitespace: true}],
                              initialValue: insurantCustomer[fieldDesc]
                            })(
                              <Input disabled={!editFlag} type="textarea" size='large' placeholder='受保人：请详述'/>
                            )}
                          </FormItem>
                        }

                        {
                          !this.state.checkboxP &&
                          appliacntCustomer[fieldId2.replace('OTHER123456', '')] === 'Y' &&
                          <FormItem label="投保人" className={styles.rad}>
                            {getFieldDecorator('' + fieldDesc2 + '', {
                              rules: [{required: true, message: '必输', whitespace: true}],
                              initialValue: appliacntCustomer[fieldDesc2.replace('OTHER123456', '')]
                            })(
                              <Input disabled={!editFlag} type="textarea" size='large' placeholder='投保人：请详述'/>
                            )}
                          </FormItem>
                        }
                      </td>
                      <td >
                        <FormItem className={styles.rad}>
                          {getFieldDecorator('' + fieldId + '', {
                            rules: [{required: true, message: '必选', whitespace: true}],
                            initialValue: insurantCustomer[fieldId] || 'N'
                          })(
                            <RadioGroup disabled={!editFlag} onChange={this.onChange.bind(this, item.fieldId, 'I')}>
                              <Radio value='Y'>是</Radio>
                              <Radio value='N' defaultChecked>否</Radio>
                            </RadioGroup>
                          )}
                        </FormItem>
                      </td>

                      {
                        !this.state.checkboxP &&
                        <td >
                          <FormItem className={styles.rad}>
                            {getFieldDecorator('' + fieldId2 + '', {
                              rules: [{required: true, message: '必选', whitespace: true}],
                              initialValue: appliacntCustomer[fieldId2.replace('OTHER123456', '')] || 'N'
                            })(
                              <RadioGroup disabled={!editFlag} onChange={this.onChange.bind(this, item.fieldId2, 'A')}>
                                <Radio value='Y'>是</Radio>
                                <Radio value='N'>否</Radio>
                              </RadioGroup>
                            )}
                          </FormItem>
                        </td>
                      }
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </div>

          {/*附件信息*/}
          <div className='disableds' >
          <div className={styles.attach_div}>
            <div style={{padding: '8px 0 0px 8px ', background: '#E2DCCC', height: '48px', fontSize: '16px', marginBottom: '8px'}}>
              <font style={{marginTop:'5px'}} >上传附件</font>
            </div>

            <FormItem {...formItemLayout} label="身份证正面照片" className={styles.formitem_sty}>
              {getFieldDecorator('file1', {
                rules: [
                  {required: true, message: '请上传身份证正面照片', type:'array'},
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file1,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="身份证反面照片" className={styles.formitem_sty}>
              {getFieldDecorator('file2', {
                rules: [
                  {required: true, message: '请上传身份证反面照片', type:'array'},
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file2,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="住址证明扫描件" className={styles.formitem_sty}>
              {getFieldDecorator('file3',{
                rules: [
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file3,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="信用卡扫描件" className={styles.formitem_sty}>
              {getFieldDecorator('file4',{
                rules: [
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file4,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="护照扫描件" className={styles.formitem_sty}>
              {getFieldDecorator('file5',{
                rules: [
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file5,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="通行证扫描件" className={styles.formitem_sty}>
              {getFieldDecorator('file6',{
                rules: [
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file6,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="出生证" className={styles.formitem_sty}>
              {getFieldDecorator('file7',{
                rules: [
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file7,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="户口本扫描件" className={styles.formitem_sty}>
              {getFieldDecorator('file8',{
                rules: [
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.file8,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={<span>其他附件<span style={{color:'#999999'}}>(可添加多个附件)</span></span>} className={styles.formitem_sty}>
              {getFieldDecorator('fileOther',{
                rules: [
                  {validator: common.vdFile.bind(this),}
                ],
                initialValue:insureance.fileOther,
              })(
                <Uploads disabled={!editFlag} fileNum={10} className={upClass}/>
              )}
            </FormItem>
          </div>

          <div>
            <FormItem labelCol={{sm: {span: 6,} }} wrapperCol={{ sm: {span:13} }} label="预约备注" className={styles.formitem_sty}>
              {getFieldDecorator('description', {
                //initialValue: insureance.description || '',
                initialValue: '',
              })(
                <Input disabled={!editFlag} className={styles['textarea']} type="textarea" style={{width:"100%"}} />
              )}
            </FormItem>
          </div>
          </div>


          {
            (this.props.orderId == '000' || this.state.insureance.dealPath == null) &&
            <Row gutter={24} style={{margin:'30px 0'}}>
              <Col span={4} offset={7}>
                <Button  disabled={!editFlag} type='default' style={{ width:'160px',height:'40px'}} onClick={this.saveInfo.bind(this)} >保存</Button>
              </Col>
              <Col span={2}>
              </Col>
              <Col span={4}>
                <Button disabled={this.state.disableButton} type='primary' style={{ width:'160px',height:'40px'}}  onClick={this.clickNext.bind(this)} >下一步</Button>
              </Col>
            </Row>
          }


          {
            this.props.orderId != null &&
            this.props.orderId != '000' &&
            this.state.insureance.editFlag == true &&
            this.state.insureance.dealPath != null &&
            <Row gutter={24} style={{margin:'30px 0'}}>
              <Col span={10}></Col>
              <Col span={4}>
                <Button type='primary' style={{ width:'160px',height:'40px'}}  onClick={this.submitInfo.bind(this)} >提交至行政</Button>
              </Col>
            </Row>
          }

        </Form>
      </div>

    );
  }
}


export default Form.create()(InsureOrder);
