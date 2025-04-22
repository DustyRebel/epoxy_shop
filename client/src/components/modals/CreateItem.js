import React, { useContext, useState, useEffect }from "react";
import {Context} from "../../index";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  Form  from "react-bootstrap/Form";
import {Dropdown} from "react-bootstrap";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { createItems, fetchColors, fetchTypes } from "../../http/itemAPI";
import { observer } from "mobx-react-lite";

const CreateItem = observer(({show, onHide}) => { // Observer нужен, чтобы в списках отображалось выбранное
    const {item} = useContext(Context)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [files, setFiles] = useState([])
    const [info, setInfo] = useState([])

    useEffect(() => { // Нужно для подгрузки типов и брендов из БД
        fetchTypes().then(data => item.setTypes(data))
        fetchColors().then(data => item.setColors(data))
    }, [])

    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }
    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }

    const selectFiles = e => {
        setFiles([...e.target.files])
    }

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i  => i.number === number ? {...i, [key]: value} : i))
    }

    const addItem = () => {
        console.log("colorId:", item.selectedColor.id)
console.log("typeId:", item.selectedType.id)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', `${price}`)
        formData.append('colorId', item.selectedColor.id)
        formData.append('typeId', item.selectedType.id)
        formData.append('info', JSON.stringify(info))
    
        files.forEach(file => {
            formData.append('img', file) // одинаковый ключ, backend воспримет это как массив
        })
    
        createItems(formData).then(data => onHide())
    }

  return (
    <Modal
    show={show}
    onHide={onHide}
    size="lg"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Добавить устройство
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Dropdown className="mt-2">
                <Dropdown.Toggle>{item.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {item.types.map(type =>
                        <Dropdown.Item onClick={()=> item.setSelectedType(type)} key={type.id}>{type.name}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="mt-2">
                <Dropdown.Toggle>{item.selectedColor.name || "Выберите цвет"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {item.colors.map(color =>
                        <Dropdown.Item onClick={()=> item.setSelectedColor(color)} key={color.id}>{color.name}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <Form.Control
                value = {name}
                onChange = {e => setName(e.target.value)}
                className="mt-2"
                placeholder={"Введите название товара"}
            />
            <Form.Control
                value = {price}    
                onChange = {e => setPrice(Number(e.target.value))}        
                className="mt-2"
                placeholder={"Введите цену товара"}
                type="number"
            />
            <Form.Control
                className="mt-2"
                type="file"
                multiple
                onChange={selectFiles}
            />

            <hr/>
            <Button variant="outline-dark" onClick={addInfo}>Добавить новое свойство</Button>
            {
                info.map(i =>
                    <Row className="mt-2" key={i.number}>
                        <Col md={4}>
                            <Form.Control
                            value = {i.title}
                            onChange={(e)=> changeInfo('title', e.target.value, i.number)}
                            placeholder="Введите название свойства"
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                            value = {i.description}
                            onChange={(e)=> changeInfo('description', e.target.value, i.number)}
                            placeholder="Введите описание свойства"
                            />
                        </Col>
                        <Col md={4}>
                            <Button variant="outline-danger" onClick={()=> removeInfo(i.number)}>Удалить</Button>
                        </Col>
                    </Row>
                )


            }
        </Form>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="outline-danger" onClick={onHide}>Close</Button>
      <Button variant="outline-success" onClick={addItem}>Добавить</Button>
    </Modal.Footer>
  </Modal>
  );
});
export default CreateItem;