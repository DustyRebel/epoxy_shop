import { $authHost } from "./index";

// Добавить товар в корзину
export const addItemToCart = async (itemId, quantity) => {
    const { data } = await $authHost.post('api/cart_item', { itemId, quantity });
    return data;
};

// Получить все товары в корзине текущего пользователя
export const fetchCartItems = async () => {
    const { data } = await $authHost.get('api/cart_item');
    return data;
};

// Обновить количество товара в корзине
export const updateCartItem = async (cartItemId, quantity) => {
    const { data } = await $authHost.put(`api/cart_item/${cartItemId}`, { quantity });
    return data;
};

// Удалить товар из корзины
export const deleteCartItem = async (cartItemId) => {
    const { data } = await $authHost.delete(`api/cart_item/${cartItemId}`);
    return data;
};


export const deleteCartItemsByCart = async (cartId) => {
    const { data } = await $authHost.delete(`api/cart_item/cart/${cartId}`);
    return data;
};


