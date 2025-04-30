import React, { useContext, useState }from "react";
import Container from 'react-bootstrap/Container';
import { Button } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateColor from "../components/modals/CreateColor";
import CreateItem from "../components/modals/CreateItem";
import DeleteItem from "../components/modals/DeleteItem";
import CreateGItem from "../components/modals/CreateGItem";
import GDeleteItem from "../components/modals/GDeleteItem";
import CreateShipping from "../components/modals/CreateShipping";

const Admin = () => {
    const [colorVisible, setColorVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [itemVisible, setItemVisible] = useState(false)
    const [gitemVisible, setGItemVisible] = useState(false)
    const [itemDeleteVisible, setItemDeleteVisible] = useState(false)
    const [gitemDeleteVisible, setGItemDeleteVisible] = useState(false)
    const [shippingVisible, setShippingVisible] = useState(false)

  return (
    <Container className="d-flex flex-column">
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setTypeVisible(true)}>Добавить тип</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setColorVisible(true)}>Добавить цвет</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setItemVisible(true)}>Добавить товар</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setItemDeleteVisible(true)}>Удалить товар</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setGItemVisible(true)}>Добавить предмет в галерею</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setGItemDeleteVisible(true)}>Удалить предмет галереи</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setShippingVisible(true)}>Добавить способ доставки</Button>
        <CreateType show={typeVisible} onHide={()=> setTypeVisible(false)}/>
        <CreateColor show={colorVisible} onHide={()=> setColorVisible(false)}/>
        <CreateItem show={itemVisible} onHide={()=> setItemVisible(false)}/>
        <DeleteItem show={itemDeleteVisible} onHide={()=> setItemDeleteVisible(false)}/>
        <CreateGItem show={gitemVisible} onHide={()=> setGItemVisible(false)}/>
        <GDeleteItem show={gitemDeleteVisible} onHide={()=> setGItemDeleteVisible(false)}/>
        <CreateShipping show={shippingVisible} onHide={()=> setShippingVisible(false)}/>
    </Container>
  );
};

export default Admin;