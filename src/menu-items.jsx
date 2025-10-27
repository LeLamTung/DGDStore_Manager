import { title } from "process";
import LogoutMenuItem from "views/tables/Logout";
const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        }
      ]
    },
    // {
    //   id: 'ui-element',
    //   title: 'UI ELEMENT',
    //   type: 'group',
    //   icon: 'icon-ui',
    //   children: [
    //     {
    //       id: 'component',
    //       title: 'Component',
    //       type: 'collapse',
    //       icon: 'feather icon-box',
    //       children: [
    //         {
    //           id: 'button',
    //           title: 'Button',
    //           type: 'item',
    //           url: '/basic/button'
    //         },
    //         {
    //           id: 'badges',
    //           title: 'Badges',
    //           type: 'item',
    //           url: '/basic/badges'
    //         },
    //         {
    //           id: 'breadcrumb',
    //           title: 'Breadcrumb & Pagination',
    //           type: 'item',
    //           url: '/basic/breadcrumb-paging'
    //         },
    //         {
    //           id: 'collapse',
    //           title: 'Collapse',
    //           type: 'item',
    //           url: '/basic/collapse'
    //         },
    //         {
    //           id: 'tabs-pills',
    //           title: 'Tabs & Pills',
    //           type: 'item',
    //           url: '/basic/tabs-pills'
    //         },
    //         {
    //           id: 'typography',
    //           title: 'Typography',
    //           type: 'item',
    //           url: '/basic/typography'
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      id: 'ui-forms',
      title: 'FORMS & TABLES',
      type: 'group',
      icon: 'icon-group',
      children: [
        // {
        //   id: 'forms',
        //   title: 'Form Elements',
        //   type: 'item',
        //   icon: 'feather icon-file-text',
        //   url: '/forms/form-basic'
        // },
        // {
        //   id: 'table',
        //   title: 'Table',
        //   type: 'item',
        //   icon: 'feather icon-server',
        //   url: '/tables/bootstrap'
        // },
        {
          id:"roles",
          title:'Chức vụ',
          type:'item',
          icon:'feather icon-briefcase',
          url:'role/list',
        },
        {
          id:'accounts',
          title:'Tài khoản',
          type:'item',
          icon:'feather icon-users',
          url:'account/list'
        },
        {
          id:"categories",
          title:'Danh mục',
          type:'item',
          icon:'feather icon-list',
          url:'category/list',
        },
        {
          id:"products",
          title:'Sản phẩm',
          type:'item',
          icon:'feather icon-smartphone',
          url:'product/list',
        },
        {
          id:'images',
          title:'Hình ảnh',
          type:'item',
          icon:'feather icon-image',
          url:'images/list',
        },
        {
          id:'orders',
          title:'Đơn hàng',
          type:'item',
          icon:'feather icon-shopping-cart',
          url:'order/list',
        },
        {
          id:'orderdetails',
          title:'Chi tiết đơn hàng',
          type:'item',
          icon:'feather icon-clipboard',
          url:'orderdetail/list',
        },
        // {
        //   id:'account_add',
        //   title:'Account_Add',
        //   type:'item',
        //   icon:'feather icon-users',
        //   url:'account/list'
        // }
      ]
    },
    // {
    //   id: 'chart-maps',
    //   title: 'Chart & Maps',
    //   type: 'group',
    //   icon: 'icon-charts',
    //   children: [
    //     {
    //       id: 'charts',
    //       title: 'Charts',
    //       type: 'item',
    //       icon: 'feather icon-pie-chart',
    //       url: '/charts/nvd3'
    //     },
    //     {
    //       id: 'maps',
    //       title: 'Maps',
    //       type: 'item',
    //       icon: 'feather icon-map',
    //       url: '/maps/google-map'
    //     }
    //   ]
    // },
    {
      id: 'pages',
      title: 'Auth',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
        
          children: [
            // {
            //   id: 'signup',
            //   title: 'Sign up',
            //   type: 'item',
            //   url: '/auth/signup',
            //   target: true,
            //   breadcrumbs: false
            // },
            {
              id: 'signin',
              title: 'Sign in',
              type: 'item',
              url: '/auth/signin',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'logout',
              title: 'Log out',
              type: 'item',
              icon: 'feather icon-log-out',
              breadcrumbs: false,
              url: '/auth/logout',
              // Loại bỏ URL, thay vào đó là LogoutMenuItem
              // component: <LogoutMenuItem />
            }

          ]
        },
        // {
        //   id: 'sample-page',
        //   title: 'Sample Page',
        //   type: 'item',
        //   url: '/sample-page',
        //   classes: 'nav-item',
        //   icon: 'feather icon-sidebar'
        // },
        // {
        //   id: 'documentation',
        //   title: 'Documentation',
        //   type: 'item',
        //   icon: 'feather icon-book',
        //   classes: 'nav-item',
        //   url: 'https://codedthemes.gitbook.io/datta/',
        //   target: true,
        //   external: true
        // },
        // {
        //   id: 'menu-level',
        //   title: 'Menu Levels',
        //   type: 'collapse',
        //   icon: 'feather icon-menu',
        //   children: [
        //     {
        //       id: 'menu-level-1.1',
        //       title: 'Menu Level 1.1',
        //       type: 'item',
        //       url: '#!'
        //     },
        //     {
        //       id: 'menu-level-1.2',
        //       title: 'Menu Level 2.2',
        //       type: 'collapse',
        //       children: [
        //         {
        //           id: 'menu-level-2.1',
        //           title: 'Menu Level 2.1',
        //           type: 'item',
        //           url: '#'
        //         },
        //         {
        //           id: 'menu-level-2.2',
        //           title: 'Menu Level 2.2',
        //           type: 'collapse',
        //           children: [
        //             {
        //               id: 'menu-level-3.1',
        //               title: 'Menu Level 3.1',
        //               type: 'item',
        //               url: '#'
        //             },
        //             {
        //               id: 'menu-level-3.2',
        //               title: 'Menu Level 3.2',
        //               type: 'item',
        //               url: '#'
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   id: 'disabled-menu',
        //   title: 'Disabled Menu',
        //   type: 'item',
        //   url: '#',
        //   classes: 'nav-item disabled',
        //   icon: 'feather icon-power'
        // }
      ]
    }
  ]
};

export default menuItems;
