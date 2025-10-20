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

const Direccion = {
  NORTE: "N",
  SUR: "S",
  ESTE: "E",
  OESTE: "O",
};

let itemsArray = [0, 1, 2, 3, 4, 5];
let itemsAddArray = []; //para instrucciones de pasos
let caminoArray = []; // camino pintado
let caminoArraysMapas = []; //array de informacion
let mapasArray = [];
let pasoSelect;
let itemRobot = {
  num: 0,
  pasoKey: 0,
};
let hayError = false;
let selectMapa = "";
let selectDataMapa = null;

const existePaso = (paso) => {
  return caminoArray.find((res) => res.key === paso);
};

async function pasosMapa(idmapa) {
  const res = await fetch(`/api/mapas/${idmapa}/detalles`);
  if (!res.ok) throw new Error("Error obteniendo pasos del mapa");
  const pasosMapa = await res.json();
  caminoArraysMapas.push({ idMapa: idmapa, lista: pasosMapa });
}

buscarMapas();

async function buscarMapas() {
  const res = await fetch(`/api/mapas`);
  if (!res.ok) throw new Error("Mapas no encontrados");

  mapasArray = await res.json();

  // Esperar a que terminen todos los pasos
  await Promise.all(mapasArray.map((mapa) => pasosMapa(mapa.idMapa)));

  console.log("Todos los mapas cargados:", mapasArray);
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
        start: false,
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

  const grid = document.getElementById("grid-main");
  grid.style.gridTemplateColumns = `repeat(${itemsArray.length}, 70px)`;

  itemsAddArray.map((res, index) => {
    res.start = index === 0;
    const pasoItem = existePaso(res.key);
    console.log(pasoItem);
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

    nuevoDiv.addEventListener("click", function () {
      eventPintarCamino(res, nuevoDiv);
      // console.log("CLICK: ", caminoArraysMapas);
    });

    grid.appendChild(nuevoDiv);
  });

  accionMenuLateral();
}

function accionMenuLateral() {
  //Manejo Menu Lateral
  const lateral = document.getElementById("idData-game");
  mapasArray?.map((mapa, index) => {
    //const mapa = mapasArray.find(res => mapa.idMapa == resAll.idMapa);
    const p = document.createElement("p");
    p.id = `item${mapa.idMapa}`;
    p.textContent = mapa?.nombreMapa;

    if (selectMapa === p.id) {
      p.classList.add("select-item");
    }
    console.log("ARRAY: ", caminoArraysMapas)

    p.addEventListener("click", function () {
      if (selectMapa === p.id) {
        limpiar(true);
        return;
      }
      selectMapa = p.id;
      selectDataMapa = mapa;
      const btnGuardar = document.getElementById("guardarId");
      btnGuardar.textContent = selectMapa ? "Actualizar" : "Guardar";

      const input = document.getElementById("input-tipo");
      const titulo = document.getElementById("titulo-tipo");
      input.value = mapa?.nombreMapa || "";
      titulo.textContent = !selectMapa ? "Agregar Nuevo" : "Actualizar Mapa";

      limpiar(false);
      const resAll = caminoArraysMapas.find((res) => res.idMapa == mapa.idMapa);
      console.log(caminoArraysMapas);
      resAll.lista.map((res) => {
        const nuevoDiv = document.getElementById(`item-${res.key}`);
        if (nuevoDiv) {
          nuevoDiv.style.backgroundColor =
            res.estatus == -1
              ? "rgb(18, 19, 18)"
              : res.estatus == 0
              ? "rgb(12, 160, 12)"
              : "rgb(187, 17, 17)";
          eventPintarCamino(res, nuevoDiv);
        }
      });
      p.style.backgroundColor = "rgb(12, 160, 12)";
    });
    lateral.appendChild(p);
  });
}

const eventPintarCamino = (res, nuevoDiv, cargar) => {
  if (caminoArray.length == 0) {
    res.start = true;
  }
  const pasoItem = existePaso(res.key);
  pasoSelect = !pasoItem ? res : pasoItem;

  const estatus = validarError() ? 0 : 1;
  if (!pasoItem || pasoSelect.estatus == 1) {
    pasoSelect.estatus = estatus;
    res.estatus = estatus;
    const resAll = caminoArraysMapas.find(
      (res) => res.idMapa == selectDataMapa?.idMapa
    );
    // if (resAll) {
    //   resAll.lista = caminoArray;
    //   console.log("LISTA:",resAll.lista)
    // }
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

Onclick = () => {
  console.log(caminoArray, " ", hayError);
};

OnButtonAccion = (direccion) => {
  console.log(direccion);
  const start = itemRobot.direccion;
  const robotDiv = document.getElementById("id-robot");

  let num = 0;
  if (direccion === "izq") {
    num = itemRobot.num === 0 ? 4 : itemRobot.num;

    if (num > 0) {
      num--;
    }
    itemRobot.num = num;
    robotDiv.textContent = itemRobot.num;
  } else if (direccion === "der") {
    num = itemRobot.num === 3 ? -1 : itemRobot.num;
    if (num < 4) {
      num++;
    }
    itemRobot.num = num;
    robotDiv.textContent = itemRobot.num;
  } else if (direccion === "ace") {
    const divElementAntes = document.getElementById(
      `item-${itemRobot.pasoKey}`
    );

    const pasoSiguiente = direccionMo();
    console.log(itemRobot.pasoKey);
    console.log(pasoSiguiente);

    if (pasoSiguiente > 0 && pasoSiguiente <= itemsArray.length) {
      const divElementSiguiente = document.getElementById(
        `item-${pasoSiguiente}`
      );
      const robotAce = document.createElement("div");
      robotAce.classList.add("item-robot");
      robotAce.id = `id-robot`;
      robotAce.textContent = itemRobot.num;

      itemRobot.pasoKey = pasoSiguiente;
      divElementAntes.removeChild(robotDiv);
      divElementSiguiente.appendChild(robotAce);
    }
  }
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

OnClickPint = () => {
  if (caminoArray.length > 0) {
    console.log(caminoArray);
    // const caminoFind = localStorage.getItem("caminos");
    //caminoArrayAll = caminoFind ? JSON.parse(caminoFind) : [];
    const input = document.getElementById("input-tipo");
    if (!input.value) {
      alert("Falta Nombre");
      return;
    }

    let data = {
      mapa: {
        idMapa: null,
        nombreMapa: input.value || "",
      },
      detalles: caminoArray,
    };

    if (selectMapa) {
      data.mapa.idMapa = selectDataMapa?.idMapa;
      selectDataMapa.nombreMapa = input.value;
      const resAll = caminoArraysMapas.find(
        (res) => res.idMapa == selectDataMapa?.idMapa
      );
      resAll.lista = caminoArray;
      // const num = selectMapa.replace("item", "");
      // caminoArrayAll[num - 1] = caminoArray;
    }
    //else {
    //   caminoArrayAll.push(caminoArray,selectMapa);
    // }
    guardarMapa(data);
    //localStorage.setItem("caminos", JSON.stringify(caminoArrayAll));
  } else {
    alert("No hay Camino");
  }
};

async function guardarMapa(data) {
  const res = await fetch("/api/mapas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error guardando el mapa");
  if (data.mapa.idMapa) {
    alert("Se Actualizo correctamente");
  } else {
    const newMapa = await res.json();
    console.log(newMapa);

    mapasArray.push(newMapa);
    caminoArraysMapas.push({ idMapa: newMapa.idMapa, lista: caminoArray });
    alert("Se Guardo correctamente");
  }

  limpiar(true);
}

async function eliminarMapa(id) {
  if (!confirm("¿Seguro que deseas eliminar este mapa?")) return;

  const res = await fetch(`/api/mapas/${id}`, { method: "DELETE" });

  if (!res.ok) {
    alert("Ocurrió un error al eliminar el mapa");
    return;
  }

  alert("Mapa eliminado correctamente");
}

limpiar = (todo) => {
  if (todo) {
    selectMapa = "";
    const btnGuardar = document.getElementById("guardarId");
    btnGuardar.textContent = selectMapa ? "Actualizar" : "Guardar";
    selectDataMapa = null;
    const input = document.getElementById("input-tipo");
    input.value = "";
    const titulo = document.getElementById("titulo-tipo");
    titulo.textContent = "Agregar Nuevo";
  }

  const grid = document.getElementById("grid-main");
  grid.replaceChildren();
  caminoArray = [];
  itemsAddArray = [];
  const lateral = document.getElementById("idData-game");
  lateral.replaceChildren();
  init();
};
