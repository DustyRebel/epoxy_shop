import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import TypeBar from "../components/TypeBar";
import ColorBar from "../components/ColorBar";
import ItemList from "../components/ItemList";
import Pages from "../components/Pages";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchColors, fetchItems, fetchTypes } from "../http/itemAPI";

const Shop = observer(() => {
    const {item} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => item.setTypes(data))
        fetchColors().then(data => item.setColors(data))
        fetchItems(null, null, 1 , 2).then(data => {
            item.setItems(data.rows)
            item.setTotalCount(data.count)
        })
    }, [])

    useEffect(() => {
        fetchItems(item.selectedType.id, item.selectedColor.id, item.page, 2).then(data => {
            item.setItems(data.rows)
            item.setTotalCount(data.count)
        })
    }, [item.page, item.selectedType, item.selectedColor,])
    
    

  return (
    <Container>
        <Row className="mt-2">
            <Col md={3}>
                <TypeBar />
            </Col>

            <Col md={9}>
                <ColorBar/>
                <ItemList />
                <Pages />
            </Col>
        </Row>
    </Container>
  );
});

export default Shop;