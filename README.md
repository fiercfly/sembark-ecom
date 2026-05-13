# Sembark E-commerce

A modern, high-performance e-commerce storefront built with React and TypeScript.

## Getting Started

Follow these steps to get the project running locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/fiercfly/sembark-ecom.git
   cd sembark-ecom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Run E2E Tests**
   ```bash
   npx playwright test
   ```

## Key Features

- **Dynamic Product Grid**: Fetches products in real-time from the Platzi API with support for search, category filtering, and price range selection.
- **Smart Sorting**: Users can sort items by price or name. The sorting state is kept in the URL, so you can share links with specific filters applied.
- **Interactive Cart**: A full shopping cart experience with the ability to adjust quantities, remove items, and view total costs. The cart is saved in your browser, so your items stay there even if you refresh.
- **Micro-Animations**: Custom animations for page transitions, a startup splash screen, and a "fly-to-cart" effect when adding items.
- **Fully Responsive**: Designed from the ground up to work perfectly on everything from small phones to large desktops.

## Technical Details

- **Tech Stack**: React 19, TypeScript, Vite, and Framer Motion.
- **State Management**: Used the React Context API to manage the shopping cart globally.
- **Routing**: Implemented with React Router for clean, dynamic URLs.
- **Styling**: Pure CSS modules were used to keep the bundle size small and the design consistent.

## Assumptions & Limitations

- **API Constraints**: The current API only allows filtering by one category at a time. To support the "multiple categories" requirement, I implemented parallel requests to fetch and merge data client-side.
- **Image Cleaning**: Some images from the public API had formatting issues (like being wrapped in extra brackets). I included a helper function to clean these URLs before displaying them.
- **Checkout**: The "Checkout" button currently shows the order summary but doesn't process real payments, as it's a frontend demonstration.

---
**GitHub Repository**: [https://github.com/fiercfly/sembark-ecom](https://github.com/fiercfly/sembark-ecom)
