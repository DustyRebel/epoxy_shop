import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { createBAttribute, fetchBVariants } from "../../http/bConstructorAPI";

const CreateBAttribute = ({ show, onHide }) => {
  const [name, setName] = useState("");
  const [variants, setVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);

  useEffect(() => {
    fetchBVariants().then(setVariants);
  }, []);

  const toggleVariant = (variant) => {
    setSelectedVariants((prev) =>
      prev.some((v) => v.id === variant.id)
        ? prev.filter((v) => v.id !== variant.id)
        : [...prev, variant]
    );
  };

  const addAttr = () => {
    if (!selectedVariants.length) return alert("Выберите хотя бы одну форму");

    createBAttribute({
      name,
      variantIds: selectedVariants.map((v) => v.id)
    }).then(() => {
      setName("");
      setSelectedVariants([]);
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить атрибут</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Цвет, Блестки, Декор"
          className="mb-3"
        />
        <Dropdown>
          <Dropdown.Toggle>
            {selectedVariants.length > 0
              ? `Выбрано: ${selectedVariants.map((v) => v.name).join(", ")}`
              : "Выберите формы"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
    {variants.map((v) => (
        <Dropdown.Item key={v.id} onClick={() => toggleVariant(v)}>
        {selectedVariants.some((sel) => sel.id === v.id) ? "✅ " : ""}
        {v.name} ({v.b_type?.name || "—"})
        </Dropdown.Item>
    ))}
    </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Отмена</Button>
        <Button variant="outline-success" onClick={addAttr}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBAttribute;
