$(document).ready(function() {
    
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
        
        var valorSeleccionado = $(this).val();

       
        $.ajax({
            url: '/rickymorty',
            type: 'GET',
            dataType: 'json',
            data: { parametro: valorSeleccionado }, 
            success: function (data) {
                console.log(data);
                renderizarDatos(data);
                
            },
            error: function (error) {
                console.error('Error al cargar los datos:', error);
            }
        });
    });
});

function renderizarDatos(data) {
    
    if (data.results) {
       
        var contenedorResultados = $('#resultados-container');
        
        
        contenedorResultados.empty();

        
        data.results.forEach(function(personaje) {
            
            var divPersonaje = $('<div class="personaje">');

          
            var imagen = $('<img src="' + personaje.image + '" alt="' + personaje.name + '">');
            divPersonaje.append(imagen);

            
            var infoContainer = $('<div class="info-container">');

            
            var nombre = $('<p>' + personaje.name + ' <span class="estado-circulo" style="background-color:' + getStatusColor(personaje.status) + '"></span></p>');
            infoContainer.append(nombre);

            
            var especie = $('<p>Especie: ' + personaje.species + '</p>');
            infoContainer.append(especie);

            
            divPersonaje.append(infoContainer);

            
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