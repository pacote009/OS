import { useEffect, useState } from "react";
import ProjetoCard from "../components/ProjetoCard";
import { FaLightbulb } from "react-icons/fa";
import api from "../services/api";
import { getCurrentUser } from "../auth";

const Projetos = () => {
  const [projetos, setProjetos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const fetchProjetos = async () => {
    try {
      const res = await api.get("/projetos");
      setProjetos(res.data);
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, []);

  const handleNovaIdeia = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();

    const novaIdeia = {
      titulo,
      descricao,
      autor: user.username,
      likes: 0,
      comentarios: []
    };

    try {
      await api.post("/projetos", novaIdeia);
      setTitulo("");
      setDescricao("");
      setShowForm(false);
      fetchProjetos(); // recarrega lista
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Projetos
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/40 transition-transform transform hover:scale-105 active:scale-95"
        >
          <FaLightbulb />
          Nova Ideia
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleNovaIdeia}
          className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Título do projeto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
          <textarea
            placeholder="Descrição da ideia"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Salvar
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {projetos.map((proj) => (
          <ProjetoCard key={proj.id} projeto={proj} onUpdate={fetchProjetos} />
        ))}
      </div>
    </div>
  );
};

export default Projetos;
