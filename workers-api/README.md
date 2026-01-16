# Cloudflare Workers API

API backend untuk Affimate Super Apps yang di-deploy ke Cloudflare Workers.

## Setup

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login ke Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
cd workers-api
wrangler deploy
```

## Environment Variables

Set di Cloudflare Dashboard > Workers > Settings > Environment Variables:
- `DUITKU_MERCHANT_CODE` - Merchant code dari Duitku
- `DUITKU_API_KEY` - API key dari Duitku
- `SUPABASE_URL` - URL Supabase project
- `SUPABASE_SERVICE_KEY` - Service role key Supabase

## Endpoints

- `POST /duitku/checkout` - Create payment checkout
- `POST /payment/callback` - Handle Duitku payment callback
