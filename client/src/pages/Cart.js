import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import {
    fetchCartItems,
    deleteCartItem,
    updateCartItem,
    deleteCartItemsByCart
} from "../http/cartItemAPI";
import { fetchShippings } from "../http/shippingAPI";
import { createCheckout } from "../http/checkoutAPI";
import { jwtDecode } from "jwt-decode";
import Loading from "../components/modals/Loading"; 



const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [shippings, setShippings] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', tg: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        phone: '',
        tg: ''
    });
    

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
        if (cartItems.length === 0) {
            alert('Корзина пуста');
            return;
        }
    
        const phoneRegex = /^\+7\d{10}$/;
        const tgRegex = /^@\w{5,}$/;
    
        const newErrors = {
            phone: phoneRegex.test(formData.phone) ? '' : 'Введите правильный номер',
            tg: tgRegex.test(formData.tg) ? '' : 'Введите адрес Telegram в формате @nickname'
        };
    
        setErrors(newErrors);
    
        const hasErrors = Object.values(newErrors).some(error => error);
        if (hasErrors) return;
    
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
    
            const checkoutData = {
                ...formData,
                price: totalPrice,
                cartId: cartItems[0]?.cartId,
                userId: decoded.id,
                shippingId: selectedShipping
            };
    
            await createCheckout(checkoutData);
            await deleteCartItemsByCart(cartItems[0]?.cartId);
    
            alert("Заказ оформлен и корзина очищена!");
            setCartItems([]);
        } catch (e) {
            alert('Ошибка при оформлении заказа');
            console.error(e);
        } finally {
            setLoading(false);
        }
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
                                isInvalid={!!errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Telegram</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.tg}
                                placeholder="@nickname"
                                onChange={e => setFormData({ ...formData, tg: e.target.value })}
                                isInvalid={!!errors.tg}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.tg}
                            </Form.Control.Feedback>
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
            <Loading show={loading} />
        </Container> 
    );
};

export default Cart;
