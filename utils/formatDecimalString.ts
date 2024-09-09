function formatDecimalString(str:string) {
  // 将科学计数法表示的数字转换为普通数字字符串
  let num = Number(str);
  let formattedStr = num.toLocaleString('en-US', { maximumFractionDigits: 20 });

  // 移除末尾的 .0
  formattedStr = formattedStr.replace(/\.0+$/, '');

  // 如果字符串以 . 结尾，也移除 .
  formattedStr = formattedStr.replace(/\.$/, '');

  return formattedStr;
}
export default formatDecimalString;