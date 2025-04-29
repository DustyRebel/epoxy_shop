import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createRating, fetchUserRating, updateRating, deleteRating } from "../../http/ratingAPI";
import { jwtDecode } from "jwt-decode";

const CreateRating = ({ show, onHide, itemId }) => {
    const [rate, setRate] = useState(5);
    const [review, setReview] = useState('');
    const [existingRatingId, setExistingRatingId] = useState(null);

    useEffect(() => {
        if (itemId && show) {
            const loadUserRating = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const decoded = jwtDecode(token);
                    const data = await fetchUserRating(decoded.id, itemId);
                    if (data) {
                        setRate(data.rate);
                        setReview(data.review || '');
                        setExistingRatingId(data.id);
                    } else {
                        setRate(5);
                        setReview('');
                        setExistingRatingId(null);
                    }
                } catch (e) {
                    console.error("Ошибка при загрузке отзыва", e);
                }
            };
            loadUserRating();
        }
    }, [itemId, show]);

    const addRating = async () => {
        try {
            await createRating({ itemId, rate, review });
            alert('Отзыв отправлен!');
            onHide();
        } catch (e) {
            alert('Ошибка при отправке отзыва');
            console.error(e);
        }
    };

    const handleSave = async () => {
        try {
            if (existingRatingId) {
                await updateRating(existingRatingId, rate, review);
            } else {
                await addRating();
            }
            onHide();
        } catch (e) {
            console.error("Ошибка при сохранении отзыва", e);
        }
    };

    const handleDelete = async () => {
        if (!existingRatingId) return;

        if (window.confirm('Вы уверены, что хотите удалить отзыв?')) {
            try {
                await deleteRating(existingRatingId);
                alert('Отзыв удален');
                onHide();
            } catch (e) {
                alert('Ошибка при удалении отзыва');
                console.error(e);
            }
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{existingRatingId ? "Редактировать отзыв" : "Оставить отзыв"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Оценка (1-5)</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            max={5}
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Отзыв</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {existingRatingId && (
                    <Button variant="danger" onClick={handleDelete}>
                        Удалить отзыв
                    </Button>
                )}
                <Button variant="secondary" onClick={onHide}>Закрыть</Button>
                <Button variant="success" onClick={handleSave}>
                    {existingRatingId ? "Обновить" : "Оставить отзыв"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateRating;
