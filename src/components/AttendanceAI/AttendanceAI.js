import React, { useState } from 'react';

function AttendanceAI() {
  const [response, setResponse] = useState(null);

  const handlePostRequest = async () => {
    const url = 'http://localhost:5000/predecir'; // Reemplaza <IP_ADDRESS> con la direcciÃ³n IP deseada
    const data = {
      categoria: "informatica",
      mes: "febrero",
      dia: "martes",
      quienLoRealiza: "empresa",
      hora: 15
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={handlePostRequest}>Predecir</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

export default AttendanceAI;