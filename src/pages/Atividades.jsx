// src/pages/Atividades.jsx
import { useEffect, useState } from "react";
import AtividadeCard from "../components/AtividadeCard";
import { getAtividades, addAtividade } from "../services/api"; // <- novo
import { FaPlus } from "react-icons/fa";
import { getCurrentUser } from "../auth"; // <- pegar usuário logado

const Atividades = () => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [novaAtividade, setNovaAtividade] = useState({ title: "", description: "" });

  const fetchData = async () => {
    try {
      const data = await getAtividades();
      setAtividades(data);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      autor: user.username
    };

    await addAtividade(nova);
    setNovaAtividade({ title: "", description: "" });
    setShowForm(false);
    fetchData();
  };

  if (loading) return <p className="text-gray-500">Carregando atividades...</p>;

  // separação por status
  const pendentes = atividades.filter((a) => a.status === "pendente");
  const finalizadas = atividades.filter((a) => a.status === "finalizada");

  return (
    <div>
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
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <h2 className="text-xl font-bold mb-4">Nova Atividade</h2>
            <input
              type="text"
              placeholder="Título"
              value={novaAtividade.title}
              onChange={(e) => setNovaAtividade({ ...novaAtividade, title: e.target.value })}
              className="w-full border rounded p-2 mb-3"
              required
            />
            <textarea
              placeholder="Descrição"
              value={novaAtividade.description}
              onChange={(e) => setNovaAtividade({ ...novaAtividade, description: e.target.value })}
              className="w-full border rounded p-2 mb-3"
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

      {/* Pendentes */}
      <Section title="Pendentes" atividades={pendentes} onUpdate={fetchData} />


      {/* Finalizadas */}
      <Section title="Finalizadas" atividades={finalizadas} onUpdate={fetchData} />
    </div>
  );
};

const Section = ({ title, atividades, onUpdate }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-gray-700 mb-4">{title}</h2>
    {atividades.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {atividades.map((atividade) => (
          <AtividadeCard
            key={atividade.id}
            id={atividade.id}
            title={atividade.title}
            description={atividade.description}
            status={atividade.status}
            comentarios={atividade.comentarios || []}
            autor={atividade.autor}
            concluidoPor={atividade.concluidoPor}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    ) : (
      <p className="text-gray-500">Nenhuma atividade {title.toLowerCase()}.</p>
    )}
  </div>
);

export default Atividades;
