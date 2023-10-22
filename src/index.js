 // Importa el módulo Express, un framework web de Node.js.
 const express = require('express');
 // Importa el módulo HTTP de Node.js para crear un servidor HTTP.
const http = require('http'); 
// Importa el módulo Socket.IO para habilitar la comunicación en tiempo real.
const socketIO = require('socket.io'); 
// Importa el módulo Path de Node.js.
const path = require('path'); 


// Crea una instancia de la aplicación Express.
const app = express(); 
// Crea un servidor HTTP a partir de la aplicación Express.
const server = http.createServer(app); 
// Crea una instancia de Socket.IO asociada al servidor HTTP.
const io = socketIO(server); 


// Configura el puerto en el que se ejecutará el servidor, utilizando el puerto 3000 de manera predeterminada si no se proporciona un puerto a través de una variable de entorno.
app.set('port', process.env.PORT || 3000); 
 // Requiere e inicia un módulo llamado "sockets" y le pasa la instancia de Socket.IO para configurar la comunicación en tiempo real.
require('./sockets')(io);
// Configura Express para servir archivos estáticos desde la carpeta "public", utilizando la ruta absoluta construida con la ubicación actual (__dirname).
app.use(express.static(path.join(__dirname, 'public'))); 


// Inicia el servidor HTTP y lo hace escuchar en el puerto configurado.
server.listen(app.get('port'), () => { 
// Imprime un mensaje en la consola indicando el puerto en el que se ha iniciado el servidor.
  console.log('Server on port', app.get('port')); 
});


