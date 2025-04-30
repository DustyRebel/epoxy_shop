import { observer } from "mobx-react-lite";
import React, { useContext }from "react";
import { Context } from "../index";
import Row from "react-bootstrap/Row"
import GItemItem from "./GItemItem";

const GItemList = observer(() => {
    const {gallery_item} = useContext(Context)

    return (
        <Row className="d-flex"> 
            {gallery_item.gallery_items.map(gallery_item=>
                <GItemItem key={gallery_item.id} gallery_item={gallery_item}/>

            )}
        </Row>
    );
    });

export default GItemList;