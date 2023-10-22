function init() {
  // Objeto para rastrear el estado del mouse
  let mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    pos_prev: false,
  };

  // Creación y configuración del canvas
  let canvasContainer = document.querySelector('.canvas-container');
  let canvas = document.createElement('canvas');
  canvasContainer.appendChild(canvas);
  let context = canvas.getContext('2d');

  // Conexión con Socket.IO para la comunicación en tiempo real
  let socket = io();

  // Establecer el ancho y alto del lienzo según el tamaño del navegador
  canvas.width = canvasContainer.clientWidth;
  canvas.height = canvasContainer.clientHeight;

  // Eventos del mouse en el lienzo para dibujar
  canvas.addEventListener('mousedown', (e) => {
    mouse.click = true;
  });

  canvas.addEventListener('mouseup', (e) => {
    mouse.click = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.pos.x = (e.clientX - rect.left) / rect.width;
    mouse.pos.y = (e.clientY - rect.top) / rect.height;
    mouse.move = true;
  });

  // Escuchar eventos "draw_line" del servidor y dibujar líneas en el lienzo
  socket.on('draw_line', data => {
    let line = data.line;
    context.beginPath();
    context.lineWidth = line.size || 2; // Usar el tamaño del pincel si está disponible
    context.globalCompositeOperation = line.erase ? 'destination-out' : 'source-over'; // Borrar si se establece erase en true
    context.moveTo(line.points[0].x * canvas.width, line.points[0].y * canvas.height);
    context.lineTo(line.points[1].x * canvas.width, line.points[1].y * canvas.height);
    context.stroke();
    context.globalCompositeOperation = 'source-over'; // Restaurar el modo de composición
  });

  // Modo de dibujo predeterminado
  let drawingMode = 'pencil';

  // Tamaño de pincel predeterminado
  let brushSize = 2;

  // Oyentes de clic en los botones de cambio de modo (pincel o borrador)
  document.getElementById('pencilButton').addEventListener('click', () => {
    drawingMode = 'pencil';
  });

  document.getElementById('eraserButton').addEventListener('click', () => {
    drawingMode = 'eraser';
  });

  // Oyente de cambio de tamaño del pincel
  document.getElementById('brushSizeInput').addEventListener('change', (e) => {
    brushSize = parseInt(e.target.value); // Convertir el valor a entero
  });

  // Función principal que se ejecuta repetidamente para sincronizar el dibujo
  function mainLoop() {
    if (mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit('draw_line', {
        line: {
          points: [mouse.pos, mouse.pos_prev],
          size: brushSize, 
          erase: drawingMode === 'eraser',
        },
      });
      mouse.move = false;
    }
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 25); // Configura una llamada recurrente para mantener la sincronización del dibujo
  }

  mainLoop(); 
}

// Esperar a que se cargue el contenido antes de ejecutar la función init
document.addEventListener('DOMContentLoaded', init);
