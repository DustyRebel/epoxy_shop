import { $authHost } from "./index";

// Заказы из магазина
export const fetchAllOrders = async (done = false) => {
  const { data } = await $authHost.get(`/api/admin/orders?done=${done}`);
  return data;
};

export const setOrderDone = async (id, done) => {
  const { data } = await $authHost.patch(`api/admin/orders/${id}/done`, { done });
  return data;
};

// Заказы из конструктора

export const fetchAllConstructorOrders = async (done = false) => {
  const { data } = await $authHost.get(`/api/admin/orders/constructor_orders?done=${done}`);
  return data;
};

export const setBOrderDone = async (id, done) => {
  const { data } = await $authHost.patch(`api/admin/orders/constructor_orders/${id}/done`, { done });
  return data;
};

// Универсальная функция
export const markOrderAsDone = async (id, isConstructor, value) => {
  const url = isConstructor
    ? `/api/admin/orders/constructor_orders/${id}/done`
    : `/api/admin/orders/${id}/done`;
  const { data } = await $authHost.patch(url, { done: value });
  return data;
};