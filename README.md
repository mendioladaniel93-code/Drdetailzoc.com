# DR DETAILZ Quote Form Update

Upload `index.html`, `hero.mp4`, `drdetailz-logo.jpg` and the `api/quote.js` file, preserving the `api` folder, to the repository root. Vercel should use Framework Preset **Other**.

## IMPORTANT: The form will not deliver inquiries until configured

1. Create a Resend account, verify a sending domain, and create an API key.
2. In Vercel Project > Settings > Environment Variables add `RESEND_API_KEY` and `QUOTE_FROM_EMAIL` (example: `DR DETAILZ <quotes@your-verified-domain.com>`). Do not put credentials in GitHub files.
3. Redeploy and submit a test request. Confirm delivery to drdetailzoc@gmail.com.
4. Optional SMS: create a Twilio account and add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` to Vercel. Verify sender permissions and registration requirements. Redeploy and test. SMS errors are logged, not shown to customer.

Note: This starter uses no database, CAPTCHA, or rate limiting. Add spam protection and privacy policy before broad public promotion. The quote form is NOT a booking confirmation.
