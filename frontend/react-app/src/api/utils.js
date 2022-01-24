import axios from "axios";

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
        return response.data;
    }).catch(error => {
        console.log(error);
        throw new Error('error!');
    });
};