"use client"; 

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [jwt, setJwt] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [quoteData, setQuoteData] = useState({ amount: 0, from: "ARS", to: "ETH" });
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [quoteId, setQuoteId] = useState("");
  const [quoteQueryResponse, setQuoteQueryResponse] = useState(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, credentials);
      setJwt(response.data.access_token);
    } catch (error) {
      console.error("Error autenticando:", error);
    }
  };

  const handleQuote = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/quote`,
        {
          ...quoteData,
          amount: Number(quoteData.amount) // Convierte a número antes de enviarlo
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setQuoteResponse(response.data);
    } catch (error) {
      console.error("Error creando cotización:", error);
    }
  };

  const handleQuery = async () => {
    try {
      const response = await axios.get(`${backendUrl}/quote/${quoteId}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setQuoteQueryResponse(response.data);
    } catch (error) {
      console.error("Error consultando cotización:", error);
    }
  };

  const handleReset = () => {
    setQuoteData({ amount: 0, from: "ARS", to: "ETH" });
    setQuoteResponse(null);
    setQuoteId("");
    setQuoteQueryResponse(null);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-500 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Autenticación</h2>
      <input
        type="text"
        placeholder="Usuario"
        className="w-full p-2 mb-2 border rounded"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full p-2 mb-2 border rounded"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button 
        onClick={handleLogin} 
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Actualizar
      </button>
      {jwt && <p className="mt-2 text-green-600">JWT generado</p>}

      <h2 className="text-xl font-semibold mt-6 mb-4">Crear Cotización</h2>
      <input
        type="number"
        placeholder="Monto"
        className="w-full p-2 mb-2 border rounded"
        value={quoteData.amount}
        onChange={(e) => setQuoteData({ ...quoteData, amount: e.target.value })}
      />
      <select
        value={quoteData.from}
        className="w-full p-2 mb-2 border rounded"
        onChange={(e) => setQuoteData({ ...quoteData, from: e.target.value })}
      >
        {["ARS", "CLP", "MXN", "USDC", "BTC", "ETH"].map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      <select
        value={quoteData.to}
        className="w-full p-2 mb-2 border rounded"
        onChange={(e) => setQuoteData({ ...quoteData, to: e.target.value })}
      >
        {["ETH", "USDC", "CLP", "USD", "ARS"].map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      <button 
        onClick={handleQuote} 
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Guardar
      </button>

      {quoteResponse && (
        <div className="mt-4 p-4 bg-white border rounded">
          <h3 className="font-semibold text-black">Respuesta Cotización</h3>
          <pre className="text-sm text-black">{JSON.stringify(quoteResponse, null, 2)}</pre>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-4">Consultar Cotización</h2>
      <input
        type="text"
        placeholder="ID de cotización"
        className="w-full p-2 mb-2 border rounded"
        value={quoteId}
        onChange={(e) => setQuoteId(e.target.value)}
      />
      <button 
        onClick={handleQuery} 
        className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
      >
        Consultar
      </button>

      {quoteQueryResponse && (
        <div className="mt-4 p-4 bg-white border rounded">
          <h3 className="font-semibold text-black">Resultado Consulta</h3>
          <pre className="text-sm text-black">{JSON.stringify(quoteQueryResponse, null, 2)}</pre>
        </div>
      )}

      <button 
        onClick={handleReset} 
        className="w-full bg-red-500 text-white py-2 mt-6 rounded hover:bg-red-600"
      >
        Limpiar Todo
      </button>
    </div>
  );
}
