import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/lottery'
  },
  {
    path: '/:page',
    component: () => import('../views/PageViews.vue')
  }
]
const history = createWebHashHistory()
export default createRouter({ history, routes })
