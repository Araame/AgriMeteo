/**
 * Génère les données simulées des 7 derniers jours
 * @param {number} currentTemp - Température actuelle
 * @param {number} currentHumidity - Humidité actuelle
 * @returns {Array} - Tableau de 7 jours
 */
export function generateHistoricalData(currentTemp, currentHumidity) {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Variation aléatoire entre -3°C et +3°C
    const tempVariation = (Math.random() * 6) - 3;
    const humidityVariation = (Math.random() * 16) - 8;

    const temperature = Math.round((currentTemp + tempVariation) * 100) / 100;
    const humidity = Math.min(100, Math.max(0, Math.round(currentHumidity + humidityVariation)));

    data.push({
      jour: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      temperature: temperature,
      humidity: humidity,
      fullDate: date.toISOString().split('T')[0]
    });
  }

  return data;
}