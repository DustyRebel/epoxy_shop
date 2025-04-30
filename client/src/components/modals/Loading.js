import React from "react";
import { Modal, Spinner } from "react-bootstrap";

const Loading = ({ show }) => {
    return (
        <Modal show={show} centered backdrop="static" keyboard={false}>
            <Modal.Body className="text-center">
                <Spinner animation="border"  variant="dark" />
                <div className="mt-3">Оформляем заказ...</div>
            </Modal.Body>
        </Modal>
    );
};

export default Loading;
