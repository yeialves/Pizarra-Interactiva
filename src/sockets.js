module.exports = io => { //exportando el objeto io
  // Almacena el historial de trazos realizados en la aplicación.
  let line_history = []; 

  io.on('connection', socket => {
    // Manejar el evento de dibujo
    socket.on('draw_line', data => {
      // Agrega el trazo actual al historial de trazos.
      line_history.push(data.line); 
      // Emite el trazo a todos los clientes, incluido el remitente.
      io.emit('draw_line', { line: data.line }); 
    });

    // Envia todos los trazos al cliente que se conecta
    line_history.forEach(line => {
      // Envia el historial de trazos al cliente recién conectado.
      socket.emit('draw_line', { line: line }); 
    });
  });
};
