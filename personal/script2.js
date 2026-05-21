import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ==========================================
// 1. CONFIGURACIÓN DE FIREBASE (Tus credenciales reales)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyC4q-0JiUoZuR9bjGK62Y7j3nFG-g8bCkU",
  authDomain: "calendario-urbelania.firebaseapp.com",
  databaseURL: "https://calendario-urbelania-default-rtdb.firebaseio.com",
  projectId: "calendario-urbelania",
  storageBucket: "calendario-urbelania.firebasestorage.app",
  messagingSenderId: "543321584707",
  appId: "1:543321584707:web:84c4da88004ba5c4ca50f6",
  measurementId: "G-REJQ1C708H"
};

// Inicializar Firebase en la subcarpeta 'tareas_personales'
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tareasRef = ref(db, 'calendario/tareas_personales'); // <-- Carpeta separada e invisible

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

// Diccionarios adaptados a tu espacio personal
const categoryToDotClass = {
    "Trabajo": "cat-trabajo",
    "Estudio": "cat-estudio",
    "Personal": "cat-personal",
    "Hogar": "cat-hogar",
    "Otra": "cat-otra"
};

const categoryToCardClass = {
    "Trabajo": "Trabajo",
    "Estudio": "Estudio",
    "Personal": "Personal",
    "Hogar": "Hogar",
    "Otra": "Otra"
};

// ==========================================
// 3. CONEXIÓN EN TIEMPO REAL COON FIREBASE
// ==========================================
onValue(tareasRef, (snapshot) => {
    const data = snapshot.val();
    tasks = data ? data : {};
    renderCalendar();
    renderTasks();
});

function saveToFirebase() {
    set(tareasRef, tasks).catch(error => console.error("Error guardando en Firebase:", error));
}

// ==========================================
// 4. LÓGICA DE LA INTERFAZ
// ==========================================
categoryInput.addEventListener('change', (e) => {
    if (e.target.value === 'Trabajo') {
        endTimeContainer.style.display = 'flex'; // Puedes usarlo para tus turnos largos si quieres
    } else {
        endTimeContainer.style.display = 'none';
        endTimeInput.value = ''; 
    }
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthYear.textContent = `${monthNames[month]} ${year}`;
    daysContainer.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = i;
        dayDiv.appendChild(dayNumber);
        
        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(i).padStart(2, '0');
        const dateString = `${year}-${monthStr}-${dayStr}`;
        
        if (selectedDate === dateString) dayDiv.classList.add('selected');

        if (tasks[dateString] && tasks[dateString].length > 0) {
            tasks[dateString].forEach(task => {
                const pill = document.createElement('div');
                pill.classList.add('event-pill');
                pill.classList.add(categoryToDotClass[task.categoria] || 'cat-otra');
                
                if (task.estado === 'Completado') pill.classList.add('completed');
                
                const timeStr = task.hora ? `${task.hora} - ` : '';
                pill.textContent = `${timeStr}${task.asignatura}`; // Muestra directamente lo que escribas
                dayDiv.appendChild(pill);
            });
        }

        dayDiv.addEventListener('click', () => {
            selectedDate = dateString;
            selectedDateText.textContent = `Detalle para el ${i} de ${monthNames[month]}`;
            renderCalendar();
            renderTasks();
        });
        daysContainer.appendChild(dayDiv);
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    if (!selectedDate) {
         taskList.innerHTML = '<p style="text-align:center; color:#94a3b8; font-style:italic;">Selecciona una fecha para ver tus actividades.</p>';
         return;
    }
    if (!tasks[selectedDate] || tasks[selectedDate].length === 0) {
         taskList.innerHTML = '<p style="text-align:center; color:#94a3b8; font-style:italic;">No tienes actividades registradas hoy.</p>';
         return;
    }

    const sortedTasks = [...tasks[selectedDate]].sort((a, b) => {
        if (!a.hora) return 1;
        if (!b.hora) return -1;
        return a.hora.localeCompare(b.hora);
    });

    sortedTasks.forEach((task) => {
        const originalIndex = tasks[selectedDate].indexOf(task);
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.classList.add(categoryToCardClass[task.categoria] || 'Otra'); 

        const statusClass = task.estado === 'Completado' ? 'status-completado' : 'status-pendiente';
        const statusIcon = task.estado === 'Completado' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-regular fa-circle"></i>';
        
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
            <div class="task-desc">${task.descripcion || 'Sin notas'}</div>
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

window.toggleStatus = function(date, index) {
    tasks[date][index].estado = tasks[date][index].estado === 'Pendiente' ? 'Completado' : 'Pendiente';
    saveToFirebase();
}

window.deleteTask = function(date, index) {
    if(confirm('¿Quieres eliminar esta actividad de tu lista?')) {
        tasks[date].splice(index, 1);
        saveToFirebase();
    }
}

addTaskBtn.addEventListener('click', () => {
    if (!selectedDate) {
        alert('Selecciona un día en el calendario primero.');
        return;
    }
    
    const asignatura = subjectInput.value.trim();
    const categoria = categoryInput.value;
    const hora = timeInput.value;
    const horaFin = endTimeInput.value;
    const descripcion = descInput.value.trim();

    if (!asignatura || !categoria) {
        alert('Escribe el título de tu actividad y selecciona una categoría.');
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

    subjectInput.value = '';
    categoryInput.value = '';
    timeInput.value = '';
    endTimeInput.value = '';
    endTimeContainer.style.display = 'none';
    descInput.value = '';

    saveToFirebase();
});

document.getElementById('prevMonth').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
document.getElementById('nextMonth').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

renderCalendar();