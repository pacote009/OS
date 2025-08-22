import { useState, useEffect } from "react";
import { getCurrentUser } from "../auth";
import api, { assignAtividade } from "../services/api";

const AtividadeCard = ({ id, title, description, status, comentarios = [], concluidoPor, assignedTo, onUpdate }) => {
  const [novoComentario, setNovoComentario] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const user = getCurrentUser();

  // Buscar lista de usuários para o modal
  useEffect(() => {
    if (showModal) {
      const fetchUsers = async () => {
        try {
          const res = await api.get("/users");
          setUsuarios(res.data);
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
        }
      };
      fetchUsers();
    }
  }, [showModal]);

  const handleConcluir = async () => {
    try {
      await api.patch(`/atividades/${id}`, {
        status: "finalizada",
        concluidoPor: user?.username || "desconhecido",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao concluir atividade:", error);
    }
  };

  const handleAddComentario = async () => {
    if (!novoComentario.trim()) return;
    try {
      const comentarioFormatado = `${user?.username || "Anônimo"}: ${novoComentario}`;
      const novosComentarios = [...comentarios, comentarioFormatado];
      await api.patch(`/atividades/${id}`, { comentarios: novosComentarios });
      setNovoComentario("");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  const handleFixar = async (username) => {
    try {
      await assignAtividade(id, username);
      setShowModal(false);
      if (onUpdate) onUpdate(); // Atualiza lista
    } catch (error) {
      console.error("Erro ao fixar atividade:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
      <h2 className="font-bold text-lg">{title}</h2>
      <p className="text-gray-600">{description}</p>

      {concluidoPor && (
        <p className="text-sm text-gray-500 mt-1">
          ✅ Concluído por: <span className="font-semibold">{concluidoPor}</span>
        </p>
      )}

      {assignedTo && (
        <p className="text-sm text-blue-500 mt-1">
          📌 Fixado para: <span className="font-semibold">{assignedTo}</span>
        </p>
      )}

      {/* Comentários */}
      <div className="mt-3">
        <h3 className="font-semibold text-gray-700">Comentários:</h3>
        {comentarios.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-600">
            {comentarios.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">Nenhum comentário.</p>
        )}
      </div>

      {/* Adicionar comentário */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Escreva um comentário..."
          className="flex-1 px-2 py-1 border rounded bg-gray-700 text-white placeholder-gray-300"
        />
        <button
          onClick={handleAddComentario}
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
        >
          Enviar
        </button>
      </div>

      {/* Botões */}
      <div className="mt-3 flex gap-2">
        {status !== "finalizada" && (
          <button
            onClick={handleConcluir}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
          >
            Concluir
          </button>
        )}

        {/* Botão Fixar (somente admin e atividade pendente) */}
        {user?.role === "admin" && status === "pendente" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Fixar
          </button>
        )}
      </div>

      {/* Modal de escolha de usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Fixar Atividade</h2>
            <p className="mb-3 text-gray-600">Escolha um usuário:</p>
            <div className="max-h-60 overflow-y-auto">
              {usuarios.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleFixar(u.username)}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 border-b"
                >
                  {u.username} ({u.role})
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtividadeCard;
