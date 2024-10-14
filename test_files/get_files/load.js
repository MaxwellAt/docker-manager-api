import http from "k6/http";
import { sleep } from "k6";

// Load
const load = {
  stages: [
    { target: 100, duration: "3m" },
    { target: 1000, duration: "10m" },
    { target: 100, duration: "3m" },
  ],
};

export const options = load;


// Função principal (executada pelos VUs)
export default function () {
  // Exemplo de requisição para obter informações do usuário
  const res = http.get(`${__ENV.HOSTNAME}/users`);

  sleep(1); // Pausa de 1 segundo entre as requisições
}
