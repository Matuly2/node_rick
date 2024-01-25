$(document).ready(function() {
    // Generar opciones del 1 al 42 con jQuery
    var select = $('#pagina');
    for (var i = 1; i <= 42; i++) {
        select.append('<option value="' + i + '">' + i + '</option>');
    }

    // Realizar la solicitud al servidor con el valor predeterminado (1)
    $.ajax({
        url: '/rickymorty',
        type: 'GET',
        dataType: 'json',
        data: { parametro: 1 }, 
        success: function (data) {
            console.log(data);
            renderizarDatos(data);
            
        },
        error: function (error) {
            console.error('Error al cargar los datos:', error);
        }
    });

    // Evento onchange para capturar el cambio de selección
    select.change(function() {
        // Obtener el valor seleccionado
        var valorSeleccionado = $(this).val();

        // Realizar la solicitud al servidor con el valor seleccionado
        $.ajax({
            url: '/rickymorty',
            type: 'GET',
            dataType: 'json',
            data: { parametro: valorSeleccionado }, // Incluir el valor seleccionado en la solicitud
            success: function (data) {
                console.log(data);
                renderizarDatos(data);
                // Puedes realizar otras acciones con los datos si es necesario
            },
            error: function (error) {
                console.error('Error al cargar los datos:', error);
            }
        });
    });
});

function renderizarDatos(data) {
    // Verificar si la propiedad 'results' está presente en el objeto
    if (data.results) {
        // Obtener el contenedor donde se mostrarán los resultados
        var contenedorResultados = $('#resultados-container');
        
        // Limpiar el contenedor antes de agregar nuevos elementos
        contenedorResultados.empty();

        // Iterar a través de los resultados y agregar cada personaje al contenedor
        data.results.forEach(function(personaje) {
            // Crear un elemento div para cada personaje
            var divPersonaje = $('<div class="personaje">');

            // Agregar la imagen del personaje
            var imagen = $('<img src="' + personaje.image + '" alt="' + personaje.name + '">');
            divPersonaje.append(imagen);

            // Crear un contenedor para la información del personaje
            var infoContainer = $('<div class="info-container">');

            // Agregar el nombre del personaje
            var nombre = $('<p>' + personaje.name + ' <span class="estado-circulo" style="background-color:' + getStatusColor(personaje.status) + '"></span></p>');
            infoContainer.append(nombre);

            // Agregar la especie (species)
            var especie = $('<p>Especie: ' + personaje.species + '</p>');
            infoContainer.append(especie);

            // Agregar el contenedor de información al div del personaje
            divPersonaje.append(infoContainer);

            // Agregar el div del personaje al contenedor general
            contenedorResultados.append(divPersonaje);
        });
    } else {
        console.error('No se encontraron resultados válidos en el objeto JSON.');
    }
}

// Función para obtener el color del círculo según el estado de vida
function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'alive':
            return 'green'; 
        case 'dead':
            return 'red'; 
        default:
            return 'gray'; 
    }
}