import { createApp } from 'vue'
import App from './App.vue'
import MouseTrackerPlugin from 'vue-mouse-tracker'

const app = createApp(App)

// usage plugin
app.use(MouseTrackerPlugin, {
  checkInterval: 30,
  sendInterval: 3000,
  url: '/api/track'
})

app.mount('#app')
