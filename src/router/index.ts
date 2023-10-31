import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/message',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/message',
                name: 'message',
                meta: {
                    title: '消息列表',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "message" */ '../views/message.vue'),
            },
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '新闻列表',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '发布新闻',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
            {
                path: '/product',
                name: 'product',
                meta: {
                    title: '产品列表',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "product" */ '../views/product.vue'),
            },
            {
                path: '/productadd',
                name: 'productadd',
                meta: {
                    title: '发布产品',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/productadd.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | AGROCHINA后台管理`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
