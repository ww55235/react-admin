import React, { Component } from "react";

import { EditorState, convertToRaw, ContentState } from "draft-js";

import { Editor } from "react-draft-wysiwyg";

import draftToHtml from "draftjs-to-html";

import htmlToDraft from "html-to-draftjs";

import PropTypes from "prop-types";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//上传图片的函数
function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/manage/img/upload");
    // xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
    const data = new FormData();
    data.append("image", file);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      const { url } = response.data;
      resolve({ data: { link: url } });
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const html = this.props.detail;
    //如果有值,则创建
    if (html) {
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
  }

  //获取用户输入的内容
  getDetail = () => {
    let { editorState } = this.state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{
          border: "2px solid black",
          paddingLeft: 10,
          minHeight: 200,
        }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
      />
    );
  }
}
