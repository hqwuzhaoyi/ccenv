---
"ccenv": minor
---

Make anthropicApiKey and anthropicAuthToken optional fields

- Both `anthropicApiKey` and `anthropicAuthToken` are now optional in environment configuration
- Removed `sk-` prefix validation for API keys
- Updated all commands (add, list, current, init) to handle optional credentials
- Users can now configure environments with:
  - Only anthropicApiKey
  - Only anthropicAuthToken
  - Both credentials
  - Neither (base URL only)
