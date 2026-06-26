import React, { useState } from "react";
import MapSenegal from "./components/map"
import Sidebar from "./components/Sidebar";
import axios from "axios";

const API_KEY = import.meta.env.VITE_APP_API_KEY; 
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

function App() {
  // États pour la sidebar

  // Etat pour sidebar ouvert ou ferme : par défaut est fermé
  const [estSidebarOuvert, setEstSidebarOuvert] = useState(false);

  // Etat pour chargement des donnees meteorologiques : par défaut pas chargé
  const [donneesAPI, setDonneesAPI] = useState(null);

  // Etat pour spinner pendant chargement des donnees depuis l'API
  const [chargement, setChargement] = useState(false);

  // Etat pour les erreurs
  const [erreur, setErreur] = useState(null);

  // Fonction qui sera passée au MapSenegal
  const donneesRegionClick = async (regionName) => {
    setChargement(true);
    setErreur(null);
    setDonneesAPI(null);
    setEstSidebarOuvert(true); 

    try {
      const response = await axios.get(API_URL, {
        params: {
          q: regionName,
          appid: API_KEY,
          units: "metric" 
        }
      });

      setDonneesAPI(response.data);
    } catch (err) {
      console.error("Erreur API:", err);
      setErreur(`Impossible de charger la météo pour ${regionName}. Vérifiez le nom.`);
    } finally {
      setChargement(false);
    }
  };

  const fermerSidebar = () => {
    setEstSidebarOuvert(false);
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4 text-primary">AgriMeteo</h1>
      
      {/* On passe la fonction donneesRegionClick au composant MapSenegal */}
      <MapSenegal onRegionClick={donneesRegionClick} />

      {/* Le sidebar reçoit les données et l'état d'ouverture */}
      <Sidebar etatSidebar={estSidebarOuvert} fermerSidebar={fermerSidebar} donneesAPI={donneesAPI} chargement={chargement} erreur={erreur}/>
    </div>
  );
}

export default App;