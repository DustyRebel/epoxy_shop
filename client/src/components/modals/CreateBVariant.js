import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { createBVariant, fetchBTypes } from "../../http/bConstructorAPI";
import { Context } from "../../index";

const CreateBVariant = observer(({ show, onHide }) => {
  const { item } = useContext(Context);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(true);
  const [file, setFile] = useState(null);
  const [imgFront, setImgFront] = useState(null)
  const [imgBack, setImgBack] = useState(null)
  const [imgSide, setImgSide] = useState(null)

const selectImgFront = e => setImgFront(e.target.files[0])
const selectImgBack = e => setImgBack(e.target.files[0])
const selectImgSide = e => setImgSide(e.target.files[0])

  

  useEffect(() => {
    fetchBTypes().then(data => item.setTypes(data));
  }, []);

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addVariant = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("availability", available);
    formData.append("bTypeId", item.selectedType.id);
    if (file) formData.append("img", file);

    createBVariant(formData).then(() => {
      setName(""); setPrice(0); setAvailable(true); setFile(null);
      onHide();
    });
    if (imgFront) formData.append("imgFront", imgFront);
    if (imgBack) formData.append("imgBack", imgBack);
    if (imgSide) formData.append("imgSide", imgSide);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить вариант формы</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-2">
            <Dropdown.Toggle>
              {item.selectedType.name || "Выберите тип"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {item.types.map(type =>
                <Dropdown.Item key={type.id} onClick={() => item.setSelectedType(type)}>
                  {type.name}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            className="mt-3"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Введите название формы"
          />
          <Form.Control
            className="mt-3"
            type="number"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            placeholder="Введите цену"
          />
          <Form.Check
            type="checkbox"
            label="Доступен"
            checked={available}
            onChange={e => setAvailable(e.target.checked)}
            className="mt-3"
          />
            <Form.Label className="mt-3">Изображение спереди</Form.Label>
            <Form.Control type="file" onChange={selectImgFront} />

            <Form.Label className="mt-3">Изображение сзади</Form.Label>
            <Form.Control type="file" onChange={selectImgBack} />

            <Form.Label className="mt-3">Изображение сбоку</Form.Label>
            <Form.Control type="file" onChange={selectImgSide} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        <Button variant="outline-success" onClick={addVariant}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateBVariant;
