import React, { useEffect, useState } from 'react';
import './YearlyTrendsPanel.css';

interface YearlyTrendsPanelProps {
  departure: string;
  arrival: string;
  dateRange: { startDate: Date; endDate: Date };
}

interface YearlyDataPoint {
  label: string; // Format: "YYYY"
  value: number;
}

const BARS_PER_PAGE = 6;

const getYearLabelsInRange = (start: Date, end: Date): Set<string> => {
  const years = new Set<string>();
  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    years.add(year.toString());
  }
  return years;
};

const YearlyTrendsPanel: React.FC<YearlyTrendsPanelProps> = ({ departure, arrival, dateRange }) => {
  const [data, setData] = useState<YearlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const selectedLabels = getYearLabelsInRange(dateRange.startDate, dateRange.endDate);

  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/yearly-fares', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departure, arrival })
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch data');
        setData(json);
        setError(null);

        // ⬇️ Auto-scroll to first selected year
        const firstMatchIndex = json.findIndex((item: YearlyDataPoint) =>
          selectedLabels.has(item.label)
        );

        if (firstMatchIndex !== -1) {
          const targetPage = Math.floor(firstMatchIndex / BARS_PER_PAGE);
          setPage(targetPage);
        } else {
          setPage(0);
        }

      } catch (err: any) {
        console.error('Error fetching yearly fares:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    if (departure && arrival && departure !== 'Select departure' && arrival !== 'Select arrival') {
      fetchYearlyData();
    }
  }, [departure, arrival, dateRange]);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, Math.floor(data.length / BARS_PER_PAGE)));

  const startIndex = page * BARS_PER_PAGE;
  const endIndex = startIndex + BARS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="yearly-trends-box">
      <h2 className="yearly-trends-heading">Average Yearly Pricing</h2>
      <div className="chart-wrapper">
        <div className="chart-controls">
          <button className="chart-nav-btn" onClick={handlePrev} disabled={page === 0}>&lt;</button>
          <button className="chart-nav-btn" onClick={handleNext} disabled={endIndex >= data.length}>&gt;</button>
        </div>
        <div className="chart-bars">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : paginatedData.length === 0 ? (
            <p>No data available.</p>
          ) : (
            paginatedData.map((item) => {
              const isSelected = selectedLabels.has(item.label);
              return (
                <div
                  key={item.label}
                  className={`chart-bar ${isSelected ? 'highlighted' : ''}`}
                  style={{ height: `calc(${(item.value / maxValue) * 100}%)` }}
                >
                  <span className="bar-value">${item.value.toFixed(0)}</span>
                  <div className="bar-fill"></div>
                  <span className="bar-label">{item.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default YearlyTrendsPanel;
