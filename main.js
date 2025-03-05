document.addEventListener('DOMContentLoaded', function () {	
    const toggleSwitch = document.getElementById("checkbox");
    const body = document.body;

    // Verifica si ya hay una preferencia guardada en localStorage
    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
        toggleSwitch.checked = true;
    }

    // Evento de cambio en el interruptor
    toggleSwitch.addEventListener("change", function () {
        if (toggleSwitch.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("dark-mode", "enabled");
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("dark-mode", "disabled");
        }
    });
    const boton = document.getElementById('add');
    const tareasContainer = document.getElementById('tasks');

    // Cargar tareas guardadas al inicio
    cargarTareas();

    boton.addEventListener('click', function () {
        const tareaTexto = document.getElementById('task').value.trim();
        if (tareaTexto === "") return; // Evita agregar tareas vacías

        // Crear objeto de tarea
        const nuevaTarea = { texto: tareaTexto, completada: false };

        // Guardar en localStorage
        let tareas = obtenerTareas();
        tareas.push(nuevaTarea);
        localStorage.setItem('tareas', JSON.stringify(tareas));

        // Agregar tarea a la lista
        agregarTareaDOM(nuevaTarea);
        document.getElementById('task').value = ""; // Limpiar input
    });

    function cargarTareas() {
        const tareas = obtenerTareas();
        tareas.forEach(tarea => agregarTareaDOM(tarea));
    }

    function obtenerTareas() {
        return JSON.parse(localStorage.getItem('tareas')) || [];
    }

    function agregarTareaDOM(tarea) {
        const tareaDiv = document.createElement('div');
        tareaDiv.classList.add('tarea');

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarea.completada;
        checkbox.classList.add('checkbox');
        checkbox.addEventListener('change', () => {
            tarea.completada = checkbox.checked;
            actualizarLocalStorage();
            tareaTexto.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        });

        // Texto de la tarea
        const tareaTexto = document.createElement('span');
        tareaTexto.textContent = tarea.texto;
        tareaTexto.classList.add('tarea-texto');
        if (tarea.completada) {
            tareaTexto.style.textDecoration = 'line-through';
        }

        // Botón editar
        const editButton = document.createElement('button');
        editButton.textContent = '✏';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => {
            const nuevaTareaTexto = prompt("Edita tu tarea:", tarea.texto);
            if (nuevaTareaTexto !== null && nuevaTareaTexto.trim() !== "") {
                tarea.texto = nuevaTareaTexto.trim();
                tareaTexto.textContent = tarea.texto;
                actualizarLocalStorage();
            }
        });

        // Botón eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
            eliminarTarea(tarea);
            tareaDiv.remove();
        });

        // Agregar elementos al div
        tareaDiv.appendChild(checkbox);
        tareaDiv.appendChild(tareaTexto);
        tareaDiv.appendChild(editButton);
        tareaDiv.appendChild(deleteButton);
        tareasContainer.appendChild(tareaDiv);
    }

    function actualizarLocalStorage() {
        const tareasActualizadas = Array.from(document.querySelectorAll('.tarea')).map(tareaDiv => ({
            texto: tareaDiv.querySelector('.tarea-texto').textContent,
            completada: tareaDiv.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tareas', JSON.stringify(tareasActualizadas));
    }

    function eliminarTarea(tarea) {
        let tareas = obtenerTareas();
        tareas = tareas.filter(t => t.texto !== tarea.texto);
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }
});
