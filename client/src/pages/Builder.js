import React, { useEffect, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import {
  fetchBTypes,
  fetchBVariants,
  fetchBAttributesByVariant,
  fetchBAttributeVals
} from "../http/bConstructorAPI";
import { Dropdown, Row, Col, Button, Form, Container } from "react-bootstrap";
import CanvasPreview from "../components/CanvasPreview";

const viewLabels = {
  front: "Вид спереди",
  side: "Вид сбоку",
  back: "Вид сзади"
};

const Builder = observer(() => {
  const { constructor: constructorStore } = useContext(Context);
  const [types, setTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [darkBackground, setDarkBackground] = useState(false);

  useEffect(() => {
    fetchBTypes().then(setTypes);
  }, []);

  useEffect(() => {
    if (constructorStore.selectedType) {
      // сбрасываем старые данные
      setAttributes([]);
      setAttributeValues({});
      setVariants([]);
  
      fetchBVariants().then(data => {
        const filtered = data
          .filter(v => v.bTypeId === constructorStore.selectedType.id)
          .map(v => ({
            ...v,
            disabled: !v.availability
          }));
        setVariants(filtered);
      });
    }
  }, [constructorStore.selectedType]);
  
  

  useEffect(() => {
    if (constructorStore.selectedVariant) {
      fetchBAttributesByVariant(constructorStore.selectedVariant.id).then(attrs => {
        setAttributes(attrs);
        attrs.forEach(attr => {
          fetchBAttributeVals(attr.id).then(vals => {
            setAttributeValues(prev => ({ ...prev, [attr.id]: vals }));
          });
        });
      });
    }
  }, [constructorStore.selectedVariant]);

  const getImgByView = (view) => {
    return constructorStore.selectedVariant?.b_variant_imgs?.find(img => img.view === view)?.link;
  };

  const getSelectedHexColor = () => {
    const colorAttr = attributes.find(attr => attr.name.toLowerCase() === "цвет");
    const selected = constructorStore.selectedAttributes.find(a => a.attribute.id === colorAttr?.id);
    return selected?.value?.hexColor || null;
  };

  const getSelectedGlitterImg = (view) => {
    const glitterAttr = attributes.find(attr => attr.name.toLowerCase().includes("глиттер"));
    const selected = constructorStore.selectedAttributes.find(a => a.attribute.id === glitterAttr?.id);
    const img = selected?.value?.b_attribute_val_imgs?.find(i => i.view === view);
    return img ? process.env.REACT_APP_API_URL + img.link : null;
  };

  const getSelectedDecorImg = (view) => {
    const decorAttr = attributes.find(attr => attr.name.toLowerCase().includes("сухоцветы"));
    const selected = constructorStore.selectedAttributes.find(a => a.attribute.id === decorAttr?.id);
    const img = selected?.value?.b_attribute_val_imgs?.find(i => i.view === view);
    return img ? process.env.REACT_APP_API_URL + img.link : null;
  };

  const getSelectedBaseColor = () => {
    const baseAttr = attributes.find(attr => attr.name.toLowerCase().includes("подложка"));
    const selected = constructorStore.selectedAttributes.find(a => a.attribute.id === baseAttr?.id);
    return selected?.value?.hexColor || null;
  };
  
  
  

  return (
    <Container fluid className="px-4">
    <Row className="p-3">
      <Col md={3}>
        <h4>Цена: {constructorStore.totalPrice} ₽</h4>

        <Dropdown className="mt-3">
          <Dropdown.Toggle>{constructorStore.selectedType?.name || "Выберите тип"}</Dropdown.Toggle>
          <Dropdown.Menu>
            {types.map(type => (
              <Dropdown.Item key={type.id} onClick={() => constructorStore.setType(type)}>
                {type.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="mt-3">
          <Dropdown.Toggle>{constructorStore.selectedVariant?.name || "Выберите форму"}</Dropdown.Toggle>
          <Dropdown.Menu>
          {variants.map(variant => (
            <Dropdown.Item
              key={variant.id}
              disabled={variant.disabled}
              onClick={() => {
                if (!variant.disabled) constructorStore.setVariant(variant);
              }}
            >
              {variant.name} ({variant.b_type?.name || "Тип"})
              {!variant.availability && " — недоступно"}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>

        </Dropdown>

        {attributes.map(attr => (
  <div className="mt-4" key={attr.id}>
    <h6>{attr.name}</h6>
    <div className="d-flex flex-wrap gap-2">
      {/* Кнопка для снятия выбора */}
      <button
        className={`btn btn-outline-secondary btn-sm ${!constructorStore.getSelectedVal(attr.id) ? "active" : ""}`}
        onClick={() => constructorStore.removeAttribute(attr.id)}
      >
        Нет
      </button>

      {(attributeValues[attr.id] || []).map(val => (
        <button
          key={val.id}
          className={`btn btn-outline-primary btn-sm ${
            constructorStore.getSelectedVal(attr.id)?.id === val.id ? "active" : ""
          }`}
          onClick={() => constructorStore.addAttributeValue(attr, val)}
          style={val.hexColor ? {
            backgroundColor: val.hexColor,
            color: "#fff",
            borderColor: val.hexColor
          } : {}}
        >
          {val.hexColor ? "" : val.name}
        </button>
      ))}
    </div>
  </div>
))}


        <Button className="mt-4" variant="success">
          Оформить заказ
        </Button>
      </Col>

      <Col md={9}>
      <div className="d-flex align-items-center mb-2">
  <Form.Check 
    type="switch"
    id="background-toggle"
    label={darkBackground ? "Тёмный фон" : "Светлый фон"}
    checked={darkBackground}
    onChange={() => setDarkBackground(prev => !prev)}
  />
</div>

<div
  className={`visual-preview d-flex flex-wrap justify-content-around mt-2 align-items-center border p-4 ${darkBackground ? 'bg-dark' : 'bg-light'}`}
  style={{ height: 750 }}
>
        {constructorStore.selectedVariant ? (
  ["front", "side", "back"].map((view) => (
    <div key={view} className="d-flex flex-column align-items-center">
<h6 className={`mb-2 ${darkBackground ? "text-light" : ""}`}>{viewLabels[view]}</h6>
      <CanvasPreview
        formImg={process.env.REACT_APP_API_URL + getImgByView(view)}
        glitterImg={getSelectedGlitterImg(view)}
        hexColor={getSelectedHexColor()}
        decorImg={getSelectedDecorImg(view)}
        baseColor={getSelectedBaseColor()} 
        view={view}
      />
    </div>
  ))
) : (
  <div className={darkBackground ? "text-light" : "text-muted"}>
  Примерный вид вашего изделия будет здесь
</div>
)}

        </div>
      </Col>
    </Row>
    </Container>
  );
});

export default Builder;
