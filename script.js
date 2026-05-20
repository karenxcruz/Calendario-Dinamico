const monthYear = document.getElementById('monthYear');
const daysContainer = document.getElementById('daysContainer');
const selectedDateText = document.getElementById('selectedDateText');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let currentDate = new Date();
let selectedDate = null;
// Cargamos las tareas guardadas en el navegador
let tasks = JSON.parse(localStorage.getItem('tareasUrbelania')) || {};

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthYear.textContent = `${monthNames[month]} ${year}`;
    daysContainer.innerHTML = '';

    // Espacios vacíos antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        
        const dateString = `${year}-${month + 1}-${i}`;
        
        if (selectedDate === dateString) {
            dayDiv.classList.add('selected');
        }

        // Marca visual si el día tiene tareas guardadas
        if (tasks[dateString] && tasks[dateString].length > 0) {
            dayDiv.classList.add('has-task');
        }

        // Seleccionar un día
        dayDiv.addEventListener('click', () => {
            selectedDate = dateString;
            selectedDateText.textContent = `Actividades para el ${i} de ${monthNames[month]}`;
            renderCalendar();
            renderTasks();
        });
        daysContainer.appendChild(dayDiv);
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    if (!selectedDate || !tasks[selectedDate]) return;

    tasks[selectedDate].forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;
        
        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.onclick = () => {
            tasks[selectedDate].splice(index, 1);
            localStorage.setItem('tareasUrbelania', JSON.stringify(tasks));
            renderTasks();
            renderCalendar();
        };
        
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
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
    if (taskInput.value.trim() !== '') {
        if (!tasks[selectedDate]) tasks[selectedDate] = [];
        tasks[selectedDate].push(taskInput.value.trim());
        localStorage.setItem('tareasUrbelania', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks();
        renderCalendar();
    }
});

// Iniciar calendario
renderCalendar();