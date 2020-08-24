import React from "react";
import "./index.less";

//函数式组件
// export default function (props) {
//   // console.log(props);
//   return (
//     <button className="link-button" {...props}>
//       {props.children}
//     </button>
//   );
// }

//类定义组件

export default class LinkButton extends React.Component {
  render() {
    return (
      <button className="link-button" {...this.props}>
        {this.props.children}
      </button>
    );
  }
}
