import React from 'react';

export default function Sidebar(props) {
  // Détermination du contenu à afficher
  let content;
  
  if (props.chargement) {
    content = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  } else if (props.erreur) {
    content = <p className="text-danger">{props.erreur}</p>;
  } else if (props.donneesAPI) {
    // Exemple d'affichage des données (température, etc.)
    const data = props.donneesAPI;
    content = (
      <div>
        <h4>Météo à {data.name}</h4>
        <p>Température : {data.main.temp}°C</p>
        <p>Description : {data.weather.description}</p>
        <p>Humidité : {data.main.humidity}%</p>
      </div>
    );
  } else {
    content = <p>Données en cours de chargement...</p>;
  }

  // La classe 'show' est ajoutée si props.etatSidebar est vrai
  // On ajoute aussi 'offcanvas-backdrop' pour l'effet d'assombrissement si nécessaire
  const offcanvasClass = `offcanvas offcanvas-start ${props.etatSidebar ? 'show' : ''}`;

  return (
    <>
      <div 
        className={offcanvasClass} 
        tabIndex="-1" 
        id="offcanvasExample" 
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Détails Région</h5>
          <button 
            type="button" 
            className="btn-close text-reset" 
            onClick={props.fermerSidebar} 
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {content}
        </div>
      </div>
    </>
  );
}