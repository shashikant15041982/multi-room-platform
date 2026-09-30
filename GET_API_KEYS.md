# Getting API Keys — Step-by-Step Guide

Quick guide to get API keys for all 4 AI providers.

---

## 1️⃣ Claude (Anthropic)

**Time**: 2 minutes

1. Go to: https://console.anthropic.com/account/keys
2. Click "Create Key"
3. Name: `multi-room-platform`
4. Copy the full key (starts with `sk-ant-`)
5. Paste into Replit Secret: `ANTHROPIC_API_KEY`

**Note**: This is your main AI - ensure you have credits

---

## 2️⃣ ChatGPT (OpenAI)

**Time**: 3 minutes

1. Go to: https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Name: `multi-room-platform`
4. **Important**: Copy key immediately (only shown once)
5. Paste into Replit Secret: `OPENAI_API_KEY`

**Setup billing**:
- Go: https://platform.openai.com/account/billing/overview
- Add payment method
- Set usage limit to $10/month (safety)

---

## 3️⃣ DeepSeek

**Time**: 3 minutes

1. Go to: https://platform.deepseek.com/api_keys
2. Sign up if needed (free account)
3. Click "Create API Key"
4. Copy the key
5. Paste into Replit Secret: `DEEPSEEK_API_KEY`

**Free tier**: 
- Generous free tokens included
- No credit card needed initially

---

## 4️⃣ Mistral AI

**Time**: 3 minutes

1. Go to: https://console.mistral.ai/api-keys
2. Sign up if needed
3. Click "Create API Key"
4. Copy the key
5. Paste into Replit Secret: `MISTRAL_API_KEY`

**Free tier**:
- $5 free credit
- No billing needed

---

## Total Time: ~15 minutes

Once you have all 4 keys, head to Replit and add them to Secrets.

### Replit Secrets Setup

1. In Replit → Click 🔒 (Secrets/Keys icon)
2. Add 4 secrets:
   ```
   ANTHROPIC_API_KEY = sk-ant-...
   OPENAI_API_KEY = sk-...
   DEEPSEEK_API_KEY = ...
   MISTRAL_API_KEY = ...
   ```
3. Click "Add Secret" for each
4. All 4 should show as added
5. Click "Run" to start server

---

## Verification

After pasting keys, run this test in Replit console:

```bash
curl https://[your-replit-url]/api/health
```

Should return JSON with all AIs marked "available: true"

---

## Troubleshooting

**"Invalid API Key" error**:
- Copy full key (no extra spaces)
- Check key hasn't expired
- Try regenerating key

**"401 Unauthorized"**:
- Wrong key format
- Key for wrong AI provider
- Key doesn't have billing set up

**"503 Service Unavailable"**:
- API provider is down
- Try another AI first
- Check provider status page

---

## Costs (Approximate)

| AI | Free Tier | Price |
|---|---|---|
| Claude | $5 free credit | ~$0.01 per 1K tokens |
| ChatGPT | $5 credit first month | ~$0.03 per 1K tokens |
| DeepSeek | Generous free | ~$0.001 per 1K tokens |
| Mistral | $5 free credit | ~$0.002 per 1K tokens |

**Estimated**: 100 users → ~$5-10/month

---

## Safety Tips

✅ Use Replit Secrets (not .env in code)
✅ Never commit .env with real keys
✅ Set monthly spending limits
✅ Rotate keys quarterly
✅ Use different keys for dev/prod
✅ Monitor usage in each provider dashboard

---

Ready? → Go to: QUICK_START_DEPLOYMENT.md

