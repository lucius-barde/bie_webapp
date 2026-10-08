import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import router from './router'
import App from './App.vue'
import './styles/globals.css'

const app = createApp(App)

app.use(router)
app.use(createHead())
app.mount('#app')
