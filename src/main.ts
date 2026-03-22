import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import '@/assets/main.css'
import '@/assets/tailwind.css'

import HomeView    from '@/views/HomeView.vue'
import StepsView   from '@/views/StepsView.vue'
import ResultsView from '@/views/ResultsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',        component: HomeView },
    { path: '/check',   component: StepsView },
    { path: '/results', component: ResultsView },
  ],
})

const pinia = createPinia()
const app   = createApp(App)
app.use(pinia).use(router).mount('#app')
