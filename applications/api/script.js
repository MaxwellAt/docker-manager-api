import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  // Teste GET
  const resGet = http.get('http://127.0.0.1:8000/api/');
  check(resGet, { 'GET status was 200': (r) => r.status === 200 });

  // Teste POST
  const payloadPost = JSON.stringify({
    name: 'New User',
    username: `newuser_${__VU}_${__ITER}`, // Gera um username único para cada iteração
    email: 'newuser@example.com',
    dateofBirth: '2000-01-01',
    gender: 'Man',
    location: 'New City',
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const resPost = http.post('http://127.0.0.1:8000/api/users', payloadPost, params);
  check(resPost, { 'POST status was 201': (r) => r.status === 201 });

  // Captura o id do item criado
  if (resPost.headers['Content-Type'].includes('application/json')) {
    const responseBody = JSON.parse(resPost.body);
    const id = responseBody.data?.id || null;

    // Verifica se o id foi capturado
    if (id) {
      console.log(`Usuário criado com id: ${id}`);

      // Teste PUT
      const payloadPut = JSON.stringify({
        name: 'Updated User',
        username: `updateduser_${__VU}_${__ITER}`, // Gera um novo username único para a atualização
        email: 'updateduser@example.com',
        dateofBirth: '2000-01-01',
        gender: 'Man',
        location: 'Updated City',
      });
      const resPut = http.put(`http://127.0.0.1:8000/api/users/${id}`, payloadPut, params);
      check(resPut, { 'PUT status was 200': (r) => r.status === 200 });
      console.log(`Resposta do PUT: ${resPut.body}`);

      // Teste DELETE com id no URL
      const resDelete = http.del(`http://127.0.0.1:8000/api/users/${id}/`, null, params);
      check(resDelete, { 'DELETE status was 202 or 204': (r) => r.status === 204 || r.status === 202 });
    } else {
      console.log('Erro ao capturar o id do usuário criado.');
      console.log(`Resposta do POST: ${resPost.body}`);
    }
  } else {
    console.log('Resposta não é JSON.');
  }

  sleep(1);
}
