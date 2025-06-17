const mockAnalyticsData = {
  correlations: [
    { asset1: "Apple", asset2: "Nasdaq", value: 0.85 },
    { asset1: "Bitcoin", asset2: "S&P500", value: 0.3 },
    { asset1: "TotalEnergies", asset2: "Brent", value: 0.7 }
  ],
  stats: [
    { label: "Sharpe Ratio", value: 1.25 },
    { label: "Sortino Ratio", value: 1.8 },
    { label: "Max Drawdown", value: "-12%" }
  ],
  heatmap: `Apple   | 0.85\nBitcoin | 0.30\nTotalEnergies | 0.70`,
  suggestions: [
    "Diversifier davantage en Asie",
    "Réduire l'exposition crypto",
    "Ajouter des ETF sectoriels"
  ]
};

export default mockAnalyticsData; 