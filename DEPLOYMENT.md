# GGS Launch Checklist

## A. Supabase
- Create a project.
- Open SQL Editor.
- Paste `supabase/schema.sql`.
- Enable email/password Auth.
- Set the Site URL to your final domain.
- Copy the Project URL + Publishable Key.

Supabase Auth supports email/password sign-up and login and uses JWT-based authorization. Use RLS to restrict member data.

## B. Local setup
Install Node.js.
Then:
npm install
cp .env.example .env.local
npm run dev

## C. Payfast
Create/configure your merchant account and recurring billing product.
Use Payfast's official custom integration/API documentation.
Set:
- return URL
- cancel URL
- notify URL
- merchant ID
- merchant key

The notify endpoint must be server-side and must verify Payfast notifications before activating membership.

## D. Deployment
Build:
npm run build

Deploy the resulting `dist` directory to a static host.

## E. Domain
Buy your preferred GGS domain, point DNS to your hosting provider, then update:
- Supabase Site URL
- Payfast return/cancel/notify URLs
- VITE_SITE_URL

## F. Live room
Use Supabase Realtime or another WebSocket service. Store messages in a protected table and apply RLS so only active members can read/write the private room.

## G. Admin
Add a server-side admin role and an admin dashboard for:
- members
- subscription status
- posts
- alerts
- videos
- live-room moderation

Do not make yourself admin based only on a browser variable; use a server-side role/claim.
