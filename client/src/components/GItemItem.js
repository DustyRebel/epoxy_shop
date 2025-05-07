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
                <div>{gallery_item.name}</div>
                <div
                className="text-black-50 mt-1"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxHeight: "4.5em", // примерно 3 строки
                    lineHeight: "1.5em"
                }}
                >
                {gallery_item.description || '...'}
                </div>
                
            </Card>
        </Col>
    );
};

export default GItemItem;
