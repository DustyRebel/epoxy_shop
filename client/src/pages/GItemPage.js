import React, { useContext, useState, useEffect }from "react";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from 'react-bootstrap/Container';
import  Image  from "react-bootstrap/Image";
import {useParams} from 'react-router-dom'
import { fetchOneItem } from "../http/gitemAPI";
import { toggleGItemAvailability } from "../http/gitemAPI";
import { jwtDecode } from "jwt-decode";
import { Button } from "react-bootstrap";

const GItemPage = () => {
    const [gallery_item, setItem] = useState({gallery_imgs: []})
    const [selectedImg, setSelectedImg] = useState(null)
    const {id} = useParams()

    useEffect(() => {
        fetchOneItem(id).then(data => {
            setItem(data)
            setSelectedImg(data.gallery_imgs?.[0]?.link || '') // выбираем первое изображение как основное
        })
    }, [id])

    const token = localStorage.getItem("token");
    let role = '';
    try {
        if (token) {
            const decoded = jwtDecode(token);
            role = decoded.role;
        }
    } catch (e) {
        console.error("Ошибка при декодировании токена", e);
    }


    return (
        <Container className="mt-3">
            <Row>
            <Col md={4}>
                <Image
                    width={600}
                    height={600}
                    src={process.env.REACT_APP_API_URL + selectedImg}
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                />
                <Row className="mt-2">
                    {gallery_item.gallery_imgs.map((img) => (
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
           
            <Col md={2}>
            </Col>
            <Col md={6}>
            {role === 'NONE' && (
            <Button
                variant={gallery_item.availability ? "outline-danger" : "outline-success"}
                className="mt-3"
                onClick={async () => {
                try {
                    const updated = await toggleGItemAvailability(gallery_item.id, gallery_item.availability);
                    setItem(prev => ({ ...prev, availability: updated.availability }));
                } catch (e) {
                    alert("Ошибка при обновлении доступности");
                    console.error(e);
                }
                }}
            >
                {gallery_item.availability ? "Сделать недоступным" : "Сделать доступным"}
            </Button>
            )}

            <div
            style={{
                width: 600,
                height: 600,
                fontSize: 18,
                overflowY: 'auto',     // вертикальная прокрутка при необходимости
                overflowX: 'hidden',   // горизонтальной прокрутки не будет
                padding: 20,
                whiteSpace: 'normal',  // перенос строк как обычно
                wordWrap: 'break-word', // перенос слов при нехватке места
                backgroundColor: '#f9f9f9',
                borderRadius: 10
            }}
            >
            {gallery_item.description}
            </div>



            </Col>

            </Row>

        </Container>
    );
};

export default GItemPage;