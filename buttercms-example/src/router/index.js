import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import CustomersHome from '@/components/CustomersHome'
import CustomerPage from '@/components/CustomerPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: HomePage
    },
    {
      path: '/customers/',
      name: 'customers-home',
      component: CustomersHome
    },
    {
      path: '/customers/:slug',
      name: 'customer-page',
      component: CustomerPage
    }
  ]
})