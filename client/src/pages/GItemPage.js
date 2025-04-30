import React, { useContext, useState, useEffect }from "react";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from 'react-bootstrap/Container';
import  Image  from "react-bootstrap/Image";
import {useParams} from 'react-router-dom'
import { fetchOneItem } from "../http/gitemAPI";

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
            <div
                    className="d-flex flex-column align-items-center "
                    style={{width:600, height:600, fontSize:32}}
                >
                    <h3>{gallery_item.description} </h3>
                    
                </div>
            </Col>

            </Row>

        </Container>
    );
};

export default GItemPage;