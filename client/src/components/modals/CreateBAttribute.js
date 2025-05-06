import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { createBAttribute, fetchBVariants } from "../../http/bConstructorAPI";

const CreateBAttribute = ({ show, onHide }) => {
  const [name, setName] = useState("");
  const [variants, setVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [renderRole, setRenderRole] = useState("");

  const roles = [
    { label: "Цвет заливки", value: "colorOverlay" },
    { label: "Цвет подложки", value: "baseColor" },
    { label: "Глиттер", value: "glitterImg" },
    { label: "Декор", value: "decorImg" },
    { label: "Не визуализируется", value: "" }
  ];

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
      variantIds: selectedVariants.map((v) => v.id),
      renderRole
    }).then(() => {
      setName("");
      setRenderRole("");
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

        <Dropdown className="mb-3">
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

        <Form.Label>Поведение атрибута</Form.Label>
        <Form.Select
          className="mb-3"
          value={renderRole}
          onChange={(e) => setRenderRole(e.target.value)}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Form.Select>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="outline-success" onClick={addAttr}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBAttribute;
