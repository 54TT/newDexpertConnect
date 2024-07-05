import NotificationChange from '../src/components/message';
function copy(text: string) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; // 防止出现滚动条
  document.body.appendChild(textarea);
  textarea.select();
  try {
    var successful = document.execCommand('copy');
    if (successful) {
      NotificationChange('success', '复制成功！');
    } else {
      NotificationChange('warning', '复制失败，请手动复制。');
    }
  } catch (err) {
    NotificationChange('warning', '无法复制，请手动复制。');
  }
  document.body.removeChild(textarea);
}

export default copy;
