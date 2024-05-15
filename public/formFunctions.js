import sweetalert2 from "https://cdn.jsdelivr.net/npm/sweetalert2@11.10.8/+esm";

export async function submitForm(id, url) {
  sweetalert2.fire({
    title: "Carregando ...",
    didOpen: () => {
      sweetalert2.showLoading();
    },
    allowOutsideClick: () => !Swal.isLoading(),
    showCancelButton: true,
  });

  const form = document.getElementById(id);
  // TO-DO radios
  const radios = form.querySelectorAll("[type='radio'");
  const checkboxes = form.querySelectorAll("[type='checkbox']");

  const formData = new FormData(form);

  // TO-DO radios
  radios.forEach((radio) => formData.append(radio.name, radio.value));

  checkboxes.forEach((checkbox) => {
    formData.append(checkbox.name, checkbox.checked);
  });

  const config = {
    method: "POST",
    body: formData,
  };

  try {
    const response = await fetch(url, config);
    return await response.json();
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function handleResponse(response, callback) {
  const result = await sweetalert2.fire({
    icon: response.success ? "success" : "error",
    text: response.message,
  });

  if (response.success && result.isConfirmed && callback) {
    callback(response);
  }
}

export function createPhotoPicker(parentId, imgPath, config = {}) {
  const parentNode = document.getElementById(parentId);
  const photoPicker = document.createElement("div");
  photoPicker.style.width = "fit-content";

  photoPicker.innerHTML = `
    <div class="photo-picker" style="
      position: relative;
      width: ${config.width || "100px"};
      height: ${config.height || "100px"};
      border-radius: ${config.borderRadius || "9999px"};
      cursor: pointer;
      overflow: hidden;

      box-shadow: 0 0 8px 1px gray;
    ">
      <img src=${imgPath} style="
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      ">

      <div class="overlay" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        visibility: hidden;
        background-color: rgba(0, 0, 0, 0.5);
      ">
        <p style="
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
        color: white;
        text-align: center;
        ">${config.hoverText || "Trocar foto de perfil"}</p>
      </div>
      <input name=${
        config.name || "profile-pricture"
      } type="file" style="display: none">
    </div>
  `;

  const input = photoPicker.querySelector("input");
  const img = photoPicker.querySelector("img");
  const overlay = photoPicker.querySelector(".overlay");

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    img.src = URL.createObjectURL(file);
  });

  photoPicker.addEventListener("click", () => input.click());

  photoPicker.addEventListener(
    "mouseover",
    () => (overlay.style.visibility = "visible")
  );
  photoPicker.addEventListener(
    "mouseout",
    () => (overlay.style.visibility = "hidden")
  );

  parentNode.appendChild(photoPicker);
}
