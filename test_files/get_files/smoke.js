import http from 'k6/http';
import { check, sleep } from 'k6';

// Opções do teste
export const options = {
  vus: 5, duration: '15s',
};


// Função principal (executada pelos VUs)
export default function () {
  // Exemplo de requisição para obter informações do usuário
  const res = http.get(`${__ENV.HOSTNAME}/users`);

  sleep(1); // Pausa de 1 segundo entre as requisições
}
