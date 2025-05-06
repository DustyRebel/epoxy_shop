import React, { useContext } from "react";
import { Context } from "../index";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from "react-router-dom";
import {Button} from "react-bootstrap";
import { BUILDER_ROUTE, ADMIN_ROUTE, ADMIN_ORDERS_ROUTE, CART_ROUTE, GALLERY_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, USER_ROUTE } from "../utils/consts";
import {observer} from "mobx-react-lite"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const NavBar = observer(() => {
    const navigate = useNavigate();
    const { item, user } = useContext(Context);
    let role = '';
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                role = decoded.role;
            }
        } catch (e) {
            console.error("Ошибка при декодировании токена", e);
        }
    

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
    }



  return (
    <Navbar bg="dark" data-bs-theme="dark"> 
        <Container>
            <span 
            style={{ color: 'white', cursor: 'pointer' }} 
            onClick={() => window.location.href = SHOP_ROUTE}
            >
            Главная
            </span>

        {user.isAuth ?
            <Nav className="ml-auto" >
                <Button variant={"outline-info"} onClick={() => navigate(BUILDER_ROUTE)} className="ms-2">Конструктор</Button>
                <Button variant={"outline-light"} onClick={()=> navigate(GALLERY_ROUTE)} className="ms-2">Галерея</Button>
                {role === 'ADMIN' && (
                    <>
                    <Button variant="outline-danger" onClick={() => navigate(ADMIN_ROUTE)} className="ms-2">
                    Админ панель
                    </Button>
                    <Button variant="outline-danger" onClick={() => navigate(ADMIN_ORDERS_ROUTE)} className="ms-2">
                    Админ заказы
                    </Button>
                </>
                )}
                <Button variant={"outline-light"} onClick={()=> navigate(CART_ROUTE)}className="ms-2">Корзина</Button>
                <Button variant={"outline-light"} onClick={()=> navigate(USER_ROUTE)}className="ms-2">Мои заказы</Button>
                <Button variant={"outline-light"} onClick={()=> logOut()} className="ms-2">Выйти</Button>
            </Nav>
            :
            <Nav className="ml-auto" >
                                <Button variant={"outline-info"} onClick={() => navigate(BUILDER_ROUTE)} className="ms-2">Конструктор</Button>
                <Button variant={"outline-light"} onClick={()=> navigate(GALLERY_ROUTE)}className="ms-2">Галерея</Button>
                <Button variant={"outline-light"} onClick={() => navigate(LOGIN_ROUTE)}className="ms-2">Авторизация</Button>
            </Nav>
        }
                </Container>
      </Navbar>
  );
});

export default NavBar;