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

let itemsArray = 6;
let itemsAddArray = []; //para instrucciones de pasos
let caminoArray = []; // camino pintado
let mapas = []; //array de informacion
let pasoSelect;
let itemRobot = {
  num: 0,
  pasoKey: 0,
};
let hayError = false;
let selectMapa = "";
let selectDataMapa = null;
const token = localStorage.getItem("token");

const existePaso = (paso) => {
  return caminoArray.find((res) => res.key === paso);
};
validarToken().then((isValid) => {
  if (!isValid) {
    window.location.href = "/login";
  } else {
    const user = obtenerSubDelToken();
    if (user.rol === "USER") {
      document.getElementById("btn-admin").style.display = "none";
    }
    document.getElementById("id-title").textContent = `Bienvenido ${user.sub}`;
    buscarMapas();
  }
});

async function buscarMapas() {
  const res = await fetch(`/api/mapas`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!res.ok) throw new Error("Mapas no encontrados");

  mapas = await res.json();

  console.log("Todos los mapas cargados:", mapas);
  init();
}

async function buscarMapaById(idMapa) {
  const res = await fetch(`/api/mapas/detalles/${idMapa}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!res.ok) throw new Error("Mapas no encontrados");
  const caminSelect = await res.json();

  console.log(caminSelect);

  caminoArray = caminSelect.detalles;
}

async function init() {
  for (let index = 0; index < itemsArray; index++) {
    let element = index === 0 ? "START" : index === itemsArray - 1 ? "END" : "";

    for (let indexFila = 0; indexFila < itemsArray; indexFila++) {
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
      } else if (indexFila === itemsArray - 1) {
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
            : index === itemsArray - 1
            ? Position.BOTTOM
            : Position.CENTER;
      }

      itemsAddArray.push(item);
    }
  }

  const grid = document.getElementById("grid-main");
  grid.style.gridTemplateColumns = `repeat(${itemsArray}, 70px)`;

  itemsAddArray.forEach((res, index) => {
    res.start = index === 0;
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

    nuevoDiv.addEventListener("click", function () {
      eventPintarCamino(res, nuevoDiv);
    });

    grid.appendChild(nuevoDiv);
  });

  accionMenuLateral();
}

async function validarToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No hay token guardado");
    return false;
  }

  const params = new URLSearchParams();
  params.append("token", token);

  try {
    const response = await fetch("/api/auth/validar-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(error);
      return false;
    }

    const data = await response.text();
    console.log(data); // "Token válido"
    return true;
  } catch (err) {
    console.error("Error al validar token:", err);
    return false;
  }
}

function eventPintarCamino(res, nuevoDiv, cargar) {
  if (caminoArray.length == 0) {
    res.start = true;
  }
  const pasoItem = existePaso(res.key);
  pasoSelect = !pasoItem ? res : pasoItem;

  const estatus = validarError() ? 0 : 1;
  if (!pasoItem || pasoSelect.estatus == 1) {
    pasoSelect.estatus = estatus;
    res.estatus = estatus;
    nuevoDiv.style.backgroundColor =
      estatus == 0 ? "rgb(12, 160, 12)" : "rgb(187, 17, 17)";

    hayError = hayErrorPasos();
    if (!pasoItem && !cargar) {
      caminoArray.push(res);
    }
  }
}

const hayErrorPasos = () => {
  return caminoArray.some((res) => res.estatus == 1);
};

function esPasoValido(keyMain) {
  const length = itemsArray;
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
}

function validarError() {
  if (caminoArray.length <= 0) return true;
  for (const res of caminoArray) {
    if (esPasoValido(res.key) && res.estatus === 0) {
      return true;
    }
  }
  return false;
}

const direccionMo = () => {
  const length = itemsArray;
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
    const input = document.getElementById("input-tipo");
    if (!input.value) {
      alert("Falta Nombre");
      return;
    }

    const hayError = caminoArray.some((res) => res.estatus === 1);
    if (hayError) {
      alert("Solucione los errores, antes de continuar");
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

      const mapa = mapas.find((res) => res.idMapa === selectDataMapa?.idMapa);
      mapa.nombreMapa = input.value;
    }

    guardarMapa(data);
  } else {
    alert("No hay Camino");
  }
};

function obtenerSubDelToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadBase64Standard = payloadBase64
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payloadJson = JSON.parse(atob(payloadBase64Standard));
    return payloadJson || null;
  } catch (err) {
    console.error("Error al decodificar el token:", err);
    return null;
  }
}

async function guardarMapa(data) {
  const usuario = obtenerSubDelToken().sub;
  const res = await fetch(`/api/mapas/${usuario}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error guardando el mapa");
  if (data.mapa.idMapa) {
    alert("Se Actualizo correctamente");
  } else {
    const newMapa = await res.json();

    mapas.push(newMapa);

    alert("Se Guardo correctamente");
  }

  limpiar(true);
}

async function limpiar(todo) {
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
}

function accionMenuLateral() {
  // Manejo del menú lateral
  const lateral = document.getElementById("idData-game");
  lateral.replaceChildren();

  mapas?.forEach((mapa, index) => {
    const contenedor = document.createElement("div");
    contenedor.id = `contenedor-${mapa.idMapa}`;
    contenedor.classList.add("item-mapa-lateral");

    const p = document.createElement("p");
    p.id = `item${mapa.idMapa}`;
    p.textContent = mapa?.nombreMapa;
    if (selectMapa === contenedor.id) contenedor.classList.add("select-item");

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener("click", async (ev) => {
      ev.stopPropagation(); // evita activar el click del mapa
      await eliminarMapa(mapa.idMapa);
    });

    contenedor.onclick = async function (ev) {
      if (selectMapa === contenedor.id) {
        limpiar(true);
        return;
      }

      selectMapa = contenedor.id;
      selectDataMapa = mapa;
      const btnGuardar = document.getElementById("guardarId");
      btnGuardar.textContent = selectMapa ? "Actualizar" : "Guardar";

      const input = document.getElementById("input-tipo");
      const titulo = document.getElementById("titulo-tipo");
      input.value = selectDataMapa?.nombreMapa || "";
      titulo.textContent = !selectMapa ? "Agregar Nuevo" : "Actualizar Mapa";

      limpiar(false);
      await buscarMapaById(mapa.idMapa);
      caminoArray.forEach((res) => {
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
    };

    contenedor.appendChild(p);
    contenedor.appendChild(btnEliminar);
    lateral.appendChild(contenedor);
  });
}

async function eliminarMapa(id) {
  if (!confirm("¿Seguro que deseas eliminar este mapa?")) return;

  try {
    const res = await fetch(`/api/mapas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) throw new Error("Error eliminando el mapa");

    mapas = mapas.filter((res) => res.idMapa !== id);

    limpiar(true);

    alert("Mapa eliminado correctamente");
  } catch (err) {
    alert("Ocurrió un error al eliminar el mapa");
    console.error(err);
  }
}

onClickLoggout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
