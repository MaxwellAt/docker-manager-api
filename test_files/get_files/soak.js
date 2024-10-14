import http from "k6/http";
import { sleep } from "k6";

// Soak
const soak = {
  stages: [
    { target: 50, duration: "5m" },
    { target: 100, duration: "1h" },
    { target: 50, duration: "5m" },
  ],
};

export const options = soak;

// Função principal (executada pelos VUs)
export default function () {
  // Exemplo de requisição para obter informações do usuário
  const res = http.get(`${__ENV.HOSTNAME}/users`);

  sleep(1); // Pausa de 1 segundo entre as requisições
}
