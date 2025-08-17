import ProjetoCard from "../components/ProjetoCard";
import LayoutBase from "../layout/LayoutBase";
import { FaLightbulb } from "react-icons/fa";

const Projetos = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Projetos
        </h1>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/40 transition-transform transform hover:scale-105 active:scale-95">
          <FaLightbulb />
          Nova Ideia
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProjetoCard title="Ideia 1" description="Descrição da ideia 1" />
        <ProjetoCard title="Ideia 2" description="Descrição da ideia 2" />
      </div>
    </div>
  );
};

export default Projetos;
