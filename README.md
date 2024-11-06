# Hotels Booking Web App

This project is a web application for booking hotels and houses. The frontend is built using **Angular 18**, while the backend is developed with **Node.js** and **TypeScript**. It integrates **Passport Authentication** and email confirmation. The application is connected to **MongoDB Atlas** for storing user data and booking details. In the future, it will include a payment simulation feature using **FifthPocket**, another one of my projects for home banking.

## Technologies Used

- **Frontend:** Angular 18, styled with **SCSS**
- **Backend:** Node.js with **TypeScript** for API development.
- **Database:** MongoDB Atlas for data storage.
- **Authentication:** Passport for user authentication with email confirmation.
- **Email Confirmation:** Ensures that users confirm their email to activate their account.
- **Future Feature:** Payment simulation with **FifthPocket** (Home Banking).

## Usage

- **Login/Registration:** Users can create an account or log in with their credentials.
- **Email Confirmation:** Users must confirm their email after registering to activate their account.
- **Booking Management:** Users can view and manage their hotel/house bookings.
- **Payment Simulation (Future):** The application will soon feature a payment simulation using FifthPocket.

## Project Structure

```plaintext
src
├── app
│   ├── components           # Reusable components of the application
│   ├── environments         # Configurations for different environments (e.g., development, production)
│   ├── guards               # Guards for managing route access
│   ├── interfaces           # TypeScript interface definitions used in the project
│   ├── pages                # Main pages of the application
│   │   ├── auth             # Authentication section
│   │   │   ├── check-email        # Page to verify email
│   │   │   ├── email-confirmed    # Email confirmation page
│   │   │   ├── login              # Login page
│   │   │   └── register           # Registration page
│   │   ├── home             # Home page
│   │   ├── homes            # List of homes and apartaments
│   │   ├── hotel-detail     # Specific hotel details
│   │   ├── hotel-list       # List of hotels
│   │   ├── new-add          # Add new items (homes/hotels)
│   │   ├── profile          # User profile
│   │   └── reservations     # Section for managing user bookings
│   ├── services             # Services for API communication and business logic
│   ├── utils                # General utilities and helpers
│   └── validators           # Validators for form fields and other validations
├── app-routing.module.ts    # Application route configuration
├── app.component.html       # Root component template
├── app.component.scss       # Root component styles
├── app.component.spec.ts    # Root component tests
└── app.module.ts            # Main module of the application
