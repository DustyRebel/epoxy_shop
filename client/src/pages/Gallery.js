import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import GTypeBar from "../components/GTypeBar";
import GColorBar from "../components/GColorBar";
import GItemList from "../components/GItemList";
import GPages from "../components/GPages";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchColors, fetchItems, fetchTypes } from "../http/gitemAPI";

const Gallery = observer(() => {
    const {gallery_item} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => gallery_item.setTypes(data))
        fetchColors().then(data => gallery_item.setColors(data))
        fetchItems(null, null, 1 , 3).then(data => {
            gallery_item.setItems(data.rows)
            gallery_item.setTotalCount(data.count)
        })
    }, [])

    useEffect(() => {
        fetchItems(gallery_item.selectedType.id, gallery_item.selectedColor.id, gallery_item.page, 3).then(data => {
            gallery_item.setItems(data.rows)
            gallery_item.setTotalCount(data.count)
        })
    }, [gallery_item.page, gallery_item.selectedType, gallery_item.selectedColor,])
    
    

  return (
    <Container>
        <Row className="mt-2">
            <Col md={3}>
                <GTypeBar />
            </Col>

            <Col md={9}>
                <GColorBar/>
                <GItemList />
                <GPages />
            </Col>
        </Row>
    </Container>
  );
});

export default Gallery;