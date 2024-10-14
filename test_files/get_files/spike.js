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


export const options = spike;

// Função principal (executada pelos VUs)
export default function () {
  // Exemplo de requisição para obter informações do usuário
  const res = http.get(`${__ENV.HOSTNAME}/users`);

  sleep(1); // Pausa de 1 segundo entre as requisições
}
