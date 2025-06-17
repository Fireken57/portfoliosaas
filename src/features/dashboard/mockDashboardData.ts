const mockDashboardData = {
  pnl: 12450.32,
  healthScore: {
    score: 82,
    explanation: "Portefeuille bien diversifié, risque modéré, bonne répartition sectorielle."
  },
  alerts: [
    "Stop-loss atteint sur Tesla (-5%)",
    "Opportunité IA: Nvidia en surperformance",
    "Échéance dividende Apple demain"
  ],
  news: [
    "Marchés en hausse après annonce BCE",
    "Nouveaux records sur le Nasdaq",
    "Analyse sectorielle: Tech vs Énergie"
  ],
  sectorPie: [
    { label: "Technologie", value: 40 },
    { label: "Santé", value: 20 },
    { label: "Finance", value: 15 },
    { label: "Énergie", value: 10 },
    { label: "Consommation", value: 15 }
  ],
  benchmark: [
    { label: "Portefeuille", value: 12.5 },
    { label: "S&P500", value: 10.2 },
    { label: "Nasdaq", value: 14.1 }
  ]
};

export default mockDashboardData; 