import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Button, Form } from "react-bootstrap";
import { fetchUserOrders, fetchUserConstructorOrders } from "../http/userAPI";
import { jwtDecode } from "jwt-decode";
import CreateRating from "../components/modals/CreateRating";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showConstructorOrders, setShowConstructorOrders] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [showConstructorOrders]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const data = showConstructorOrders
        ? await fetchUserConstructorOrders(decoded.id)
        : await fetchUserOrders(decoded.id);
      setOrders(data);
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveReview = (itemId) => {
    setSelectedItemId(itemId);
    setShowRatingModal(true);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Мои заказы</h2>
        <Form.Check
          type="switch"
          id="constructor-toggle"
          label="Показать заказы из конструктора"
          checked={showConstructorOrders}
          onChange={() => setShowConstructorOrders(prev => !prev)}
        />
      </div>

      {loading ? (
        <h4>Загрузка заказов...</h4>
      ) : orders.length === 0 ? (
        <h5 className="text-muted">
          {showConstructorOrders
            ? "Заказы из конструктора не найдены"
            : "Обычные заказы не найдены"}
        </h5>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="mt-3">
            <Card.Body>
              <Card.Title>
                Заказ №{order.id} от {new Date(order.createdAt).toLocaleString("ru-RU", {
                  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                }).replace(",", "")}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Сумма: {order.price} руб. | Доставка: {order.shipping?.name || "Не указано"}
              </Card.Subtitle>
              <Card.Text>
                Адрес доставки: {order.address}
              </Card.Text>

              {showConstructorOrders ? (
                <div>
                  <h5>Заказ из конструктора</h5>
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
                </div>
              ) : (
                <>
                  <h5>Товары:</h5>
                  <ListGroup variant="flush">
                    {(order.checkout_items || []).map(item => (
                      <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                        <span>{item.item.name} × {item.quantity}</span>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => handleLeaveReview(item.item.id)}
                        >
                          Оставить отзыв
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <CreateRating
        show={showRatingModal}
        onHide={() => setShowRatingModal(false)}
        itemId={selectedItemId}
      />
    </Container>
  );
};

export default UserOrders;
