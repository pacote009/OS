import React, { useEffect, useState } from "react";
import { ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDashboardData();
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500">Carregando...</p>;
  if (!stats) return <p className="text-red-500">Erro ao carregar dados.</p>;

  // Dados para gráfico de pizza
  const pieData = [
    { name: "Concluídas", value: stats.concluidas },
    { name: "Pendentes", value: stats.pendentes },
    { name: "Projetos", value: stats.projetos },
  ];
  const COLORS = ["#22c55e", "#eab308", "#6366f1"];

  // Dados exemplo para gráfico de linha
  const lineData = [
    { semana: "01-07", concluidas: 2, pendentes: 4 },
    { semana: "08-14", concluidas: 5, pendentes: 2 },
    { semana: "15-21", concluidas: 3, pendentes: 6 },
    { semana: "22-28", concluidas: 7, pendentes: 1 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">Resumo atualizado das suas atividades e projetos.</p>

      {/* Cards clicáveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card onClick={() => navigate("/projetos")}
          icon={<ClipboardDocumentListIcon className="h-8 w-8" />} color="indigo"
          title="Projetos Ativos" value={stats.projetos} />

        <Card onClick={() => navigate("/atividades?status=concluidas")}
          icon={<CheckCircleIcon className="h-8 w-8" />} color="green"
          title="Atividades Concluídas" value={stats.concluidas} />

        <Card onClick={() => navigate("/atividades?status=pendentes")}
          icon={<ClockIcon className="h-8 w-8" />} color="yellow"
          title="Pendentes" value={stats.pendentes} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico Pizza */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Distribuição</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Linha */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Progresso Semanal</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="concluidas" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="pendentes" stroke="#eab308" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Card = ({ icon, color, title, value, onClick }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <button
      onClick={onClick}
      className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 border border-gray-100 hover:scale-105 transition-transform"
    >
      <div className={`${colors[color]} p-3 rounded-full`}>{icon}</div>
      <div className="text-left">
        <p className="text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </button>
  );
};

export default Dashboard;
