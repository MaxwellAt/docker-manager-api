const configSelection = document.querySelector("#config-selection");
const applications = document.querySelector("#applications");
const reqBtn = document.querySelector("#request-btn");

const apiURL = "http://localhost";

getConfigurations();
getApplications();

async function getApplications() {
  const result = await fetch(apiURL + ":8000/applications", {
    method: "GET",
  });

  const data = await result.json();
  console.log(data);

  renderApplications(data.result);
}

function renderApplications(data) {
  applications.innerHTML = "";

  data.map((curr) => {
    const component = getCard(curr);
    const button = component.querySelector(".remove");

    button.addEventListener("click", () =>
      removeApplication(curr.composerFile)
    );

    applications.appendChild(component);
  });
}

async function getConfigurations() {
  const result = await fetch(apiURL + ":8000/options", {
    method: "GET",
  });
  const data = await result.json();

  renderConfig(data.result);
}

function renderConfig(data) {
  configSelection.innerHTML = data.reduce((prev, curr) => {
    return prev + `<option value=${curr}>${curr}</option>`;
  }, "");
}

reqBtn.addEventListener("click", buildContainer);

async function buildContainer() {
  const selectedConf = configSelection.value;
  const requestBody = JSON.stringify({
    conf: selectedConf,
    backend: {
      cpu: "0.5",
      ram: "50M",
    },
    database: {
      cpu: "0.5",
      ram: "50M",
    },
  });

  const result = await fetch(apiURL + ":8000/up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const data = result.json();
  console.log(data);
}

function removeApplication(composerFile) {
  fetch(apiURL + ":8000/down", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      composerFile,
    }),
  });
}

function getCard({ conf, port, composerFile, backend, database }) {
  const card = document.createElement("div");
  card.innerHTML = `
  <div class="card">
  <div class="card-header">
    ${conf} 
  </div>
  <div class="card-body">
    <h5 class="card-title">${composerFile}</h5>
    <div class="d-flex g-3">
    <div class="p-3 bg-primary-subtle rounded flex-grow-1 mx-1">
      <h6>Backend</h6>
      <p class="card-text">Cpus: ${backend.cpu}</p>
      <p class="card-text">Memória Ram: ${backend.ram}</p>
    </div>
    <div class="p-3 bg-primary-subtle rounded flex-grow-1 mx-1">
      <h6>Database</h6>
      <p class="card-text">Cpus: ${database.cpu}</p>
      <p class="card-text">Memória Ram: ${database.ram}</p>
    </div>
    </div>
    <hr>
    <a href="${apiURL}:${port}" target="_blank" class="btn btn-primary">Application</a>
    <a href="#" class="remove btn btn-danger">Remove</a>
  </div>
  </div>`;

  return card;
}
