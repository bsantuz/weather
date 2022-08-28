import Axios from 'axios'

export default async function API(url, callback){
    await Axios
            .get(url)
            .then(response => callback(response.data))
}