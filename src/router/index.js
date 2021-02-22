import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/measure',
    name: 'Measure',
    component: () => import('../views/Measure.vue'),
  },
  {
    path: '/reset',
    name: 'Reset',
    component: () => import('../views/Reset.vue'),
  },
  {
    path: '/shape',
    name: 'Shape',
    component: () => import('../views/Shape.vue'),
  },
  {
    path: '/trajctory',
    name: 'Trajectory',
    component: () => import("../views/Trajectory.vue"),
  },
  {
    path: '/realtime',
    name: 'Realtime',
    component: () => import("../views/Realtime.vue"),
  },
  {
    path: '/mouseposition',
    name: 'Mouseposition',
    component: () => import("../views/Mouseposition.vue"),
  },
  {
    path: '/notfind',
    name: 'Notfind',
    component: () => import("../components/Notfind.vue")
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
