  import React from 'react';

  const Atividadecard = ({ title, description }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-bold text-lg">{title}</h2>
        <p>{description}</p>
        <div className="mt-2">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
            Concluir
          </button>
        </div>
      </div>
    );
  };

  export default Atividadecard;
  