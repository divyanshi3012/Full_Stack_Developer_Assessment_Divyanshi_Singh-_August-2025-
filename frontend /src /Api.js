import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000"; // Change to backend URL after deploy

export default function App() {
  const [token, setToken] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [simulation, setSimulation] = useState(null);

  const login = async () => {
    const { data } = await axios.post(`${API}/login`, { username: "admin", password: "admin" });
    setToken(data.token);
  };

  const getDrivers = async () => {
    const { data } = await axios.get(`${API}/drivers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDrivers(data);
  };

  const runSimulation = async () => {
    const { data } = await axios.post(`${API}/simulate`, {
      availableDrivers: 5,
      startTime: "09:00",
      maxHours: 8
    }, { headers: { Authorization: `Bearer ${token}` } });
    setSimulation(data);
  };

  useEffect(() => { if (token) getDrivers(); }, [token]);

  return (
    <div style={{ padding: 20 }}>
      {!token && <button onClick={login}>Login</button>}
      {token && (
        <>
          <h2>Drivers</h2>
          <ul>{drivers.map(d => <li key={d._id}>{d.name}</li>)}</ul>
          <button onClick={runSimulation}>Run Simulation</button>
          {simulation && (
            <div>
              <h3>Simulation Results</h3>
              <p>Total Profit: ₹{simulation.totalProfit}</p>
              <p>Efficiency: {simulation.efficiency.toFixed(2)}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
