import React, { useContext, useState }from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from 'react-bootstrap/Container';
import  Image  from "react-bootstrap/Image";
import bigStar from '../assets/bigStar.png'
import { Button } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateColor from "../components/modals/CreateColor";
import CreateItem from "../components/modals/CreateItem";
import DeleteItem from "../components/modals/DeleteItem";
import CreateGItem from "../components/modals/CreateGItem";

const Admin = () => {
    const [colorVisible, setColorVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [itemVisible, setItemVisible] = useState(false)
    const [gitemVisible, setGItemVisible] = useState(false)
    const [itemDeleteVisible, setItemDeleteVisible] = useState(false)

  return (
    <Container className="d-flex flex-column">
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setTypeVisible(true)}>Добавить тип</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setColorVisible(true)}>Добавить цвет</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setItemVisible(true)}>Добавить товар</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setItemDeleteVisible(true)}>Удалить товар</Button>
        <Button variant={"outline-dark"} className="mt-2 p-2" onClick={()=> setGItemVisible(true)}>Добавить товар в галерею</Button>
        <CreateType show={typeVisible} onHide={()=> setTypeVisible(false)}/>
        <CreateColor show={colorVisible} onHide={()=> setColorVisible(false)}/>
        <CreateItem show={itemVisible} onHide={()=> setItemVisible(false)}/>
        <DeleteItem show={itemDeleteVisible} onHide={()=> setItemDeleteVisible(false)}/>
        <CreateGItem show={gitemVisible} onHide={()=> setGItemVisible(false)}/>
    </Container>
  );
};

export default Admin;