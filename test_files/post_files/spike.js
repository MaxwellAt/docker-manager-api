import http from "k6/http";
import { sleep } from "k6";

// Spike
const spike = {
  stages: [
    { target: 500, duration: "1m" },
    { target: 5000, duration: "25s" },
    { target: 500, duration: "1m" },
    { target: 5000, duration: "25s" },
    { target: 500, duration: "1m" },
  ],
};
const baseUrl = `${__ENV.HOSTNAME}`;

export const options = spike;


function gerarUsuarioAleatorio() {
  return {
    name: `Usuário ${Math.floor(Math.random() * 1000)}`,
    username: `user${Math.floor(Math.random() * 10000)}`,
    email: `usuario${Math.floor(Math.random() * 10000)}@exemplo.com`,
    dateOfBirth: `${1950 + Math.floor(Math.random() * 50)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    gender: ['Male', 'Female', 'Other'][Math.floor(Math.random() * 3)],
    location: `Cidade ${Math.floor(Math.random() * 100)}`
  };
}

export default function () {
  const payload = JSON.stringify(gerarUsuarioAleatorio());

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Requisição POST
  const ENDPOINT = `${baseUrl}/users`;
  const response = http.post(ENDPOINT, payload, params);

  // Pausa entre as requisições
  sleep(1);
}
// Função de teardown (executada após o fim do teste)
export function teardown(data) {
  //remover os usuarios criados
  const url = `${__ENV.HOSTNAME}/users`; // Endpoint da API para adicionar usuários
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  for (const user of data.users) {
    http.del(`${url}/${user.id}`, params);
  }
  console.log('Teste finalizado');
}
