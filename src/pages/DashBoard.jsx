import React, { useEffect, useState } from "react";
import { ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getDashboardData, getRelatorioConcluidasPorSemana } from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const data = await getDashboardData();
        if (isMounted) setStats(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function fetchLineData() {
  try {
    const result = await getRelatorioConcluidasPorSemana();
    console.log("📊 Dados recebidos do backend:", result);

    if (isMounted) {
      const parsed = {};

      // percorre usuários
      Object.values(result).forEach(userData => {
        // percorre semanas
        Object.entries(userData).forEach(([semana, atividades]) => {
          if (!parsed[semana]) {
            parsed[semana] = { semana, concluidas: 0, pendentes: 0 };
          }

          atividades.forEach(a => {
  const status = a.status?.toLowerCase();

  if (status === "finalizada") {
    parsed[semana].concluidas += 1;
  } else if (status === "pendente" || status === "pendentes") {
    parsed[semana].pendentes += 1;
  }
});

        });
      });
      // transforma objeto em array e ordena por data da semana
const sorted = Object.values(parsed).sort((a, b) => {
  const [diaA] = a.semana.split(" - ");
  const [diaB] = b.semana.split(" - ");
  const [dA, mA] = diaA.split("/").map(Number);
  const [dB, mB] = diaB.split("/").map(Number);
  return new Date(2025, mA - 1, dA) - new Date(2025, mB - 1, dB);
});

setLineData(sorted);
    }
  } catch (err) {
    console.error("Erro ao buscar progresso semanal:", err);
  }
}

    fetchData();
    fetchLineData();

    // 🔄 Auto refresh a cada 30s
    const interval = setInterval(() => {
      fetchData();
      fetchLineData();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-300">Carregando...</p>;
  if (!stats) return <p className="text-red-500">Erro ao carregar dados.</p>;

  // Dados para gráfico de pizza
  const pieData = [
    { name: "Concluídas", value: stats.concluidas },
    { name: "Pendentes", value: stats.pendentes },
    { name: "Projetos", value: stats.projetos },
  ];
  const COLORS = ["#22c55e", "#eab308", "#6366f1"];

  return (
    <div className="space-y-8 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-800 dark:text-white"
      >
        Dashboard
      </motion.h1>
      <p className="text-gray-600 dark:text-gray-400">Resumo atualizado das suas atividades e projetos.</p>

      {/* Cards clicáveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MotionCard
          onClick={() => navigate("/projetos")}
          icon={<ClipboardDocumentListIcon className="h-8 w-8" />}
          color="indigo"
          title="Projetos Ativos"
          value={stats.projetos}
        />

        <MotionCard
          onClick={() => navigate("/atividades?status=concluidas")}
          icon={<CheckCircleIcon className="h-8 w-8" />}
          color="green"
          title="Atividades Concluídas"
          value={stats.concluidas}
        />

        <MotionCard
          onClick={() => navigate("/atividades?status=pendentes")}
          icon={<ClockIcon className="h-8 w-8" />}
          color="yellow"
          title="Pendentes"
          value={stats.pendentes}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico Pizza */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Distribuição</h2>
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
        </motion.div>

        {/* Gráfico Linha */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Progresso Semanal</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="semana" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="concluidas" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="pendentes" stroke="#eab308" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

const MotionCard = ({ icon, color, title, value, onClick }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transition-colors"
    >
      <div className={`${colors[color]} p-3 rounded-full`}>{icon}</div>
      <div className="text-left">
        <p className="text-gray-500 dark:text-gray-400">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</h2>
      </div>
    </motion.button>
  );
};

export default Dashboard;
