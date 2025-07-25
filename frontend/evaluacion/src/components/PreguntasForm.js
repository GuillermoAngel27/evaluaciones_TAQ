import React from 'react';
import RatingSelector from './RatingSelector';

export default function PreguntasForm({ preguntas, respuestas, setRespuestas }) {
  const handleChange = (idx, value) => {
    const nuevas = [...respuestas];
    nuevas[idx] = value;
    setRespuestas(nuevas);
  };

  return (
    <div>
      {preguntas.map((pregunta, idx) => (
        <div key={idx} style={{ marginBottom: 16 }}>
          <div>{pregunta}</div>
          <RatingSelector
            value={respuestas[idx] || 0}
            onChange={val => handleChange(idx, val)}
            type="smiley"
          />
        </div>
      ))}
    </div>
  );
}