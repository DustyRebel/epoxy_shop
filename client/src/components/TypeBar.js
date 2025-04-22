import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { Context } from "../index";

const TypeBar = observer(() => {
    const {item} = useContext(Context)
    return (
        <ListGroup>
            {item.types.map(type=>
                <ListGroup.Item 
                style={{cursor: 'pointer'}}
                active={type.id === item.selectedType.id}
                onClick={()=>item.setSelectedType(type)} 
                key={type.id}
                >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;