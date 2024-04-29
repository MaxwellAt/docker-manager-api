const configSelection = document.querySelector("#config-selection");
const backendCpuField = document.querySelector("#backend-cpu");
const backendRamField = document.querySelector("#backend-ram");
const databaseCpuField = document.querySelector("#database-cpu");
const databaseRamField = document.querySelector("#database-ram");

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
  //console.log(data);

  renderApplications(data.result);
}

function renderApplications(data) {
  if (data.length == 0) return;

  applications.innerHTML = "";

  data.map((curr) => {
    const component = getCard(curr);
    const button = component.querySelector(".remove");

    button.addEventListener("click", () => {
      removeApplication(curr.composerFile);
      window.location.reload();
    });

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

reqBtn.addEventListener("click", async () => {
  const modalBody = document.querySelector(".modal-body");
  const setMessage = handleMessage(modalBody);
  const data = await buildContainer();
  setMessage(data.message);
});

async function buildContainer() {
  const selectedConf = configSelection.value;
  const backendCpu = backendCpuField.value;
  const backendRam = backendRamField.value;
  const databaseCpu = databaseCpuField.value;
  const databaseRam = databaseRamField.value;

  const requestBody = JSON.stringify({
    conf: selectedConf,
    backend: {
      cpu: backendCpu,
      ram: `${backendRam}M`,
    },
    database: {
      cpu: databaseCpu,
      ram: `${databaseRam}M`,
    },
  });

  const result = await fetch(apiURL + ":8000/up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const data = await result.json();
  return data;
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
  <div class="card my-3">
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

function handleMessage(body) {
  body.innerHTML = `
    <div class="message-body"
    style="width: 100%; min-height: 200px;text-align: center; position: relative"
    >
      <img src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
      style="position: absolute; 
      left: 50%; 
      top: 50%; 
      transform: translate(-50%, -50%);
      width:100px; 
      height:100px;"
      >  
      <button class="btn btn-primary container-fluid" style="display: none">Ok</button>
    <div>
  `;

  const okButton = body.querySelector(".btn");
  okButton.addEventListener("click", () => window.location.reload());

  return (message) => {
    const messageBody = body.querySelector(".message-body");
    messageBody.innerHTML = `<p style="margin-bottom: 100px">${message}</p>`;

    okButton.style.display = "block";

    messageBody.appendChild(okButton);
  };
}

// Setup Dataviwer
const dataViewers = document.querySelectorAll(".value-viewer");
dataViewers.forEach((el) => {
  const inputEl = document.getElementById(el.dataset.for);
  // Get formating
  const format = el.innerText;

  // set current value
  el.innerText = inputEl.value + format;

  // set value on change
  inputEl.addEventListener("input", () => {
    el.innerText = inputEl.value + format;
  });
});
