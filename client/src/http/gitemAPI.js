import { $authHost, $host } from "./index";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => { //получение типов из БД
    const {data} = await $host.get('api/type')
    return data
}


export const createColor = async (color) => {
    const {data} = await $authHost.post('api/color', color)
    return data
}

export const fetchColors = async () => {
    const {data} = await $host.get('api/color')
    return data
}


export const createItems = async (gallery_item) => {
    const {data} = await $authHost.post('api/gitem', gallery_item)
    return data
}

export const fetchItems = async (typeId, colorId, page, limit= 2) => {
    const {data} = await $host.get('api/gitem', {params: {
            typeId, colorId, page, limit
        }})
    return data
}

export const fetchOneItem = async (id) => {
    const {data} = await $host.get('api/gitem/' + id)
    return data
}

export const deleteItems = async (id) => {
    const { data } = await $authHost.delete(`api/gitem${id}`);
    return data
}

export const toggleGItemAvailability = async (id, currentAvailability) => {
    const { data } = await $authHost.patch(`api/gitem/${id}/availability`, {
        availability: !currentAvailability
    });
    return data;
};

export const fetchGItemByName = async (name) => {
    const { data } = await $authHost.get(`api/gitem/name/${encodeURIComponent(name)}`);
    return data;
  };