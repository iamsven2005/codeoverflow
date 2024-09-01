This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm install
pnpm build
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnyp-tech%2Fnyp-tech%2Ftree%2Fmain%2Fbihance&demo-title=FULL&demo-description=Deploy-Sample-SAAS)

### This assumes you have a vercel account
1. Go To https://clerk.com/ and sign in, go to the api keys page, copy the env.local to your .env file
2. Go To Webhooks page, add endpoint
3. Add {url}/api/clerk-webhook where your {url} is the hosted url, add
user.updated
user.created
4. copy the signing secret, this is your webhook secret to env file
5. Go to https://dashboard.stripe.com/login and sign in, click on the sidebar to create new account. Copy the publishable key and secret key and put in env file
6. Go to https://dashboard.stripe.com/webhooks and add enpoint for
https://{url}/api/webhooks/stripe add invoice.payment_succeeded
checkout.session.completed
on the top right-hand side copy the webhooksecret with we_
7. Go to https://console.neon.tech/app/projects dashboard, create a database and copy this connection string this is your DIRECT_URL
8. Go to https://console.prisma.io/ and add new project, copy your direct url string from step 7 and past in the Database connection string, copy the new accelerate link, this is your DATABASE_URL in the env file
9. Go to https://uploadthing.com/ and sign in with github, create a new app, go to the api keys page and copy the api keys.
10. Go to sentry.io and make sure you are signed in, type in npx @sentry/wizard@latest -i sourcemaps
it should rewrite your sentry files.
If you have problems running this, whatsapp +65 92962690 or whoever is currently maintaining this repo