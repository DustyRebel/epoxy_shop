import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { fetchShippings } from "../../http/shippingAPI";
import { createBCheckout } from "../../http/bCheckoutAPI";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { Context } from "../../index";
import axios from "axios";

const CheckoutModal = ({ show, onHide, price }) => {
  const [shippings, setShippings] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', tg: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { constructor: constructorStore } = useContext(Context);

  useEffect(() => {
    fetchShippings().then(setShippings);
  }, []);

  const validate = () => {
    const phoneRegex = /^\+7\d{10}$/;
    //const tgRegex = /^@\w{5,}$/;

    const errs = {
      phone: phoneRegex.test(formData.phone) ? '' : 'Неверный номер',
      //tg: tgRegex.test(formData.tg) ? '' : 'Неверный Telegram (@username)'
    };
    setErrors(errs);
    return !Object.values(errs).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
  
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
  
      // Генерация JSON состояния конструктора
      const constructorData = {
        typeId: constructorStore.selectedBType?.id,
        variantId: constructorStore.selectedVariant?.id,
        attributes: constructorStore.selectedAttributes.map(({ attribute, value }) => ({
          attributeId: attribute.id,
          valueId: value.id
        })),
        smallSize: constructorStore.smallSizeEnabled
      };
      console.log("constructorData:", constructorData);
      // Единый запрос в bCheckoutController
      const createdCheckout = await createBCheckout({
        ...formData,
        price,
        shippingId: selectedShipping,
        json: constructorData
      });
  
      alert("Заказ оформлен!");
      onHide();
    } catch (e) {
      alert("Ошибка при оформлении");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Оформление заказа</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-3">Сумма к оплате: {price} ₽</h5>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>ФИО</Form.Label>
            <Form.Control
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Телефон</Form.Label>
            <Form.Control
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Telegram</Form.Label>
            <Form.Control
              value={formData.tg}
              onChange={e => setFormData({ ...formData, tg: e.target.value })}
              placeholder="@nickname"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Адрес</Form.Label>
            <Form.Control
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Способ доставки</Form.Label>
            <Form.Select
              value={selectedShipping || ''}
              onChange={e => setSelectedShipping(Number(e.target.value))}
            >
              <option disabled value="">Выберите способ</option>
              {shippings.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Отмена</Button>
        <Button variant="success" onClick={handleSubmit} disabled={loading || !selectedShipping}>
          {loading ? <Spinner size="sm" animation="border" /> : "Оформить"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;
