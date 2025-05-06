import { $authHost } from "./index";

export const createBCheckout = async (checkoutData) => {
    const { data } = await $authHost.post('api/bcheckout', checkoutData);
    return data;
};
