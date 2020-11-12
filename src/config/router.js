import Vue from 'vue'
import VueRouter from 'vue-router'

import Person from '@/components/person/Person'
import Home from '@/components/home/Home'

Vue.use(VueRouter)

const routes = [{
    name: 'person',
    path: '/person',
    component: Person
},
{
    name: 'home',
    path: '/',
    component: Home
}]

export default new VueRouter({
    mode: 'history',
    routes: routes
})
