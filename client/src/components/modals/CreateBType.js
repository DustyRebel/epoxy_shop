import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createBType } from "../../http/bConstructorAPI";

const CreateBType = ({ show, onHide }) => {
  const [name, setName] = useState("");

  const addType = () => {
    createBType({ name }).then(() => {
      setName("");
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить тип изделия</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название типа"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Закрыть</Button>
        <Button variant="outline-success" onClick={addType}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBType;
