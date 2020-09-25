import Vue from 'vue'
import VueRouter from 'vue-router'
import Parent from '../views/Parent.vue'
import Child from '../views/Child.vue'
import TabA from '../views/TabA.vue'
import TabB from '../views/TabB.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Parent',
    component: Parent,
    children: [
      {
        path: '',
        name: 'TabA',
        component: TabA
      },
      {
        path: '/tab-b',
        name: 'TabB',
        component: TabB
      }
    ]
  },
  {
    path: '/detail/:id',
    name: 'Child',
    component: Child
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
