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
import { addItemToCart } from "../http/cartItemAPI"; // <--- импорт функции добавления в корзину

const ItemPage = () => {
    const [item, setItem] = useState({ info: [], shop_imgs: [] });
    const [selectedImg, setSelectedImg] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();

    useEffect(() => {
        fetchOneItem(id).then(data => {
            setItem(data);
            setSelectedImg(data.shop_imgs?.[0]?.link || '');
        });
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
        const value = Math.max(1, parseInt(e.target.value) || 1); // не меньше 1
        setQuantity(value);
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image
                        width={300}
                        height={300}
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

                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                        <h2 className="text-center">{item.name}</h2>
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                background: `url(${bigStar}) no-repeat center center`,
                                width: 240, height: 240,
                                backgroundSize: 'cover', fontSize: 64
                            }}
                        >
                            {item.rating}
                        </div>
                    </Row>
                </Col>

                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgrey' }}
                    >
                        <h3>{item.price} руб.</h3>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={handleQuantityChange}
                                style={{ width: 70, marginRight: 10 }}
                            />
                            <Button variant={"outline-dark"} onClick={handleAddToCart}>
                                В корзину
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {item.info.map((info, index) =>
                    <Row key={info.id} style={{ background: index % 2 === 0 ? 'lightgrey' : 'transparent', padding: 10 }}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    );
};

export default ItemPage;
