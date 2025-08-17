import React from 'react';

const Projetocard = ({ title, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-bold text-lg">{title}</h2>
      <p>{description}</p>
      <div className="mt-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
          Curti
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded ml-2">
          Comentários
        </button>
      </div>
    </div>
  );
};

export default Projetocard;
