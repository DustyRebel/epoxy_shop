import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import { createColor } from "../../http/itemAPI";

const CreateColor = ({ show, onHide }) => {
  const [name, setName] = useState('');
  const [hexColor, setHexColor] = useState('#000000'); // по умолчанию чёрный

  const addColor = () => {
    createColor({ name, hexColor }).then(() => {
      setName('');
      setHexColor('#000000');
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить новый цвет</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Название цвета</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Красный"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Цвет (HEX)</Form.Label>
            <Form.Control
              type="color"
              value={hexColor}
              onChange={e => setHexColor(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        <Button variant="outline-success" onClick={addColor}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateColor;
