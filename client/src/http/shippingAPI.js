import { $host } from "./index";

export const fetchShippings = async () => {
    const { data } = await $host.get('api/shipping');
    return data;
};
