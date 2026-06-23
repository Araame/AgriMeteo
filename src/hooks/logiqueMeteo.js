import { useState } from "react";
import { getMeteoRegion } from "../services/AppelApiMeteo";


export  function useMeteo() {
    const [meteo, setmeteo]= useState(null)
    const [loading, setloading]=useState(false)
    const [error, seterror]= useState(null)

     async function utilisationMeteo(Region){

        setloading(true)
        try{
        const donnees= await getMeteoRegion(Region)
        setmeteo(donnees)
    }catch(error){   
        seterror("erreur meteo")
        setmeteo(null)
   }finally{
    setloading(false)
   }

}
   return{
    meteo,
    loading,
    error,
    utilisationMeteo
   }
}

