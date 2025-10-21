const Position = {
  TOP_LEFT: "TOP_LEFT",
  TOP_RIGHT: "TOP_RIGHT",
  BOTTOM_RIGHT: "BOTTOM_RIGHT",
  BOTTOM_LEFT: "BOTTOM_LEFT",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  TOP: "TOP",
  BOTTOM: "BOTTOM",
  CENTER: "CENTER",
};

let itemsArray = [0, 1, 2, 3, 4, 5];
let itemsAddArray = [];
let pasosRobot = [];
let caminoArrayAll = [];
let caminoArray = [];
let pasoSelect;
let itemRobot = {
  num: 0,
  pasoKey: 0,
};
let hayError = false;
let perdio = false;
let gano = false;
let bucle = false;
let start = false;
let cantidadBucle = 2;

const existePaso = (paso) => {
  if (!caminoArray) return undefined;
  return caminoArray.find((res) => res.key === paso);
};

const direccionVisual = () => {
  return itemRobot.num == 0
    ? "⬆️" // arriba
    : itemRobot.num == 1
    ? "➡️" // derecha
    : itemRobot.num == 2
    ? "⬇️" // abajo
    : "⬅️"; // izquierda
};

buscarMapas();

async function buscarMapas() {
  const res = await fetch(`/api/auth/aletorioMapa`);
  if (!res.ok) throw new Error("Mapas no encontrados");

  const camino = await res.json();

  caminoArray = camino;
  console.log(camino)
  init();
}

async function init() {
  for (let index = 0; index < itemsArray.length; index++) {
    let element =
      index === 0 ? "START" : index === itemsArray.length - 1 ? "END" : "";

    for (let indexFila = 0; indexFila < itemsArray.length; indexFila++) {
      const item = {
        key: itemsAddArray.length + 1,
        value: indexFila,
        tipo: "",
        valueMain: index,
        estatus: -1,
      };

      // Determinar tipo según posición
      if (indexFila === 0) {
        item.tipo =
          element === "START"
            ? Position.TOP_LEFT
            : element === "END"
            ? Position.BOTTOM_LEFT
            : Position.LEFT;
      } else if (indexFila === itemsArray.length - 1) {
        item.tipo =
          element === "START"
            ? Position.TOP_RIGHT
            : element === "END"
            ? Position.BOTTOM_RIGHT
            : Position.RIGHT;
      } else {
        item.tipo =
          index === 0
            ? Position.TOP
            : index === itemsArray.length - 1
            ? Position.BOTTOM
            : Position.CENTER;
      }

      itemsAddArray.push(item);
    }
  }

  const grid = document.getElementById("grid-main-game");
  grid.style.gridTemplateColumns = `repeat(${itemsArray.length}, 70px)`;

  itemsAddArray.map((res, index) => {
    const pasoItem = existePaso(res.key);
    if (pasoItem) {
      res.estatus = pasoItem.estatus;
      res.start = pasoItem.start;
      if (res.estatus == 1) {
        hayError = true;
      }
    }

    const nuevoDiv = document.createElement("div");
    nuevoDiv.classList.add("item");
    nuevoDiv.id = `item-${res.key}`;
    nuevoDiv.style.backgroundColor =
      res.estatus == -1
        ? "rgb(18, 19, 18)"
        : res.estatus == 0
        ? "rgb(12, 160, 12)"
        : "rgb(187, 17, 17)";

    // nuevoDiv.addEventListener("click", function () {
    //     eventPintarCamino(res, nuevoDiv);
    //     // console.log("CLICk", res)
    // });

    if (res.start) {
      const robotDiv = document.createElement("div");
      robotDiv.classList.add("item-robot");
      robotDiv.id = `id-robot`;
      robotDiv.textContent = direccionVisual();
      itemRobot.pasoKey = res.key;

      nuevoDiv.appendChild(robotDiv);
    }

    grid.appendChild(nuevoDiv);
  });
}

const eventPintarCamino = (res, nuevoDiv, cargar) => {
  const pasoItem = existePaso(res.key);
  pasoSelect = !pasoItem ? res : pasoItem;

  if (!pasoItem || pasoSelect.estatus == 1) {
    const estatus = validarError() ? 0 : 1;
    pasoSelect.estatus = estatus;
    nuevoDiv.style.backgroundColor =
      estatus == 0 ? "rgb(12, 160, 12)" : "rgb(187, 17, 17)";

    hayError = hayErrorPasos();
    if (!pasoItem && !cargar) {
      caminoArray.push(res);
    }
  }
};

const hayErrorPasos = () => {
  return caminoArray.some((res) => res.estatus == 1);
};

const esPasoValido = (keyMain) => {
  const length = itemsArray.length;
  if (caminoArray.length > 0 && pasoSelect.key !== keyMain) {
    if (pasoSelect.tipo === Position.CENTER) {
      return (
        pasoSelect.key + length === keyMain || // abajo
        pasoSelect.key - length === keyMain || // arriba
        pasoSelect.key + 1 === keyMain || // derecha
        pasoSelect.key - 1 === keyMain // izquierda
      );
    }

    if (pasoSelect.tipo === Position.TOP) {
      return (
        pasoSelect.key + length === keyMain || // abajo
        pasoSelect.key + 1 === keyMain || // derecha
        pasoSelect.key - 1 === keyMain // izquierda
      );
    }

    if (pasoSelect.tipo === Position.TOP_LEFT) {
      return (
        pasoSelect.key + length === keyMain || // abajo
        pasoSelect.key + 1 === keyMain // derecha
      );
    }

    if (pasoSelect.tipo === Position.TOP_RIGHT) {
      return (
        pasoSelect.key + length === keyMain || // abajo
        pasoSelect.key - 1 === keyMain // izquierda
      );
    }

    if (pasoSelect.tipo === Position.BOTTOM) {
      return (
        pasoSelect.key - length === keyMain || // arriba
        pasoSelect.key + 1 === keyMain || // derecha
        pasoSelect.key - 1 === keyMain // izquierda
      );
    }

    if (pasoSelect.tipo === Position.BOTTOM_LEFT) {
      return (
        pasoSelect.key - length === keyMain || // arriba
        pasoSelect.key + 1 === keyMain // derecha
      );
    }

    if (pasoSelect.tipo === Position.BOTTOM_RIGHT) {
      return (
        pasoSelect.key - length === keyMain || // arriba
        pasoSelect.key - 1 === keyMain // izquierda
      );
    }

    if (pasoSelect.tipo === Position.LEFT) {
      return (
        pasoSelect.key + length === keyMain || // abajo
        pasoSelect.key - length === keyMain || // arriba
        pasoSelect.key + 1 === keyMain // derecha
      );
    }

    if (pasoSelect.tipo === Position.RIGHT) {
      return (
        pasoSelect.key + length === keyMain || // abajo
        pasoSelect.key - length === keyMain || // arriba
        pasoSelect.key - 1 === keyMain // izquierda
      );
    }

    return false;
  }
  return false;
};

const validarError = () => {
  if (caminoArray.length <= 0) return true;
  for (const res of caminoArray) {
    if (esPasoValido(res.key) && res.estatus === 0) {
      return true;
    }
  }
  return false;
};

OnClick = () => {
  console.log(caminoArray, " ", hayError);
};

agregarPaso = (direccion) => {
  pasosRobot.push(direccion);
  console.log(direccion);
  const dir = document.getElementById("idData-game");
  const divMain = document.createElement("div");

  let color =
    direccion === "ace"
      ? "rgb(61, 103, 167)"
      : direccion === "izq"
      ? "rgb(183, 214, 44)"
      : direccion === "der"
      ? "rgb(194, 133, 53)"
      : "rgb(69, 67, 87)";

  let texto =
    direccion === "ace"
      ? "Adelante"
      : direccion === "izq"
      ? "Izquierda"
      : direccion === "der"
      ? "Derecha"
      : direccion === "buc"
      ? "Inicio Bucle"
      : "Finaliza Bucle Bucle";

  let margin = bucle ? "50px" : "0px";

  divMain.innerHTML = `
       <div class="icon-text">
            <div class="btn-Acccion" style="background-color: ${color}; margin-left:${margin};">
            ${svgButton(direccion)}
                
            </div>
            <p>${texto}</p>
        </div>
    `;

  dir.appendChild(divMain);
};

svgButton = (direccion) => {
  if (direccion === "ace") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                    d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" />
                </svg>`;
  } else if (direccion === "izq") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z"/></svg>
           `;
  } else if (direccion === "der") {
    return ` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z"/></svg>
            `;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"/></svg>
            `;
  }
};

OnButtonAccion = (direccion) => {
  if ((direccion === "buc" && bucle) || perdio) {
    return;
  }
  if (bucle) {
    agregarPaso(direccion);
    bucle = false;
    agregarPaso("buc-end");
  } else {
    agregarPaso(direccion);
  }

  if (direccion === "buc") {
    bucle = true;
  }

  //instruccionesRobot(direccion);
};

const direccionMo = () => {
  const length = itemsArray.length;
  return itemRobot.num == 0
    ? itemRobot.pasoKey - length // arriba
    : itemRobot.num == 1
    ? itemRobot.pasoKey + 1 // derecha
    : itemRobot.num == 2
    ? itemRobot.pasoKey + length // abajo
    : itemRobot.pasoKey - 1; // izquierda
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function empezarCamino() {
  if (bucle) return;
  let bucl = 1;
  start = true;
  for (const direccion of pasosRobot) {
    if (direccion !== "buc") {
      for (let index = 0; index < bucl; index++) {
        instruccionesRobot(direccion);
        await delay(500);
      }
      bucl = 1;
    } else {
      bucl = cantidadBucle;
    }
  }
}

function instruccionesRobot(direccion) {
  if (perdio || gano) return;
  console.log(direccion);

  const start = itemRobot.direccion;
  const robotDiv = document.getElementById("id-robot");

  let num = 0;
  if (direccion === "izq") {
    num = itemRobot.num === 0 ? 4 : itemRobot.num;

    if (num > 0) num--;
    itemRobot.num = num;
    robotDiv.textContent = direccionVisual();
  } else if (direccion === "der") {
    num = itemRobot.num === 3 ? -1 : itemRobot.num;
    if (num < 4) num++;
    itemRobot.num = num;
    robotDiv.textContent = direccionVisual();
  } else if (direccion === "ace") {
    const divElementAntes = document.getElementById(
      `item-${itemRobot.pasoKey}`
    );
    const pasoSiguiente = direccionMo();
    const camino = caminoArray.find((res) => res.key === pasoSiguiente);

    const length = itemsAddArray.length;
    if (pasoSiguiente > 0 && pasoSiguiente <= length && !perdio) {
      const ganador = caminoArray[caminoArray.length - 1];
      const divElementSiguiente = document.getElementById(
        `item-${pasoSiguiente}`
      );

      if (!camino) {
        console.log("PERDIO");
        divElementSiguiente.style.backgroundColor = "rgb(187, 17, 17)";
      }

      const robotAce = document.createElement("div");
      robotAce.classList.add("item-robot");
      robotAce.id = `id-robot`;
      robotAce.textContent = direccionVisual();

      itemRobot.pasoKey = pasoSiguiente;

      divElementAntes.removeChild(robotDiv);
      divElementSiguiente.appendChild(robotAce);

      if (ganador.key === pasoSiguiente) {
        console.log("GANO");
        divElementSiguiente.style.backgroundColor = "rgba(11, 137, 175, 1)";
        gano = true;
        alert("¡Felicitaciones, misión cumplida!🚀");
      }

      perdio = !camino;
      if (perdio) {
        setTimeout(() => {
          alert("Intentalo de nuevo🚀");
        }, 200);
      }
    }
  }
}

async function reiniciar() {
  if (pasosRobot.length <= 0) return;
  pasosRobot = [];
  bucle = false;

  gano = false;
  hayError = false;
  const dir = document.getElementById("idData-game");
  dir.replaceChildren();

  let res = itemsAddArray.find((res) => res.start);

  if (res) {
    const robotDiv = document.getElementById("id-robot");
    const divElementAntes = document.getElementById(
      `item-${itemRobot.pasoKey}`
    );
    divElementAntes.removeChild(robotDiv);

    itemRobot.pasoKey = res.key;
    itemRobot.num = 0;
    const divElementSiguiente = document.getElementById(
      `item-${itemRobot.pasoKey}`
    );

    if (start && perdio) {
      divElementAntes.style.backgroundColor = "rgb(18, 19, 18)";
      res.status = -1;
    }

    const robotAce = document.createElement("div");
    robotAce.classList.add("item-robot");
    robotAce.id = `id-robot`;
    robotAce.textContent = direccionVisual();
    divElementSiguiente.appendChild(robotAce);
  }
  start = false;
  perdio = false;
}
