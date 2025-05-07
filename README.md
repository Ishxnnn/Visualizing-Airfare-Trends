# Visualizing Airfare Trends ✈️

## 📙 Description

**Visualizing Airfare Trends** is a full-stack web application that enables users to explore and analyze historical U.S. flight pricing data in an interactive, visual format. Built with a React + TypeScript frontend and a Flask + Pandas backend, the system integrates a variety of datasets—including FAA airfare statistics and macroeconomic indicators—to help users identify patterns and trends in airline pricing over time. Users can click on specific flight routes across a U.S. map to view pricing trends by quarter and year, compare fare fluctuations across time periods, and analyze how special events like recessions or pandemics impact air travel costs.

The application also features a fare prediction engine that leverages a decision tree model to estimate prices based on user-defined routes, dates, and events. In addition to trend graphs and fare forecasts, the system provides economic context by surfacing relevant macro-level metrics like GDP, oil prices, and unemployment rates for the selected date range. With its intuitive interface and data-driven backend, this tool supports both casual exploration and deeper analytical insights into the dynamics of airfare pricing in the U.S.

🔗 Live Site: https://visualizing-airfare-trends.vercel.app

🔌 Backend API (Hosted on Render): https://visualizing-airfare-trends-backend.onrender.com

![App Overview](screenshots/map-overview.png)

---

---

## 🚀 Execution

Here’s how to use the application:

1. **Start on the Interactive Map:**
   - You’ll see a map of the U.S. with airports and flight routes.
   - Click on a route between two airports to explore its fare trends.

2. **View Quarterly & Yearly Fare Trends:**
   - After selecting a route and selecting `View Data`, the system displays two bar charts.
     - One shows **quarterly pricing trends**.
     - The other shows **yearly pricing trends**.
   - These trends are based on real historical data from the FAA.

3. **Use the Calendar Panel for Prediction:**
   - In the prediction panel, select a **start and end date** using the calendar.
   - Choose a **special event** (e.g., Pandemic, Recession) to simulate its impact.
   - Click **“Predict Route Fare”** to receive a model-generated fare estimate.
   - The system uses a decision tree model trained on historical data to compute this prediction.

4. **Macroeconomic Context:**
   - When a date is chosen, the panel also fetches and displays:
     - GDP
     - Oil prices
     - Unemployment rate
   - These metrics correspond to the selected date and provide additional context for interpreting fare changes.

5. **Clear Selections & Explore More Routes:**
   - On the home page, click **“Show All Routes”** to reset the view and select a new route.

This interactive pipeline allows users to explore and compare how airfare changes over time, under different conditions, and between routes — offering both historical insight and predictive power.

---

## 🧠 Tech Stack
**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS

**Backend:**
- Flask + Pandas + SQLAlchemy
- SQLite for storage
- Jupyter Notebook executed via papermill

**ML Model:**
- Ridge regression pipeline (scikit-learn)
- Uses categorical + macro features for fare prediction

**Deployment:**
- Frontend: Vercel
- Backend: Render


