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
let tasks = JSON.parse(localStorage.getItem('tareasUrbelaniaV4')) || {}; // V4 para los nuevos campos

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

// Mostrar/Ocultar hora de fin según la categoría
categoryInput.addEventListener('change', (e) => {
    if (e.target.value === 'Clase en directo') {
        endTimeContainer.style.display = 'flex';
    } else {
        endTimeContainer.style.display = 'none';
        endTimeInput.value = ''; // Limpiar si cambia de categoría
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
        
        if (selectedDate === dateString) {
            dayDiv.classList.add('selected');
        }

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
         taskList.innerHTML = '<p style="text-align:center; color:#94a3b8; font-style:italic;">Selecciona una fecha para ver sus actividades.</p>';
         return;
    }
    if (!tasks[selectedDate] || tasks[selectedDate].length === 0) {
         taskList.innerHTML = '<p style="text-align:center; color:#94a3b8; font-style:italic;">No hay actividades registradas para este día.</p>';
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
        card.classList.add(categoryToCardClass[task.categoria] || 'Actividad'); 

        const statusClass = task.estado === 'Completado' ? 'status-completado' : 'status-pendiente';
        const statusIcon = task.estado === 'Completado' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-regular fa-circle"></i>';
        
        // Formato visual de la hora
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
                <div class="status-toggle ${statusClass}" onclick="toggleStatus('${selectedDate}', ${originalIndex})">
                    ${statusIcon} ${task.estado}
                </div>
                <button class="delete-btn" onclick="deleteTask('${selectedDate}', ${originalIndex})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        taskList.appendChild(card);
    });
}

window.toggleStatus = function(date, index) {
    if (tasks[date][index].estado === 'Pendiente') {
        tasks[date][index].estado = 'Completado';
    } else {
        tasks[date][index].estado = 'Pendiente';
    }
    saveAndRender();
}

window.deleteTask = function(date, index) {
    if(confirm('¿Estás seguro de eliminar esta actividad?')) {
        tasks[date].splice(index, 1);
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('tareasUrbelaniaV4', JSON.stringify(tasks));
    renderTasks();
    renderCalendar();
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

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
        horaFin: horaFin, // Nueva variable guardada
        descripcion: descripcion,
        estado: 'Pendiente' 
    });

    subjectInput.value = '';
    categoryInput.value = '';
    timeInput.value = '';
    endTimeInput.value = '';
    endTimeContainer.style.display = 'none'; // Volver a ocultar al guardar
    descInput.value = '';

    saveAndRender();
});

renderCalendar();
renderTasks();