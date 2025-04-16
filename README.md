# ✈️ Visualizing Airfare Trends

An interactive full-stack web application to explore historical U.S. airfare trends. Users can select specific flight routes and visualize dynamic pricing trends by quarter and year. Built with **React + TypeScript** on the frontend and **Flask + Pandas** on the backend.

![Map Overview](screenshots/map-overview.png)

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Ishxnnn/visualizing-airfare-trends.git
cd visualizing-airfare-trends
```

### 2. Backend Setup (Flask + Pandas)
Make sure you have **Conda** installed. Then run:

```bash
cd ../visualizing-airfare-trends-backend
conda env create -f environment.yml
conda activate airfare_backend
python app.py
```

The backend will run on `http://localhost:5000`.

### 3. Frontend Setup (React + Vite)
In another terminal:

```bash
cd ../visualizing-airfare-trends-frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

## 🧠 Features

* 🗺️ Interactive flight route map
* ✈️ Route selection with blinking red animation
* 📅 Calendar-based quarter/year filters
* 📊 Dynamic quarterly and yearly pricing panels
* 🧮 Fare prediction using a decision tree model
* 🔍 Auto-scroll to relevant quarters/years based on selected dates
* ⚡ Dotted-line animation that mimics flight motion

## 🗂️ Folder Structure

```
visualizing-airfare-trends/
├── visualizing-airfare-trends-backend/
│   ├── app.py
│   └── environment.yml
├── visualizing-airfare-trends-frontend/
│   ├── src/
│   └── index.html
└── README.md
```

## 💻 Tech Stack

* **Frontend:** React, TypeScript, Vite, CSS Modules
* **Visualization:** react-simple-maps, D3
* **Backend:** Flask, Pandas, NumPy
* **Data:** FAA fare and passenger route data
