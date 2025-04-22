import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import star from '../assets/star.png';
import { useNavigate } from "react-router-dom";
import { GALLERY_ITEM_ROUTE } from "../utils/consts";

const GItemItem = ({gallery_item}) => {
    const navigate = useNavigate();

    // Показываем первое изображение, если оно есть
    const firstImage = gallery_item.gallery_imgs && gallery_item.gallery_imgs.length > 0
        ? process.env.REACT_APP_API_URL + gallery_item.gallery_imgs[0].link
        : 'https://via.placeholder.com/150'; // запасное изображение

    return (
        <Col md={4} className="mt-3" onClick={() => navigate(GALLERY_ITEM_ROUTE + '/' + gallery_item.id)}>
            <Card style={{ width: 300, cursor: 'pointer' }} border={"light"}>
                <Image width={300} height={300} src={firstImage} />
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div>{gallery_item.color || '...'}</div>
                    <div className="d-flex align-items-center">
                        <div>{gallery_item.rating || 0}</div>
                        <Image width={18} height={18} src={star} />
                    </div>
                </div>
                <div>{gallery_item.name}</div>
            </Card>
        </Col>
    );
};

export default GItemItem;
