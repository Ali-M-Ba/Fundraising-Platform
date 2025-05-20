# Donation Platform

## Description

A full-stack web application that connects donors with individuals in need, providing a secure and transparent platform for charitable giving. The platform enables users to donate to orphans and campaigns managed by orphanages, track their donations, and manage their donation basket, all under the guidance of a trusted overseeing authority.

## Features

- User authentication (signup, login, logout)
- Browse and search donation opportunities (orphans and campaigns)
- Add donations to a basket (cart) and manage donation amounts
- Secure online payments via Stripe
- Admin and orphanage management of campaigns and orphans
- Track donation history and progress
- Responsive, modern frontend UI

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** EJS (server-side rendering), HTML, CSS (Tailwind), JavaScript (ES6 modules)
- **Authentication:** JWT, bcryptjs, express-session, cookies
- **Payments:** Stripe
- **Other Libraries:** dotenv, joi, connect-mongo, uuid

## Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ali-M-Ba/Fundraising-Platform
   cd Donation-Platform
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory with the following variables:
     ```env
     PORT=3000
     NODE_ENV=development
     MONGO_URI=<your-mongodb-uri>
     SESSION_SECRET=<your-session-secret>
     STRIPE_SECRET_KEY=<your-stripe-secret-key>
     REFRESH_TOKEN_MAX_AGE=604800000 # (example: 7 days in ms)
     REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
     CLIENT_URL=http://localhost:3000
     ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage

- **Browse Opportunities:** Visit `/opportunities` to view available orphans and campaigns.
- **Add to Cart:** Add donation items to your basket and adjust amounts as needed.
- **Checkout:** Proceed to payment using Stripe for secure transactions.
- **Authentication:** Sign up or log in to track your donation history and manage your profile.
- **Admin/Orphanage:** Manage campaigns, orphans, and view donation analytics (requires appropriate role).

## Configuration

- **Environment Variables:** See `.env` setup above.
- **Session Storage:** Uses MongoDB for session persistence.
- **Payment:** Requires valid Stripe API keys.

## Folder Structure

```
Donation-Platform/
├── backend/
│   ├── config/           # Database and Stripe configuration
│   ├── controllers/      # Route controllers (auth, campaign, cart, etc.)
│   ├── middlewares/      # Authentication and authorization middleware
│   ├── models/           # Mongoose models (User, Orphan, Campaign, etc.)
│   ├── routes/           # Express route definitions
│   ├── utils/            # Utility functions (cart, donation, etc.)
│   ├── validators/       # Joi validation schemas
│   └── server.js         # Express app entry point
├── frontend/
│   ├── public/           # Static assets and JS modules
│   │   └── scripts/      # Frontend JS (auth, cart, homepage, opportunities)
│   └── views/            # EJS templates for pages and partials
├── package.json          # Project metadata and dependencies
```

---

_For questions or contributions, please open an issue or pull request on the repository._
