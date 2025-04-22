import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { Context } from "../index";

const GTypeBar = observer(() => {
    const {gallery_item} = useContext(Context)
    return (
        <ListGroup>
            {gallery_item.types.map(type=>
                <ListGroup.Item 
                style={{cursor: 'pointer'}}
                active={type.id === gallery_item.selectedType.id}
                onClick={()=>gallery_item.setSelectedType(type)} 
                key={type.id}
                >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default GTypeBar;