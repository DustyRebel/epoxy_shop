import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { fetchUserOrders } from "../http/userAPI";
import { jwtDecode } from "jwt-decode";
import CreateRating from "../components/modals/CreateRating"; // импорт модального окна для отзыва

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false); // управление модальным окном
    const [selectedItemId, setSelectedItemId] = useState(null); // для какого товара оставить отзыв

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const data = await fetchUserOrders(decoded.id);
                setOrders(data);
            } catch (error) {
                console.error('Ошибка при загрузке заказов:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const handleLeaveReview = (itemId) => {
        setSelectedItemId(itemId);
        setShowRatingModal(true);
    };

    if (loading) {
        return <Container className="mt-5"><h2>Загрузка заказов...</h2></Container>;
    }

    if (orders.length === 0) {
        return <Container className="mt-5"><h2>Заказы не найдены</h2></Container>;
    }

    return (
        <Container className="mt-4">
            <h2>Мои заказы</h2>
            {orders.map(order => (
                <Card key={order.id} className="mt-3">
                    <Card.Body>
                        <Card.Title>
                            Заказ №{order.id} от {new Date(order.createdAt)
                                .toLocaleString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                .replace(',', '')}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            Сумма: {order.price} руб. | Доставка: {order.shipping?.name || 'Не указано'}
                        </Card.Subtitle>
                        <Card.Text>
                            Адрес доставки: {order.address}
                        </Card.Text>
                        <h5>Товары:</h5>
                        <ListGroup variant="flush">
                            {order.checkout_items.map(item => (
                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                    <span>{item.item.name} × {item.quantity}</span>
                                    <Button variant={"outline-dark"} size="sm" onClick={() => handleLeaveReview(item.item.id)}>
                                        Оставить отзыв
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            ))}

            {/* Модалка для создания отзыва */}
            <CreateRating
                show={showRatingModal}
                onHide={() => setShowRatingModal(false)}
                itemId={selectedItemId}
            />
        </Container>
    );
};

export default UserOrders;
