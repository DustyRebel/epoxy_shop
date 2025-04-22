import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  Form  from "react-bootstrap/Form";
import { createColor } from "../../http/itemAPI";

const CreateColor = ({show, onHide}) => {

    const [value, setValue] = useState('')

    const addColor = () => {
        createColor({name: value}).then(data => {
            setValue('')
            onHide()
        })
    }
    
  return (
    <Modal
    show={show}
    onHide={onHide}
    size="lg"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Добавить новый цвет
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Control
                value = {value}
                onChange={e => setValue(e.target.value)}
                placeholder={"Введите название цвета"}
            />
        </Form>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="outline-danger" onClick={onHide}>Close</Button>
      <Button variant="outline-success" onClick={addColor}>Добавить</Button>
    </Modal.Footer>
  </Modal>
  );
};

export default CreateColor;