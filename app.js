// --- LOGIC SERIE I: INICIO DE SESIÓN ---
document.getElementById('loginForm').addEventListener('submit', async function(evento) {
    evento.preventDefault(); 
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    
    try {
        const response = await fetch('https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "Username": username, "Password": password })
        });

        if (response.ok) {
            const data = await response.json();
            let tokenObtenido = typeof data === 'string' ? data : (data.token || data.Token);
            
            localStorage.setItem('miToken', tokenObtenido);
            localStorage.setItem('miUsuario', username);
            
            alert("¡Sesión Iniciada de forma segura!");
            
            // Ocultar login y desplegar paneles operativos
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('chatSection').style.display = 'block';
            document.getElementById('viewSection').style.display = 'block';
            
            // Cargar feed de mensajes de inmediato
            document.getElementById('btnCargarMensajes').click();

        } else {
            alert("Acceso denegado. Revisa tus credenciales.");
        }
    } catch (error) { console.error(error); }
});

// --- LOGIC SERIE II: ENVÍO DE DATOS ---
document.getElementById('mensajeForm').addEventListener('submit', async function(evento) {
    evento.preventDefault();
    const contenido = document.getElementById('mensajeInput').value;
    const token = localStorage.getItem('miToken');
    const usuarioLogueado = localStorage.getItem('miUsuario');

    try {
        const response = await fetch('https://backcvbgtmdesa.azurewebsites.net/api/Mensajes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ "Cod_Sala": 0, "Login_Emisor": usuarioLogueado, "Contenido": contenido })
        });

        if (response.ok) {
            document.getElementById('mensajeInput').value = ''; 
            document.getElementById('btnCargarMensajes').click(); // Auto-refrescar feed
        } else { 
            alert("Error en la transmisión."); 
        }
    } catch (error) { console.error(error); }
});

// --- LOGIC SERIE III: FEED DE MONITOREO GLOBAL ---
document.getElementById('btnCargarMensajes').addEventListener('click', async function() {
    const urlMensajes = 'https://examenfinalprogra319328.azurewebsites.net/api/mensajes';
    const token = localStorage.getItem('miToken');
    const miUsuario = localStorage.getItem('miUsuario');
    
    try {
        const response = await fetch(urlMensajes, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const mensajes = await response.json();
            const cajaChat = document.getElementById('cajaChat');
            cajaChat.innerHTML = ''; 

            mensajes.forEach(msg => {
                const burbuja = document.createElement('div');
                burbuja.classList.add('burbuja');
                
                const emisor = msg.login_Emisor || msg.Login_Emisor || msg.emisor || 'Usuario';
                const contenido = msg.contenido || msg.Contenido || msg.mensaje || '';

                if (emisor === miUsuario) {
                    burbuja.classList.add('burbuja-mia');
                }

                burbuja.innerHTML = `
                    <div class="emisor">${emisor}</div>
                    <div class="texto-mensaje">${contenido}</div>
                `;
                cajaChat.appendChild(burbuja);
            });

            cajaChat.scrollTop = cajaChat.scrollHeight; // Auto scroll al final
        }
    } catch (error) { console.error(error); }
});