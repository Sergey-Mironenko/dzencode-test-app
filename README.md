# Orders & Products SPA

## Description
This is a Single Page Application (SPA) designed to manage inventory, specifically focusing on Orders and Products. The application is built using a component-based architecture and implements routing for seamless navigation. It includes dynamic UI elements, such as a Top Menu displaying the current date and a real-time clock, alongside an active user session counter. 

The project fulfills all base requirements and has been extended with advanced Junior+ tier features, ensuring high performance, scalability, and code quality.

## Technologies Used
This project leverages a modern front-end stack and various tools to meet both base and advanced requirements:

*   **Core Framework:** React.js (latest version).
*   **Server-Side Rendering (SSR):** Next.js integration.
*   **Language:** TypeScript, utilizing modern ES6+ features such as arrow functions, spread operators, and template strings[cite: 6, 9].
*   **State Management:** Redux for handling global state[cite: 6, 8].
*   **Styling & UI:** CSS structured with BEM architecture and the Bootstrap framework for responsive design.
*   **Real-time Communication:** WebSocket (Socket.io) to manage live connections and track active session counters in real-time[cite: 6, 7, 8].
*   **Data Fetching & APIs:** REST API integration using Axios or Fetch, supplemented by **GraphQL** specifically implemented for user registration and authentication logic.
*   **Advanced Features (Junior+):** Implementation of i18n for internationalization, JWT for secure tokens, Web Storage, Lazy Loading for optimized performance, Charts, and Maps.
*   **Quality Assurance & DevOps:** Built-in form validation, Unit-tests[cite: 8, 9], and an automated CI pipeline with GitHub Actions that runs tests and blocks merging into `main` if checks fail.
*   **Version Control & Deployment:** Git for repository management and Docker for packaging the application with all its dependencies into a container.

## Key Features

### Global UI & Navigation
*   **Navigation Menu:** Contains route links to navigate between the Orders and Products pages.
*   **Top Menu:** Displays the current date and time in real-time in the top right corner.
*   **Active Sessions Counter:** Utilizes WebSocket to show the exact number of active application sessions across different browsers in real-time.
*   **Animations:** Uses transition effects (e.g., animate.css) when switching between routes and components for a smooth user experience.

### Orders Management
*   **Order List:** Displays a comprehensive list showing the order name, the number of products included, and creation dates formatted in two different ways.
*   **Financial Summaries:** Calculates and displays the total sum of the order, equal to the sum of all product prices within it, shown in two currencies.
*   **Interactive Details:** Clicking on a specific order opens a closable information block directly next to it.
*   **Deletion Handling:** Includes a delete button for orders that triggers a confirmation popup upon clicking.

### Products Management
*   **Product List & Filtering:** Displays all available products and includes a select dropdown filter to sort them by product type.
*   **Detailed Product Cards:** Each product displays its name, type, guarantee dates in multiple formats, price in different currencies, and the name of the order it belongs to.

## Database Schema
The database architecture designed for this project can be viewed and compared in MySQL Workbench. 
*   **Prisma Schema:** Located at `prisma/schema.prisma` (handles automated migrations and ORM typing).
*   **MySQL Workbench Model:** The visual ER-diagram file (`database_schema.mwb` or SQL creation script) is located in the root directory under the `docs/` folder for review and comparison.

## Installation & Setup
*(Follow these steps to run the project locally)*

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and configure the necessary variables for the application, JWT authentication, and the database connection:
    ```env
    # MySQL
    MYSQL_DATABASE=inventory_app
    MYSQL_USER=root
    MYSQL_PASSWORD=1234

    # Backend
    SECRET_KEY=super_secret_jwt_key_123
    PORT=4000

    # Public API URL used by the browser
    NEXT_PUBLIC_API_URL=http://localhost:4000

    # Local application URL
    NEXT_PUBLIC_URL=http://localhost:4000

    # Local database URL
    DATABASE_URL="mysql://root:1234@localhost:3306/inventory_app"
    ```

4.  **Database Setup:**
    Ensure you have a local MySQL server running. Create an empty database named `inventory_app`, then run Prisma migrations to apply the schema (e.g., creating the `User` table for GraphQL authentication):
    ```bash
    npx prisma migrate dev
    ```
    *(Note: This command applies the schema to the database and automatically generates the Prisma Client).*

5.  **Start the Backend Server:**
    From the root directory, start the server to initialize the GraphQL API, database connection, and WebSocket session counters:
    ```bash
    node server.js
    ```

6.  **Start the Frontend Application:**
    Open a new terminal window (while keeping the server running) and start the React/Next.js client application at localhost:3000 :
    ```bash
    npm run dev
    ```

## Docker Deployment
The application can be deployed using Docker, packaging the app with all its environments and dependencies.
Application will be available at `localhost:3000`

1.  **Build and Run with Docker Compose:**
    ```bash
    sudo docker compose up --build -d .
    ```

## Testing
*(Follow these steps to run unit tests)*

1.  **Run Unit Tests:**
    ```bash
    npm test
    ```