import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { createBAttributeVal, fetchBAttributes, uploadBAttributeValImg } from "../../http/bConstructorAPI";

const CreateBAttributeVal = ({ show, onHide }) => {
  const [attributes, setAttributes] = useState([]);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState(true);

  const [imgFront, setImgFront] = useState(null);
  const [imgBack, setImgBack] = useState(null);
  const [imgSide, setImgSide] = useState(null);
  const [hexColor, setHexColor] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    fetchBAttributes().then(setAttributes);
  }, []);

  const selectImg = (e, setter) => setter(e.target.files[0]);

  const uploadImage = async (file, view, attributeValId) => {
    const formData = new FormData();
    formData.append("img", file);
    formData.append("view", view);
    formData.append("attributeValId", attributeValId);
    await uploadBAttributeValImg(formData);
  };

  const addVal = async () => {
    if (!selectedAttr) return alert("Выберите атрибут");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("availability", availability);
    formData.append("bAttributeId", selectedAttr.id);
    formData.append("hexColor", hexColor);

    if (previewImg) {
      formData.append("img", previewImg); // ← загрузка preview-изображения
    }

    const created = await createBAttributeVal(formData);

    // загрузка изображений
    if (imgFront) await uploadImage(imgFront, "front", created.id);
    if (imgBack) await uploadImage(imgBack, "back", created.id);
    if (imgSide) await uploadImage(imgSide, "side", created.id);

    // очистка
    setName(""); setPrice(0); setAvailability(true); setSelectedAttr(null);
    setImgFront(null); setImgBack(null); setImgSide(null); setPreviewImg(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить значение атрибута</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown>
          <Dropdown.Toggle>{selectedAttr?.name || "Выберите атрибут"}</Dropdown.Toggle>
          <Dropdown.Menu>
            {attributes.map(attr =>
              <Dropdown.Item key={attr.id} onClick={() => setSelectedAttr(attr)}>{attr.name}</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <Form.Control className="mt-2" value={name} onChange={e => setName(e.target.value)} placeholder="Название" />
        <Form.Control className="mt-2" type="number" value={price} onChange={e => setPrice(+e.target.value)} placeholder="Цена" />
        <Form.Check className="mt-2" type="checkbox" label="Доступен" checked={availability} onChange={e => setAvailability(e.target.checked)} />

        <Form.Label className="mt-3">Превью изображения</Form.Label>
        <Form.Control type="file" onChange={e => setPreviewImg(e.target.files[0])} />
        <Form.Text muted>Показывается в меню выбора (не отображается на изделии)</Form.Text>
        
        <Form.Label className="mt-3">Изображения для конструктора</Form.Label>
        <Form.Control type="file" onChange={e => selectImg(e, setImgFront)} className="mt-1" />
        <Form.Text muted>Front</Form.Text>
        <Form.Control type="file" onChange={e => selectImg(e, setImgBack)} className="mt-1" />
        <Form.Text muted>Back</Form.Text>
        <Form.Control type="file" onChange={e => selectImg(e, setImgSide)} className="mt-1" />
        <Form.Text muted>Side</Form.Text>
        <Form.Control
        className="mt-2"
        type="text"
        value={hexColor}
        onChange={(e) => setHexColor(e.target.value)}
        placeholder="Цвет (например: #ffc0cb)"
        />
        <Form.Text muted>Если вы создаёте цвет, укажите hex-код</Form.Text>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Отмена</Button>
        <Button variant="outline-success" onClick={addVal}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBAttributeVal;
