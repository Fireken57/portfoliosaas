This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Quick Deploy Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add all variables from `env.example`
   - Update `NEXTAUTH_URL` to your Vercel domain

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

### Environment Variables Required:
- `DATABASE_URL` - Your Prisma Accelerate connection string
- `NEXTAUTH_SECRET` - A random string for NextAuth
- `NEXTAUTH_URL` - Your production URL
- `RESEND_API_KEY` - For email functionality
- `OPENAI_API_KEY` - For AI features
- `SNAPTRADE_API_KEY` - For trading features
- `PLAID_CLIENT_ID` & `PLAID_SECRET` - For financial data

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Ajouter une nouvelle intégration API ou IA

1. Crée un fichier dans `/src/integrations` (ex: `newapi.ts`).
2. Ajoute la logique d'appel API, gestion des tokens, helpers.
3. Crée une route `/src/app/api/newapi/route.ts` pour proxy/secure l'API.
4. Ajoute les types dans `/src/types` si besoin.
5. Si besoin, ajoute un hook custom dans `/src/hooks`.
6. Documente l'intégration dans le README.
7. Pour une nouvelle IA, ajoute la logique dans `/src/integrations/openai.ts` ou crée un nouveau fichier.

## Structure du projet (extrait)

- `/src/features` : pages et composants par feature (dashboard, portfolio, etc.)
- `/src/integrations` : services d'intégration API externes (openai, snaptrade, plaid, etc.)
- `/src/app/api` : routes API Next.js (proxy sécurisés)
- `/src/components` : composants UI réutilisables
- `/src/hooks` : hooks custom
- `/src/types` : types TypeScript globaux
- `/src/services` : logique métier, accès BDD, gestion tokens
