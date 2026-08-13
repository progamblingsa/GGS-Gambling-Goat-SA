# GGS — Gambling GOAT SA — Paid Membership Platform

This project is the next step from the original static website.

## What is included
- Public landing page
- GGS membership pricing
- Supabase email/password authentication
- Member profile table + Row Level Security schema
- Subscription status gate
- Members-only dashboard
- Live room / alerts / pattern journal / strategy library UI
- Payfast checkout integration point
- Mobile responsive design

## Important: what you must connect
A real paid website needs your own accounts/credentials. This project intentionally does NOT contain secret keys.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Enable email/password authentication.
4. Copy `.env.example` to `.env.local`.
5. Add your Supabase URL and publishable key.
6. Create your Payfast merchant account and configure recurring subscriptions.
7. Add Payfast credentials and a server-side notification/webhook endpoint.
8. Deploy the Vite app to Vercel/Netlify/Cloudflare Pages.
9. Deploy the payment webhook on a server/edge function.
10. Only the webhook/server should change `subscription_status` to `active`.
11. Connect a realtime provider (Supabase Realtime is a natural fit) for the live room.
12. Add your actual member content to protected tables/storage.

## Why the payment webhook matters
Do NOT unlock paid content simply because a browser returns from a payment page. Your backend must verify the payment notification and then update the member's subscription status.

Payfast supports recurring billing/subscriptions and provides API/custom integration options. See the official documentation before going live.

## Recommended production structure
Public -> Account -> Payment -> Verified webhook -> Active subscription -> Member dashboard.

## Security
Never put a Supabase service-role/secret key in browser code. Use server-side functions for privileged subscription updates.

## Gambling content
Keep GGS positioned as educational/community content. Do not advertise guaranteed wins, guaranteed multipliers, or claims that a signal can predict a random gambling outcome. Add age gating, responsible-gambling information and any South African legal/compliance requirements that apply to the service before launch.
