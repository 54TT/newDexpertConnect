import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// i18next-browser-languagedetector插件 这是一个 i18next 语言检测插件，用于检测浏览器中的用户语言，
// 详情请访问：https://github.com/i18next/i18next-browser-languageDetector
// 可以通过localStorage.getItem('i18nextLng')取出当前语言环境
import LanguageDetector from "i18next-browser-languagedetector";

// 引入需要实现国际化的简体、英文两种数据的json文件
import zhTranslation from "./locales/zh.json";
import enTranslation from "./locales/en.json";

i18n
  .use(LanguageDetector) // 嗅探当前浏览器语言 zh-CN
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  // 初始化 i18next
  // 配置参数的文档: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en_US: { translation: enTranslation },
      zh_CN: { translation: zhTranslation },
    },
    fallbackLng: "en_US", // 默认当前环境的语言
    // 需要链式调用messages.welcome
    // keySeparator: false, // we do not use keys in form messages.welcome
    debug: false,
    interpolation: { escapeValue: false },
  });

export default i18n;
