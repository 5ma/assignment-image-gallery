import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $debug: (...args: any[]) => void
  }
}

export default {
  install: (app: App) => {
    // 開発中のみconsole.logを出す
    app.config.globalProperties.$debug = (...args: any[]): void => {
      if (import.meta.env.MODE === 'development') {
        console.log(...args)
      }
    }
  }
}
