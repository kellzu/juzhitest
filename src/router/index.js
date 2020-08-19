import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/register/index'), hidden: true },
  { path: '/resetPassword', component: () => import('@/views/ams/admin/resetPassword'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/ams',
    component: Layout,
    redirect: '/ams/userDetail',
    name: 'ams',
    meta: { title: '人力管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'userDetail',
        name: 'userDetail',
        component: () => import("@/views/ams/admin/userDetail"),
        meta: { title: '个人信息', icon: 'product-list' }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ams/admin/index'),
        meta: { title: '用户列表', icon: 'product-list' }
      },
      {
        path: 'businessGroup',
        name: 'businessGroup',
        component: () => import('@/views/ems/business/businessGroup'),
        meta: { title: '业务组列表', icon: 'product-list' }
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/pms/shop/index'),
        meta: { title: '商铺列表', icon: 'product-list' }
      },
      // 绩效管理
      {
        path: 'KPL',
        name: 'KPL',
        component: () => import('@/views/ams/performance/index'),
        meta: { title: '绩效管理', icon: 'product-list' }
      },
      {
        path: 'grade',
        name: 'grade',
        // props: true,
        component: () => import('@/views/ams/performance/grade'),
        meta: { title: '绩效考核', icon: 'product-list' },
        hidden: true
      },
      // {
      //   path: 'addAdmin',
      //   name: 'addAdmin',
      //   component: () => import('@/views/ams/admin/add'),
      //   meta: {title: '添加用户', icon: 'admin-add'}
      // },
      // {
      //   path: 'updateAdmin',
      //   name: 'updateAdmin',
      //   component: () => import('@/views/ams/admin/update'),
      //   meta: {title: '修改商品', icon: 'admin-add'},
      //   hidden: true
      // },
    ]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/wholesale/Product',
    name: 'pms',
    meta: { title: '商品管理', icon: 'el-icon-s-goods' },
    children: [
      {
        path: 'wholesale/Product',
        name: 'wholesaleProduct',
        component: () => import('@/views/pms/wholesale/index'),
        meta: { title: '批发商品列表', icon: 'product-list' }
      },
      // {
      //   path: 'product',
      //   name: 'product',
      //   component: () => import('@/views/pms/product/index'),
      //   meta: { title: '商品列表', icon: 'product-list' },
      //   hidden: true,
      // },
      // {
      //   path: 'addProduct',
      //   name: 'addProduct',
      //   component: () => import('@/views/pms/product/add'),
      //   meta: { title: '添加商品', icon: 'product-add' },
      //   hidden: true,
      // },
      // {
      //   path: 'updateProduct',
      //   name: 'updateProduct',
      //   component: () => import('@/views/pms/product/update'),
      //   meta: { title: '修改商品', icon: 'product-add' },
      //   hidden: true
      // },
      // {
      //   path: 'productRecycle',
      //   name: 'productRecycle',
      //   component: () => import('@/views/pms/product/index'),
      //   meta: { title: '商品回收站', icon: 'product-recycle' },
      //   hidden: true
      // },
      // {
      //   path: 'productComment',
      //   name: 'productComment',
      //   component: () => import('@/views/pms/product/index'),
      //   meta: { title: '商品评价', icon: 'product-comment' },
      //   hidden: true
      // },
      {
        path: 'productCate',
        name: 'productCate',
        component: () => import('@/views/pms/productCate/index'),
        meta: { title: '商品分类', icon: 'product-list' }
      },
      {
        path: 'addProductCate',
        name: 'addProductCate',
        component: () => import('@/views/pms/productCate/add'),
        meta: { title: '添加商品分类' },
        hidden: true
      },
      {
        path: 'updateProductCate',
        name: 'updateProductCate',
        component: () => import('@/views/pms/productCate/update'),
        meta: { title: '修改商品分类' },
        hidden: true
      },
      {
        path: 'productAttr',
        name: 'productAttr',
        component: () => import('@/views/pms/productAttr/index'),
        meta: { title: '商品类型', icon: 'product-list' }
      },
      {
        path: 'productAttrList',
        name: 'productAttrList',
        component: () => import('@/views/pms/productAttr/productAttrList'),
        meta: { title: '商品属性列表' },
        hidden: true
      },
      {
        path: 'addProductAttr',
        name: 'addProductAttr',
        component: () => import('@/views/pms/productAttr/addProductAttr'),
        meta: { title: '添加商品属性' },
        hidden: true
      },
      {
        path: 'updateProductAttr',
        name: 'updateProductAttr',
        component: () => import('@/views/pms/productAttr/updateProductAttr'),
        meta: { title: '修改商品属性' },
        hidden: true
      },
      // {
      //   path: 'brand',
      //   name: 'brand',
      //   component: () => import('@/views/pms/brand/index'),
      //   meta: { title: '品牌管理', icon: 'product-brand' },
      //   hidden: true,
      // },
      // {
      //   path: 'addBrand',
      //   name: 'addBrand',
      //   component: () => import('@/views/pms/brand/add'),
      //   meta: { title: '添加品牌' },
      //   hidden: true
      // },
      // {
      //   path: 'updateBrand',
      //   name: 'updateBrand',
      //   component: () => import('@/views/pms/brand/update'),
      //   meta: { title: '编辑品牌' },
      //   hidden: true
      // },

      {
        path: 'wholesale/addProduct',
        name: 'addWholesaleProduct',
        component: () => import('@/views/pms/wholesale/add'),
        meta: { title: '添加批发商品', icon: 'product-list' }
      },
      {
        path: 'wholesale/updateProduct',
        name: 'updateWholesaleProduct',
        component: () => import('@/views/pms/wholesale/update'),
        meta: { title: '修改批发商品' },
        hidden: true
      },
      {
        path: 'spider',
        name: 'spiderIndex',
        meta: { title: '导入商品记录', icon: 'product-list' },
        component: () => import('@/views/sms/spider/index'),
        props: (route) => ({ spiderId: (route.query.spiderId ? new Number(route.query.spiderId) : null) }),
      },
    ]
  },
  {
    // /oms/customerOrder/receiveAddress
    path: '/oms',
    component: Layout,
    redirect: '/oms/customerOrder',
    name: 'oms',
    meta: { title: '客户订单', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'customer',
        name: 'customer',
        meta: { title: '客户列表', icon: 'product-list' },
        component: () => import('@/views/ums/customer/index'),
      },
      {
        name: 'customerReceiveAddress',
        path: 'receiveAddress',
        props: true,
        component: () => import('@/views/ums/customer/receiveAddress'),
        meta: { title: '客户收货地址列表', icon: 'product-list' },
        hidden: true,
      },
      {
        path: 'customerOrder',
        name: 'customerOrder',
        component: () => import('@/views/oms/order/customer/index'),
        meta: { title: '订单列表', icon: 'product-list' },
      }, {
        path: 'addCustomerOrder',
        name: 'addCustomerOrder',
        component: () => import('@/views/oms/order/customer/addCustomerOrder/index'),
        meta: { title: '添加客户订单', icon: 'product-list' },
        hidden: true
      },
      {
        path: 'customerOrderDetail',
        name: 'customerOrderDetail',
        component: () => import('@/views/oms/order/customer/customerOrderDetail/index'),
        meta: { title: '客户订单详情', icon: 'product-list' },
        hidden: true
      },
    ]
  },
  {
    path: '/purchase',
    name: 'purchase',
    component: Layout,
    redirect: '/purchase/orderList',
    meta: { title: '采购管理', icon: 'el-icon-s-management' },
    children: [
      {
        path: 'orderList',
        name: 'orderList',
        component: () => import('@/views/oms/purchase/order/index'),
        meta: { title: '采购订单列表', icon: 'product-list' }
      },
      {
        path: 'createPurchase',
        name: 'createPurchase',
        component: () => import('@/views/oms/purchase/order/createPurchaseOrder'),
        meta: { title: '添加采购订单', icon: 'product-list' }
      }
      , {
        path: 'purchaseDetail',
        name: 'purchaseDetail',
        component: () => import('@/views/oms/purchase/order/detail/purchaseDetail'),
        meta: { title: '采购订单详情', icon: 'product-list' },
        hidden: true
      }
    ]
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    component: Layout,
    redirect: '/warehouse/acceptance',
    meta: { title: '仓库物流', icon: 'el-icon-truck' },
    children: [
      {
        path: 'acceptance',
        name: 'acceptance',
        component: () => import('@/views/acceptance/index'),
        meta: { title: '待验收', icon: 'product-list' }
      },
      {
        path: 'acceptanceCheckDetail',
        name: 'acceptanceCheckDetail',
        component: () => import('@/views/acceptance/compoment/acceptanceCheckDetail'),
        meta: { title: '验收', icon: 'product-list' },
        hidden: true
      },
      // {
      //   path: 'deliveryList',
      //   name: 'deliveryList',
      //   component: () => import('@/views/exWarehouse/deliveryList/index'),
      //   meta: { title: '出货表', icon: 'product-list' },
      // },
      {
        path: 'exWarehouse',
        name: 'exWarehouse',
        component: () => import('@/views/exWarehouse/index'),
        meta: { title: "待发货", icon: "product-list" }
      },
      {
        path: 'dispatchBill',
        name: 'dispatchBill',
        component: () => import('@/views/exWarehouse/dispatchBill/index'),
        meta: { title: '发货单', icon: 'product-list' },
      },
    ]
  },
  {
    path: '/fms',
    name: 'fms',
    component: Layout,
    redirect: '/fms/bill',
    meta: { title: '财务账单', icon: 'el-icon-money' },
    children: [
      // {
      //   path: 'bill',
      //   name: 'bill',
      //   component: () => import('@/views/fms/bill/index'),
      //   meta: { title: "交易账单", icon: "product-list" }
      // },
      {
        path: 'payroll',
        name: 'payroll',
        component: () => import('@/views/fms/payroll/index'),
        meta: { title: "薪资账单", icon: "product-list" }
      },
      {
        path: 'reimbursement',
        name: 'reimbursement',
        component: () => import('@/views/fms/reimbursement/index'),
        meta: { title: '报销申请', icon: 'product-list' }
      },
      {
        path: 'applyDetail',
        name: 'applyDetail',
        component: () => import('@/views/fms/reimbursement/compoment/applyDetail'),
        meta: { title: '报销申请', icon: 'product-list' },
        hidden: true
      }
    ]
  },
  {
    path: '/factory',
    name: 'factory',
    component: Layout,
    redirect: '/factory/factoryList',
    meta: { title: '厂商管理', icon: 'el-icon-discount' },
    children: [
      {
        path: 'factoryList',
        name: 'factoryList',
        component: () => import('@/views/pms/factory/index'),
        meta: { title: '厂商管理', icon: 'product-list' }
      },
      {
        path: 'factoryDetail',
        name: 'factoryDetail',
        component: () => import('@/views/pms/factory/factoryDetail/index'),
        meta: { title: '厂商添加', icon: 'product-list' }

      },
      {
        path: 'factoryDetailShow',
        name: 'factoryDetailShow',
        component: () => import('@/views/pms/factory/factoryDetail/factoryDetail'),
        meta: { title: '厂商信息' },
        hidden: true
      },
    ]
  },
  {
    path: '/forward',
    name: 'forward',
    component: Layout,
    redirect: '/forward/list',
    meta: { title: "货代公司", icon: 'el-icon-office-building' },
    children: [
      {
        path: 'forwarlist',
        name: 'forwarlist',
        component: () => import('@/views/forward/index'),
        meta: { title: '货代公司列表', icon: 'product-list' }
      },
      {
        path: 'forwarDetail',
        name: 'forwarDetail',
        component: () => import("@/views/forward/updateForward/index"),
        meta: { title: '货代公司编辑', icon: 'product-list' }
      }
    ]
  },
  {
    path: '/company',
    name: 'company',
    component: Layout,
    redirect: '/company/meeting',
    meta: { title: '公司会议', icon: 'el-icon-notebook-1' },
    children: [
      {
        path: 'meeting',
        name: 'meeting',
        component: () => import("@/views/meeting/index"),
        meta: { title: '会议记录', icon: 'product-list' }
      }
      , {
        path: 'detail',
        name: 'detail',
        component: () => import("@/views/meeting/detail/index"),
        meta: { title: '创建会议', icon: 'product-list' }
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Layout,
    redirect: '/message/create',
    meta: { title: '留言板', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/message/index'),
        meta: { title: '留言板', icon: 'product-list' }
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/message/list/index'),
        meta: { title: '留言记录', icon: 'product-list' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/roleList',
    name: 'role',
    meta: { title: '权限控制', icon: 'el-icon-key' },
    children: [
      {
        path: 'roleList',
        name: 'roleList',
        component: () => import('@/views/ams/role/index'),
        meta: { title: '角色列表', icon: 'product-list' }
      },
      {
        path: 'roleDetail',
        name: 'roleDetail',
        hidden: true,
        component: () => import('@/views/ams/role/roleDetail/index'),
        meta: { title: '角色创建修改', icon: 'product-list' }
      },
      {
        path: 'permilist',
        name: 'permilist',
        component: () => import('@/views/ams/permi/index'),
        meta: { title: '权限列表', icon: 'product-list' }
      },
      {
        path: 'permissionDetail',
        name: 'permissionDetail',
        hidden: true,
        component: () => import('@/views/ams/permi/permiDetail/index'),
        meta: { title: '权限操作', icon: 'product-list' }
      }
    ]
  },
  {
    path: '/report',
    name: 'report',
    component: Layout,
    redirect: '/report/index',
    meta: { title: '公司报表', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'report',
        name: 'reportIndex',
        component: () => import('@/views/report/index'),
        meta: { title: '每周报表', icon: 'product-list' }
      },
      {
        path: 'createReport',
        name: 'createReport',
        component: () => import('@/views/report/create'),
        meta: { title: '创建报表', icon: 'product-list' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

