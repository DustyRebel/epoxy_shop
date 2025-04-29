import { $authHost } from "./index"; // используем авторизованный запрос с токеном

export const createRating = async ({ itemId, rate, review }) => {
    const { data } = await $authHost.post('api/rating', { itemId, rate, review });
    return data;
};

export const fetchUserRating = async (userId, itemId) => {
    const { data } = await $authHost.get('api/rating/user', { params: { userId, itemId } });
    return data; // если нет отзыва, будет null
};

export const updateRating = async (ratingId, rate, review) => {
    const { data } = await $authHost.put(`api/rating/${ratingId}`, { rate, review });
    return data;
};

export const deleteRating = async (ratingId) => {
    const { data } = await $authHost.delete(`api/rating/${ratingId}`);
    return data;
};

export const fetchRatings = async (itemId) => {
    const { data } = await $authHost.get('api/rating', { params: { itemId } });
    return data;
};