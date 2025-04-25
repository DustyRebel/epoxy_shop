import { $authHost } from "./index";

export const createCheckout = async (checkoutData) => {
    const { data } = await $authHost.post('api/checkout', checkoutData);
    return data;
};
