import {$authHost, $host  } from "./index";

export const fetchShippings = async () => {
    const { data } = await $host.get('api/shipping');
    return data;
};

export const createShipping = async (shipping) => {
    const {data} = await $authHost.post('api/shipping', shipping)
    return data
}