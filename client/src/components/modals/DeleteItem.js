import { deleteItems } from "../../http/itemAPI";
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  Form  from "react-bootstrap/Form";
import {fetchItems} from "../../http/itemAPI";

const DeleteItem = ({show, onHide}) => {

    const [value, setValue] = useState('')
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems().then(data => setItems(data.rows || data)); // на случай, если ты возвращаешь просто массив
      }, [show]);

      const deleteD = async () => {
        const found = items.find(d => d.name.toLowerCase() === value.toLowerCase());
        if (!found) {
          alert('Товар с таким названием не найден!');
          return;
        }
    
        try {
          await deleteItems(`/${found.id}`);
          alert(`Товар "${found.name}" удалён`);
          onHide(); // Закрываем модалку
        } catch (e) {
          alert('Ошибка при удалении: ' + e.message);
        }
      };
    
      return (
        <Modal show={show} onHide={onHide} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Удалить товар
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Введите название товара для удаления"
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            <Button variant="outline-success" onClick={deleteD}>Удалить</Button>
          </Modal.Footer>
        </Modal>
      );
    };

export default DeleteItem;