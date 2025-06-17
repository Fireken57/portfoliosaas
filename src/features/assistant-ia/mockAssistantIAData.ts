const mockAssistantIAData = {
  chatHistory: [
    { role: "user", content: "Quel est le score santé de mon portefeuille ?" },
    { role: "assistant", content: "Votre score santé est de 82/100. Diversification correcte, exposition modérée." }
  ],
  suggestions: [
    "Réduire l'exposition sur la tech US",
    "Ajouter des ETF émergents",
    "Surveiller le stop-loss sur Tesla"
  ],
  analyses: [
    "Analyse long terme (Charles) : Portefeuille robuste, bonne diversification.",
    "Analyse court terme (Sylvain) : Attention à la volatilité crypto cette semaine."
  ]
};

export default mockAssistantIAData; 