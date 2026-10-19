import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import { router } from './app/router'

import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

const app = createApp(App)
// Pinia подключается до роутера: guard'ы маршрутов обращаются к store уже при первой навигации.
app.use(createPinia())
app.use(router)
app.mount('#app')
