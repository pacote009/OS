import React, { useEffect, useState } from "react";
import { ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projetos: 0,
    concluidas: 0,
    pendentes: 0,
  });

  useEffect(() => {
    // Simulação: dados salvos/localStorage
    const dadosSimulados = {
      projetos: 4,
      concluidas: 15,
      pendentes: 6,
    };

    // Atualiza o state (no futuro pode vir de API)
    setStats(dadosSimulados);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">Resumo atualizado das suas atividades e projetos.</p>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projetos */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 border border-gray-100">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            <ClipboardDocumentListIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500">Projetos Ativos</p>
            <h2 className="text-2xl font-bold">{stats.projetos}</h2>
          </div>
        </div>

        {/* Atividades concluídas */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 border border-gray-100">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500">Atividades Concluídas</p>
            <h2 className="text-2xl font-bold">{stats.concluidas}</h2>
          </div>
        </div>

        {/* Atividades pendentes */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 border border-gray-100">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <ClockIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500">Pendentes</p>
            <h2 className="text-2xl font-bold">{stats.pendentes}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
