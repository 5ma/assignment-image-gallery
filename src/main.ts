import { createApp } from 'vue'
import App from './App.vue'
import debugPlugin from "@/plugins/debug";

const app = createApp(App)
app.use(debugPlugin)
app.mount('#app')