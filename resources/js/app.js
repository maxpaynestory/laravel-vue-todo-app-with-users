require('./bootstrap');

import Vue from 'vue'

import App from './vue/app'

import VueRouter from 'vue-router'

import Vuex from 'vuex'

import Welcome from './vue/screens/welcome'
import Todos from './vue/screens/todos'
import Login from './vue/screens/login'
import Register from './vue/screens/register'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
    mode:"history",
    routes: [
        {
            path:'/',
            component: Welcome,
            name: 'home',
            meta:{
                redirectTotodos:true
            }
        },
        {
            path:'/todos',
            component: Todos,
            name: 'todos',
            meta:{
                checkauth:true
            }
        },
        {
            path:'/login',
            component: Login,
            name: 'login',
            meta:{
                redirectTotodos: true
            }
        },
        {
            path:'/register',
            component: Register,
            name: 'register'
        }
    ]
});

router.beforeEach((to, from, next) => {
    if(to.meta.redirectTotodos && localStorage.getItem("token"))
    {
        next({ name: "todos"});
    }else if(to.meta.checkauth && localStorage.getItem("token") == null){
        next({ name: "login"});
    }else{
        next();
    }
})

const app = new Vue({
    el: '#vue-app',
    router,
    components: {App}
});