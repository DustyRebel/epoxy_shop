import { $authHost } from "./index";
import { $host } from "./index";

export const createBType = async (type) => {
  const { data } = await $authHost.post("api/btype", type);
  return data;
};

export const createBVariant = async (formData) => {
    const { data } = await $authHost.post("api/bvariant", formData);
    return data;
};

export const fetchBTypes = async () => {
    const { data } = await $host.get("api/btype");
    return data;
};

export const fetchBVariants = async () => {
    const { data } = await $host.get("api/bvariant");
    return data;
};

export const createBAttribute = async (data) => {
    const res = await $authHost.post("api/battribute", data);
    return res.data;
  };
  
  export const fetchBAttributesByVariant = async (variantId) => {
    const res = await $host.get(`api/battribute/by-variant/${variantId}`);
    return res.data;
  };
  
export const createBAttributeVal = async (formData) => {
    const res = await $authHost.post("api/battributeval", formData);
    return res.data;
};

export const uploadBAttributeValImg = async (formData) => {
    const { data } = await $authHost.post("api/battributevalimg", formData);
    return data;
};

export const fetchBAttributes = async () => {
    const { data } = await $host.get("api/battribute");
    return data;
};

export const fetchBAttributeVals = async (attributeId) => {
    const { data } = await $host.get(`api/battributeval/by-attribute/${attributeId}`);
    return data;
};
  