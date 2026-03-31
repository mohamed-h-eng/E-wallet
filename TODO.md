# E-Wallet Frontend Implementation Plan

## Steps:
- [x] 1. Create Vite React project (`frontend/`)
- [x] 2. Install dependencies
- [x] 3. Setup Tailwind (init config, update tailwind.config.js, postcss.config.js, globals.css)
- [x] 4. Configure vite.config.js (proxy /api -> localhost:3000)
- [x] 5. Create src/services/api.js (axios instance w/ auth interceptor)
- [x] 6. Create src/hooks/useAuth.js (login/logout, token utils)
- [x] 7. Build components: AccountCard, TransactionTable, SendForm, DepositForm, AuthForm
- [x] 8. Build pages: Login, Register, Dashboard
- [x] 9. Setup App.jsx (Router, QueryClient, Toast provider, auth guards)
- [x] 10. Test & run (npm run dev)
- [ ] 11. Complete: attempt_completion
