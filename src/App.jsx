// import React from 'react';
// import CarteSenegal from './components/carte';
// const App = () => {
//   return (
//     <CarteSenegal/>
//   );
// }

// export default App;


// App.jsx - CORRIGÉ
import React, { useState } from 'react';
import CarteSenegal, { Regions } from './components/carte';  // ✅ Import nommé + défaut
import MeteoChart from './components/MeteoChart';
import { getMeteoRegion } from './services/AppelApiMeteo';
import { generateHistoricalData } from './utils/generateHistoricalData';
import './App.css';

// ⚠️ IMPORTANT : Importe ton tableau Regions

function App() {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [meteoData, setMeteoData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegionSelect = async (regionId) => {
    setSelectedRegionId(regionId);
    
    if (!regionId) {
      setMeteoData(null);
      setHistoricalData([]);
      return;
    }

    // 🔥 Récupère le nom de la région à partir de son ID
    const region = Regions.find(r => r.id === regionId);
    if (!region) {
      console.error('Région non trouvée:', regionId);
      return;
    }

    const regionName = region.name;  // ← Le NOM de la région
    console.log('Région sélectionnée:', regionName);  // Vérification

    setLoading(true);
    setError(null);

    try {
      // ✅ Envoie le NOM à l'API
      const data = await getMeteoRegion(regionName);
      setMeteoData(data);

      const history = generateHistoricalData(data.main.temp, data.main.humidity);
      setHistoricalData(history);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Météo du Sénégal</h1>
      </header>

      <main className="main-content">
        <div className="left-panel">
          <CarteSenegal
            selectedRegion={selectedRegionId}
            onRegionSelect={handleRegionSelect}
          />
        </div>

        <div className="right-panel">
          {selectedRegionId && (
            <>
              {/* <Dashboard
                region={selectedRegionId}
                meteo={meteoData}
                loading={loading}
                error={error}
              /> */}

              <MeteoChart
                data={historicalData}
                region={selectedRegionId}
                isLoading={loading}
              />
            </>
          )}

          {!selectedRegionId && (
            <div className="welcome-message">
              <h2>Cliquez sur une région</h2>
              <p>Pour voir les données météo et les tendances</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;