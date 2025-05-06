import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Button, Form } from "react-bootstrap";
import { fetchAllOrders, fetchAllConstructorOrders, markOrderAsDone } from "../http/adminAPI";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showConstructorOrders, setShowConstructorOrders] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [showConstructorOrders]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = showConstructorOrders
        ? await fetchAllConstructorOrders()
        : await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Ошибка загрузки заказов:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (id) => {
    await markOrderAsDone(id, showConstructorOrders);
    loadOrders();
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Заказы пользователей</h2>
        <Form.Check
          type="switch"
          id="constructor-toggle"
          label="Показать заказы из конструктора"
          checked={showConstructorOrders}
          onChange={() => setShowConstructorOrders(prev => !prev)}
        />
      </div>

      {loading ? (
        <h5>Загрузка...</h5>
      ) : orders.length === 0 ? (
        <h5 className="text-muted">Нет заказов</h5>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mt-3">
            <Card.Body>
              <Card.Title>
                Заказ №{order.id} — {order.user?.email || "Неизвестный пользователь"}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Покупатель: {order.name} | Телефон: {order.phone} | Telegram: {order.tg || "–"}
              </Card.Subtitle>
              <Card.Text>Адрес: {order.address}</Card.Text>
              <Card.Text>Доставка: {order.shipping?.name || "Не указана"}</Card.Text>
              <Card.Text>Итого: {order.price} руб.</Card.Text>

              {showConstructorOrders ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    const json = order.b_checkout_items?.[0]?.json;
                    if (json) {
                      localStorage.setItem("constructor_restore_json", JSON.stringify(json));
                      window.open("/builder?restore=1", "_blank");
                    }
                  }}
                >
                  Посмотреть в конструкторе
                </Button>
              ) : (
                Array.isArray(order.checkout_items) && order.checkout_items.length > 0 && (
                  <>
                    <h5>Товары:</h5>
                    <ListGroup>
                      {order.checkout_items.map((item) => (
                        <ListGroup.Item key={item.id}>
                          {item.item.name} × {item.quantity}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </>
                )
              )}

              {!order.done && (
                <div>
                  <Button
                    className="mt-3"
                    variant="success"
                    onClick={() => handleMarkDone(order.id)}
                  >
                    Отметить как выполненный
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default AdminOrders;
