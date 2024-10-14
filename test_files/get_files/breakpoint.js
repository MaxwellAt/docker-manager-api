import http from 'k6/http';
import {sleep} from 'k6';

// Opções do teste
export const options = {
    stages: [{ target: 10000, duration: "2h" }],
    tresholds: {
      http_req_duration: {
        treshold: ["p(95) < 200", "p(99) < 1000"],
        abortOnFail: true,
        delayAbortEval: "10s",
      },
      http_req_failed: {
        treshold: ["rate<0.02"],
        abortOnFail: true,
        delayAbortEval: "10s",
      },
    },
};

// Função principal (executada pelos VUs)
export default function () {
  // Exemplo de requisição para obter informações do usuário
  const res = http.get(`${__ENV.HOSTNAME}/users`);

  sleep(1); // Pausa de 1 segundo entre as requisições
}
