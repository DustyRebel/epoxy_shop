import { deleteItems } from "../../http/gitemAPI";
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  Form  from "react-bootstrap/Form";
import {fetchItems} from "../../http/gitemAPI";

const GDeleteItem = ({show, onHide}) => {

    const [value, setValue] = useState('')
    const [gallery_items, setItems] = useState([]);

    useEffect(() => {
        fetchItems().then(data => setItems(data.rows || data)); // на случай, если ты возвращаешь просто массив
      }, [show]);

      const deleteD = async () => {
        const found = gallery_items.find(d => d.name.toLowerCase() === value.toLowerCase());
        if (!found) {
          alert('Предмет галереи с таким названием не найден!');
          return;
        }
    
        try {
          await deleteItems(`/${found.id}`);
          alert(`Предмет галереи "${found.name}" удалён`);
          onHide(); // Закрываем модалку
        } catch (e) {
          alert('Ошибка при удалении: ' + e.message);
        }
      };
    
      return (
        <Modal show={show} onHide={onHide} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Удалить предмет галереи
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Введите название предмета галереи для удаления"
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

export default GDeleteItem;