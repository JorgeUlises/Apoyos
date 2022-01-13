const onInputDescripcionEvento = event => {
    event.target.value = event.target.value.replace(/[\'\"\&#\\]/g, '');
}


/*********************************************************************************************************************
 * FILTRAR EVENTOS - Identifica opción seleccionada
 *********************************************************************************************************************/
$('#LegEventosBusqueda').click(function () {
    FiltraEventos();
});

$('#EstatusEventoBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#EstatusEventoBusqueda").val());
    FiltraEventos();
});

$('#TipoBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#TipoBusqueda").val());
    FiltraEventos();
});


/*********************************************************************************************************************
 * FILTRAR Evento
 *********************************************************************************************************************/
function FiltraEventos() {
    var LegislaturaId = $("#LegEventosBusqueda").val();

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    console.log("...Filtra Eventos: -" + LegislaturaId + "-" + RegXpag + "-" + offsetSolicitudes + "-->" + $("#hideFechaInicioRegistro").val());

    GeneraTablaEventos(LegislaturaId, RegXpag, offsetSolicitudes);
}


/*********************************************************************************************************************
 * Muestra Tabla de Solicitud de Apoyos 
 *********************************************************************************************************************/
function GeneraTablaEventos(LegislaturaId, RegXpag, offsetPeticiones) {
    var indice = 0;
    var tablaHTML = "";
    var numeroRegistros = 0;

    var LegislaturaID = $("#LegEventosBusqueda").val();
    var folio = $("#NumFolioBusqueda").val();
    var tipoId = $("#TipoBusqueda").val();
    var descripcion = $("#descripcionFiltro").val();
    var colonia = $("#coloniaFiltro").val();
    var estatusId = $("#EstatusEventoBusqueda").val();

    var fechaInicioEvento = $("#hideFechaInicioEvento").val();
    var fechaFinEvento = $("#hideFechaFinEvento").val();

    fechaInicioEvento = fechaInicioEvento == "" ? "0" : fechaInicioEvento;
    fechaFinEvento = fechaFinEvento == "" ? "0" : fechaFinEvento;

    tablaHTML += "<table class='table table-bordered responsive-table' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='13%' style='text-align:center;'>Fecha</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripcion</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Colonia</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Tipo</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Estatus</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'># Asistentes</th>";
    tablaHTML += "<th width='3%' style='text-align:center;'>Opciones</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/ObtieneEventos",
        data: { RegXpag, offsetPeticiones, LegislaturaID, folio, descripcion, tipoId, estatusId, fechaInicioEvento, fechaFinEvento, colonia },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fecha + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>(" + val.eventoId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.colonia + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.tipo + "</td>";
                switch (val.estatusId) {
                    case 0:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>SIN ESTATUS</td>";
                        break;
                    case 1:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>PLANEADO</td>";
                        break;
                    case 2:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>REALIZADO</td>";
                        break;
                    case 3:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>POSPUESTO</td>";
                        break;
                    case 4:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>CANCELADO</td>";
                        break;
                }
                
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numeroAsistentes + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                tablaHTML += "<a href='/Apoyo/Eventoes/Edit/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Evento'></span></a>";
                tablaHTML += "<a href='/Apoyo/Eventoes/Delete/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Evento'></span></a>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            $("#divEventos").html(tablaHTML);
        }
    });

    numeroRegistros = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/numeroEventos",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistros = response - 1;
        }
    });



    var numeroRegistrosFiltrados = 0;

    fechaInicioEvento = $("#hideFechaInicioEvento").val();
    fechaFinEvento = $("#hideFechaFinEvento").val();

    fechaInicioEvento = fechaInicioEvento == "" ? "0" : fechaInicioEvento;
    fechaFinEvento = fechaFinEvento == "" ? "0" : fechaFinEvento;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/ObtieneNumeroEventosXfiltro",
        data: { LegislaturaID, folio, descripcion, tipoId, estatusId, fechaInicioEvento, fechaFinEvento, colonia },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistrosFiltrados = response;
            $("#hideNumRegistros").val(numeroRegistrosFiltrados);
        }
    });

    //console.log(">>>>>> INICIO: " + fechaInicioRecibido);
    //console.log(">>>>>> FIN: " + fechaFinRecibido);
    //console.log(">>>>>> NUMERO REGISTROS FILTRADOS: " + numeroRegistrosFiltrados);

    $("#labelNumeroRegistros").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    $("#labelNumeroRegistros_footer").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    var numPaginas = 0;
    if (numeroRegistrosFiltrados != 0) {
        numPaginas = Math.ceil(numeroRegistrosFiltrados / RegXpag);
        $("#hideNumPaginas").val(numPaginas);
        console.log("NÚMERO DE PAGINA: " + numPaginas);
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
                var LegislaturaId = $("#LegEventosBusqueda").val();
                GeneraTablaEventos_2(LegislaturaId, RegXpag, RegXpag * (page - 1), page);
            }
        });
    } else {
        $("#hideNumPaginas").val(numPaginas);
        $('#pagina-solicitudes').twbsPagination('destroy');
    }

}


/*********************************************************************************************************************
 * Muestra Tabla de Eventos
 *********************************************************************************************************************/
function GeneraTablaEventos_2(LegislaturaId, RegXpag, offsetPeticiones, pagina) {
    var indice = 0;
    var tablaHTML = "";

    var LegislaturaID = $("#LegEventosBusqueda").val();
    var folio = $("#NumFolioBusqueda").val();
    var tipoId = $("#TipoBusqueda").val();
    var descripcion = $("#descripcionFiltro").val();
    var colonia = $("#coloniaFiltro").val();
    var estatusId = $("#EstatusEventoBusqueda").val();

    var fechaInicioEvento = $("#hideFechaInicioEvento").val();
    var fechaFinEvento = $("#hideFechaFinEvento").val();

    fechaInicioEvento = fechaInicioEvento == "" ? "0" : fechaInicioEvento;
    fechaFinEvento = fechaFinEvento == "" ? "0" : fechaFinEvento;

    tablaHTML += "<table class='table table-bordered responsive-table' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%; background-color:#1e81b0; color:whitesmoke;'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='13%' style='text-align:center;'>Fecha</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripcion</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Colonia</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Tipo</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Estatus</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'># Asistentes</th>";
    tablaHTML += "<th width='3%' style='text-align:center;'>Opciones</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";

    console.log("==>> RegXpag, offsetPeticiones, LegislaturaID: " + RegXpag + "--" + offsetPeticiones + "--" + LegislaturaID)

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/ObtieneEventos",
        data: { RegXpag, offsetPeticiones, LegislaturaID, folio, descripcion, tipoId, estatusId, fechaInicioEvento, fechaFinEvento, colonia },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = (pagina - 1) * RegXpag + index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fecha + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>(" + val.eventoId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:2px;'>" + val.colonia + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.tipo + "</td>";
//                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatusId + "</td>";
                switch (val.estatusId) {
                    case 0:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>SIN ESTATUS</td>";
                        break;
                    case 1:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>PLANEADO</td>";
                        break;
                    case 2:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>REALIZADO</td>";
                        break;
                    case 3:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>POSPUESTO</td>";
                        break;
                    case 4:
                        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>CANCELADO</td>";
                        break;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numeroAsistentes + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                tablaHTML += "<a href='/Apoyo/Eventoes/Edit/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Evento'></span></a>";
                tablaHTML += "<a href='/Apoyo/Eventoes/Delete/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Evento'></span></a>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            $("#divEventos").html(tablaHTML);
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/numeroEventos",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistros = response - 1;
        }
    });





    var numeroRegistrosFiltrados = 0;

    fechaInicioSolicitud = $("#hideFechaInicioRegistro").val();
    fechaFinSolicitud = $("#hideFechaFinRegistro").val();

    fechaInicioSolicitud = fechaInicioSolicitud == "" ? "0" : fechaInicioSolicitud;
    fechaFinSolicitud = fechaFinSolicitud == "" ? "0" : fechaFinSolicitud;


    fechaInicioConclusion = $("#hideFechaInicioConclusion").val();
    fechaFinConclusion = $("#hideFechaFinConclusion").val();

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/ObtieneNumeroEventosXfiltro",
        data: { LegislaturaID, folio, descripcion, tipoId, estatusId, fechaInicioEvento, fechaFinEvento, colonia },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistrosFiltrados = response;
            $("#hideNumRegistros").val(numeroRegistrosFiltrados);
        }
    });


    $("#labelNumeroRegistros").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    $("#labelNumeroRegistros_footer").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);

    var numPaginas = Math.ceil(numeroRegistros / RegXpag);
    $("#hideNumPaginas").val(numPaginas);
}



/*************************************************************************************
 *  Filtro Rango de fecha EVENTOS
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoFechaEvento').daterangepicker({
        startDate: moment(),
        endDate: moment(),
        autoUpdateInput: false,
        ranges: {
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Hoy': [moment(), moment()],
            'Semana Anterior': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
            'Esta Semana': [moment().startOf('week'), moment().endOf('week')],
            'Mes Anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Este Año': [moment().startOf('year'), moment().endOf('year')],
            'Año Anterior': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        },
        locale: {
            format: 'DD/MM/YYYY',
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "A",
            "customRangeLabel": "Personalizado",
            "weekLabel": "W",
            "daysOfWeek": [
                "Dom",
                "Lun",
                "Mar",
                "Mié",
                "Jue",
                "Vie",
                "Sáb"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ]
        },
        "applyButtonClasses": "btn btn-dark btn-sm",
        "cancelButtonClasses": "btn btn-dark btn-sm"
    },
        function (start, end, label) {
            console.log('>>>>>>>>>>>>>>RANGO DE FECHAS<<<<<<<<<<<<<<<<<: ' + start.format('YYYY-MM-DD 00:00') + ' to ' + end.format('YYYY-MM-DD 11:59') + ' (predefined range: ' + label + ')');
            $("#hideFechaInicioEvento").val(start.format('DD-MM-YYYY 00:00'));
            $("#hideFechaFinEvento").val(end.format('DD-MM-YYYY 11:59'));
            FiltraEventos();
        }
    );
});

$('input[id="filtro_rangoFechaEvento"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoFechaEvento"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});


/*********************************************************************************************************
 * Guarda Nuevo Evento
 *********************************************************************************************************/
function GuardarNuevoEvento() {
    var DatosGuardados = false;
    var legislaturaId = $("#LegEventosNuevo").val();
    var folioEvento = $("#FolioEvento").val();
    var estatusId = $("#opcionEstatusId").val();
    var numAsistentes = $("#NumAsistentes").val();
    var fechaEvento = $("#FechaEvento").val();
    var tipoEvento = $("#opcionTipoEventos").val();
    var coloniaId = $("#hColoniaBuscar").val();
    var calleId = $("#hCalleBuscar").val();
    var numExt = $("#IngresaNumExt").val();
    var numInt = $("#IngresaNumInt").val();
    var CP = $("#IngresaCP").val();
    var latitud = $("#Latitud").val();
    var longitud = $("#Longitud").val();

    var descripcionEvento = $("#DescripcionEvento").val().trim().replace(/\n/g, '&#13');

    console.log("legislaturaId: " + legislaturaId);
    console.log("folioEvento: " + folioEvento);
    console.log("opcionEstatusId: " + estatusId);
    console.log("numAsistentes: " + numAsistentes);
    console.log("fechaEvento: " + fechaEvento);
    console.log("opcionTipoEventos: " + tipoEvento);
    console.log("coloniasBuscar: " + coloniaId);
    console.log("callesBuscar: " + calleId);
    console.log("ingresaNumExt: " + numExt);
    console.log("ingresaNumInt: " + numInt);
    console.log("ingresaCP: " + CP);
    console.log("latitud: " + latitud);
    console.log("longitud: " + longitud);
    console.log("descripcionEvento: " + descripcionEvento);


    var datosCompletos = false;

    if (folioEvento.length > 0) {
        if (descripcionEvento.length > 0) {
            if (fechaEvento.length > 0) {
                if (coloniaId > 0) {
                    if (calleId > 0) {
                        datosCompletos = true;
                    }
                }
            }
        }
    }

    if (!datosCompletos) {
        $("#msgAlerta_DatosIncompletos").show();
        setTimeout(function () {
            $('#msgAlerta_DatosIncompletos').fadeOut('fast');
        }, 2000); // <-- milliseconds
        return;
    }

    //return;

    //$("#OrigenPeticion").val(1);
    //$("#hCiudadanoSolicitanteBuscar").val(0);
    //$("#NombreCiudadanoSolicitante").val("");
    //$("#AsociacionId").val(0);


    $.ajax({
        type: "POST",
        url: "/Apoyo/Eventoes/NuevoEvento",
        cache: false,
        async: false,
        data: {
            legislaturaId, folioEvento, estatusId, numAsistentes, fechaEvento, tipoEvento, coloniaId, calleId, numExt, numInt, CP, latitud, longitud, descripcionEvento
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : -" + response + "-");

            switch (response) {
                //case 0:
                //    $("#mensajeAlerta_PersonaExistente").show();
                //    setTimeout(function () {
                //        $('#mensajeAlerta_PersonaExistente').fadeOut('fast');
                //    }, 2000);
                //    DatosGuardados = false;
                //    break;
                case -1:
                    $("#mensajeAlerta_Error").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_Error').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = false;
                    break;
                case -2:
                    $("#mensajeAlerta_Error").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_Error').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = false;
                    break;
                default:
                    $("#mensajeAlerta_OK").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_OK').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = true;
                    $("#hEventoId").val(response);
                    break;
            }
        },
        error: function (response) {
            $("#mensajeAlerta_Error").show();
            setTimeout(function () {
                $('#mensajeAlerta_Error').fadeOut('fast');
            }, 2000);
            DatosGuardados = false;
        },
        failure: function (response) {
            $("#mensajeAlerta_Error").show();
            setTimeout(function () {
                $('#mensajeAlerta_Error').fadeOut('fast');
            }, 2000);
            DatosGuardados = false;
        }

    });


    if (DatosGuardados) {
        $("#divEventoComplemento").show();
        var idEvento = $("#hEventoId").val();
        GeneraTablaArchivosAnexosNEvento(idEvento);
        GeneraTablaAsistentesNvoEvento(idEvento);
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-" + $("#hEventoId").val());
}

/*********************************************************************************************************
 * Revisa que el número de Folio de Evento no exista en la BD
 *********************************************************************************************************/
$('#FolioEvento').focusout(function () {
    var folio = $('#FolioEvento').val();
    //console.log("Salio de el campo de Numero de Turno --> " + folio);
    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/BuscaNumeroFolio",
        data: { folio },
        cache: false,
        async: false,
        success: (response) => {
            if (response >= 1) {
                $("#msgAlertFolioExistente").show();
                setTimeout(function () {
                    $('#msgAlertFolioExistente').fadeOut('fast');
                }, 2000); // <-- milliseconds
                $('#FolioEvento').val("");
            } else {
                console.log("NO NUMERO DE FOLIO " + response);
            }
        }
    });
});


/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Archivos Anexos para registro de Nuevo Evento
 ***********************************************************************************************************/
function GeneraTablaArchivosAnexosNEvento(idEvento) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaArchivosAnexosNEvento'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='94%'>";
    tablaHTML += "Nombre de Archivo";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    tablaHTML += "<span class='fas fa-file-upload' style='font-size:18px; cursor:pointer' title='Subir Archivo Anexo' onclick='MostrarModalSubirArchivoAnexoEvento(" + idEvento + ");'></span>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/ObtieneListaArchivosEvento",
        data: { idEvento },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                console.log("ARCHIVO: " + val.url);
                tablaHTML += "<tr id='ArchivoRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td><a href='" + val.url + "' target='_blank' title='Archivo'>" + val.nombreArchivo + "</a></td>";
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowArchivoEvento(" + val.archivoId + ");'></span></td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divArchivosAnexosNvoEvento").html(tablaHTML);

}



/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Asistentes para registro de Nuevo Evento
 ***********************************************************************************************************/
function GeneraTablaAsistentesNvoEvento(idEvento) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaAsistentesNvoEvento'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Nombre";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Colonia";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Calle";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='35%'>";
    tablaHTML += "Apoyo";
    tablaHTML += "</td>";

    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/ObtieneListaAsistentesEvento",
        data: { idEvento },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr id='ArchivoRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td>" + val.nombreCompleto + "</td>";
                tablaHTML += "<td>" + val.colonia + "</td>";
                tablaHTML += "<td>" + val.calle + "</td>";
                tablaHTML += "<td><input type='text' id='DescripcionApoyo_" + val.beneficiariosID + "' style='width:100%; max-width:100%;' value='" + val.notas + "'/></td>";
                tablaHTML += "<td>";
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowAsistente(" + val.peticionID + "," + val.ciudadanoID + ");'></span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Actualiza el apoyo recibido' onclick='GuardaCambiosAsistente(" + val.peticionID + "," + val.ciudadanoID + "," + val.beneficiariosID + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    indice++;

    tablaHTML += "<tr id='BeneficiarioRenglon_" + indice + "'>";
    tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
    tablaHTML += "<td><input type='text' id='AsistenteNombre_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td></td>";
    tablaHTML += "<td></td>";
    tablaHTML += "<td><input type='text' id='AsistenteNota_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guarda Asistente' onclick='GuardaNuevoAsistenteEvento(" + idEvento + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divAsistentesNvoEvento").html(tablaHTML);
    $("#AsistenteNombre_Nuevo").autocomplete(autocompleteNombreBeneficiario);

}


/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de Petiviones
 **********************************************************************************************/
function MostrarModalSubirArchivoAnexoEvento(idEvento) {
    $("#ModalSeleccionarArchivosEvento").appendTo("body");
    $("#ModalSeleccionarArchivosEvento").modal("show");

    $('#hEventoId').val(idEvento);
}

/***********************************************************************************
 * Subir Archivo de Peticiones de Apoyo
 ***********************************************************************************/
function subirArchivosEventoButton(nombreArchivoAsubir) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    var EventoId = $('#hEventoId').val();

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("EventoId", EventoId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + EventoId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Eventoes/SubirArchivoEvento",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        data: formData,
        dataType: 'json',
        cache: false,
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            console.log('El archivo ha sido subido-->' + response);
            $('#ModalSeleccionarArchivosEvento').modal('hide');
            GeneraTablaArchivosAnexosNEvento(EventoId);
        },
        error: function (error) {
            console.log('Error al subir el archivo');
            //console.log("MENSAJE ERROR AL SUBIR ARCHIVO: " + response.ServerMessage);
        }
    });
}
