export default function TodoGuide() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">📋 Todo List du Projet</h1>
      
      <div className="space-y-8">
        {/* Configuration Initiale */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Configuration Initiale</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              Installer les dépendances :
              <pre className="bg-zinc-900 text-white rounded p-2 mt-1">npm install axios @supabase/supabase-js next-auth @prisma/client prisma bcryptjs @auth/prisma-adapter resend @react-email/components lightweight-charts</pre>
            </li>
            <li>
              Configurer les variables d'environnement dans <code>.env.local</code> :
              <pre className="bg-zinc-900 text-white rounded p-2 mt-1">
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio-saas"
NEXTAUTH_SECRET="votre-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="votre-clé-resend"
OPENAI_API_KEY="votre-clé-openai"
SNAPTRADE_API_KEY="votre-clé-snaptrade"
PLAID_CLIENT_ID="votre-client-id-plaid"
PLAID_SECRET="votre-secret-plaid"
              </pre>
            </li>
            <li>
              Initialiser la base de données :
              <pre className="bg-zinc-900 text-white rounded p-2 mt-1">
npx prisma generate
npx prisma db push
              </pre>
            </li>
          </ol>
        </section>

        {/* Authentification */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Authentification</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>✅ Système d'inscription et de connexion avec NextAuth.js</li>
            <li>✅ Protection des routes authentifiées</li>
            <li>✅ Création automatique du portfolio et watchlist par défaut</li>
            <li>❌ Ajouter la réinitialisation de mot de passe</li>
            <li>❌ Ajouter la vérification d'email</li>
          </ul>
        </section>

        {/* Gestion des Alertes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Gestion des Alertes</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>✅ Interface de gestion des alertes</li>
            <li>✅ Graphiques en temps réel</li>
            <li>✅ Notifications par email</li>
            <li>❌ Alertes basées sur plusieurs conditions</li>
            <li>❌ Préférences de notification personnalisées</li>
            <li>❌ Tests unitaires pour les indicateurs techniques</li>
          </ul>
        </section>

        {/* Portfolio et Trading */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Portfolio et Trading</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>❌ Intégration avec SnapTrade pour les transactions réelles</li>
            <li>❌ Suivi des performances en temps réel</li>
            <li>❌ Analyse des frais de transaction</li>
            <li>❌ Gestion des ordres (market, limit, stop)</li>
            <li>❌ Historique des transactions détaillé</li>
          </ul>
        </section>

        {/* Backtest et Stratégies */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Backtest et Stratégies</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>❌ Interface de backtest complète</li>
            <li>❌ Bibliothèque de stratégies prédéfinies</li>
            <li>❌ Optimisation des paramètres</li>
            <li>❌ Rapports de performance détaillés</li>
            <li>❌ Export des résultats</li>
          </ul>
        </section>

        {/* Assistant IA */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Assistant IA</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>❌ Analyse de portefeuille</li>
            <li>❌ Suggestions de trading</li>
            <li>❌ Analyse de sentiment du marché</li>
            <li>❌ Prévisions basées sur l'IA</li>
            <li>❌ Chat interactif pour les questions</li>
          </ul>
        </section>

        {/* Analytics et Reporting */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Analytics et Reporting</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>❌ Tableau de bord personnalisable</li>
            <li>❌ Rapports PDF exportables</li>
            <li>❌ Analyse de risque avancée</li>
            <li>❌ Comparaison avec des benchmarks</li>
            <li>❌ Visualisations interactives</li>
          </ul>
        </section>

        {/* Optimisations */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Optimisations</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>❌ Mise en cache des données de marché</li>
            <li>❌ Optimisation des performances</li>
            <li>❌ Tests de charge</li>
            <li>❌ Monitoring des erreurs</li>
            <li>❌ Documentation complète</li>
          </ul>
        </section>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Légende :</h3>
        <ul className="list-disc ml-6">
          <li>✅ : Terminé</li>
          <li>❌ : À faire</li>
        </ul>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Pour démarrer le projet :</p>
        <pre className="bg-zinc-900 text-white rounded p-2 mt-1">npm run dev</pre>
        <p className="mt-2">Accédez à http://localhost:3000 pour voir le site.</p>
      </div>
    </div>
  );
} 