import React, { Component } from "react";

import { Card, Select, Input, Button, Icon, Table, message } from "antd";

import LinkButton from "../../components/linkButton/LinkButton";

import {
  reqProducts,
  reqSearchProducts,
  reqUpdateCategoryStatus,
} from "../../api/index";

import { PAGE_SIZE } from "../../utils/constants";

export default class ProductHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [], //商品数据
      total: 0, //商品总数量
      loading: false, //控制loading的显示
      searchName: "", //搜索的名称
      searchType: "productName", //根据什么字段进行搜索 (默认为productName) productName/productDesc
    };
  }

  //更新商品的状态
  updateStatus = async (productId, status) => {
    const result = await reqUpdateCategoryStatus(productId, status);
    if (result.status === 0) {
      message.success("更新商品状态成功!");
    }
    this.getProducts(this.pageNum);
  };

  //初始化列
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "¥" + price, //当前指定了对应的属性值，传入的是对应的属性值
      },
      {
        title: "状态",
        render: (product) => {
          const { _id, status } = product;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                style={{ marginTop: "10px" }}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                {status === 1 ? "在售" : "已下架"}
              </p>
            </span>
          );
        },
      },
      {
        title: "操作",
        render: (product) => {
          // console.log(product);
          return (
            <span>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/detail", { product })
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/addproduct", product)
                }
              >
                修改
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  //获取商品数据
  getProducts = async (pageNum = 1, pageSize = PAGE_SIZE) => {
    this.pageNum = pageNum;
    //显示loading
    this.setState({
      loading: true,
    });

    const { searchType, searchName } = this.state;
    let result;
    //根据关键字进行搜索
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize,
        searchName,
        searchType,
      });
    } else {
      result = await reqProducts(pageNum, pageSize);
    }
    //显示loading
    this.setState({
      loading: false,
    });
    //请求数据成功
    if (result.status === 0) {
      // console.log(result);
      const { list, total } = result.data;

      //更新状态
      this.setState({
        products: list,
        total,
      });
    } else {
      //请求数据失败
      message.error("获取数据出错了。");
    }
  };

  //发送ajax请求获取商品数据
  componentDidMount() {
    this.getProducts();
  }

  render() {
    const { products, total, loading, searchName, searchType } = this.state;
    const Option = Select.Option;
    const title = (
      <span>
        <Select
          value={searchType}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          value={searchName}
          placeholder="关键字"
          style={{ width: 150, margin: "0 10px" }}
          onChange={(e) => {
            this.setState({ searchName: e.currentTarget.value });
          }}
        />
        <Button type="primary" onClick={() => this.getProducts()}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <span>
        <Button
          type="primary"
          onClick={() => this.props.history.push("/product/addproduct")}
        >
          <Icon type="plus" />
          添加商品
        </Button>
      </span>
    );
    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            loading={loading}
            bordered
            dataSource={products}
            columns={this.columns}
            rowKey="_id"
            pagination={{
              current: this.pageNum,
              defaultPageSize: PAGE_SIZE,
              showQuickJumper: true,
              total,
              onChange: this.getProducts,
            }}
          />
        </Card>
      </div>
    );
  }
}
