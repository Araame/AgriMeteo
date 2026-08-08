import React, { useState } from "react";
import MapSenegal from "./components/map";
import Sidebar from "./components/Sidebar";
import { fetchApiMeteo } from "./services/OpenWeatherApiCall"; 

function App() {
  // --- ÉTATS ---
  // État pour ouvrir/fermer la sidebar
  const [estSidebarOuvert, setEstSidebarOuvert] = useState(false);
  // État pour stocker les données météo de l'API
  const [donneesAPI, setDonneesAPI] = useState(null);
  // État pour le spinner de chargement
  const [chargement, setChargement] = useState(false);
  // État pour gérer les erreurs
  const [erreur, setErreur] = useState(null);


  // --- FONCTIONS ---
  
  // Fonction appelée lors du clic sur une région de la carte
  const donneesRegionClick = async (regionName) => {
    setChargement(true);
    setErreur(null);
    setDonneesAPI(null);
    setEstSidebarOuvert(true); // Ouvre la sidebar dès le clic

    try {
      // Appel de la fonction fetchApiMeteo avec le nom de la région
      const data = await fetchApiMeteo(regionName);
      setDonneesAPI(data); 
    } catch (err) {
      // Gestion de l'erreur textuelle pour l'afficher dans la Sidebar
      setErreur(err.message || "Impossible de récupérer les données météo.");
    } finally {
      setChargement(false); 
    }
  };

  // Ajout de la fonction pour fermer la sidebar (manquante dans votre code)
  const fermerSidebar = () => {
    setEstSidebarOuvert(false);
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4 text-primary">AgriMeteo</h1>
      
      {/* On passe la fonction au composant MapSenegal */}
      <MapSenegal onRegionClick={donneesRegionClick} />

      {/* Le sidebar reçoit les données et les fonctions de contrôle */}
      <Sidebar 
        etatSidebar={estSidebarOuvert} 
        fermerSidebar={fermerSidebar} 
        donneesAPI={donneesAPI} 
        chargement={chargement} 
        erreur={erreur}
      />
    </div>
  );
}

export default App;