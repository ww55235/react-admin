import React from "react";
import { Upload, Icon, Modal, message } from "antd";
import { reqDeleteImg } from "../../api/index";
import { BASE_IMG_URL } from "../../utils/constants";
import PropTypes from "prop-types";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class PicturesWall extends React.Component {
  //声明接受数据的类型
  static propTypes = {
    imgs: PropTypes.array,
  };
  constructor(props) {
    super(props);
    let fileList = [];
    let imgs = this.props.imgs;
    //  console.log(imgs);
    if (imgs && imgs.length > 0) {
      //进行赋值
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: BASE_IMG_URL + img,
      }));
    }

    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList, //所有已上传图片的数组
    };
  }

  //获取上传的图片name []
  getImgs = () => this.state.fileList.map((img) => img.name);

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ fileList, file }) => {
    //console.log(fileList, file);
    //上传成功
    if (file.status === "done") {
      message.success("上传图片成功！");
      const result = file.response;
      if (result.status === 0) {
        let { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error("上传图片失败！");
      }
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("删除图片成功！");
      } else {
        message.error("删除图片失败");
      }
    }
    //更新状态
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" //上传图片的接口地址
          listType="picture-card" //展示的演示
          accept="image/*" //只接受图片类型
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name="image" //发送请求的参数名
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
