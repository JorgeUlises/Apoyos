
/*********************************************************************************************************************
 * FILTRAR INTEGRANTES DE UNA ASOCIACIÓN
 *********************************************************************************************************************/
function FiltraIntegrantesAsociacion() {

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    GeneraTablaIntegranteAsociacion(RegXpag, offsetSolicitudes);
}


/***************************************
 * Busqueda Rápida Gestión
 ***************************************/
function BusqudaRapIntegranteAsociacion() {
    var valorBR = $('#BRciudadanoId').val().trim();
    $("#NombreBuscar").val(valorBR);
    FiltraIntegrantesAsociacion()
}


/*********************************************************************************************************************
 * Muestra Tabla de Solicitud de Apoyos 
 *********************************************************************************************************************/
function GeneraTablaIntegranteAsociacion(RegXpag, offsetPeticiones) {
    var pagina = 1;

    var Nombre = $("#NombreBuscar").val();
    //var Email = $("#IngresaEmail").val();
    //var Telefono = $("#IngresaTelefono").val();
    //var Asociacion = $("#opcionGeneroId").val();
    //var Puesto = $("#opcionCumpleId").val();
    //var Representante = $("#opcionCumpleId").val();

    //var Nombre = "";
    var Email = "";
    var Telefono = "";
    var Asociacion = "";
    var Puesto = "";
    var Representante = -1;

    var numeroRegistrosFiltrados = 0;

    var numeroRegistros = ObtieneNumIntegrantesAsociacion();
    var numeroRegistrosFiltrados = ObtieneNumIntegrantesAsociacionFiltrados(RegXpag, offsetPeticiones, Nombre, Email, Telefono, Asociacion, Puesto, Representante);

    $("#labelNumeroRegistros").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    $("#labelNumeroRegistros_footer").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);

    DibujaTablaIntegrantesAsociacion(RegXpag, offsetPeticiones, pagina, Nombre, Email, Telefono, Asociacion, Puesto, Representante)

    var numPaginas = 0;
    if (numeroRegistrosFiltrados != 0) {
        numPaginas = Math.ceil(numeroRegistrosFiltrados / RegXpag);
        $("#hideNumPaginas").val(numPaginas);
        $('#pagina-solicitudes').twbsPagination('destroy');
        $('#pagina-solicitudes').twbsPagination({
            totalPages: numPaginas,
            visiblePages: 4,
            next: '>>',
            prev: '<<',
            first: 'Inicio',
            last: 'Fin',
            initiateStartPageClick: false,
            onPageClick: function (event, page) {
                var e = document.getElementById("selNumeroRegistrosXpagina");
                var RegXpag = e.options[e.selectedIndex].value;
                DibujaTablaIntegrantesAsociacion(RegXpag, RegXpag * (page - 1), page, Nombre, Email, Telefono, Asociacion, Puesto, Representante);
            }
        });
    } else {
        $("#hideNumPaginas").val(numPaginas);
        $('#pagina-solicitudes').twbsPagination('destroy');
    }

}

/*********************************************************************************************************************
 Dibuja la Tabla
 *********************************************************************************************************************/
function DibujaTablaIntegrantesAsociacion(RegXpag, offsetPeticiones, pagina, Nombre, Email, Telefono, Asociacion, Puesto, Representante) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Asociación</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Nombre</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Puesto</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Representante</th>";
    tablaHTML += "<th width='12%' style='text-align:center;'>e-mail</th>";
    tablaHTML += "<th width='11%' style='text-align:center;'>Teléfono</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/ObtieneIntegrantesAsociacion",
        data: { RegXpag, offsetPeticiones, Nombre, Email, Telefono, Asociacion, Puesto, Representante },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = (pagina - 1) * RegXpag + index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.nombreAsociacion + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Ciudadano'> <a href='/Apoyo/Ciudadanoes/DetalleCiudadano?id=" + val.ciudadanoID + "'>" + val.nombreCompleto + "</a></span></td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.puesto + "</td>";

                if (val.representante == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;'></td>";
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.telefono + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.email + "</td>";

                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            $("#divListaIntegrantesAsociacion").html(tablaHTML);
        }
    });
}

/*********************************************************************************************************************
 * Obtiene el total de Ciudadanos
 *********************************************************************************************************************/
function ObtieneNumIntegrantesAsociacion() {
    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/numeroIntegrantesAsociaciones",
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistros = response - 1;
        }
    });
    return numeroRegistros;
}

/*********************************************************************************************************************
 * Obtiene el número de Ciudadanos seleccionados al aplicar el filtro
 *********************************************************************************************************************/
function ObtieneNumIntegrantesAsociacionFiltrados(RegXpag, offsetPeticiones, Nombre, Email, Telefono, Asociacion, Puesto, Representante) {
    var numeroRegistrosFiltrados = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/ObtieneNumeroIntegrantesAsociacionesXfiltro",
        data: { RegXpag, offsetPeticiones, Nombre, Email, Telefono, Asociacion, Puesto, Representante },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistrosFiltrados = response;
            $("#hideNumRegistros").val(numeroRegistrosFiltrados);
        }
    });
    return numeroRegistrosFiltrados;
}