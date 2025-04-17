'use client';

import { useState, useRef } from 'react';
import { updateTask, deleteTask } from '@/lib/api';
import { Check, Trash, Trash2 } from 'lucide-react';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Checkbox } from '@heroui/checkbox';
import Swal from 'sweetalert2';

export default function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [loading, setLoading] = useState(false);
  const titleInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: type === 'checkbox' ? checked : value,
    });
    console.log({
      ...editedTask,
      [name]: type === 'checkbox' ? checked : value,
    })
  };

  const startEditing = () => {
    setIsEditing(true);
    
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 10);
  };

  const handleUpdate = async () => {
    if (!editedTask.title.trim()) {
      return;
    }

    setLoading(true);
    try {
      await updateTask(task.id, editedTask);
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent('task-updated'));
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    const updatedTask = {
      ...task,
      Completed: !task.completed,
      Title: task.title,
      Description: task.description
    };
    console.log(updatedTask, task, !task.completed)

    try {
      await updateTask(task.id, updatedTask);
      window.dispatchEvent(new CustomEvent('task-updated'));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "!bg-danger p-2 text-white rounded-md mr-2 hover:shadow-md",
        confirmButton: "bg-success p-2 text-white rounded-md ml-2 hover:shadow-md"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar!",
      cancelButtonText: "Cancelar!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTask(task.id);
          window.dispatchEvent(new CustomEvent('task-deleted'));

          swalWithBootstrapButtons.fire({
            title: "Apagado!",
            text: "Sua tarefa foi apagada com sucesso.",
            icon: "success"
          });
        } catch (err) {
          swalWithBootstrapButtons.fire({
            title: "Houve um erro!",
            text: "Houve um erro ao tentar apagar a tarefa.",
            icon: "error"
          });
          console.error('Failed to delete task:', err);

        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "A ação de exclusão foi cancelada",
          icon: "error"
        });
      }
    });
  };

  const cancelEdit = () => {
    setEditedTask({ ...task }); // Reset to original
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Editando tarefa</h3>
          <button
            onClick={cancelEdit}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <Input
              ref={titleInputRef}
              labelPlacement='outside'
              label="Título"
              type="text"
              id={`title-${task.id}`}
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              required
              className=" focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escreva um título descritivo"
              classNames={{
                label: "!text-gray-700",
                inputWrapper: "!bg-slate-200",
                input: "!text-slate-800"
              }}
            />
          </div>

          <div className="mb-4">
            <Textarea
              labelPlacement='outside'
              label="Descricao"
              type="text"
              id={`description-${task.id}`}
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              required
              className=" focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Adicione detalhes sobre a tarefa..."
              classNames={{
                label: "!text-gray-700",
                inputWrapper: "!bg-slate-200",
                input: "!text-slate-800"
              }}
              />
          </div>

          <div className="mb-6">
            <Checkbox
            name='completed'
            onChange={handleChange}
            defaultSelected={editedTask.completed}
            color='success'
            classNames={{
              label: "!text-gray-700",
            }}
            
            >
              Concluído
            </Checkbox>
          </div>

          <div className="flex justify-between">
            <Button
              onPress={cancelEdit}
            >
              Cancelar
            </Button>
            <Button
              onPress={handleUpdate}
              className="bg-gradient-to-r from-indigo-500 to-purple-600  shadow-sm flex"
              isLoading={loading}
            >
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm mb-4 overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 ${task.completed ? 'border-green-500' : 'border-amber-500'
        }`}
    >

      <div className="p-5">
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggleComplete}
            className={`flex-shrink-0 h-6 w-6 rounded-full border ${task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-amber-500'
              } flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {task.completed && (
              <Check />
            )}
          </button>

          <div className="flex-1">
            <h3 className={`text-lg font-medium ${task.completed ? 'text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>

            {task.description && (
              <p className={`mt-1 text-gray-600 ${task.completed ? 'text-gray-400' : ''}`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center mt-3 text-xs text-gray-500 space-x-4">
              <span className="flex items-center">
                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Criada em {new Date(task.created_at).toLocaleDateString()}
              </span>

              {task.completed && (
                <span className="flex items-center text-green-600">
                  <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Concluída
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={startEditing}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Editar tarefa"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir tarefa"
            >
              <Trash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}