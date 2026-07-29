# City Dispatch 🚖

**City Dispatch** is a comprehensive, premium logistics and dispatch management platform built with React, Vite, and Tailwind CSS. It serves as a centralized hub for managing passenger bookings, driver operations, and administrative dispatch, integrated seamlessly with backend services for AI optimization and Google Sheets data synchronization.

---

## 🌟 Key Features

### 1. Multi-Role Workspaces
The application seamlessly transitions between three primary functional modes:
- **Passenger Portal (Booking View)**: Clean, user-friendly interface for passengers or operators to book new trips, select vehicle types (Standard Sedan, Executive SUV, Luxury Van, Electric Fleet), and view active bookings.
- **Driver Console**: Dedicated interface for drivers secured by a 4-digit PIN authentication. Drivers can toggle their duty status, view assigned trips, update operational statuses (En-route, Arrived, Completed), and file disputes if standard payouts differ from their calculations.
- **Admin Dispatch (Control Center)**: A robust dashboard for dispatchers and administrators to monitor all active trips, assign trips to drivers, handle driver disputes, and manage the fleet. Includes a live real-time activity ticker.

### 2. Intelligent & Premium UI/UX
- **Editorial Design Language**: Features a high-contrast, premium aesthetic utilizing the brand's signature colors (`#49243e` primary, `#f2e6b1` secondary).
- **Typography & Layout**: Elegant font pairings with "Playfair Display" for headers and "Plus Jakarta Sans" for crisp, readable UI elements.
- **Fluid Animations**: Implemented using `motion/react` (Framer Motion) for seamless transitions, splash screens, and modal dialogs.
- **Responsive Navigation**: Adaptive sidebar and top headers ensuring complete usability across desktop monitors, tablets, and mobile devices.

### 3. Advanced Integrations
- **AI Route Optimizer**: Built-in AI dispatch modal leveraging Google Gemini (`@google/genai`) to suggest optimal driver assignments, detect potential scheduling conflicts, and generate smart operational insights.
- **Google Sheets Synchronization**: Two-way integration via Google Apps Script.
  - Automatically syncs newly completed trips, updated statuses, and driver profiles to your administrative Google Sheet.
  - Supports manual triggering, auto-sync on job completion, and importing data directly from Sheets into the app.

### 4. Financial & Reporting Tools
- **Monthly Earnings Reports**: Automatically aggregates completed trips to generate comprehensive financial summaries.
- **Metrics Tracking**: Tracks Gross Revenue, Driver Payouts, and Company Margins.
- **Dispute Resolution Center**: Specialized workflow for administrators to review and resolve payout disputes raised by drivers.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 (Utility-first, responsive design)
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Backend / API (Full-Stack)**: Node.js Express server running concurrently with the Vite dev server (via `tsx`).
- **AI SDK**: `@google/genai` (Gemini API)

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components and primary views
│   ├── AdminDispatchView.tsx
│   ├── DriverConsoleView.tsx
│   ├── PassengerBookingView.tsx
│   ├── Sidebar.tsx
│   ├── TopHeader.tsx
│   └── ... (Modals, activity streams, etc.)
├── data/
│   └── seedData.ts      # Initial mock dataset for prototyping
├── App.tsx              # Main application entry and state container
├── main.tsx             # React DOM rendering entry point
├── types.ts             # Global TypeScript interfaces and type definitions
├── index.css            # Global CSS including Tailwind and theme variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory. At minimum, provide your Gemini API key if utilizing the AI Optimizer capabilities.
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000
   VITE_APP_MODE=ADMIN # Change to PASSENGER or DRIVER to test specific views
   
   # Server-side Secrets (Do not prefix with VITE_)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the Development Server:**
   This command starts both the Vite frontend server and the Express backend server concurrently.
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   Compiles the frontend assets and bundles the backend server into a single executable file (`dist/server.cjs`).
   ```bash
   npm run build
   ```

5. **Start Production Server:**
   ```bash
   npm run start
   ```

---

## 📖 Usage Guide

### Logging in as a Driver
Navigate to the "Driver Console" view from the sidebar. Use one of the pre-configured PINs (e.g., `1234`, `4321`) to log in and start accepting assignments.

### Assigning a Trip (Admin)
As an admin, view the "Unassigned" trips in the Admin Dispatch panel. Click "Assign Driver" to choose from a list of available, on-duty drivers. 

### Resolving a Dispute
If a driver completes a trip but disputes the system-calculated payout, it is flagged as `DISPUTED`. Admins will see a badge in the sidebar and top header. Clicking "Resolve" allows the admin to review the driver's note and authorize a corrected payout amount.

---

## 🤝 Contribution Guidelines
When making changes, please ensure:
- You run `npm run lint` to verify TypeScript typings.
- Do not bypass the single-screen layout constraint. The application is designed to function fluidly as a Single Page Application (SPA).
- Maintain the strict separation between `VITE_` prefixed public variables and secure backend secrets.

---

*City Dispatch — Delivering Excellence, Driven by Intelligence.*
