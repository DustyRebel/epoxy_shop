import { observer } from "mobx-react-lite";
import React, { useContext }from "react";
import Card from "react-bootstrap/Card";
import { Context } from "../index";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const GColorBar = observer(() => {
    const {gallery_item} = useContext(Context)
    return (
        <Row className="d-flex">
            {gallery_item.colors.map(color=>(
                <Col key={color.id} xs="auto" className="mb-2">
                <Card 
                style={{cursor:'pointer'}}
                key={color.id} 
                className="p-3" 
                onClick={()=>{gallery_item.setSelectedColor(color)}}
                border={color.id === gallery_item.selectedColor.id ? 'dark': 'light'}
                >
                    {color.name}
                </Card>
                </Col>

            ))}
        </Row>
    );
    });

export default GColorBar;