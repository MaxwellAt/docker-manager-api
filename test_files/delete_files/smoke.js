import http from 'k6/http';
import { check, sleep } from 'k6';

// Opções do teste
export const options = {
  vus: 5, duration: '10s',
};

// Função de setup, usada para adicionar vários usuários
export function setup() {
  const url = `${__ENV.HOSTNAME}/users`; // Endpoint da API para adicionar usuários
  const createdUsers = []; // Array para armazenar os usuários criados

  // Criar múltiplos usuários (exemplo: 5 usuários)
  for (let i = 1; i <= 5; i++) {
    const payload = JSON.stringify({
      name: `User ${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      dateOfBirth: '2000-01-01',
      gender: 'Other',
      location: 'Location',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Faz a requisição POST para criar o usuário
    const res = http.post(url, payload, params);

    // Verifica se a requisição foi bem-sucedida
    check(res, {
      [`User ${i} created successfully`]: (r) => r.status === 201, // Supondo que 201 seja o código de sucesso
    });

    // Armazena o ID do usuário criado
    createdUsers.push(res.json('id')); // Armazena o ID do usuário criado
    sleep(1); // Pausa para evitar criar todos de uma vez (opcional)
  }

  // Retorna a lista de IDs dos usuários criados para ser usada pelos VUs
  return { users: createdUsers };
}

// Função principal (executada pelos VUs)
export default function (data) {
  const randomUserId = data.users[Math.floor(Math.random() * data.users.length)]; // Pega um ID de usuário aleatório

  // Exemplo de requisição para deletar o usuário
  const res = http.del(`${__ENV.HOSTNAME}/users/${randomUserId}`);


  sleep(1); // Pausa de 1 segundo entre as requisições
}