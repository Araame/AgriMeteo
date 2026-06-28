// import { getMeteoRegion } from "../services/AppelApiMeteo";


// export  function useMeteo() {
//     const [meteo, setmeteo]= useState(null)
//     const [loading, setloading]=useState(false)
//     const [error, seterror]= useState(null)

//      async function utilisationMeteo(Region){

//         setloading(true)
//         try{
//         const donnees= await getMeteoRegion(Region)
//         setmeteo(donnees)
//     }catch(error){   
//         seterror("erreur meteo")
//         setmeteo(null)
//    }finally{
//     setloading(false)
//    }

// }
//    return{
//     meteo,
//     loading,
//     error,
//     utilisationMeteo
//    }
// }
import { getMeteoRegion } from "../services/AppelApiMeteo";
 import { useState, useEffect } from 'react';
 import { generateHistoricalData } from '../utils/generateHistoricalData';

export function useMeteo(region) {
  const [meteo, setMeteo] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!region) {
      setMeteo(null);
      setHistoricalData([]);
      return;
    }

    async function fetchMeteo() {
      setLoading(true);
      setError(null);

      try {
        const data = await getMeteoRegion(region);
        setMeteo(data);

        // Générer les données historiques
        const history = generateHistoricalData(
          data.main.temp,
          data.main.humidity
        );
        setHistoricalData(history);

      } catch (err) {
        console.error('Erreur météo:', err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    }

    fetchMeteo();
  }, [region]);

  return { meteo, historicalData, loading, error };
}