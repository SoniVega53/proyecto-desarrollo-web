const token = localStorage.getItem("token");

let usuarios = [];
let usuarioSelect = null;
const usuario = obtenerSubDelToken();

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
    obtenerUsuario();
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
async function obtenerUsuario() {
  try {
    const res = await fetch(`/api/usuarios/${usuario.sub}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const findUser = await res.json();
    if (!res.ok){
      alert("Usuario no encontrado");
      window.location.href = "/crear-mapa";
    }else{
      const nombre = document.getElementById('perfil-nombre');
      const correo = document.getElementById('perfil-correo');
      const rol = document.getElementById('perfil-rol');
      nombre.textContent = findUser.nombre;
      rol.textContent = findUser.rol;
      correo.textContent = findUser.correo;
      console.log(findUser)
    }

  } catch (err) {
    console.error("Error al listar usuarios:", err);
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