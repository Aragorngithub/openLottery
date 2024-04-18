import { createRouter, createWebHashHistory} from "vue-router";

const routes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/lottery',
  },
  {
    path: '/:page',
    component: () => import('../views/index.vue'),
  },
];
const history = createWebHashHistory();
export default createRouter({ history, routes });