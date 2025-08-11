import { createRouter, createWebHistory } from 'vue-router'

import SingleTownship from '../views/SingleTownship.vue'
import TownshipDuo from '../views/TownshipDuo.vue'
import FullCapeCulture from '../views/FullCapeCulture.vue'
import Success from '../views/Success.vue'
import Cancel from '../views/Cancel.vue'
import TourPackages from '../components/TourPackages.vue' // <--- add this import
import RegisterForm from '../views/RegisterForm.vue'
import Checkout from '../views/Checkout.vue'

const routes = [
 { path: '/', redirect: '/single' },
  { path: '/single', component: SingleTownship },
  { path: '/duo', component: TownshipDuo },
  { path: '/full', component: FullCapeCulture },
  { path: '/success', component: Success },
  { path: '/cancel', component: Cancel },
  { path: '/tours', component: TourPackages },
  { path: '/register', component: RegisterForm },
  { path: '/checkout', component: Checkout }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
