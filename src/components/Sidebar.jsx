import { Link, useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";
import { getCurrentUser, logout } from "../auth";

export default function Sidebar() {
  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // remove do localStorage
    navigate("/"); // redireciona para tela de login
  };

  // Se for admin, prefixo das rotas é "/admin"
  const basePath = isAdmin ? "/admin" : "";

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-6 flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">Ativix</h2>
        <p className="text-gray-400 text-sm">Gestão de Chamados</p>
      </div>
      
      <nav className="space-y-2 flex-1">
        <Link to={`${basePath}/projetos`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
          <ClipboardDocumentListIcon className="h-5 w-5" /> 
          <span>Projetos</span>
        </Link>
        <Link to={`${basePath}/atividades`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
          <HomeIcon className="h-5 w-5" /> 
          <span>Atividades</span>
        </Link>
        <Link to={`${basePath}/dashboard`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
          <ChartBarIcon className="h-5 w-5" /> 
          <span>Dashboard</span>
        </Link>

        {/* Só mostra para admin */}
        {isAdmin && (
          <>
            <Link to="/admin/cadastro-usuario" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
              <UserCircleIcon className="h-5 w-5" /> 
              <span>Cadastro Usuário</span>
            </Link>
            <Link to="/admin/relatorios" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
              <UserCircleIcon className="h-5 w-5" /> 
              <span>Relatórios</span>
            </Link>
          </>
        )}
      </nav>
      
      {/* Rodapé com usuário + logout */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center gap-3 p-3 text-gray-400">
          <UserCircleIcon className="h-5 w-5" />
          <span>{user?.username}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-gray-700 transition-all mt-3"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
