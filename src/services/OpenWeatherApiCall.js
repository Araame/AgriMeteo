const API_KEY = import.meta.env.VITE_APP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchApiMeteo = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
    );

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status} - Ville non trouvée ou problème API`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la météo:", error);
    throw error;
  }
};