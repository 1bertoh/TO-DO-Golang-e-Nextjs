'use client';

import { useState } from 'react';
import { login, register } from '@/lib/api';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';

export default function AuthForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleForm = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { token, user } = await login({Email: formData.email, Password: formData.password});
        onLoginSuccess(user, token);
      } else {
        const { token, user } = await register({
          Username: formData.username,
          Email: formData.email,
          password: formData.password
        });
        onLoginSuccess(user, token);
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message || 'Something went wrong',
        color: 'danger',
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center max-w-[600px] w-full min-h-fit top-[80px] absolute  px-4">
      <div
        className={`max-w-md w-full mx-auto perspective-1000 ${isFlipping ? '' : 'transition-all duration-500 ease-in-out'}`}
        style={{ perspective: '1000px' }}
      >
        <div
          className={`bg-white rounded-xl shadow-lg overflow-hidden relative transform-gpu ${isFlipping ? 'animate-flip-card' : ''
            }`}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-4">
            <h2 className="text-2xl font-bold text-center text-white">
              {isLogin ? 'Bem-vindo de volta' : 'Junte-se a nós'}
            </h2>
            <p className="text-center text-blue-100 mt-1">
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className='pb-4'>
                  <Input
                    labelPlacement='outside'
                    label="Nome de Usuário"
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    className=" focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite seu nome de usuário"
                    classNames={{
                      label: "!text-gray-700",
                      inputWrapper: "!bg-slate-200",
                      input: "!text-slate-800",
                      base: "!text-slate-800"
                    }}
                  />
                </div>
              )}

              <div className='pb-4'>
                <Input
                  labelPlacement='outside'
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className=" focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                  classNames={{
                    label: "!text-gray-700",
                    inputWrapper: "!bg-slate-200",
                    input: "!text-slate-800"
                  }}
                />
              </div>

              <div className='pb-4'>
                <Input
                  labelPlacement='outside'
                  label="Senha"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className=" focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="********"
                  classNames={{
                    label: "!text-gray-700",
                    inputWrapper: "!bg-slate-200",
                    input: "!text-slate-800"
                  }}
                />
              </div>

              <Button
                type="submit"
                isLoading={loading}
                fullWidth
                className="bg-gradient-to-r from-blue-500 to-purple-600  font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
                
              >
                {
                  isLogin ? 'Entrar' : 'Registrar'
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleToggleForm}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                disabled={isFlipping}
              >
                {isLogin
                  ? "Não tem uma conta? Registre-se"
                  : 'Já tem uma conta? Faça login'}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Esqueceu sua senha?
                </a>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-center text-gray-500">
                Ou continue com
              </p>
              <div className="mt-4 flex gap-4 justify-center">
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.58V20.29H19.28C21.36 18.34 22.56 15.56 22.56 12.25Z" fill="#4285F4" />
                    <path d="M12 23C14.97 23 17.46 22 19.28 20.29L15.71 17.58C14.73 18.22 13.48 18.58 12 18.58C9.12 18.58 6.68 16.67 5.8 14.08H2.13V16.87C3.94 20.52 7.69 23 12 23Z" fill="#34A853" />
                    <path d="M5.8 14.08C5.58 13.47 5.45 12.81 5.45 12.12C5.45 11.43 5.58 10.78 5.8 10.16V7.37H2.13C1.41 8.82 1 10.42 1 12.12C1 13.82 1.41 15.42 2.13 16.87L5.8 14.08Z" fill="#FBBC05" />
                    <path d="M12 5.67C13.62 5.67 15.06 6.22 16.16 7.27L19.31 4.13C17.45 2.42 14.97 1.33 12 1.33C7.69 1.33 3.94 3.82 2.13 7.46L5.8 10.25C6.68 7.66 9.12 5.67 12 5.67Z" fill="#EA4335" />
                  </svg>
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="#1877F2" />
                  </svg>
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H6C3.79 2 2 3.79 2 6V18C2 20.21 3.79 22 6 22H18C20.21 22 22 20.21 22 18V6C22 3.79 20.21 2 18 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 12V16M12 8V16M16 12V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flipCard {
          0% {
            transform: translateY(0) rotateY(0deg);
          }
          25% {
            transform: translateY(-20px) rotateY(90deg);
          }
          75% {
            transform: translateY(-20px) rotateY(270deg);
          }
          100% {
            transform: translateY(0) rotateY(360deg);
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .animate-flip-card {
          animation: flipCard 0.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}