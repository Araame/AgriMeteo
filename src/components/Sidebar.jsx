import React, { useState, useEffect, useMemo } from 'react';
import { calculateRisk, fetchLLMAdvice } from '../utils/algo_decisionnel'; 
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Sidebar({ etatSidebar, fermerSidebar, donneesAPI, chargement, erreur }) {
  
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // ALGORITHME DÉCISIONNEL
  const risk = useMemo(() => {
    if (donneesAPI && donneesAPI.main) {
      const temp = Number(donneesAPI.main.temp);
      const humidity = Number(donneesAPI.main.humidity);
      return calculateRisk(temp, humidity);
    }
    return null;
  }, [donneesAPI]);

  // PLUVIOMÉTRIE (mm sur la dernière heure, 0 si pas de pluie)
  const pluieMM = useMemo(() => {
    if (!donneesAPI) return 0;
    return donneesAPI.rain?.["1h"] ?? donneesAPI.rain?.["3h"] ?? 0;
  }, [donneesAPI]);

  // SIMULATION TEMP SUR 7 JOURS
  const donneesGraphique = useMemo(() => {
    if (!donneesAPI || !donneesAPI.main) return [];

    const tempActuelle = Math.round(donneesAPI.main.temp);
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const aujourdhui = new Date();
    const serieTemporelle = [];

    for (let i = 6; i >= 0; i--) {
      const dateCible = new Date(aujourdhui);
      dateCible.setDate(aujourdhui.getDate() - i);
      const nomJour = jours[dateCible.getDay()];

      if (i === 0) {
        serieTemporelle.push({
          jour: "Auj.",
          "Température": tempActuelle
        });
      } else {
        const variationAleatoire = (Math.random() * 6) - 3; 
        serieTemporelle.push({
          jour: nomJour,
          "Température": Math.round(tempActuelle + variationAleatoire)
        });
      }
    }

    return serieTemporelle;
  }, [donneesAPI]);

  // EFFET POUR LE DÉCLENCHEMENT CIBLÉ DU LLM
  useEffect(() => {
    if (!donneesAPI || !donneesAPI.main || !risk) return;

    let isMounted = true;

    if (risk.score > 60) {
      setLoadingAi(true);
      setAiAdvice('');

      const temp = Number(donneesAPI.main.temp);
      const humidity = Number(donneesAPI.main.humidity);
      const regionName = donneesAPI.name;

      fetchLLMAdvice(regionName, temp, humidity, risk.label)
        .then((advice) => {
          if (isMounted) {
            setAiAdvice(advice);
            setLoadingAi(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error("Erreur LLM :", err);
            setAiAdvice("Impossible de générer les conseils de l'IA pour le moment. Veuillez suivre les consignes standards.");
            setLoadingAi(false);
          }
        });
    } else {
      setAiAdvice("Les conditions actuelles sont stables. Aucune mesure d'urgence ou action spécifique n'est requise.");
      setLoadingAi(false);
    }

    return () => {
      isMounted = false; 
    };
  }, [risk, donneesAPI]);

  if (!etatSidebar) return null;

  const bleuInfo = "#0dcaf0"; 

  return (
  <div
    className="offcanvas offcanvas-start show"
    tabIndex="-1"
    style={{
      visibility: "visible",
      display: "block",
      zIndex: 1055,
      width: "398px",
      height: "100vh",
      overflow: "hidden",
    }}
  >

    {/* HEADER DU SIDEBAR */}
    <div
      className="offcanvas-header"
      style={{
        height: "66px",
        minHeight: "66px",
        borderBottom: "1px solid #dee2e6",
        backgroundColor: "#fff",
        padding: "0 15px",
      }}
    >
      <h5 className="offcanvas-title fw-bold mb-0">
        Météo Régionale
      </h5>

      <button
        type="button"
        className="btn-close"
        aria-label="Fermer"
        onClick={fermerSidebar}
      ></button>
    </div>

    {/* CONTENU SCROLLABLE */}
    <div
      className="offcanvas-body"
      style={{
        height: "calc(100vh - 66px)",
        maxHeight: "calc(100vh - 66px)",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "20px 14px",
      }}
    >

      {/* Cas 1 : En cours de chargement */}
      {chargement && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      {/* Cas 2 : Erreur API */}
      {erreur && !chargement && (
        <div className="alert alert-danger" role="alert">
          {erreur}
        </div>
      )}

      {/* Cas 3 : Contenu affiché */}
      {donneesAPI && !chargement && !erreur && (
        <div>

          <h3 className="fw-bold text-dark">
            {donneesAPI.name}
          </h3>

          <div className="display-4 my-2 fw-semibold text-primary">
            {Math.round(donneesAPI.main?.temp)}°C
          </div>

          <p className="text-capitalize text-muted mb-3">
            {donneesAPI.weather?.[0]?.description}
          </p>

          <ul className="list-unstyled bg-light p-3 rounded mb-4">
            <li className="mb-2">
              <strong>Humidité :</strong>{" "}
              {donneesAPI.main?.humidity}%
            </li>

            <li className="mb-2">
              <strong>Vent :</strong>{" "}
              {donneesAPI.wind?.speed} m/s
            </li>

            <li>
              <strong>Pluviométrie :</strong>{" "}
              {pluieMM > 0 ? `${pluieMM} mm/h` : "Aucune pluie"}
            </li>
          </ul>

          {/* INDICE DE SÉVÉRITÉ */}
          {risk && (
            <div className="my-4 p-3 bg-light rounded border">
              <div className="d-flex justify-content-between small mb-2">
                <span className="fw-semibold text-secondary">
                  Indice de Sévérité
                </span>

                <span
                  style={{
                    fontWeight: "bold",
                    color: bleuInfo,
                  }}
                >
                  {risk.score} / 100
                </span>
              </div>

              <div
                className="progress rounded-pill"
                style={{
                  height: "12px",
                  backgroundColor: "#e9ecef",
                }}
              >
                <div
                  className="progress-bar rounded-pill"
                  role="progressbar"
                  style={{
                    width: `${risk.score}%`,
                    backgroundColor: bleuInfo,
                    transition: "width 0.6s ease",
                  }}
                  aria-valuenow={risk.score}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <div className="mt-3">
                <span
                  className="badge"
                  style={{
                    backgroundColor: `${bleuInfo}18`,
                    color: "#0993af",
                    border: `1px solid ${bleuInfo}`,
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  {risk.label}
                </span>
              </div>
            </div>
          )}

          {/* GRAPHIQUE */}
          <div className="my-4 p-2 bg-white rounded border">
            <h6 className="fw-bold mb-3 small text-uppercase text-muted">
              Évolution - 7 derniers jours
            </h6>

            <div
              style={{
                width: "100%",
                height: 180,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={donneesGraphique}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="colorTemp"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={bleuInfo}
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor={bleuInfo}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />

                  <XAxis
                    dataKey="jour"
                    tick={{ fontSize: 11 }}
                    stroke="#888888"
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#888888"
                    domain={[
                      "dataMin - 2",
                      "dataMax + 2",
                    ]}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value}°C`,
                      "Température",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="Température"
                    stroke={bleuInfo}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <hr className="my-4" />

          {/* IA */}
          <div
            className="p-3 rounded shadow-sm mb-4"
            style={{
              backgroundColor: "#f8f9fa",
              borderLeft: `4px solid ${bleuInfo}`,
            }}
          >
            <strong className="d-block mb-2 text-info small text-uppercase">
              Analyse de l'IA :
            </strong>

            {loadingAi ? (
              <div className="text-muted small placeholder-glow">
                <span className="placeholder col-12 rounded mb-1"></span>
                <span className="placeholder col-8 rounded"></span>
              </div>
            ) : (
              <p
                className="mb-0 small text-secondary"
                style={{ lineHeight: "1.6" }}
              >
                {aiAdvice}
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  </div>
);
}