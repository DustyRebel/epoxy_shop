import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from 'react-bootstrap/Container';
import Image from "react-bootstrap/Image";
import bigStar from '../assets/bigStar.png'
import { Button, Form } from "react-bootstrap";
import { useParams } from 'react-router-dom'
import { fetchOneItem } from "../http/itemAPI";
import { addItemToCart } from "../http/cartItemAPI"; 
import { fetchRatings } from "../http/ratingAPI";
import { useMemo } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} color="gold" />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} color="gold" />);
        } else {
            stars.push(<FaRegStar key={i} color="gray" />);
        }
    }
    return stars;
};

const ItemPage = () => {
    const [item, setItem] = useState({ info: [], shop_imgs: [] });
    const [selectedImg, setSelectedImg] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        fetchOneItem(id).then(data => {
            setItem(data);
            setSelectedImg(data.shop_imgs?.[0]?.link || '');
        });
        fetchRatings(id).then(setRatings).catch(console.error);
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addItemToCart(id, quantity);
            alert('Товар добавлен в корзину!');
        } catch (e) {
            alert('Ошибка при добавлении в корзину');
            console.error(e);
        }
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    const averageRating = useMemo(() => {
        if (ratings.length === 0) return 0;
        const total = ratings.reduce((sum, r) => sum + r.rate, 0);
        return (total / ratings.length).toFixed(1); // например: 4.3
    }, [ratings]);

    return (
        <Container className="mt-3">
            <Row>
                <Col md={5}>
                    <Image
                        width="100%"
                        height="auto"
                        src={process.env.REACT_APP_API_URL + selectedImg}
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <Row className="mt-2">
                        {item.shop_imgs.map((img) => (
                            <Col xs={3} key={img.id}>
                                <Image
                                    src={process.env.REACT_APP_API_URL + img.link}
                                    thumbnail
                                    onClick={() => setSelectedImg(img.link)}
                                    style={{
                                        cursor: 'pointer',
                                        border: selectedImg === img.link ? '2px solid black' : '1px solid #ccc',
                                        maxHeight: '70px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col md={4} className="d-flex flex-column">
                    <h2 className="text-center">{item.name}</h2>



                    <div className="flex-grow-1 w-100">
                        <h4 className="mt-4">Характеристики</h4>
                        {item.info.length > 0 ? (
                            <div>
                                {item.info.map((info, index) => (
                                    <div
                                        key={info.id}
                                        style={{
                                            background: index % 2 === 0 ? 'lightgrey' : 'transparent',
                                            padding: 10,
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        {info.title}: {info.description}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Нет характеристик</p>
                        )}
                    </div>
                </Col>

                <Col md={3}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around p-3"
                        style={{ fontSize: 20, border: '5px solid lightgrey' }}
                    >
                        <h3>{item.price} руб.</h3>
                        <div className="d-flex align-items-center mt-3">
                            <Form.Control
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={handleQuantityChange}
                                style={{ width: 70, marginRight: 10 }}
                            />
                            <Button variant="outline-dark" onClick={handleAddToCart}>
                                В корзину
                            </Button>
                        </div>
                    </Card>
                    <div className="text-center mt-3" style={{ fontSize: 32 }}>
                        {renderStars(averageRating)} {/* визуальные звёзды */}
                        <div style={{ fontSize: 16, color: '#555' }}>({averageRating})</div>
                    </div>
                </Col>
            </Row>

            {/* Место для отзывов */}
            <Row className="mt-5">
            <Row className=" align-items-center">
                <Col xs="auto">
                    <h2 className="mb-2">Отзывы покупателей</h2>
                </Col>
                <Col xs="auto" className="d-flex align-items-center gap-1">
                    {renderStars(averageRating)}
                    <span style={{ marginLeft: 5, fontSize: 16, color: '#555' }}>({averageRating})</span>
                </Col>
            </Row>
                {ratings.length > 0 ? (
                    ratings.map(rating => (
                        <Card key={rating.id} className="mb-3 p-3">
                            <div className="d-flex justify-content-between">
                                <div><strong>Оценка:</strong> {rating.rate} / 5</div>
                                <div style={{ color: '#555' }}>{new Date(rating.createdAt)
                                .toLocaleString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                .replace(',', '')}</div>
                            </div>
                            <div className="mt-2">{rating.review || "Без текста"}</div>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted">Отзывов пока нет</p>
                )}
            </Row>
        </Container>
    );
};

export default ItemPage;
