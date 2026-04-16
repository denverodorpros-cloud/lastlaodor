# LA Odor Pros Website

Static multi-page HTML website with shared `styles.css` and `script.js`.

Form submissions now post to the Vercel function at `/api/estimate`.

Before publishing, set these Vercel environment variables:
- `RESEND_API_KEY`
- `ESTIMATE_TO_EMAIL` set to `info@laodorpros.com`
- `ESTIMATE_FROM_EMAIL` set to a verified sender, such as `estimates@yourdomain.com`
