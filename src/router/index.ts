import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Ganttchart from '../views/Ganttchart.vue'
import Table from '../views/Table.vue'
import Kanban from '../views/Kanban.vue'
import Calendar from '../views/Calendar.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/table',
    name: 'table',
    component: Table
  },
  {
    path: '/kanban',
    name: 'kanban',
    component: Kanban
  },
  {
    path: '/ganttchart',
    name: 'ganttchart',
    component: Ganttchart
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: Calendar
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
