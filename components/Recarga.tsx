"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Aqui vai usar interfaces para tipar os dados recebidos
interface Operador {
  id: number;
  nome: string;
}

interface Veiculo {
  id: number;
  identificador: string;
}

interface Eletroposto {
  id: number;
  nome: string;
}

// Aqui vai colocar um tipo para vários campos que podem representar uma recarga
type Recarga = {
  id: number;
  data: string;
  inicio: string;
  fim: string | null;
  percentual_inicio: number;
  percentual_final: number | null;
  kwh: number | null;
  km_inicial: number;
  km_final: number | null;
  status: string;
  veiculoId: number;
  operadorId: number;
  eletropostoId: number;
};

export default function RecargaPage() {
  // Aqui vai usar e armazenar listas e dados individuais
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [eletropostos, setEletropostos] = useState<Eletroposto[]>([]);
  const [recargasIniciadas, setRecargasIniciadas] = useState<Recarga[]>([]);
  const [ultimaRecarga, setUltimaRecarga] = useState<Recarga | null>(null);
  const [etapa, setEtapa] = useState(1);

  // Aqui vai controlar os campos do formulário
  const [form, setForm] = useState({
    veiculoId: "",
    operadorId: "",
    eletropostoId: "",
    percentual_inicio: "",
    km_inicial: "",
    percentual_final: "",
    km_final: "",
    kwh: "",
    recargaSelecionadaId: "",
  });

  // Aqui vai ser para tanto celular, como notebook poderem utilizar sem problema a aplicação
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  // Aqui vai fazer o Fetch de dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      // Aqui irá fazer 3 requisições ao mesmo tempo
      const [ops, veics, postos] = await Promise.all([
        axios.get(`${baseUrl}/api/operadores`),
        axios.get(`${baseUrl}/api/veiculos`),
        axios.get(`${baseUrl}/api/eletropostos`),
      ]);

      setOperadores(ops.data);
      setVeiculos(veics.data);
      setEletropostos(postos.data);
    };

    fetchData();
  }, []); // Aqui vai garantir que rode apenas uma vez

  // Aqui vai buscar recarga ativa do operador selecionado
  useEffect(() => {
    if (form.operadorId) {
      axios
        .get(`${baseUrl}/api/recargas/iniciadas?idOperador=${form.operadorId}`)
        .then((res) => setRecargasIniciadas(res.data));
    }
  }, [form.operadorId]);

  // Aqui vai buscar dados da última recarga ao selecionar veículo
  useEffect(() => {
    if (form.veiculoId) {
      axios
        .get(`${baseUrl}/api/recargas/ultimo?idVeiculo=${form.veiculoId}`)
        .then((res) => {
          if (res.data) {
            setUltimaRecarga(res.data);
            // Aqui vai atualizar o km_inicial com o km_final da última recarga
            setForm((prev) => ({
              ...prev,
              km_inicial: String(res.data.km_final ?? ""),
            }));
          }
        });
    }
  }, [form.veiculoId]);

  // Aqui vai sempre atualizar o formulário sempre que o input ou o select altera
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Aqui vai vai iniciar uma nova recarga
  const iniciarRecarga = async () => {
    // Aqui é onde o km inicial tem que ser maior que o último km final
    if (Number(form.km_inicial) <= Number(ultimaRecarga?.km_final ?? 0)) {
      return alert("O KM atual deve ser maior que o último KM registrado.");
    }

    // Monta o corpo da requisição POST com dados convertidos para número
    const body = {
      veiculoId: Number(form.veiculoId),
      operadorId: Number(form.operadorId),
      eletropostoId: Number(form.eletropostoId),
      percentual_inicio: Number(form.percentual_inicio),
      km_inicial: Number(form.km_inicial),
    };

    try {
      await axios.post(`${baseUrl}/api/recargas`, body);
      alert("Recarga iniciada com sucesso!");
      setEtapa(2); // irá avançar para etapa 2
      // Aqui atualiza lista de recargas iniciadas para a etapa 2
      const res = await axios.get(
        `${baseUrl}/api/recargas/iniciadas?idOperador=${form.operadorId}`
      );
      setRecargasIniciadas(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar recarga.");
    }
  };

  const finalizarRecarga = async () => {
    if (!form.recargaSelecionadaId) {
      return alert("Selecione uma recarga para finalizar.");
    }

    const body = {
      idRecarga: Number(form.recargaSelecionadaId),
      km_final: Number(form.km_final),
      percentual_final: Number(form.percentual_final),
      kwh: Number(form.kwh),
      fim: new Date().toISOString(),
    };

    try {
      // Aqui envia a requisição para finalizar a recarga
      await axios.patch(`${baseUrl}/api/recargas/finalizar`, body);
      alert("Recarga finalizada com sucesso!");
      setEtapa(1); // Aqui irá voltar para etapa 1

      // Aqui irá resetar o formulário para valores vazios
      setForm({
        veiculoId: "",
        operadorId: "",
        eletropostoId: "",
        percentual_inicio: "",
        km_inicial: "",
        percentual_final: "",
        km_final: "",
        kwh: "",
        recargaSelecionadaId: "",
      });
      setRecargasIniciadas([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao finalizar recarga.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4 overflow-auto">
      <div className="space-y-8 w-full max-w-xl bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center text-black">
          Página de Recarga
        </h1>

        {/* Etapa 1: Início da Recarga */}
        {etapa === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-green-700">
              Etapa 1: Início da Recarga
            </h2>

            <div className="space-y-3">
              <select
                name="operadorId"
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              >
                <option value="">Selecione o Operador</option>
                {operadores.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.nome}
                  </option>
                ))}
              </select>

              <select
                name="veiculoId"
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              >
                <option value="">Selecione o Veículo</option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.identificador}
                  </option>
                ))}
              </select>

              <select
                name="eletropostoId"
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              >
                <option value="">Selecione o Eletroposto</option>
                {eletropostos.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="percentual_inicio"
                placeholder="Percentual inicial da bateria"
                value={form.percentual_inicio}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              />

              {ultimaRecarga && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500">
                    Último KM final registrado: {ultimaRecarga.km_final}
                  </p>
                  <p className="text-xs text-gray-400">
                    Valor foi sugerido como KM inicial.
                  </p>
                </div>
              )}

              <input
                type="number"
                name="km_inicial"
                placeholder="KM atual do odômetro"
                value={form.km_inicial}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
                min={Number(ultimaRecarga?.km_final ?? 0)}
              />

              <button
                onClick={iniciarRecarga}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Iniciar Recarga
              </button>
            </div>
          </div>
        )}

        {/* Etapa 2: Finalização da Recarga */}
        {etapa === 2 && recargasIniciadas.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">
              Etapa 2: Finalização da Recarga
            </h2>

            <div className="space-y-3">
              <select
                name="recargaSelecionadaId"
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              >
                <option value="">Selecione uma recarga</option>
                {recargasIniciadas.map((r) => (
                  <option key={r.id} value={r.id}>
                    Recarga #{r.id} - Veículo {r.veiculoId}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="percentual_final"
                placeholder="Percentual final da bateria"
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              />

              <input
                type="number"
                name="km_final"
                placeholder="KM final do odômetro"
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              />

              <input
                type="number"
                name="kwh"
                placeholder="KWh consumido"
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600"
              />

              <button
                onClick={finalizarRecarga}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Finalizar Recarga
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
