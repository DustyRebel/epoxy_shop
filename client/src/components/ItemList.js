import { observer } from "mobx-react-lite";
import React, { useContext }from "react";
import Card from "react-bootstrap/Card";
import { Context } from "../index";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ItemItem from "./ItemItem";

const ItemList = observer(() => {
    const {item} = useContext(Context)

    return (
        <Row className="d-flex"> 
            {item.items.map(item=>
                <ItemItem key={item.id} item={item}/>

            )}
        </Row>
    );
    });

export default ItemList;