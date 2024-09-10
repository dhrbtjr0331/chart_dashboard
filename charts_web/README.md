# Charts Dashboard Project
### This project is a full-stack web application that displays multiple charts (Candlestick, Line, Bar, and Pie) on a dashboard. It uses Django for the backend (API) and Next.js with TypeScript for the frontend.

## Technologies Used
### Backend: Django REST Framework (Python)
### Frontend: Next.js (React with TypeScript)
Chart Libraries:
react-chartjs-2 for Line, Bar, and Pie charts
react-financial-charts for the Candlestick chart
Features
Dynamic charts displaying data fetched from a Django API.
Line, Bar, Pie, and Candlestick charts, with data coming from the backend API.
TypeScript used for type safety and development efficiency.
Setup Instructions
Backend (Django)
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Run the Django server:

bash
Copy code
python manage.py runserver
Django server will be running at http://localhost:8000.

API Endpoint: The charts data is served at:

bash
Copy code
http://localhost:8000/charts/api/data/
Frontend (Next.js with TypeScript)
Install dependencies:

bash
Copy code
npm install
Run the Next.js development server:

bash
Copy code
npm run dev
The frontend will be available at http://localhost:3000.

Fetching Data
The frontend fetches data from the Django backend using the following endpoint:

ts
Copy code
fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)
Make sure to set NEXT_PUBLIC_BACKEND_URL in your .env file:

bash
Copy code
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/charts/api/data/
Available Scripts
npm run dev: Runs the development server.
npm run build: Builds the application for production.
npm run start: Starts the production server.
Usage
After running both the backend and frontend servers:

Access the dashboard at http://localhost:3000/ to view the charts.
