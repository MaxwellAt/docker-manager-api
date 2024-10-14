import http from 'k6/http';
import {sleep} from 'k6';

// Opções do teste
export const options = {
    stages: [
        { target: 100, duration: "5m" },
        { target: 250, duration: "10m" },
        { target: 100, duration: "5m" },
      ],
};

// Função principal (executada pelos VUs)
export default function () {
  // Exemplo de requisição para obter informações do usuário
  const res = http.get(`${__ENV.HOSTNAME}/users`);

  sleep(1); // Pausa de 1 segundo entre as requisições
}
