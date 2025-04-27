import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import star from '../assets/star.png';
import { useNavigate } from "react-router-dom";
import { ITEM_ROUTE } from "../utils/consts";

const ItemItem = ({item}) => {
    const navigate = useNavigate();

    // Показываем первое изображение, если оно есть
    const firstImage = item.shop_imgs && item.shop_imgs.length > 0
        ? process.env.REACT_APP_API_URL + item.shop_imgs[0].link
        : 'https://via.placeholder.com/150'; // запасное изображение

    return (
        <Col md={3} className="mt-3" onClick={() => navigate(ITEM_ROUTE + '/' + item.id)}>
            <Card style={{ width: 150, cursor: 'pointer' }} border={"light"}>
                <Image width={150} height={150} src={firstImage} />
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div>{item.price || '???'} руб.</div>
                    <div className="d-flex align-items-center">
                        <div>{item.rating || 0}</div>
                        <Image width={18} height={18} src={star} />
                    </div>
                </div>
                <div>{item.name}</div>
            </Card>
        </Col>
    );
};

export default ItemItem;
