import axios from "axios";
import { notification } from 'antd';

export const getRequest = async (URL) => {
    return axios
    .get('http://localhost:5000' + URL)
    .then(response => {
       return response.data;
    })
    .catch(error => {
      console.log(error);
      throw new Error('error!');
    });
};

export const patchRequest = async (URL, options) => {
    return axios.patch('http://localhost:5000' + URL, options)
    .then(response => {
        notification.success({
            message: 'Pomyślnie zaktualizowano profil',
            placement: 'bottomRight',
        });
        return response.data;
    }).catch(error => {
        console.log(error);
        notification.error({
            message: error.message,
            placement: 'bottomRight',
        });
        throw new Error('error!');
    });
};