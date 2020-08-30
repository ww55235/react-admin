import React, { Component } from "react";
import { Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { set_header_title } from "../../redux/createActions";
import "./index.less";
/*
前台 404 页面
*/
class NotFound extends Component {
  goHome = () => {
    this.props.set_header_title("首页");
    this.props.history.replace("/home");
  };
  render() {
    return (
      <Row className="not-found">
        <Col span={12} className="left"></Col>
        <Col span={12} className="right">
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
          <div>
            <Button type="primary" onClick={this.goHome}>
              回到首页
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}
export default connect(null, { set_header_title })(NotFound);
