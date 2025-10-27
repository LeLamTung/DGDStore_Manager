import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '/auth/logout',
    element: lazy(() => import('./views/tables/Logout'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      //Quản lý tài khoản
      {
        exact: 'true',
        path: '/account/list',
        element: lazy(() => import('./views/tables/Account_List'))
      },
      {
        exact: 'true',
        path: '/account/add',
        element: lazy(() => import('./views/tables/Account_Add'))
      },
      {
        path: '/account/edit/:id',
        element: lazy(() => import('./views/tables/Account_Edit'))
      },
      //Quản lý chức vụ
      {
        path:'/role/list',
        element:lazy(() => import('./views/tables/Role_List'))
      },
      {
        path:'role/add',
        element: lazy(() => import('./views/tables/Role_Add'))
      },
      {
        path:'role/edit/:id',
        element: lazy(() => import('./views/tables/Role_Edit'))
      },
      //Quản lý danh mục
      {
        path:'/category/list',
        element:lazy(() => import('./views/tables/Category_List'))
      },
      {
        path:'category/add',
        element: lazy(() => import('./views/tables/Category_Add'))
      },
      {
        path:'category/edit/:id',
        element: lazy(() => import('./views/tables/Category_Edit'))
      },
      //Quản lý sản phẩm
      {
        path:'/product/list',
        element:lazy(() => import('./views/tables/Product_List'))
      },
      {
        path:'/product/add',
        element:lazy(() => import('./views/tables/Product_Add'))
      },
      {
        path:'/product/edit/:id',
        element:lazy(() => import('./views/tables/Product_Edit'))
      },
      //Quản lý ảnh
      {
        path:'/images/edit/:id',
        element:lazy(() => import('./views/tables/Images_Edit'))
      },
      {
        path:'/images/list',
        element:lazy(() => import('./views/tables/Images_List'))
      },
      //Quản lý Order
      {
        path:'/order/list',
        element:lazy(() => import('./views/tables/Order_List'))
      },
      {
        path:'/order/edit/:id',
        element: lazy(() => import('./views/tables/Order_Edit'))
      },
      //Quản lý chi tiet Order
      {
        path:'/orderdetail/list',
        element: lazy(() => import('./views/tables/OrderDetail_List'))
      },
      {
        exact: 'true',
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: 'true',
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
