import AtividadeCard from "../components/AtividadeCard";
import { FaPlus } from "react-icons/fa";

const Atividades = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Atividades
        </h1>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/40 transition-transform transform hover:scale-105 active:scale-95">
          <FaPlus />
          Registrar Atividade
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AtividadeCard title="Atividade 1" description="Descrição da atividade 1" />
        <AtividadeCard title="Atividade 2" description="Descrição da atividade 2" />
      </div>
    </div>
  );
};

export default Atividades;
