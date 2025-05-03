import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import { Button } from "react-bootstrap";
import {
  fetchAllBVariants,
  fetchAllBAttributeVals,
  updateBVariantAvailability,
  updateBAttributeValAvailability,
} from "../http/bConstructorAPI";

import CreateType from "../components/modals/CreateType";
import CreateColor from "../components/modals/CreateColor";
import CreateItem from "../components/modals/CreateItem";
import DeleteItem from "../components/modals/DeleteItem";
import CreateGItem from "../components/modals/CreateGItem";
import GDeleteItem from "../components/modals/GDeleteItem";
import CreateShipping from "../components/modals/CreateShipping";

import CreateBType from "../components/modals/CreateBType";
import CreateBVariant from "../components/modals/CreateBVariant";
import CreateBAttribute from "../components/modals/CreateBAttribute";
import CreateBAttributeVal from "../components/modals/CreateBAttributeVal";
import ToggleAvailabilityModal from "../components/modals/ToggleAvailabilityModal";

const Admin = () => {
  const [colorVisible, setColorVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [itemVisible, setItemVisible] = useState(false);
  const [gitemVisible, setGItemVisible] = useState(false);
  const [itemDeleteVisible, setItemDeleteVisible] = useState(false);
  const [gitemDeleteVisible, setGItemDeleteVisible] = useState(false);
  const [shippingVisible, setShippingVisible] = useState(false);

  const [btypeVisible, setBTypeVisible] = useState(false);
  const [bvariantVisible, setBVariantVisible] = useState(false);
  const [battrVisible, setBAttrVisible] = useState(false);
  const [battrValVisible, setBAttrValVisible] = useState(false);

  const [toggleVisible, setToggleVisible] = useState(false);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [allVariants, setAllVariants] = useState([]);
  const [allAttrVals, setAllAttrVals] = useState([]);
  const [showLists, setShowLists] = useState(false);

  const loadData = () => {
    fetchAllBVariants().then(setAllVariants);
    fetchAllBAttributeVals().then(setAllAttrVals);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container className="d-flex flex-column">

      {/* Кнопки добавления */}
      <Button variant="outline-dark" className="mt-2 p-2" onClick={() => setTypeVisible(true)}>Добавить тип</Button>
      <Button variant="outline-dark" className="mt-2 p-2" onClick={() => setColorVisible(true)}>Добавить цвет</Button>
      <Button variant="outline-dark" className="mt-2 p-2" onClick={() => setItemVisible(true)}>Добавить товар</Button>
      <Button variant="outline-dark" className="mt-2 p-2" onClick={() => setItemDeleteVisible(true)}>Удалить товар</Button>
      <Button variant="outline-dark" className="mt-2 p-2" onClick={() => setGItemVisible(true)}>Добавить предмет в галерею</Button>
      <Button variant="outline-dark" className="mt-2 p-2" onClick={() => setGItemDeleteVisible(true)}>Удалить предмет галереи</Button>
      <Button variant="outline-dark" className="mt-2 p-2" onClick={() => setShippingVisible(true)}>Добавить способ доставки</Button>

      {/* Конструктор */}
      <Button variant="outline-info" className="mt-2 p-2" onClick={() => setBTypeVisible(true)}>Добавить тип в конструктор</Button>
      <Button variant="outline-info" className="mt-2 p-2" onClick={() => setBVariantVisible(true)}>Добавить форму к типу</Button>
      <Button variant="outline-info" className="mt-2 p-2" onClick={() => setBAttrVisible(true)}>Добавить атрибут</Button>
      <Button variant="outline-info" className="mt-2 p-2" onClick={() => setBAttrValVisible(true)}>Добавить значение атрибута</Button>
      <Button variant="outline-info" className="mt-2 p-2" onClick={() => setShowLists(prev => !prev)}> {showLists ? "Скрыть формы и значения" : "Показать формы и значения"} </Button>
      
      
      {/* Модалки */}
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateColor show={colorVisible} onHide={() => setColorVisible(false)} />
      <CreateItem show={itemVisible} onHide={() => setItemVisible(false)} />
      <DeleteItem show={itemDeleteVisible} onHide={() => setItemDeleteVisible(false)} />
      <CreateGItem show={gitemVisible} onHide={() => setGItemVisible(false)} />
      <GDeleteItem show={gitemDeleteVisible} onHide={() => setGItemDeleteVisible(false)} />
      <CreateShipping show={shippingVisible} onHide={() => setShippingVisible(false)} />

      <CreateBType show={btypeVisible} onHide={() => setBTypeVisible(false)} />
      <CreateBVariant show={bvariantVisible} onHide={() => setBVariantVisible(false)} />
      <CreateBAttribute show={battrVisible} onHide={() => setBAttrVisible(false)} />
      <CreateBAttributeVal show={battrValVisible} onHide={() => setBAttrValVisible(false)} />

      {/* Списки доступности */}
      {showLists && (
  <>
    <h5 className="mt-4">Формы</h5>
    <div className="d-flex flex-wrap gap-3">
      {allVariants.map(v => (
        <div
          key={v.id}
          className="border rounded p-2 d-flex flex-column align-items-start"
          style={{ minWidth: 200 }}
        >
          <div>
            <strong>{v.name}</strong> ({v.b_type?.name || `тип ID: ${v.bTypeId}`}){" "}
            {!v.availability && <span className="text-danger">[отключено]</span>}
          </div>
          <Button
            size="sm"
            className="mt-2"
            variant={v.availability ? "outline-danger" : "outline-success"}
            onClick={() => {
              setToggleTarget({ id: v.id, name: v.name, availability: v.availability, type: "variant" });
              setToggleVisible(true);
            }}
          >
            {v.availability ? "Отключить" : "Включить"}
          </Button>
        </div>
      ))}
    </div>

    <h5 className="mt-4">Значения атрибутов</h5>
    <div className="d-flex flex-wrap gap-3">
      {allAttrVals.map(val => (
        <div
          key={val.id}
          className="border rounded p-2 d-flex flex-column align-items-start"
          style={{ minWidth: 200 }}
        >
          <div>
            <strong>{val.name}</strong> ({val.b_attribute?.name || `атрибут ID: ${val.bAttributeId}`}){" "}
            {!val.availability && <span className="text-danger">[отключено]</span>}
          </div>
          <Button
            size="sm"
            className="mt-2"
            variant={val.availability ? "outline-danger" : "outline-success"}
            onClick={() => {
              setToggleTarget({ id: val.id, name: val.name, availability: val.availability, type: "attrval" });
              setToggleVisible(true);
            }}
          >
            {val.availability ? "Отключить" : "Включить"}
          </Button>
        </div>
      ))}
    </div>
  </>
)}



      <ToggleAvailabilityModal
        show={toggleVisible}
        onHide={() => setToggleVisible(false)}
        entityName={toggleTarget?.name || "элемент"}
        currentValue={toggleTarget?.availability}
        onToggle={async () => {
          try {
            if (toggleTarget.type === "variant") {
              await updateBVariantAvailability(toggleTarget.id, !toggleTarget.availability);
            } else {
              await updateBAttributeValAvailability(toggleTarget.id, !toggleTarget.availability);
            }
            setToggleVisible(false);
            loadData();
          } catch (e) {
            alert("Ошибка при обновлении");
          }
        }}
      />
    </Container>
  );
};

export default Admin;
