import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password, role: 'USER'})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}


export const fetchUserOrders = async (userId) => {
    const { data } = await $authHost.get('api/user/' + userId);
    return data;
};

export const fetchUserConstructorOrders = async (userId) => {
    const { data } = await $authHost.get(`api/user/constructor/${userId}`);
    return data;
};