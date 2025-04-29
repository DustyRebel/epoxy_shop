import { Component } from "react";
import Admin from "./pages/Admin";
import { ADMIN_ROUTE, USER_ROUTE, CART_ROUTE, GALLERY_ITEM_ROUTE, GALLERY_ROUTE, ITEM_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "./utils/consts";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import User from "./pages/User";
import ItemPage from "./pages/ItemPage";
import Gallery from "./pages/Gallery";
import GItemPage from "./pages/GItemPage";

export const authRoutes = [
    
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: CART_ROUTE,
        Component: Cart
    },
    {
        path: USER_ROUTE,
        Component: User
    },

]


export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: ITEM_ROUTE + '/:id',
        Component: ItemPage
    },
    {
        path: GALLERY_ROUTE,
        Component: Gallery
    },
    {
        path: GALLERY_ITEM_ROUTE + '/:id',
        Component: GItemPage
    },
]