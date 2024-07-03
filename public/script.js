import { submitForm, showTestModal } from "/formFunctions.js";

const configSelection = document.querySelector("#config-selection");
const backendCpuField = document.querySelector("#backend-cpu");
const backendRamField = document.querySelector("#backend-ram");
const databaseCpuField = document.querySelector("#database-cpu");
const databaseRamField = document.querySelector("#database-ram");

const applications = document.querySelector("#applications");
const reqBtn = document.querySelector("#request-btn");

const baseUrl = document.querySelector("#url").value;
const port = document.querySelector("#port").value;
const apiURL = `${baseUrl}:${port}`;

getConfigurations();
getApplications();

async function getApplications() {
  const result = await fetch(apiURL + "/applications", {
    method: "GET",
  });

  const data = await result.json();

  renderApplications(data.result);
}

function renderApplications(data) {
  if (data.length == 0) return;

  applications.innerHTML = "";

  data.map((curr) => {
    const component = getCard(curr);
    applications.appendChild(component);
  });
}

async function getConfigurations() {
  const result = await fetch(apiURL + "/options", {
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

  try {
    const result = await fetch(apiURL + "/up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    return await result.json();
  } catch (err) {
    return err;
  }
}

async function removeApplication(composerFile) {
  return await submitForm(apiURL + "/down", JSON.stringify({ composerFile }));
}

function getCard(application) {
  const { conf, port, composerFile, backend, database } = application;
  const card = document.createElement("div");
  card.innerHTML = `
  <div class="card my-3">
  <div class="card-header">
    ${conf} 
    <div class="status" 
      style="
      display: inline-block;
      width:10px;
      height:10px;
      background-color: red;
      border-radius: 10px;
      "
    >
    </div>
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
    <a href="#" class="run btn btn-secondary">Run</a>
    <a href="#" class="remove btn btn-danger">Remove</a>
    <button class="test btn btn-primary">Test</button>
  </div>
  </div>`;

  // Add events
  const status = card.querySelector(".status");
  const removeButton = card.querySelector(".remove");
  const runButton = card.querySelector(".run");
  const testButton = card.querySelector(".test");

  testButton.addEventListener("click", () =>
    showTestModal(apiURL, baseUrl, application)
  );

  removeButton.addEventListener("click", async () => {
    const res = await removeApplication(composerFile);
    window.location.reload();
  });

  const interval = setInterval(async () => {
    try {
      await fetch(`${baseUrl}:${port}/`);
      clearInterval(interval);
      setAvailable();
    } catch (error) {
      console.log("Trying connection on port: " + port);
    }
  }, 1000);

  function setAvailable() {
    status.style.backgroundColor = "green";
    runButton.href = `${baseUrl}:${port}`;
    runButton.className = "run btn btn-primary";
    runButton.target = "_blank";
  }

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

  el.value = inputEl.value;

  // set value on change
  inputEl.addEventListener("input", () => {
    //el.innerText = inputEl.value + format;
    el.value = inputEl.value;
  });

  el.addEventListener("input", () => {
    const value = Number(el.value);
    if (el.min <= value && value <= el.max) {
      inputEl.value = el.value;
    }
  });
});
