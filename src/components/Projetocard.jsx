import { useState } from "react";
import { FaRegThumbsUp, FaCommentAlt, FaTrash } from "react-icons/fa";
import api from "../services/api";
import { getCurrentUser } from "../auth";

const ProjetoCard = ({ projeto, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const user = getCurrentUser();

  const handleLike = async () => {
    try {
      await api.patch(`/projetos/${projeto.id}`, {
        likes: projeto.likes + 1,
      });
      onUpdate();
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.patch(`/projetos/${projeto.id}`, {
        comentarios: [...projeto.comentarios, `${user.username}: ${newComment}`],
      });
      setNewComment("");
      onUpdate();
    } catch (err) {
      console.error("Erro ao comentar:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta ideia?")) return;
    try {
      await api.delete(`/projetos/${projeto.id}`);
      onUpdate();
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-bold text-lg">{projeto.titulo}</h2>
      <p>{projeto.descricao}</p>
      <p className="text-sm text-gray-500">Autor: {projeto.autor}</p>

      <div className="mt-3 flex gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <FaRegThumbsUp /> {projeto.likes}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <FaCommentAlt /> {projeto.comentarios.length}
        </button>

        {user?.username === projeto.autor && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-600 hover:text-red-800"
          >
            <FaTrash /> Excluir
          </button>
        )}
      </div>

      {showComments && (
        <div className="mt-3 border-t pt-2">
          <div className="space-y-2">
            {projeto.comentarios.map((c, i) => (
              <p key={i} className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                {c}
              </p>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Adicionar comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded-lg p-2"
            />
            <button
              onClick={handleAddComment}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetoCard;
