import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import {
    fetchCartItems,
    deleteCartItem,
    updateCartItem
} from "../http/cartItemAPI";
import { fetchShippings } from "../http/shippingAPI";
import { createCheckout } from "../http/checkoutAPI";


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [shippings, setShippings] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', tg: '', address: '' });

    useEffect(() => {
        loadCart();
        fetchShippings().then(data => setShippings(data));
    }, []);

    const loadCart = async () => {
        const data = await fetchCartItems();
        setCartItems(data);
    };

    const handleQuantityChange = async (itemId, quantity) => {
        if (quantity < 1) return;
        await updateCartItem(itemId, quantity);
        loadCart();
    };

    const handleRemove = async (itemId) => {
        await deleteCartItem(itemId);
        loadCart();
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

    const handleOrder = async () => {
        const checkoutData = {
            ...formData,
            price: totalPrice,
            cartId: cartItems[0]?.cartId, // предполагаем, что все товары из одной корзины
            userId: cartItems[0]?.cart.userId,
            shippingId: selectedShipping
        };

        await createCheckout(checkoutData);
        alert("Заказ оформлен!");
        setCartItems([]);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={8}>
                    <h2>Корзина</h2>
                    {cartItems.map(ci => (
                        <Row key={ci.id} className="mb-3 align-items-center">
                            <Col md={2}>
                            {ci.item.shop_imgs?.length > 0 ? (
  <Image
    src={process.env.REACT_APP_API_URL + ci.item.shop_imgs[0].link}
    
    fluid
  />
) : (
  <div style={{ width: 100, height: 100, background: '#ccc' }} />
)}
                            </Col>
                            <Col md={4}>{ci.item.name}</Col>
                            <Col md={2}>{ci.item.price} руб.</Col>
                            <Col md={2}>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    value={ci.quantity}
                                    onChange={(e) => handleQuantityChange(ci.id, parseInt(e.target.value))}
                                />
                            </Col>
                            <Col md={2}>
                                <Button variant="danger" onClick={() => handleRemove(ci.id)}>Удалить</Button>
                            </Col>
                        </Row>
                    ))}
                </Col>

                <Col md={4}>
                    <h3>Оформление заказа</h3>
                    <p>Итого: <strong>{totalPrice} руб.</strong></p>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>ФИО</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Telegram</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.tg}
                                placeholder="@nickname"
                                onChange={e => setFormData({ ...formData, tg: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Адрес</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Способ доставки</Form.Label>
                            <Form.Select
                                value={selectedShipping || ''}
                                onChange={e => setSelectedShipping(Number(e.target.value))}
                            >
                                <option disabled value="">Выберите способ</option>
                                {shippings.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="dark" onClick={handleOrder} disabled={!selectedShipping}>Оформить заказ</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;
