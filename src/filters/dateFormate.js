export default function (time) {
  if (!time) {
    return "";
  }
  //定义一个日期对象
  const date = new Date(time);

  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
}
