import React, { useContext, useState, useEffect }from "react";
import {Context} from "../../index";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  Form  from "react-bootstrap/Form";
import {Dropdown} from "react-bootstrap";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { createItems, fetchColors, fetchTypes } from "../../http/gitemAPI";
import { observer } from "mobx-react-lite";

const CreateGItem = observer(({show, onHide}) => { // Observer нужен, чтобы в списках отображалось выбранное
    const {gallery_item} = useContext(Context)
    const [name, setName] = useState('')
    const [files, setFiles] = useState([])
    const [description, setDescription] = useState('')

    useEffect(() => { // Нужно для подгрузки типов и брендов из БД
        fetchTypes().then(data => gallery_item.setTypes(data))
        fetchColors().then(data => gallery_item.setColors(data))
    }, [])

    const selectFiles = e => {
        setFiles([...e.target.files])
    }


    const addItem = () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('colorId', gallery_item.selectedColor.id)
        formData.append('typeId', gallery_item.selectedType.id)
        formData.append('description', description)
    
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
                <Dropdown.Toggle>{gallery_item.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {gallery_item.types.map(type =>
                        <Dropdown.Item onClick={()=> gallery_item.setSelectedType(type)} key={type.id}>{type.name}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="mt-2">
                <Dropdown.Toggle>{gallery_item.selectedColor.name || "Выберите цвет"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {gallery_item.colors.map(color =>
                        <Dropdown.Item onClick={()=> gallery_item.setSelectedColor(color)} key={color.id}>{color.name}</Dropdown.Item>
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
                className="mt-2"
                type="file"
                multiple
                onChange={selectFiles}
            />

            <Form.Control
                value = {description}
                onChange = {e => setDescription(e.target.value)}
                className="mt-2"
                placeholder={"Введите описание товара"}
            />

            <hr/>
           
        </Form>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="outline-danger" onClick={onHide}>Close</Button>
      <Button variant="outline-success" onClick={addItem}>Добавить</Button>
    </Modal.Footer>
  </Modal>
  );
});
export default CreateGItem;