// src/components/AtividadeCard.jsx
import { useState } from "react";
import { getCurrentUser } from "../auth";
import api from "../services/api";

const AtividadeCard = ({ id, title, description, status, comentarios = [], concluidoPor, onUpdate }) => {
  const [novoComentario, setNovoComentario] = useState("");

  // Função para concluir atividade
  const handleConcluir = async () => {
    const user = getCurrentUser();
    try {
      await api.patch(`/atividades/${id}`, {
        status: "finalizada",
        concluidoPor: user?.username || "desconhecido"
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao concluir atividade:", error);
    }
  };

  // Função para adicionar comentário
  const handleAddComentario = async () => {
    if (!novoComentario.trim()) return;
    try {
      const user = getCurrentUser();
      const comentarioFormatado = `${user?.username || "Anônimo"}: ${novoComentario}`;

      const novosComentarios = [...comentarios, comentarioFormatado];
      await api.patch(`/atividades/${id}`, { comentarios: novosComentarios });
      setNovoComentario("");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-bold text-lg">{title}</h2>
      <p className="text-gray-600">{description}</p>

      {/* Mostrar quem concluiu, se tiver */}
      {concluidoPor && (
        <p className="text-sm text-gray-500 mt-1">
          ✅ Concluído por: <span className="font-semibold">{concluidoPor}</span>
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

      {/* Campo de novo comentário */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Escreva um comentário..."
          className="flex-1 px-2 py-1 border rounded bg-white text-gray-800 placeholder-gray-400"
        />
        <button
          onClick={handleAddComentario}
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
        >
          Enviar
        </button>
      </div>

      {/* Botão concluir (só se ainda não estiver finalizada) */}
      {status !== "finalizada" && (
        <div className="mt-3">
          <button
            onClick={handleConcluir}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
          >
            Concluir
          </button>
        </div>
      )}
    </div>
  );
};

export default AtividadeCard;
