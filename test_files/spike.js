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

function makeRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const generateUser = (random) => {
  return {
    name: random ? makeRandomString(5) : "defualt_value",
    username: random ? makeRandomString(5) : "defualt_value",
    email: random ? makeRandomString(5) : "defualt_value",
    date: random ? makeRandomString(5) : "defualt_value",
    dateOfBirth: random ? makeRandomString(5) : "defualt_value",
    location: random ? makeRandomString(5) : "defualt_value",
    gender: random ? makeRandomString(5) : "defualt_value",
  };
};

const baseUrl = `${__ENV.HOSTNAME}`;

export const options = spike;

export default function () {
  // Consulta
  const ENDPOINT = `${baseUrl}/users`;
  http.get(ENDPOINT);

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Criacao
  const resPost = http.post(
    `${ENDPOINT}`,
    JSON.stringify(generateUser()),
    params
  );
  const userId = JSON.parse(resPost.body).id;

  // Edição
  const resPut = http.put(
    `${ENDPOINT}/${userId}`,
    JSON.stringify(generateUser(true)),
    params
  );

  // Remocao
  http.del(`${ENDPOINT}/${userId}`);

  sleep(1);
}
