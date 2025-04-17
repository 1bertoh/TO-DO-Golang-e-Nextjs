'use client';

import { useState } from 'react';
import { createTask } from '@/lib/api';
import { Check, CircleAlert, Plus } from 'lucide-react';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';

export default function TaskForm() {
  const [task, setTask] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowSuccess(false);

    try {
      await createTask(task);
      // Reset form
      setTask({ title: '', description: '' });
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // Trigger refresh - in a more complex app, we'd use a state manager like Redux
      window.dispatchEvent(new CustomEvent('task-created'));
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Plus />
          Nova Tarefa
        </h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-start">
            <CircleAlert/>
            <div>
              <p className="font-medium">Erro ao criar tarefa</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded flex items-start">
            <Check/>
            <div>
              <p className="font-medium">Sucesso!</p>
              <p className="text-sm">Tarefa criada com sucesso.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              labelPlacement='outside'
              label="Título"
              type="text"
              id="title"
              name="title"
              value={task.title}
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
          <div>
            <Textarea
              labelPlacement='outside'
              label="Descricao"
              type="text"
              id="description"
              name="description"
              value={task.description}
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
          <div className="flex items-center justify-between pt-2">
            <Button
              onPress={() => setTask({ title: '', description: '' })}
            >
            Limpar
            </Button>
            <Button
            type="submit"
            isLoading={loading}
            className=" bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Adicionar tarefa
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Dica: Faça suas tarefas específicas e alcançáveis para melhor produtividade.
          </p>
        </div>
      </div>
    </div>
  );
}