const token = localStorage.getItem("token");

let usuarios = [];
let usuarioSelect = null;
const usuario = obtenerSubDelToken();

document.getElementById("id-title").textContent = `Bienvenido ${usuario.sub}`;

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

validarToken().then((isValid) => {
  if (!isValid) {
    window.location.href = "/login";
  } else {
    listarUsuarios();
  }
});

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
    localStorage.setItem("token", '');
    return false;
  }
}

// Función para listar usuarios
async function listarUsuarios() {
  try {
    const res = await fetch("/api/usuarios", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    usuarios = await res.json();
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = "";
    usuarios.forEach((u) => {
      const tr = document.createElement("tr");

      if (usuario.sub === u.correo) {
        tr.innerHTML = `
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.rol}</td>
                <td>
                    <button onclick="actualizarUsuario(${u.idUsuario})"
                        style="background-color: #22577aff; color: white; border: none; padding: 4px 8px; cursor: pointer;">
                        Actualizar
                    </button>
                    <button onclick="actualizarPassword(${u.idUsuario})" id="openModalBtn"
                        style="background-color: #1f4b68ff; color: white; border: none; padding: 4px 8px; cursor: pointer;">
                        Actualizar Contraseña
                    </button>
                </td>
            `;
      } else {
        tr.innerHTML = `
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.rol}</td>
                <td>
                    <button onclick="actualizarUsuario(${u.idUsuario})"
                        style="background-color: #22577aff; color: white; border: none; padding: 4px 8px; cursor: pointer;">
                        Actualizar
                    </button>
                    <button onclick="eliminarUsuario(${u.idUsuario})"
                        style="background-color: #e74c3c; color: white; border: none; padding: 4px 8px; cursor: pointer;">
                        Eliminar
                    </button>
                </td>
            `;
      }

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error al listar usuarios:", err);
  }
}

onClikcCrearUser = async () => {
  if (validarVacios()) {
    return;
  }
  const usuario = {
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    password: document.getElementById("password").value,
    rol: document.getElementById("rol").value,
  };

  const mensaje = document.getElementById("mensaje");

  if (usuarioSelect) {
    try {
      const res = await fetch(`/api/usuarios/${usuarioSelect.idUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(usuario),
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Error: " + text);
      } else {
        alert("Usuario actualizado correctamente");
        listarUsuarios(); // refresca tabla
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
    limpiar();
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    const data = await res.text();
    if (!res.ok) {
      mensaje.className = "alert error";
      mensaje.textContent = data;
    } else {
      mensaje.className = "alert success";
      mensaje.textContent = data;
      document.getElementById("nombre").value = "";
      document.getElementById("correo").value = "";
      document.getElementById("password").value = "";
      listarUsuarios(); // refrescar tabla
    }

    mensaje.style.display = "block";
    setTimeout(() => {
      mensaje.style.display = "none";
    }, 3000);
  } catch (err) {
    console.error("Error al crear usuario:", err);
  }
};

function limpiar() {
  document.getElementById("nombre").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("password").value = "";
  document.getElementById("password").disabled = false;
  document.getElementById("rol").disabled = false;
  document.getElementById("rol").value = "ADMIN";

  document.getElementById("btnCrear").textContent = "Crear Usuario";
  usuarioSelect = null;
}

function validarVacios() {
  if (
    document.getElementById("nombre").value === "" &&
    document.getElementById("correo").value === "" &&
    document.getElementById("password").value === ""
  ) {
    alert("Faltan Datos ");
    return true;
  }
  return false;
}

async function actualizarUsuario(userId) {
  limpiar();
  const user = usuarios.find((res) => res.idUsuario === userId);

  document.getElementById("nombre").value = user.nombre;
  document.getElementById("correo").value = user.correo;
  document.getElementById("password").value = user.password;
  document.getElementById("password").disabled = true;
  document.getElementById("rol").value = user.rol;
  document.getElementById("btnCrear").textContent = "Actualizar";
  if (user.correo === usuario.sub) {
    document.getElementById("rol").disabled = true;
  }

  usuarioSelect = user;
  return;
}

async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

  try {
    const res = await fetch(`/api/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      alert("Error: " + text);
      console.error("Error al eliminar usuario:", text);
    } else {
      alert("Usuario eliminado correctamente");
      listarUsuarios(); // refrescar tabla
    }
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
  }
}

onClickLoggout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};


const modal = document.getElementById('passwordModal');
actualizarPassword = () => {
  modal.style.display = 'block'
}

closeModalBtn = () => {
  modal.style.display = 'none'
}

// Actualizar contraseña
window.onclick = e => { if(e.target===modal) modal.style.display='none'; }

// Actualizar contraseña (estilo fetch DELETE)
document.getElementById('updatePasswordBtn').addEventListener('click', async () => {
    const password = document.getElementById('passwordOld');
    const passwordChange = document.getElementById('passwordChange');

    if (!password.value || !passwordChange.value) {
        alert("Todos los campos son obligatorios");
        return;
    }

    if(!confirm("¿Seguro que deseas cambiar la contraseña?")) return;

    try {
        const res = await fetch(`/api/usuarios/updatePassword/${encodeURIComponent(usuario.sub)}/${encodeURIComponent(password.value)}/${encodeURIComponent(passwordChange.value)}`, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
        });

        if (!res.ok) {
            const text = await res.text();
            alert("Error: " + text);
            console.error("Error al actualizar contraseña:", text);
        } else {
            alert("Contraseña actualizada correctamente");
            modal.style.display = 'none';
            password.value = "";
            passwordChange.value = "";
        }
    } catch (err) {
        console.error("Error al actualizar contraseña:", err.error);
        alert("Error de conexión con el servidor");
    }
});