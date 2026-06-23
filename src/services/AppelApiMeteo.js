const API_KEY=import.meta.env.VITE_CLE_API_METEO
const URL_METEO=import.meta.env.VITE_URL_METEO
import axios from 'axios'




export async function getMeteoRegion(region){
    try{  
    const url=`${URL_METEO}?q=${region}&appid=${API_KEY}&units=metric&lang=fr`
    const response=await axios.get(url)
    return response.data}
    catch(error){
        console.error("Erreur meteo", error)
         throw error;
    }
}

