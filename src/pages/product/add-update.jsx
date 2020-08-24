import React, { Component } from "react";

import { Card, Input, Form, Button, Icon, Cascader, message } from "antd";

import LinkButton from "../../components/linkButton/LinkButton";

import { reqCategorys, reqAddOrUpdateProduct } from "../../api/index";

import RichTextEditor from "./RichTextEditor";

import PhotoWall from "./photoWall";
const { Item } = Form;
const { TextArea } = Input;

class AddProduct extends Component {
  constructor(props) {
    super(props);
    //创建容器
    this.photoWall = React.createRef();
    this.detail = React.createRef();
  }
  // 定义组件的状态
  state = {
    options: [],
  };

  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // console.log(typeof selectedOptions[selectedOptions.length - 1]);
    //显示loading
    targetOption.loading = true;
    //获取二级分类
    const subCategorys = await this.getCategorys(targetOption.value);
    //隐藏loading
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      //生成一个二级列表的options
      const subOptions = subCategorys.map((childItem) => ({
        value: childItem._id,
        label: childItem.name,
        isLeaf: true,
      }));
      targetOption.children = subOptions;
    } else {
      //没有二级列表
      targetOption.isLeaf = true;
    }
    //更新数据
    this.setState({
      options: [...this.state.options],
    });
  };

  //验证价格输入是否正确
  validatorPrice = (rule, value, callback) => {
    if (+value > 0) {
      callback(); //输入正确
    } else {
      callback("价格必须大于0"); //验证不通过
    }
  };

  //submitHandler 添加商品
  submitHandler = () => {
    this.props.form.validateFields(async (err, values) => {
      //没有错误，验证成功
      if (!err) {
        const imgs = this.photoWall.current.getImgs();
        let detail = this.detail.current.getDetail();
        let { categorys, desc, name, price } = values;
        let pCategoryId, categoryId;
        //一级菜单下
        if (categorys.length === 1) {
          //父分类Id
          pCategoryId = "0";
          //一级菜单下的分类Id
          categoryId = categorys[0];
        } else {
          //父分类Id
          pCategoryId = categorys[0];
          // 子分类Id
          categoryId = categorys[1];
        }
        const product = {
          categoryId,
          pCategoryId,
          name,
          desc,
          price,
          detail,
          imgs,
        };

        if (this.isUpdate) {
          product._id = this.product._id;
        }
        //发送ajax请求
        const result = await reqAddOrUpdateProduct(product);
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "修改" : "添加"}商品成功！`);
          //跳转路由
          this.props.history.goBack();
        } else {
          message.error(`${this.isUpdate ? "修改" : "添加"}商品失败！`);
        }
        /*
     categoryId    |Y       |string   |分类ID
    |pCategoryId   |Y       |string   |父分类ID
    |name          |Y       |string   |商品名称
    |desc          |N       |string   |商品描述
    |price         |N       |string   |商品价格
    |detail        |N       |string   |商品详情
    |imgs          |N       |array   |商品图片名数组
 */
      }
    });
  };
  getInitOptions = async (categorys) => {
    //遍历categorys []
    const newCategorys = categorys.map((item) => ({
      value: item._id,
      label: item.name,
      isLeaf: false,
    }));
    //如果是一个二级商品分类
    let { isUpdate, product } = this;
    //categoryId
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      //获取二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      //生成二级菜单列表下的options
      const childrenOptions = subCategorys.map((cItem) => ({
        value: cItem._id,
        label: cItem.name,
        isLeaf: true,
      }));
      //找到当前商品对应的一级option对象
      const targetOption = newCategorys.find(
        (option) => option.value === pCategoryId
      );
      //关联对应的option
      targetOption.children = childrenOptions;
    }

    //更新数据 options
    this.setState({
      options: newCategorys,
    });
  };

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        //一级分类列表的数据
        this.getInitOptions(categorys);
      } else {
        //二级分类列表
        return categorys;
      }
    }
  };
  componentDidMount() {
    this.getCategorys("0");
  }

  UNSAFE_componentWillMount() {
    //如果有值则为修改商品，否则为添加商品
    let product = this.props.location.state;
    //判断是否为更新标识
    this.isUpdate = !!product;
    this.product = product || {};
  }

  render() {
    const isUpdate = this.isUpdate;
    let product = this.product;
    let { categoryId, pCategoryId } = product;
    let categorys = [];
    if (isUpdate) {
      //一级分类的Id
      if (pCategoryId === "0") {
        categorys.push(pCategoryId);
      } else {
        // 二级分类的Id
        categorys.push(pCategoryId);
        categorys.push(categoryId);
      }
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ marginRight: 10 }} />
          <span>{isUpdate ? "修改商品" : "添加商品"}</span>
        </LinkButton>
      </span>
    );

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "必须输入商品名称" }],
              initialValue: product.name,
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              rules: [{ required: true, message: "必须输入商品描述" }],
              initialValue: product.desc,
            })(
              <TextArea
                placeholder="请输入商品描述"
                autosize={{ minRows: 2, maxRows: 10 }}
              ></TextArea>
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              rules: [
                { required: true, message: "必须输入商品价格" },
                {
                  validator: this.validatorPrice,
                },
              ],
              initialValue: product.price,
            })(
              <Input
                placeholder="请输入商品价格"
                type="number"
                addonAfter="元"
              ></Input>
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categorys", {
              rules: [{ required: true, message: "必须选择商品分类" }],
              initialValue: categorys,
            })(
              <Cascader options={this.state.options} loadData={this.loadData} />
            )}
          </Item>
          <Item label="商品图片">
            <PhotoWall ref={this.photoWall} imgs={product.imgs} />
          </Item>

          <Item
            label="商品详情"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 18 }}
          >
            <RichTextEditor ref={this.detail} detail={product.detail} />
          </Item>
        </Form>
        <Button type="primary" onClick={this.submitHandler}>
          提交
        </Button>
      </Card>
    );
  }
}
export default Form.create()(AddProduct);
