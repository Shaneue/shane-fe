import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Memo from '@/components/Memo'
import Password from '@/components/Password'
import Diary from '@/components/Diary'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/memo',
      name: 'Memo',
      component: Memo
    },
    {
      path: '/password',
      name: 'Password',
      component: Password
    },
    {
      path: '/diary',
      name: 'Diary',
      component: Diary
    }
  ]
})
