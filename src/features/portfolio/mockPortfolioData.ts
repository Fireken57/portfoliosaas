const mockPortfolioData = {
  assets: [
    { name: "Apple", type: "Action", platform: "Degiro", quantity: 10, value: 1800, currency: "EUR" },
    { name: "Bitcoin", type: "Crypto", platform: "Binance", quantity: 0.5, value: 14000, currency: "EUR" },
    { name: "Amundi MSCI World", type: "ETF", platform: "Boursorama", quantity: 20, value: 2000, currency: "EUR" },
    { name: "TotalEnergies", type: "Action", platform: "Revolut", quantity: 15, value: 900, currency: "EUR" },
    { name: "Or", type: "Matière première", platform: "Boursorama", quantity: 2, value: 120, currency: "EUR" }
  ],
  stats: {
    bySector: ["Technologie 40%", "Crypto 30%", "Énergie 15%", "ETF 10%", "Matières premières 5%"],
    byCurrency: ["EUR 100%"],
    byCountry: ["USA 60%", "France 25%", "Monde 10%", "Autres 5%"]
  }
};

export default mockPortfolioData; 