import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  Form  from "react-bootstrap/Form";
import { createShipping } from "../../http/shippingAPI";

const CreateShipping = ({show, onHide}) => {
    const [value, setValue] = useState('')

    const addShipping = () => {
        createShipping({name: value}).then(data => {
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
        Добавить новый способ доставки
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Control
                value = {value}
                onChange={e => setValue(e.target.value)}
                placeholder={"Введите название типа"}
            />
        </Form>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="outline-danger" onClick={onHide}>Close</Button>
      <Button variant="outline-success" onClick={addShipping}>Добавить</Button>
    </Modal.Footer>
  </Modal>
  );
};

export default CreateShipping;