interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly MODE: 'development' | 'production'
  // 更多环境变量...
}