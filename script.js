import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ==========================================
// 1. CONFIGURACIÓN DE FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyC4q-0JiUoZuR9bjGK62Y7j3nFG-g8bCkU",
  authDomain: "calendario-urbelania.firebaseapp.com",
  databaseURL: "https://calendario-urbelania-default-rtdb.firebaseio.com", // <-- Añadida para que funcione Realtime Database
  projectId: "calendario-urbelania",
  storageBucket: "calendario-urbelania.firebasestorage.app",
  messagingSenderId: "543321584707",
  appId: "1:543321584707:web:84c4da88004ba5c4ca50f6",
  measurementId: "G-REJQ1C708H"
};

// Inicializar Firebase y la Base de Datos
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tareasRef = ref(db, 'calendario/tareas_urbelania');

// ==========================================
// 2. VARIABLES Y ELEMENTOS DEL DOM
// ==========================================
const monthYear = document.getElementById('monthYear');
const daysContainer = document.getElementById('daysContainer');
const selectedDateText = document.getElementById('selectedDateText');
const taskList = document.getElementById('taskList');

const subjectInput = document.getElementById('subjectInput');
const categoryInput = document.getElementById('categoryInput');
const timeInput = document.getElementById('timeInput');
const endTimeInput = document.getElementById('endTimeInput');
const endTimeContainer = document.getElementById('endTimeContainer');
const descInput = document.getElementById('descInput');
const addTaskBtn = document.getElementById('addTaskBtn');

let currentDate = new Date();
let selectedDate = null;
let tasks = {};

// Diccionarios de colores y estilos
const categoryToDotClass = {
    "Clase en directo": "cat-clase",
    "Actividad": "cat-actividad",
    "Examen": "cat-examen",
    "Foro": "cat-foro",
    "Lectura": "cat-lectura"
};

const categoryToCardClass = {
    "Clase en directo": "Clase",
    "Actividad": "Actividad",
    "Examen": "Examen",
    "Foro": "Foro",
    "Lectura": "Lectura"
};

// ==========================================
// 3. CONEXIÓN EN TIEMPO REAL CON FIREBASE
// ==========================================
// Escuchar cambios: Si Juan agrega algo, esto actualiza tu pantalla automáticamente
onValue(tareasRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        tasks = data;
    } else {
        tasks = {};
    }
    renderCalendar();
    renderTasks();
});

// Guardar cambios en la nube
function saveToFirebase() {
    set(tareasRef, tasks).catch(error => console.error("Error guardando en Firebase:", error));
}

// ==========================================
// 4. LÓGICA DE LA INTERFAZ
// ==========================================

// Mostrar/Ocultar hora de fin si es "Clase en directo"
categoryInput.addEventListener('change', (e) => {
    if (e.target.value === 'Clase en directo') {
        endTimeContainer.style.display = 'flex';
    } else {
        endTimeContainer.style.display = 'none';
        endTimeInput.value = ''; 
    }
});

// Dibuja el calendario del mes actual
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthYear.textContent = `${monthNames[month]} ${year}`;
    daysContainer.innerHTML = '';

    // Espacios vacíos antes del primer día
    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    // Dibujar los días del mes
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = i;
        dayDiv.appendChild(dayNumber);
        
        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(i).padStart(2, '0');
        const dateString = `${year}-${monthStr}-${dayStr}`;
        
        if (selectedDate === dateString) {
            dayDiv.classList.add('selected');
        }

        // Si hay tareas ese día, poner las etiquetas visuales
        if (tasks[dateString] && tasks[dateString].length > 0) {
            tasks[dateString].forEach(task => {
                const pill = document.createElement('div');
                pill.classList.add('event-pill');
                pill.classList.add(categoryToDotClass[task.categoria] || 'cat-actividad');
                
                if (task.estado === 'Completado') {
                    pill.classList.add('completed');
                }
                
                const timeStr = task.hora ? `${task.hora} - ` : '';
                pill.textContent = `${timeStr}${task.categoria}`;
                
                dayDiv.appendChild(pill);
            });
        }

        // Seleccionar un día para ver su detalle
        dayDiv.addEventListener('click', () => {
            selectedDate = dateString;
            selectedDateText.textContent = `Detalle para el ${i} de ${monthNames[month]}`;
            renderCalendar();
            renderTasks();
        });
        daysContainer.appendChild(dayDiv);
    }
}

// Dibuja las tarjetas de actividades en el panel derecho
function renderTasks() {
    taskList.innerHTML = '';
    
    if (!selectedDate) {
         taskList.innerHTML = '<p style="text-align:center; color:#94a3b8; font-style:italic;">Selecciona una fecha para ver sus actividades.</p>';
         return;
    }
    if (!tasks[selectedDate] || tasks[selectedDate].length === 0) {
         taskList.innerHTML = '<p style="text-align:center; color:#94a3b8; font-style:italic;">No hay actividades registradas para este día.</p>';
         return;
    }

    // Ordenar cronológicamente
    const sortedTasks = [...tasks[selectedDate]].sort((a, b) => {
        if (!a.hora) return 1;
        if (!b.hora) return -1;
        return a.hora.localeCompare(b.hora);
    });

    sortedTasks.forEach((task) => {
        const originalIndex = tasks[selectedDate].indexOf(task);
        
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.classList.add(categoryToCardClass[task.categoria] || 'Actividad'); 

        const statusClass = task.estado === 'Completado' ? 'status-completado' : 'status-pendiente';
        const statusIcon = task.estado === 'Completado' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-regular fa-circle"></i>';
        
        // Armar el texto de la hora
        let horaVisual = '';
        if (task.hora && task.horaFin) {
            horaVisual = `<strong><i class="fa-regular fa-clock"></i> ${task.hora} a ${task.horaFin}</strong> - `;
        } else if (task.hora) {
            horaVisual = `<strong><i class="fa-regular fa-clock"></i> ${task.hora}</strong> - `;
        }

        card.innerHTML = `
            <div class="task-header">
                <span class="task-subject">${horaVisual}${task.asignatura}</span>
                <span class="task-category">${task.categoria}</span>
            </div>
            <div class="task-desc">${task.descripcion || 'Sin descripción'}</div>
            <div class="task-actions">
                <div class="status-toggle ${statusClass}" onclick="window.toggleStatus('${selectedDate}', ${originalIndex})">
                    ${statusIcon} ${task.estado}
                </div>
                <button class="delete-btn" onclick="window.deleteTask('${selectedDate}', ${originalIndex})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        taskList.appendChild(card);
    });
}

// ==========================================
// 5. ACCIONES (Guardar, Eliminar, Completar)
// ==========================================

// Funciones globales (window) necesarias para que funcionen desde el HTML generado dinámicamente
window.toggleStatus = function(date, index) {
    if (tasks[date][index].estado === 'Pendiente') {
        tasks[date][index].estado = 'Completado';
    } else {
        tasks[date][index].estado = 'Pendiente';
    }
    saveToFirebase();
}

window.deleteTask = function(date, index) {
    if(confirm('¿Estás seguro de eliminar esta actividad?')) {
        tasks[date].splice(index, 1);
        saveToFirebase();
    }
}

// Agregar nueva tarea
addTaskBtn.addEventListener('click', () => {
    if (!selectedDate) {
        alert('Por favor selecciona un día en el calendario primero.');
        return;
    }
    
    const asignatura = subjectInput.value;
    const categoria = categoryInput.value;
    const hora = timeInput.value;
    const horaFin = endTimeInput.value;
    const descripcion = descInput.value.trim();

    if (!asignatura || !categoria) {
        alert('La Asignatura y la Categoría son obligatorias.');
        return;
    }

    if (!tasks[selectedDate]) tasks[selectedDate] = [];
    
    tasks[selectedDate].push({
        asignatura: asignatura,
        categoria: categoria,
        hora: hora,
        horaFin: horaFin,
        descripcion: descripcion,
        estado: 'Pendiente' 
    });

    // Limpiar campos del formulario
    subjectInput.value = '';
    categoryInput.value = '';
    timeInput.value = '';
    endTimeInput.value = '';
    endTimeContainer.style.display = 'none';
    descInput.value = '';

    saveToFirebase();
});

// Navegación entre meses
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Iniciar interfaz
renderCalendar();