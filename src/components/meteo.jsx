import { useMeteo } from "../hooks/logiqueMeteo";

export function AfficheMeteo({meteo, error,loading}){
    if(error){
       return <p>Erreur Meteo</p>
    }else if(loading===true){
        return <p>chargement...."</p>
    }else if(!meteo){
        return <p>Choisissez la region</p>
    }else{
        return(
        <div>
   
        <p>Nom: {meteo.name}</p>
        <p>Température: {meteo.main.temp}°C</p>
        <p>Description: {meteo.weather[0].description}</p>
        <p>Humidité: {meteo.main.humidity}%</p>
        <p>Vent: {meteo.wind.speed} m/s</p>
        <p>Pays: {meteo.sys.country}</p>


        </div>
    )
    }

}