import Axios from 'axios'

export default async function API(url, callback){
    
    await Axios
            .get(url,{
                headers: {"Access-Control-Allow-Origin": "*"} 
            })
            .then(response => callback(response.data))
}