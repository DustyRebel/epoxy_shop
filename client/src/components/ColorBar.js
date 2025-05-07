import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import { Context } from "../index";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const ColorBar = observer(() => {
  const { item } = useContext(Context);

  return (
    <>
      <Row className="mb-2">
        <Col><strong>Цвет:</strong></Col>
      </Row>
      <Row className="d-flex flex-wrap gap-2">
        {item.colors.map(color => (
          <Col key={color.id} xs="auto">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-${color.id}`}>{color.name}</Tooltip>}
            >
              <Card
                style={{
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  backgroundColor: color.hexColor || "#ccc",
                  border: color.id === item.selectedColor.id ? '2px solid black' : '1px solid lightgray',
                  boxShadow: color.id === item.selectedColor.id ? '0 0 5px gray' : 'none'
                }}
                onClick={() => item.setSelectedColor(color)}
              />
            </OverlayTrigger>
          </Col>
        ))}
      </Row>
    </>
  );
});

export default ColorBar;
