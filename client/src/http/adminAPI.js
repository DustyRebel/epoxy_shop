import { $authHost } from "./index";

// Заказы из магазина
export const fetchAllOrders = async () => {
  const { data } = await $authHost.get("api/admin/orders"); // ← OK
  return data;
};

export const setOrderDone = async (id) => {
  const { data } = await $authHost.patch(`api/admin/orders/${id}/done`);
  return data;
};

// Заказы из конструктора
export const fetchAllConstructorOrders = async () => {
  const { data } = await $authHost.get("api/admin/orders/constructor_orders"); // ← исправлено
  return data;
};

export const setBOrderDone = async (id) => {
  const { data } = await $authHost.patch(`api/admin/orders/constructor_orders/${id}/done`);
  return data;
};

// Универсальная функция — в зависимости от флага отправим в нужный endpoint
export const markOrderAsDone = async (id, isConstructor = false) => {
  return isConstructor ? setBOrderDone(id) : setOrderDone(id);
};
