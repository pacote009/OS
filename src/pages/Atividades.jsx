// src/pages/Atividades.jsx
import { useState, useEffect } from "react";
import AtividadeCard from "../components/AtividadeCard";
import { addAtividade, getAtividades } from "../services/api";
import { FaPlus } from "react-icons/fa";
import { getCurrentUser } from "../auth";

const Atividades = () => {
  const [showForm, setShowForm] = useState(false);
  const [novaAtividade, setNovaAtividade] = useState({ title: "", description: "" });
  const [reload, setReload] = useState(false);

  const handleRegistrarAtividade = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      alert("Você precisa estar logado!");
      return;
    }

    const nova = {
      title: novaAtividade.title,
      description: novaAtividade.description,
      status: "pendente",
      comentarios: [],
      autor: user.username,
    };

    await addAtividade(nova);
    setNovaAtividade({ title: "", description: "" });
    setShowForm(false);
    setReload((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Atividades
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/40 transition-transform transform hover:scale-105 active:scale-95"
        >
          <FaPlus />
          Registrar Atividade
        </button>
      </div>

      {/* Modal de Registro */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <form
            onSubmit={handleRegistrarAtividade}
            className="bg-gray-200 p-6 rounded-xl shadow-lg w-96 text-white"
          >
            <h2 className="text-xl font-bold mb-4">Nova Atividade</h2>
            <input
              type="text"
              placeholder="Título"
              value={novaAtividade.title}
              onChange={(e) => setNovaAtividade({ ...novaAtividade, title: e.target.value })}
              className="w-full border rounded p-2 mb-3 bg-gray-700 text-white placeholder-gray-300"
              required
            />
            <textarea
              placeholder="Descrição"
              value={novaAtividade.description}
              onChange={(e) => setNovaAtividade({ ...novaAtividade, description: e.target.value })}
              className="w-full border rounded p-2 mb-3 bg-gray-700 text-white placeholder-gray-300"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Seções com paginação */}
      <Section key={`pendentes-${reload}`} title="Pendentes" status="pendente" />
      <Section key={`finalizadas-${reload}`} title="Finalizadas" status="finalizada" />
    </div>
  );
};

const Section = ({ title, status }) => {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const res = await getAtividades(status, page, 5, order, search);
      setData(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, order, search, status]);

  const totalPages = Math.ceil(total / 5);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg border border-gray-300">

      <h2 className="text-2xl font-bold text-gray-700 mb-4">{title}</h2>

      {/* Filtro e ordenação */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2 w-full md:w-1/2 bg-white text-gray-800 placeholder-gray-500"
        />
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border rounded px-3 py-2 bg-white text-gray-800"
        >
          <option value="desc">Mais recentes</option>
          <option value="asc">Mais antigos</option>
        </select>
      </div>

      {data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((atividade) => (
              <AtividadeCard
                key={atividade.id}
                id={atividade.id}
                title={atividade.title}
                description={atividade.description}
                status={atividade.status}
                comentarios={atividade.comentarios || []}
                autor={atividade.autor}
                concluidoPor={atividade.concluidoPor}
                assignedTo={atividade.assignedTo}
                onUpdate={fetchData}
              />
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 transition disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {page} de {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 transition disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Nenhuma atividade {title.toLowerCase()}.</p>
      )}
    </div>
  );
};

export default Atividades;
