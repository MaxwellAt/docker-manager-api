const configSelection = document.querySelector("#config-selection");
const applications = document.querySelector("#applications");
const reqBtn = document.querySelector("#request-btn");

const apiURL = "http://localhost:8000";

getConfigurations();
getApplications();

async function getApplications() {
  const result = await fetch(apiURL + "/applications", {
    method: "GET",
  });

  const data = await result.json();
  console.log(data);

  renderApplications(data.result);
}

function renderApplications(data) {
  applications.innerHTML = "";

  data.map((curr) => {
    const component = document.createElement("div");
    const button = document.createElement("button");

    button.addEventListener("click", () =>
      removeApplication(curr.composerFile)
    );

    component.innerHTML = `
            <h3>${curr.conf}</h3>
            <p>${curr.composerFile}</p>
            <p>Port: ${curr.port}</p>
        `;

    component.appendChild(button);
    button.innerHTML = "remove";
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

  const result = await fetch(apiURL + "/up", {
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
  fetch(apiURL + "/down", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      composerFile,
    }),
  });
}
