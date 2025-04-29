import React, { useContext } from "react";
import { Context } from "../index";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from "react-router-dom";
import {Button} from "react-bootstrap";
import { ADMIN_ROUTE, CART_ROUTE, GALLERY_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, USER_ROUTE } from "../utils/consts";
import {observer} from "mobx-react-lite"
import { useNavigate } from "react-router-dom";

const NavBar = observer(() => {
    const navigate = useNavigate();
    const { item, user } = useContext(Context);
    

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
                <Button variant={"outline-light"} onClick={()=> navigate(GALLERY_ROUTE)}>Галерея</Button>
                <Button variant={"outline-light"} onClick={()=> navigate(ADMIN_ROUTE)}className="ms-2">Админ</Button>
                <Button variant={"outline-light"} onClick={()=> navigate(CART_ROUTE)}className="ms-2">Корзина</Button>
                <Button variant={"outline-light"} onClick={()=> navigate(USER_ROUTE)}className="ms-2">Мои заказы</Button>
                <Button variant={"outline-light"} onClick={()=> logOut()} className="ms-2">Выйти</Button>
            </Nav>
            :
            <Nav className="ml-auto" >
                <Button variant={"outline-light"} onClick={()=> navigate(GALLERY_ROUTE)}>Галерея</Button>
                <Button variant={"outline-light"} onClick={() => navigate(LOGIN_ROUTE)}className="ms-2">Авторизация</Button>
            </Nav>
        }
                </Container>
      </Navbar>
  );
});

export default NavBar;