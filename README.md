<div align="center">

  <img src="public/images/saddle_ranch_logo.png" alt="Saddle Ranch Roadhouse Logo" width="220" />

  # Saddle Ranch Roadhouse — Web Application

  **Enterprise Full-Stack Restaurant Ordering, In-House QR Dining, POS, KDS, and Management Ecosystem**

  [![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Private-red?style=for-the-badge)](LICENSE)

  <p align="center">
    <a href="#client-project-showcase">Client Showcase</a> •
    <a href="#system-architecture--key-modules">System Architecture</a> •
    <a href="#visual-interface-gallery">Visual Gallery</a> •
    <a href="#technical-specifications">Technical Specifications</a> •
    <a href="#contributors--acknowledgments">Contributors</a> •
    <a href="#proprietary-license--confidentiality-notice">License</a>
  </p>

</div>

---

## Client Project Showcase

**Production Client System Portfolio Exhibition**  
This enterprise web application was engineered for **Saddle Ranch Roadhouse**, a commercial restaurant and steakhouse brand operating across branches in Silang, Bulihan, and Dasmariñas, Cavite, Philippines.

While other commercial client applications developed under professional engagement remain confidential under strict Non-Disclosure Agreements (NDAs), **Saddle Ranch Roadhouse is an authorized public portfolio showcase**. This project serves to demonstrate full-stack software architecture, scalable relational database engineering, real-time kitchen operations, and high-conversion e-commerce workflows.

> **Confidentiality Notice**: The client has authorized public exhibition of the system design and architecture for portfolio evaluation. In compliance with client agreements, proprietary business logic, operational credentials, customer records, and internal deployment configurations remain confidential and are not distributed for public execution.

---

## System Architecture & Key Modules

Saddle Ranch Web integrates customer ordering, table-side contactless dining, in-store cashier point-of-sale, line-cook kitchen display terminals, and executive business analytics into a unified reactive platform.

```
                                  +------------------------------+
                                  |   SADDLE RANCH ROADHOUSE     |
                                  +--------------+---------------+
                                                 |
                  +------------------------------+------------------------------+
                  |                              |                              |
                  v                              v                              v
      +------------------------+    +------------------------+    +------------------------+
      |    CUSTOMER WEB APP    |    |   IN-HOUSE QR TABLES   |    |  COMPANION MOBILE APP  |
      | - Remote Pick-Up       |    | - Dynamic ?table=XX    |    | - Flutter 1:1 Parity   |
      | - Bulihan Fee Engine   |    | - "Call Waiter" Chime  |    | - Sanctum Token Auth   |
      | - QRPh / GCash Pay     |    | - Express Takeout      |    | - Email OTP (Brevo)    |
      +-----------+------------+    +-----------+------------+    +-----------+------------+
                  |                             |                             |
                  +----------------------+------+-----------------------------+
                                         |
                                         v
                 +-----------------------------------------------+
                 |        LARAVEL 11 + INERTIA + SANCTUM         |
                 |   Atomic Transactions * Stock Dec * Auditing  |
                 +--------------+----------------+---------------+
                                |                |
                +---------------+----+      +----+---------------+
                |                    |      |                    |
                v                    v      v                    v
      +------------------+ +------------------+ +------------------+
      |   KITCHEN KDS    | |   CASHIER POS    | | ADMIN DASHBOARD  |
      | - Live Order Pop | | - Walk-In Orders | | - Sales Revenue  |
      | - Cook Timers    | | - Receipt Engine | | - WebP Catalog   |
      | - Status Stages  | | - Senior/PWD Disc| | - QR Generator   |
      +------------------+ +------------------+ +------------------+
```

---

### 1. Customer Remote Ordering & Delivery Engine
- **Categorized Menu Navigation**: Sizzling Rice Meals, Authentic Filipino Cuisines, Barkada Platters, and Specialty Beverages.
- **Location-Based Delivery Engine**: Structured municipality and barangay cascading selector for Cavite province, with dedicated fee waiver logic for the Bulihan branch cluster.
- **Integrated Digital Payments**: Support for QRPh e-Wallets (GCash, Maya, ShopeePay, Cards) with automated payment status verification.
- **Live Order Tracking**: Customer self-service order lookup by Order Number or Phone Number with real-time status progression.
- **Context-Aware AI Concierge**: Embedded chatbot assistant providing real-time menu recommendations and restaurant policies.
- **Customer Ratings & Review Moderation**: Live customer review submissions with automated bilingual profanity and URL moderation filtering.

---

### 2. In-House Contactless QR Table Dining
- **Dynamic Table Routing**: Direct table session initialization via URL parameterization (`?table=05`).
- **Staff Service Alerts**: "Call Waiter" digital chime integration with real-time staff acknowledgment status tracking.
- **Flexible In-Store Fulfillment**: Seamless switching between Table Dine-In and Express Counter Takeout modes.

---

### 3. Point-of-Sale (POS) Cashier Terminal
- **Walk-In Order Processing**: Direct cashier order entry supporting instant table assignment or counter pick-up.
- **Regulatory Discount Engine**: Senior Citizen and PWD 20% discount calculations with automated VAT breakdown.
- **Database & KDS Synchronization**: Real-time atomic persistence ensuring walk-in orders instantly propagate to kitchen screens and decrement inventory.
- **Thermal Receipt Generation**: Structured digital receipt formatting ready for thermal printing and transaction auditing.

---

### 4. Real-Time Kitchen Display System (KDS)
- **Live Order Polling Queue**: Auto-refreshing kitchen interface organized chronologically by submission timestamp.
- **Visual Status Progression**:
  $$\text{Pending Kitchen} \longrightarrow \text{Preparing (On Grill)} \longrightarrow \text{Ready to Serve} \longrightarrow \text{Completed}$$
- **Auditory Notifications**: Dedicated kitchen chime alerts signaling incoming orders.
- **Active Cook Summary**: Aggregated item quantities providing kitchen staff with real-time counts of items currently on the grill.
- **Security Void Protection**: Manager password authorization required to void or cancel active orders with automatic inventory restoration.

---

### 5. Executive Administration & Operations Portal
- **Revenue Analytics**: Real-time sales volume tracking, branch revenue comparisons, and average ticket size metrics.
- **Catalog & Inventory Control**: Product CRUD operations with WebP image processing and branch-specific stock thresholds.
- **Table QR Code Generator**: Dynamic generation of printable table QR codes configured for local network or domain routing.
- **Promotional Campaigns**: Custom voucher rules (percentage, fixed amount, minimum spend, expiry date, single-use limits) and marketing banner controls.
- **Security & Audit Logging**: Role-based access control (`admin`, `employee`) and immutable event audit logs.

---

### 6. Mobile REST API Layer (Flutter Parity)
- Complete RESTful API architecture maintaining 1:1 functional parity with companion mobile applications.
- **Sanctum Authentication**: Secure bearer token issuance with 6-digit email OTP verification via Brevo SMTP.

---

## Visual Interface Gallery

<div align="center">

### Customer Landing Page & Experience
*Immersive western roadhouse theme, video showcase, promotional specials, and verified customer reviews.*

![Landing Page](docs/screenshots/LANDING%20PAGE.png)

---

### Remote Online Ordering & Checkout
*Categorized food catalog, dynamic shopping cart drawer, Cavite delivery cascading, and payment options.*

![Remote Ordering](docs/screenshots/Remote%20Ordering.png)

---

### In-House QR Table Dining
*Contactless table-side dining interface with instant "Call Waiter" service chime.*

![In-House QR Ordering](docs/screenshots/QR%20Ordering.png)

---

### Cashier Point-of-Sale (POS) Terminal
*Walk-in ticket builder, quick-cash presets, Senior/PWD discount calculations, and thermal receipt generation.*

![Cashier POS Terminal](docs/screenshots/POS.png)

---

### Real-Time Kitchen Display System (KDS)
*Line-cook order queue with preparation timers, audio alerts, and active grill summaries.*

![Kitchen KDS](docs/screenshots/KDS.png)

---

### Executive Admin Dashboard
*Real-time branch revenue analytics, order queue monitoring, catalog management, and audit logs.*

![Admin Dashboard](docs/screenshots/Admin.png)

</div>

---

## Technical Specifications

| Layer | Component | Description |
| :--- | :--- | :--- |
| **Backend Architecture** | Laravel 11.x | PHP 8.2+, Eloquent ORM, Database Migrations & Seeders |
| **Frontend Architecture** | React 18.x + TypeScript | Type-safe Single Page Application via Inertia.js 2.x |
| **Styling & UI System** | Tailwind CSS v4.0 | Shadcn UI primitives, Lucide Icons, Custom Design Tokens |
| **Animations** | GSAP 3.x | Smooth UI transitions and interactive visual effects |
| **Database Engines** | SQLite / MySQL | ACID-compliant relational schemas with atomic transaction locks |
| **Authentication** | Laravel Sanctum & Session | Dual session-based web auth and Sanctum token API auth |
| **Email Infrastructure** | Brevo SMTP | Automated 6-digit OTP verification and transactional mailing |
| **Automated Testing** | PHPUnit 11.x | Comprehensive feature and unit test coverage (418+ assertions) |

---

## Contributors & Acknowledgments

- **Lead Engineer & System Architect**: Full-stack design, system architecture, database schema, POS/KDS engine, and UI implementation.
- **Authentication & Security Contributor**: Special acknowledgment to **[crazysen](https://github.com/crazysen)**, who utilized Cursor AI to assist in developing critical components of the Authentication subsystem, specifically:
  - Forgot Password request workflow
  - Reset Password token processing and security validation
  - Email OTP Verification infrastructure via Brevo SMTP integration

---

## Proprietary License & Confidentiality Notice

```
PROPRIETARY & CONFIDENTIAL — ALL RIGHTS RESERVED
Copyright (c) 2026 Saddle Ranch Roadhouse.

This repository is presented strictly for professional portfolio review and architectural evaluation.
Unauthorized copying, duplication, reproduction, reverse engineering, redistribution, or commercial
exploitation of this codebase, design assets, or proprietary system logic is strictly prohibited.
```
