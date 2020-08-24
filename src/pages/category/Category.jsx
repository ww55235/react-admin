import React, { Component } from "react";

import { Card, Button, Icon, Table, message, Modal } from "antd";
import {
  reqCategorys,
  reqAddCategory,
  reqUpdateCategory,
} from "../../api/index";

import LinkButton from "../../components/linkButton/LinkButton";

import AddCategory from "./addCategory/addCategorys";

import UpdateCategory from "./updateCategory/updateCategory";

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorys: [], //一级分类列表
      subCategorys: [], //二级分类列表
      loading: false,
      parentId: "0",
      parentName: "",
      showStatus: 0, //0都不显示 1显示添加 2显示更新
    };
  }

  //获取二级分类列表数据
  getSubCategorys = (category) => {
    //console.log(category);
    //获取二级分类列表
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      () => {
        this.getCategorys();
      }
    );
  };

  initColumns = () => {
    this.columns = [
      {
        title: "分类的名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "操作",
        width: 300,
        render: (category) => {
          const { parentId } = this.state;
          return (
            <span>
              <LinkButton onClick={() => this.showUpdateCategory(category)}>
                修改分类
              </LinkButton>
              {parentId === "0" ? (
                <LinkButton onClick={() => this.getSubCategorys(category)}>
                  查看子分类
                </LinkButton>
              ) : null}
            </span>
          );
        },
      },
    ];
  };

  //为第一次render准备数据
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  //发送ajax请求处理异步任务
  componentDidMount() {
    this.getCategorys();
  }
  getCategorys = async (parentId) => {
    this.setState({
      loading: true,
    });
    parentId = parentId || this.state.parentId;
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      //可能是一级的，也可能是二级的
      const categorys = result.data;
      if (parentId === "0") {
        //更新数据
        this.setState({
          categorys,
          loading: false,
        });
      } else {
        //更新数据
        this.setState({
          subCategorys: categorys, //更新二级列表数据
          loading: false,
        });
      }
    } else {
      message.error("请求数据出错");
    }
  };

  //更新显示为一级菜单项
  showFirstCategory = () => {
    //更新数据
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };

  //显示更新的modal
  showUpdateCategory = (category) => {
    //保存数据
    this.category = category;
    //更新数据
    this.setState({
      showStatus: 2,
    });
  };

  //点击更新
  updateCategory = () => {
    //console.log(this.form);
    this.form.validateFields(async (err, values) => {
      //如果没有错误
      if (!err) {
        const categoryId = this.category._id;
        const { categoryName } = values;
        //发送更新的ajax请求
        const result = await reqUpdateCategory({ categoryId, categoryName });
        // console.log(result);
        if (result.status === 0) {
          //重新获取数据
          this.getCategorys();
        } else {
          message.error("获取数据出错");
        }
        //隐藏modal
        this.handleCancel();
      }
    });
  };

  //显示添加的modal
  showAddCategory = () => {
    this.setState({
      showStatus: 1,
    });
  };

  //点击添加
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      //如果没有出现错误
      if (!err) {
        //获取数据
        const { parentId, categoryName } = values;
        //发送添加的ajax请求
        const result = await reqAddCategory({ parentId, categoryName });
        if (result.status === 0) {
          //添加的分类就是当前列表下的分类
          //重新获取数据
          this.getCategorys();
        } else if (parentId === "0") {
          //如果在二级菜单添加一级数据 需要重新获取一下一级数据
          this.getCategorys("0");
        } else {
          message.error("获取数据失败了。");
        }
        this.handleCancel();
      }
    });
  };

  //隐藏模态框(modal)
  handleCancel = () => {
    //清除文本框缓存
    this.form.resetFields();
    this.setState({
      showStatus: 0,
    });
  };

  render() {
    const {
      categorys,
      loading,
      parentId,
      subCategorys,
      parentName,
      showStatus,
    } = this.state;
    const title =
      parentId === "0" ? (
        "一级菜单列表"
      ) : (
        <span>
          <LinkButton onClick={this.showFirstCategory}>一级菜单列表</LinkButton>
          <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
          {parentName}
        </span>
      );
    const extra = (
      <Button onClick={this.showAddCategory} type="primary">
        <Icon type="plus"></Icon>
        添加
      </Button>
    );

    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            bordered
            rowKey="_id"
            dataSource={parentId === "0" ? categorys : subCategorys}
            columns={this.columns}
            loading={loading}
            pagination={{
              defaultPageSize: 3,
              showQuickJumper: true,
            }}
          />
          <Modal
            title="添加数据"
            visible={showStatus === 1}
            onOk={this.addCategory}
            onCancel={this.handleCancel}
          >
            <AddCategory
              categorys={categorys}
              parentId={parentId}
              setForm={(form) => {
                this.form = form;
              }}
            />
          </Modal>
          <Modal
            title="更新数据"
            visible={showStatus === 2}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
          >
            <UpdateCategory
              categoryName={this.category ? this.category.name : ""}
              setForm={(form) => {
                this.form = form;
              }}
            />
          </Modal>
        </Card>
      </div>
    );
  }
}
