import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRoutes = [
  // export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '管理页面',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
]

/**
 * 动态路由
 */
 export const asyncRoutes = [
  //讲师管理目录
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/table',
    name: '讲师管理',
    meta: { title: '讲师管理', icon: 'peoples' },
    children: [
      {
        path: 'table',
        name: '讲师列表',
        component: () => import('@/views/edu/teacher/list'),
        meta: { title: '讲师列表', icon: 'table' }
      },
      {
        path: 'save',
        name: '添加讲师',
        component: () => import('@/views/edu/teacher/save'),
        meta: { title: '添加讲师', icon: 'user' }
      },
      {
        path: 'edit/:id',
        name: '修改讲师',
        component: () => import('@/views/edu/teacher/save'),
        meta: { title: '修改讲师', icon: 'tree' },
        hidden:true
      }
    ]
  },

  //课程分类管理
  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/list',
    name: '课程分类管理',
    meta: { title: '课程分类管理', icon: 'nested' },
    children: [
      {
        path: 'save',
        name: '添加课程分类',
        component: () => import('@/views/edu/subject/save'),
        meta: { title: '添加课程分类', icon: 'table' }
      },
      {
        path: 'list',
        name: '课程分类列表',
        component: () => import('@/views/edu/subject/list'),
        meta: { title: '课程分类列表', icon: 'tree' }
      }
    ]
  },

  //课程管理
  {
    path:'/course',
    component: Layout,
    redirect: '/course/list',
    name: '课程管理',
    meta: { title: '课程管理', icon: 'clipboard' },
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/edu/course/list'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: 'info',
        name: '添加课程',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '添加课程', icon: 'edit' }
      },
      {
        path: 'info/:id',
        name: '编辑课程',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '编辑课程', icon: 'edit' },
        hidden:true
      },
      {
        path: 'chapter/:id',
        name: '课程大纲',
        component: () => import('@/views/edu/course/chapter'),
        meta: { title: '课程大纲', icon: 'edit' },
        hidden:true
      },
      {
        path: 'publish/:id',
        name: '最终发布',
        component: () => import('@/views/edu/course/publish'),
        meta: { title: '最终发布', icon: 'edit' },
        hidden:true
      }
    ]
  },

  // Banner 管理
  {
    path:'/banner',
    component: Layout,
    redirect: '/banner/list',
    name: 'Banner管理',
    meta: { title: 'Banner管理', icon: 'clipboard' },
    children: [
      {
        path: 'list',
        name: 'Banner列表',
        component: () => import('@/views/edu/banner/list'),
        meta: { title: 'Banner列表', icon: 'table' }
      },
      {
        path: 'save',
        name: '添加Banner',
        component: () => import('@/views/edu/banner/save'),
        meta: { title: '添加Banner', icon: 'edit' }
      },
      {
        path: 'save/:id',
        name: '编辑Banner',
        component: () => import('@/views/edu/banner/save'),
        meta: { title: '编辑Banner', icon: 'edit' },
        hidden:true
      }
    ]
  },

  //数据统计
  {
    path:'/statistic',
    component: Layout,
    redirect: '/statistic/create',
    name: '数据统计',
    meta: { title: '数据统计', icon: 'list' },
    children: [
      {
        path: 'create',
        name: '生成数据',
        component: () => import('@/views/edu/statistic/create'),
        meta: { title: '生成数据', icon: 'star' }
      },
      {
        path: 'show',
        name: '图表显示',
        component: () => import('@/views/edu/statistic/show'),
        meta: { title: '图表显示', icon: 'table' }
      },
    ]
  },
  {
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    name: '权限管理',
    meta: { title: '权限管理', icon: 'eye' },
    children: [
      {
        path: 'user/list',
        name: '用户管理',
        component: () => import('@/views/acl/user/list'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role/list',
        name: '角色管理',
        component: () => import('@/views/acl/role/list'),
        meta: { title: '角色管理' }
      },
      {
        path: 'role/form',
        name: '角色添加',
        component: () => import('@/views/acl/role/form'),
        meta: { title: '角色添加' },
        hidden: true
      },
      {
        path: 'role/update/:id',
        name: '角色修改',
        component: () => import('@/views/acl/role/form'),
        meta: { title: '角色修改' },
        hidden: true
      },
      {
        path: 'role/distribution/:id',
        name: '角色权限',
        component: () => import('@/views/acl/role/roleForm'),
        meta: { title: '角色权限' },
        hidden: true
      },
      {
        path: 'menu/list',
        name: '菜单管理',
        component: () => import('@/views/acl/menu/list'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'user/add',
        name: '用户添加',
        component: () => import('@/views/acl/user/form'),
        meta: { title: '用户添加' },
        hidden: true
      },
      {
        path: 'user/update/:id',
        name: '用户修改',
        component: () => import('@/views/acl/user/form'),
        meta: { title: '用户修改' },
        hidden: true
      },
      {
        path: 'user/role/:id',
        name: '用户角色',
        component: () => import('@/views/acl/user/roleForm'),
        meta: { title: '用户角色' },
        hidden: true
      }

    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

// export default new Router({
//   // mode: 'history', //后端支持可开
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })


const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 发生路由切换以后让页面回到顶部
  scrollBehavior: () => ({ y: 0 }),
  //用来配置多个route对象
  routes: constantRoutes
})

// 创建一个路由器实例
const router = createRouter()
export default router






