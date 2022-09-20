import Axios from 'axios'

export default async function API(url, callback){
    Axios.defaults.headers.get['Content-Type'] ='application/json;charset=utf-8';
    Axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    await Axios
            .get(url,{
                headers: {"Access-Control-Allow-Origin": "*"} 
            })
            .then(response => callback(response.data))
}