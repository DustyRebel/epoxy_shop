import React from "react";
import { Modal, Button } from "react-bootstrap";

const ToggleAvailabilityModal = ({ show, onHide, onToggle, entityName, currentValue }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Изменить доступность</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Вы уверены, что хотите ${currentValue ? "отключить" : "включить"} ${entityName}?`}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant={currentValue ? "danger" : "success"} onClick={onToggle}>
          {currentValue ? "Отключить" : "Включить"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ToggleAvailabilityModal;
