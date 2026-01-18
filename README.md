# POD-to-Pay Autopilot (MVP)

Production-ready MVP for small carriers/3PLs to move from POD to paid faster.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite
- Zod validation
- Nodemailer SMTP integration

## Prerequisites
- Node.js 18+
- npm 9+

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Set your environment variables in `.env` (see below).

## Environment Variables
```
# Required
APP_PASSWORD=changeme
DATABASE_URL="file:./prisma/dev.db"

# Optional SMTP (for email send)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Optional for logout redirect
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Prisma Migration & Seeding
Run the following commands from the repo root:
```bash
npx prisma migrate dev --name init
npm run seed
```

This creates the SQLite database and seeds three broker playbooks.

## Running the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Product Walkthrough

### 1) Sign in
- Use the shared password set in `APP_PASSWORD`.

### 2) Create a load (manual entry)
- Go to **Loads** → **Create load**.
- Fill in load number, broker reference, optional dates, and amount.

### 3) Create a load (email forwarding)
- Open a load and use **Forwarded email intake** to paste the broker email.
- Click **Extract and update** to auto-fill fields using the mock LLM adapter.

### 4) Store broker playbooks
- Go to **Broker Playbooks** to view seeded brokers.
- Add new brokers with submission method, subject template, and required docs.

### 5) Upload documents/photos
- Open a load.
- Upload POD/Lumper/Scale tickets in **Document uploads**.
- Files are stored locally under `/uploads`.

### 6) Extract key fields (mock LLM)
- Uploading a document runs `/lib/llm.ts` mock extraction.
- Forwarded email intake also uses the same adapter.
- Replace with a real LLM later by swapping the adapter functions.

### 7) Generate the invoice packet
- Open a load → **Invoice packet** → **Generate packet**.
- This creates:
  - Invoice PDF (stored in `/uploads`)
  - Attachment checklist
  - Email subject/body draft based on the broker playbook

### 8) Send emails or copy to clipboard
- Click **Send via SMTP** to send with Nodemailer (requires SMTP env vars).
- If SMTP is not configured, use **Copy** buttons to paste into your email client.

### 9) Track invoice status
- Use quick status buttons to mark a load as draft/submitted/accepted/rejected/paid.

### 10) Rejection analysis & corrective action
- Paste a rejection email in **Rejection analysis**.
- The mock LLM returns a reason, recommended fix, and a revised email draft.

### 11) Mark payments + DSO estimate
- In a load, enter **Paid date** (and optional amount).
- Dashboard DSO estimates are calculated from delivery date to paid date.

## Testing
Run basic tests:
```bash
npm test
```

## File Tree (Key Paths)
```
app/
  page.tsx
  login/page.tsx
  loads/page.tsx
  loads/[id]/page.tsx
  brokers/page.tsx
  actions/
components/
lib/
prisma/
uploads/
```

## Notes
- This MVP uses local-only file storage in `/uploads`.
- Replace mocks in `lib/llm.ts` to integrate with OpenAI or other LLMs.
- All validation is performed with Zod in `lib/validation.ts`.
