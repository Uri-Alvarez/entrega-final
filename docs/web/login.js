document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Login temporal
  if (email === "correo@correo.com" && password === "123") {
    alert("Inicio de sesión exitoso");
    window.location.href = "dashboard.html"; // Redirigir a parte privada
  } else {
    alert("Credenciales incorrectas");
  }

  // Aquí irá la validación con Supabase:
  // supabase.auth.signInWithPassword({ email, password })
});
