// 1. L'appel à l'API OpenRouter (LLM)
export const fetchLLMAdvice = async (regionName, temp, humidity, label) => {
  const apiKey = import.meta.env.VITE_OPENROUTER; 
  
  if (!apiKey) {
    console.error("Clé VITE_OPENROUTER manquante dans les variables d'environnement.");
    throw new Error("Clé API manquante");
  }

  const prompt = `Agis en tant qu'expert en gestion des risques climatiques et agricoles au Sénégal. 
  La région de ${regionName} présente actuellement une température de ${temp}°C et un taux d'humidité de ${humidity}%. 
  Notre algorithme métier a détecté le niveau d'alerte suivant : "${label}". 
  Rédige exactement 2 phrases courtes, très précises et pragmatiques de recommandations de sécurité ou d'actions agricoles adaptées à la population locale.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin, 
      "X-Title": "AgriMeteo Sénégal"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini", 
      messages: [
        { role: "system", content: "Tu es un assistant concis spécialisé dans la gestion des risques météo et l'adaptation agricole." },
        { role: "user", content: prompt }
      ],
      max_tokens: 120,
      temperature: 0.4 
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Détails de l'erreur OpenRouter :", errorData);
    throw new Error(`Erreur réponse API LLM: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// 2. L'algorithme décisionnel déterministe
export const calculateRisk = (temp, humidity) => {
  if (temp > 38 && humidity > 60) {
    return { score: 85, label: "Risque Canicule Élevé", color: "#FF4500" };
  }

  if (temp > 35 && humidity < 30) {
    return { score: 80, label: "Chaleur Aride - Risque Incendie", color: "#FF8C00" };
  }

  if (temp > 30 && humidity > 75) {
    return { score: 75, label: "Atmosphère Instable - Risque Orage", color: "#FFA500" };
  }

  if (temp < 2 && humidity > 85) {
    return { score: 70, label: "Risque de Verglas Critique", color: "#00BFFF" };
  }

  if (temp >= 18 && temp <= 26 && humidity >= 40 && humidity <= 60) {
    return { score: 10, label: "Conditions Optimales", color: "#2ECC71" };
  }

  return { score: 35, label: "Vigilance Normale", color: "#F1C40F" };
};