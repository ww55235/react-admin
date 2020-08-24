import React, { Component } from "react";

import LinkButton from "../../components/linkButton/LinkButton";

import { Card, List, Icon } from "antd";

import { BASE_IMG_URL } from "../../utils/constants";

import { reqCategory } from "../../api/index";

export default class Detail extends Component {
  state = {
    cNameOne: "", //一级分类列表
    cNameTwo: "", //二级分类列表
  };

  async UNSAFE_componentWillMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product;

    //发送ajax请求
    if (pCategoryId === "0") {
      const result = await reqCategory(categoryId); //一级分类
      let cNameOne = result.data.name;
      if (result.status === 0) {
        this.setState({
          cNameOne,
        });
      }
    } else {
      //二级分类
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      let cNameOne = results[0].data.name;
      let cNameTwo = results[1].data.name;
      //更新状态
      this.setState({ cNameOne, cNameTwo });
    }
  }
  render() {
    const { product } = this.props.location.state;
    // console.log(product);
    //解构赋值
    let { name, imgs, price, desc, detail } = product;
    const Item = List.Item;
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon style={{ marginRight: 10 }} type="arrow-left" />
        </LinkButton>
        商品详情
      </span>
    );
    const { cNameOne, cNameTwo } = this.state;
    return (
      <Card title={title} className="detail">
        <List>
          <Item>
            <span className="title">商品名称:</span>
            <span className="content">{name}</span>
          </Item>
          <Item>
            <span className="title">商品描述:</span>
            <span className="content">{desc}</span>
          </Item>
          <Item>
            <span className="title">商品价格:</span>
            <span className="content">{price}元</span>
          </Item>
          <Item>
            <span className="title">所属分类:</span>
            <span className="content">
              {cNameOne} {cNameTwo ? " --> " + cNameTwo : null}
            </span>
          </Item>
          <Item>
            <span className="title">商品图片</span>
            <span className="content">
              {imgs.map((imgItem) => (
                <img key={imgItem} src={BASE_IMG_URL + imgItem} alt="" />
              ))}
            </span>
          </Item>
          <Item>
            <span className="title">商品详情:</span>
            <span
              dangerouslySetInnerHTML={{ __html: detail }}
              className="content"
            ></span>
          </Item>
        </List>
      </Card>
    );
  }
}
