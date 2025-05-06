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
import { downloadConstructorState, uploadConstructorState, uploadConstructorStateFromJson } from "../utils/constructorStateUtils";
import CheckoutModal from "../components/modals/CheckoutModal";
import { jwtDecode } from "jwt-decode";

const viewLabels = {
  front: "Вид спереди",
  side: "Вид сбоку",
  back: "Вид сзади"
};

const Builder = observer(() => {
  const { constructor: constructorStore } = useContext(Context);
  const { user } = useContext(Context);
  let role = '';
  try {
              const token = localStorage.getItem('token');
              if (token) {
                  const decoded = jwtDecode(token);
                  role = decoded.role;
              }
          } catch (e) {
              console.error("Ошибка при декодировании токена", e);
          }
  const [types, setTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [darkBackground, setDarkBackground] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);


  useEffect(() => {
    fetchBTypes().then(setTypes);
  }, []);

  useEffect(() => {
    if (constructorStore.selectedBType) {
      // сбрасываем старые данные
      setAttributes([]);
      setAttributeValues({});
      setVariants([]);
  
      fetchBVariants().then(data => {
        const filtered = data
          .filter(v => v.bTypeId === constructorStore.selectedBType.id)
          .map(v => ({
            ...v,
            disabled: !v.availability
          }));
        setVariants(filtered);
      });
    }
  }, [constructorStore.selectedBType]);
  
  

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

  useEffect(() => {
    const restoreFlag = new URLSearchParams(window.location.search).get("restore");
    if (restoreFlag && localStorage.getItem("constructor_restore_json")) {
      const json = JSON.parse(localStorage.getItem("constructor_restore_json"));
      uploadConstructorStateFromJson(json, constructorStore);
      localStorage.removeItem("constructor_restore_json");
    }
  }, []);
  

  const getImgByView = (view) => {
    return constructorStore.selectedVariant?.b_variant_imgs?.find(img => img.view === view)?.link;
  };

  const getAttrValByRole = (role) => {
    const matchingAttrs = attributes.filter(a => a.renderRole === role);
    for (const attr of matchingAttrs) {
      const selected = constructorStore.selectedAttributes.find(sa => sa.attribute.id === attr.id);
      if (selected?.value) return selected.value;
    }
    return null;
  };
  
  const getSelectedHexColor = () => getAttrValByRole("colorOverlay")?.hexColor || null;
  const getSelectedBaseColor = () => getAttrValByRole("baseColor")?.hexColor || null;

  const getSelectedBaseImg = (view) => {
    const val = getAttrValByRole("baseColor");
    const img = val?.b_attribute_val_imgs?.find(i => i.view === view);
    return img ? process.env.REACT_APP_API_URL + img.link : null;
  };

  const getSelectedGlitterImg = (view) => {
    const val = getAttrValByRole("glitterImg");
    const img = val?.b_attribute_val_imgs?.find(i => i.view === view);
    return img ? process.env.REACT_APP_API_URL + img.link : null;
  };
  const getSelectedDecorImg = (view) => {
    const val = getAttrValByRole("decorImg");
    console.log("DecorAttrVal:", getAttrValByRole("decorImg"));
    const img = val?.b_attribute_val_imgs?.find(i => i.view === view);
    return img ? process.env.REACT_APP_API_URL + img.link : null;
  };
  

  return (
    <Container fluid className="px-4">
    <Row className="p-3">
      <Col md={3}  style={{
    maxHeight: "calc(100vh - 100px)",
    overflowY: "auto",
    paddingRight: "8px"
  }}>
        <h4>Цена: {constructorStore.totalPrice} ₽</h4>

        <Dropdown className="mt-3 ">
          <Dropdown.Toggle  style={{ backgroundColor: "#f27cab", borderColor: "#f27cab", color: "#fff"}}>
            {constructorStore.selectedBType?.name || "Выберите тип"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {types.map(type => (
              <Dropdown.Item key={type.id} onClick={() => constructorStore.setType(type)}>
                {type.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="mt-3">
          <Dropdown.Toggle style={{ backgroundColor: "#f27cab", borderColor: "#f27cab", color: "#fff"}}>
            {constructorStore.selectedVariant?.name || "Выберите форму"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
          {variants.map(variant => (
            <Dropdown.Item
              key={variant.id}
              disabled={variant.disabled}
              onClick={() => {
                if (!variant.disabled) constructorStore.setVariant(variant);
              }}
            >
              {variant.name} 
              {!variant.availability && " — недоступно"}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>

        </Dropdown>
        
        <Form.Check
  type="switch"
  id="size-toggle"
  label={constructorStore.smallSizeEnabled ? "Форма 2х2 см" : "Форма 3х3 см"}
  checked={constructorStore.smallSizeEnabled}
  onChange={() => {
    constructorStore.setSmallSize(!constructorStore.smallSizeEnabled);
  }}
  className="mb-2 mt-2"
/>


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

      {(attributeValues[attr.id] || []).map(val => {
        const isSelected = constructorStore.getSelectedVal(attr.id)?.id === val.id;
        const imgUrl = val.img ? process.env.REACT_APP_API_URL + val.img : null;

        const buttonStyle = {
          width:  val.hexColor ? 20 : "auto",
          height: 40,
          padding: imgUrl || val.hexColor ? 0 : "0 10px",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: isSelected ? "#f27cab" : "#ccc",
          backgroundColor: val.hexColor && !imgUrl ? val.hexColor : "#fff",
          color: val.hexColor ? "#fff" : "#000",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        };

      return (
        <button
          key={val.id}
          className="btn btn-sm"
          onClick={() => constructorStore.addAttributeValue(attr, val)}
          style={buttonStyle}
          title={val.name}
        >
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={val.name}
              style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 3 }}
            />
          ) : !val.hexColor ? (
            val.name
          ) : null}
        </button>
      );
    })}

        </div>
      </div>
    ))}


<div className="mt-4 d-flex flex-column gap-2">
  <Button
    variant="outline-primary"
    onClick={() => downloadConstructorState(constructorStore)}
  >
    Скачать JSON
  </Button>
Выберите JSON-файл для восстановления
  <Form.Control
    type="file"
    accept=".json"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        uploadConstructorState(file, constructorStore)
          .then(() => console.log("Состояние конструктора восстановлено"))
          .catch((err) => alert("Ошибка загрузки JSON: " + err.message));
      }
    }}
  />
{role === 'USER' || role === 'ADMIN' ? (
  <Button variant="success" onClick={() => setShowCheckout(true)}>
    Оформить заказ
  </Button>
) : (
  <Button variant="secondary" disabled>
    Войдите, чтобы оформить заказ
  </Button>
)}


<CheckoutModal
  show={showCheckout}
  onHide={() => setShowCheckout(false)}
  price={constructorStore.totalPrice}
/>

</div>

        
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
        baseImg={getSelectedBaseImg(view)}
        view={view}
        scale={constructorStore.smallSizeEnabled ? 0.66 : 1}
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
