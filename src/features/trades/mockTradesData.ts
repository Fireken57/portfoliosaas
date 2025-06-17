const mockTradesData = {
  trades: [
    { asset: "Apple", type: "Achat", platform: "Degiro", quantity: 10, entry: 170, exit: 180, status: "Fermé", pnl: 100, fees: 2, comment: "Swing" },
    { asset: "Bitcoin", type: "Achat", platform: "Binance", quantity: 0.5, entry: 25000, exit: 28000, status: "Fermé", pnl: 1500, fees: 10, comment: "Long terme" },
    { asset: "TotalEnergies", type: "Vente", platform: "Revolut", quantity: 5, entry: 60, exit: 58, status: "Fermé", pnl: -10, fees: 1, comment: "Stop-loss" },
    { asset: "Amundi MSCI World", type: "Achat", platform: "Boursorama", quantity: 20, entry: 95, exit: 100, status: "Ouvert", pnl: 100, fees: 2, comment: "ETF" }
  ],
  filters: {
    status: ["Ouvert", "Fermé"],
    platform: ["Degiro", "Binance", "Revolut", "Boursorama"],
    sector: ["Technologie", "Énergie", "ETF", "Crypto"]
  }
};

export default mockTradesData; 