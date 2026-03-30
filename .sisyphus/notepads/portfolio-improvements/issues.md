
## [2026-03-31] Task T2: .env git history verification

### Finding
- **Was .env ever committed:** YES (initially committed, then removed in commit 3da520f2)
- **Commit where added:** 3b49f710... (parent of removal commit)
- **Commit where removed:** 3da520f2 (dated 2026-03-23 16:06:50 +0700)
  - Commit message: "fix: resolve app crash and address security/quality issues from PR review"
  - Explicitly states: "Security: remove .env with Firebase keys from git, add to .gitignore"

### Credentials Exposed (in removed commit)
- VITE_FIREBASE_API_KEY=AIzaSyBU6WLE91JrW8AcKQUCBYMyBi3JM-gnJ2M
- VITE_FIREBASE_AUTH_DOMAIN=ferryhinardi-web.firebaseapp.com
- VITE_FIREBASE_PROJECT_ID=ferryhinardi-web
- VITE_FIREBASE_STORAGE_BUCKET=ferryhinardi-web.firebasestorage.app
- VITE_FIREBASE_MESSAGING_SENDER_ID=81868834498
- VITE_FIREBASE_APP_ID=1:81868834498:web:4b0e66a6841254a29c5d5b

### .gitignore Status
- **Already protected:** YES
- **Line 91:** `.env` (explicit)
- **Line 90:** `.env*.local` (wildcard pattern)
- **Lines 16-19:** Specific env.local variants

### Action Taken
- Verified `.env` is explicitly covered in .gitignore (line 91)
- Confirmed removal was intentional and documented in git history
- No additional hardening needed — `.gitignore` already has explicit `.env` entry
- Credentials should be considered exposed in git history (rotated if necessary by admin)

### Status
✅ COMPLETE - `.gitignore` is properly hardened and `.env` is explicitly ignored
