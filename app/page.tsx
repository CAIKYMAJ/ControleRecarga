"use client";

import { useEffect, useState } from "react";

interface Operador {
  id: string;
  nome: string;
}

interface Eletroposto {
  id: string;
  nome: string;
}

export default function LoginPage() {
  const [dataAtual, setDataAtual] = useState("");
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [eletropostos, setEletropostos] = useState<Eletroposto[]>([]);
  const [operadorSelecionado, setOperadorSelecionado] = useState("");
  const [eletropostoSelecionado, setEletropostoSelecionado] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR");
    setDataAtual(dataFormatada);
  }, []);

  useEffect(() => {
    async function carregarDados() {
      try {
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000";

        const resOp = await fetch(`${baseUrl}/api/operadores`);
        const operadoresData = await resOp.json();
        setOperadores(operadoresData);

        const resEl = await fetch(`${baseUrl}/api/eletropostos`);
        const eletropostosData = await resEl.json();
        setEletropostos(eletropostosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDados();
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!operadorSelecionado || !eletropostoSelecionado) {
      setErro("Por favor, selecione operador e eletroposto.");
      return;
    }

    const data = {
      actualDate: dataAtual,
      selecionarOperador: operadorSelecionado,
      selecionarEletroposto: eletropostoSelecionado,
    };

    // Salvando dados localmente
    localStorage.setItem("dataLoginOperacional", JSON.stringify(data));

    // Redirecionamento (exemplo)
    window.location.href = "/recarga";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 overflow-auto">
      <form
        onSubmit={handleLogin}
        className="bg-white px-4 py-6 sm:px-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-center text-black">
          Login Operacional
        </h1>

        <div>
          <label className="block font-medium text-sm text-gray-700">
            Data Atual
          </label>
          <input
            type="text"
            value={dataAtual}
            readOnly
            className="w-full mt-1 p-3 border border-gray-300 rounded bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">
            Operador
          </label>
          <select
            value={operadorSelecionado}
            onChange={(e) => setOperadorSelecionado(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded text-gray-500"
            required
          >
            <option value="">Selecione um operador</option>
            {operadores.map((op) => (
              <option key={op.id} value={op.id}>
                {op.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">
            Eletroposto
          </label>
          <select
            value={eletropostoSelecionado}
            onChange={(e) => setEletropostoSelecionado(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded text-gray-500"
            required
          >
            <option value="">Selecione um eletroposto</option>
            {eletropostos.map((el) => (
              <option key={el.id} value={el.id}>
                {el.nome}
              </option>
            ))}
          </select>
        </div>

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
