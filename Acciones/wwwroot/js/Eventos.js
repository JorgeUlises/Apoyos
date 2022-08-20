const onInputDescripcionEvento = event => {
    event.target.value = event.target.value.replace(/[\'\"\&#\\]/g, '');
}

$('#FileUploadFormFileEvento').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);

    }
    $(this).next('.custom-file-label').html(files.join(', '));
    //var TmpPath = URL.createObjectURL(e.target.files[0]);
})

/*****************************************************************************************
 *  Autocomplete Buscar ASISTENTE EVETO
 *****************************************************************************************/
var autocompleteNombreAsistente = {
    source: function (request, response) {
        document.getElementById("hAsistenteBuscar").value = "";
        if ($('#AsistenteNombre_Nuevo').val().length < 1) {
            console.log("en datos BENEFICIARIO");
            return;
        }

        $.ajax({
            url: "/Apoyo/Ciudadanoes/BusquedaCiudadano",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: { term: request.term },
            success: function (data) {
                response($.map(data, function (item) {
                    return {
                        value: item.aNombreCiudadano,
                        id: item.id
                    };
                }));
            },
            error: function (response) {
                alert(response.responseText);
            },
            failure: function (response) {
                alert(response.responseText);
            }
        })
    },
    select: function (event, ui) {
        $("#hAsistenteBuscar").val(ui.item.id);
        console.log("valor de ciudadanos es: " + $("#hAsistenteBuscar").val());
    },
    change: function (event, ui) {
        if (ui.item === null) {
            $(this).val('');
            $('#field_id').val('');
            console.log("NO SE SELECCIONO UN VALOR");
        }
    },
    error: function (error) {
        console.log("Mensaje de error: autocompleteNombreBeneficiario: " + error.e);
        window.location = '/Apoyo';
    }
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

$('#TipoEventoId').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#TipoEventoId").val());
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
 * Muestra Tabla de Eventos 
 *********************************************************************************************************************/
function GeneraTablaEventos(LegislaturaId, RegXpag, offsetPeticiones) {
    var indice = 0;
    var tablaHTML = "";
    var numeroRegistros = 0;

    var LegislaturaID = $("#LegEventosBusqueda").val();
    var folio = $("#NumFolioBusqueda").val();
    var tipoId = $("#TipoEventoId").val();
    var descripcion = $("#descripcionFiltro").val();
    var colonia = $("#coloniaFiltro").val();
    var estatusId = $("#EstatusEventoBusqueda").val();

    var fechaInicioEvento = $("#hideFechaInicioEvento").val();
    var fechaFinEvento = $("#hideFechaFinEvento").val();

    fechaInicioEvento = fechaInicioEvento == "" ? "0" : fechaInicioEvento;
    fechaFinEvento = fechaFinEvento == "" ? "0" : fechaFinEvento;

    console.log("TIPO EVENTO ID: " + tipoId);

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
                //tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";

                switch (val.estatusId) {
                    case 0: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#cce0ff;'>" + indice + "</td>";
                        break;
                    case 1: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#48C4F5;'>" + indice + "</td>";
                        break;
                    case 2: // VERDE - Atendido
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#77F548;'>" + indice + "</td>";
                        break;
                    case 3: // AZUL OBSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#2B84F1;'>" + indice + "</td>";
                        break;
                    case 4: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#FA784C;'>" + indice + "</td>";
                        break;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fecha + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>(" + val.eventoId + ") " + val.descripcion.replace(/&#13/g, '\n') + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>" + val.descripcion.replace(/&#13/g, '\n') + "</span></td>";
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
                //tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                //tablaHTML += "<a href='/Apoyo/Eventoes/Edit/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Evento'></span></a>";
                //tablaHTML += "<a href='/Apoyo/Eventoes/Delete/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Evento'></span></a>";

                switch (val.estatusId) {
                    case 0: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#cce0ff;'>";
                        break;
                    case 1: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#48C4F5;'>";
                        break;
                    case 2: // VERDE - Atendido
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#77F548;'>";
                        break;
                    case 3: // AZUL OBSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#2B84F1;'>";
                        break;
                    case 4: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#FA784C;'>";
                        break;
                }
                tablaHTML += "<a href='/Apoyo/Eventoes/Edit/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Evento'></span></a>";
                tablaHTML += "<a href='/Apoyo/Eventoes/Delete/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Evento'></span></a>";

//                tablaHTML += "<a href='/Apoyo/Ciudadanoes/AsistentesEventoToExcel/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-file-excel' title='Exportar a Excel'></span></a>";

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
    var tipoId = $("#TipoEventoId").val();
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

                //tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";

                switch (val.estatusId) {
                    case 0: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#cce0ff;'>" + indice + "</td>";
                        break;
                    case 1: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#48C4F5;'>" + indice + "</td>";
                        break;
                    case 2: // VERDE - Atendido
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#77F548;'>" + indice + "</td>";
                        break;
                    case 3: // AZUL OBSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#2B84F1;'>" + indice + "</td>";
                        break;
                    case 4: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#FA784C;'>" + indice + "</td>";
                        break;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fecha + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>(" + val.eventoId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>" + val.descripcion + "</span></td>";
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
                //tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                //tablaHTML += "<a href='/Apoyo/Eventoes/Edit/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Evento'></span></a>";
                //tablaHTML += "<a href='/Apoyo/Eventoes/Delete/" + val.eventoId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Evento'></span></a>";
                //tablaHTML += "</td>";

                switch (val.estatusId) {
                    case 0: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#cce0ff;'>";
                        break;
                    case 1: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#48C4F5;'>";
                        break;
                    case 2: // VERDE - Atendido
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#77F548;'>";
                        break;
                    case 3: // AZUL OBSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#2B84F1;'>";
                        break;
                    case 4: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#FA784C;'>";
                        break;
                }
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
 *  Selecciona Hora del Evento
 *************************************************************************************/
$(document).ready(function () {
    $('#HoratimepickerFEvento').datepicker({
        format: 'LT'
    });
})
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
    //var tipoEvento = $("#opcionTipoEventos").val();
    var tipoEvento = $("#TipoEventoId").val();
    
    var coloniaId = $("#hColoniaBuscar").val();
    var calleId = $("#hCalleBuscar").val();
    var numExt = $("#IngresaNumExt").val();
    var numInt = $("#IngresaNumInt").val();
    var CP = $("#IngresaCP").val();
    var latitud = $("#Latitud").val();
    var longitud = $("#Longitud").val();
    var horaInicioEvento = $("#HoraInicioEvento").val();
    var lugar = $("#Lugar").val();
    

    var descripcionEvento = $("#DescripcionEvento").val().trim().replace(/\n/g, '&#13');

    console.log("legislaturaId: " + legislaturaId);
    console.log("folioEvento: " + folioEvento);
    console.log("opcionEstatusId: " + estatusId);
    console.log("numAsistentes: " + numAsistentes);
    console.log("fechaEvento: " + fechaEvento);
    console.log("opcionTipoEventos...: " + tipoEvento);
    console.log("coloniasBuscar: " + coloniaId);
    console.log("callesBuscar: " + calleId);
    console.log("ingresaNumExt: " + numExt);
    console.log("ingresaNumInt: " + numInt);
    console.log("ingresaCP: " + CP);
    console.log("latitud: " + latitud);
    console.log("longitud: " + longitud);
    console.log("descripcionEvento: " + descripcionEvento);
    console.log("HoraInicioEvento: " + horaInicioEvento);


    var datosCompletos = false;

    //if (folioEvento.length > 0) {
        if (descripcionEvento.length > 0) {
            if (fechaEvento.length > 0) {
                if (coloniaId > 0) {
                    if (calleId > 0) {
                        if (lugar.length > 0) {
                            if (horaInicioEvento.length > 0) {
                                datosCompletos = true;
                            }
                        }
                    }
                }
            }
        }
    //}

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
            legislaturaId, folioEvento, estatusId, numAsistentes, fechaEvento, tipoEvento, coloniaId, calleId, numExt, numInt, CP, latitud, longitud, descripcionEvento, horaInicioEvento, lugar
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
 * ACTUALIZA Evento
 *********************************************************************************************************/
function ActualizaEvento() {
    var DatosGuardados = false;
    var legislaturaId = $("#LegislaturaId").val();
    var folioEvento = $("#FolioEventoActualiza").val();
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
    var eventoId = $("#hEventoId").val();
    var FechaRegistro = $("#hFechaRegEvento").val();
    var horaInicioEvento = $("#HoraInicioEvento").val();
    var lugar = $("#Lugar").val();

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

    //if (folioEvento.length > 0) {
        if (descripcionEvento.length > 0) {
            if (fechaEvento.length > 0) {
                if (coloniaId > 0) {
                    if (calleId > 0) {
                        datosCompletos = true;
                    }
                }
            }
        }
    //}

    if (!datosCompletos) {
        $("#msgAlerta_DatosIncompletos").show();
        setTimeout(function () {
            $('#msgAlerta_DatosIncompletos').fadeOut('fast');
        }, 2000); // <-- milliseconds
        return;
    }

    $.ajax({
        type: "POST",
        url: "/Apoyo/Eventoes/ActualizaEvento",
        cache: false,
        async: false,
        data: {
            eventoId, legislaturaId, folioEvento, estatusId, numAsistentes, fechaEvento, tipoEvento, coloniaId, calleId, numExt, numInt, CP, latitud, longitud, descripcionEvento, FechaRegistro, horaInicioEvento, lugar
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : >" + response + "<");

            switch (response) {
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

/*********************************************************************************************************
 * ACTUALIZA Revisa que el número de Folio de Evento no exista en la BD
 *********************************************************************************************************/
$('#FolioEventoActualiza').focusout(function () {
    var folioOriginal = $('#hFolioId').val();
    var folio = $('#FolioEventoActualiza').val();

    if (folioOriginal == folio) {
        return;
    }
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
                $('#FolioEventoActualiza').val("");
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
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowArchivoEvento(" + val.archivoID + "," + idEvento + ");'></span></td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    if (indice > 0) {
        $("#opc_1").css({ 'border-left-color': '#20B016' });
    }

    $("#divArchivosAnexosNvoEvento").html(tablaHTML);

}

/****************************************************************
 *  BORRAR Archivo Evento
 ****************************************************************/
function EliminaRowArchivoEvento(archivoId, idEvento) {
    console.log("archivoId: " + archivoId);
    $.ajax({
        type: "POST",
        url: "/Apoyo/Eventoes/BorrarArchivoEvento",
        cache: false,
        async: false,
        data: { archivoId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaArchivosAnexosNEvento(idEvento);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
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
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Asistencia";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Colonia";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Calle";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='25%'>";
    tablaHTML += "Notas";
    tablaHTML += "</td>";

    tablaHTML += "<a href='/Apoyo/Ciudadanoes/AsistentesEventoToExcel/" + idEvento + "'><span style='cursor: pointer; color:black;' class='fas fa-file-excel' title='Exportar a Excel'></span></a>";
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

                //tablaHTML += "<td>" + val.asistencia + "</td>";
                if (val.asistencia != 0) {
                    tablaHTML += "<td><input type='checkbox' id='cboxAsisEvento_" + val.asistenteEventoID + "' checked></td>";
                } else{
                    tablaHTML += "<td><input type='checkbox' id='cboxAsisEvento_" + val.asistenteEventoID + "'></td>";
                }
                tablaHTML += "<td>" + val.colonia + "</td>";
                tablaHTML += "<td>" + val.calle + "</td>";
                tablaHTML += "<td><input type='text' id='comentarioAsis_" + val.asistenteEventoID + "' style='width:100%; max-width:100%;' value='" + val.comentarios + "'/></td>";
                tablaHTML += "<td>";
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowAsistente(" + val.eventoID + "," + val.asistenteEventoID + ");'></span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Actualiza el apoyo recibido' onclick='GuardaCambiosAsistente(" + val.eventoID + "," + val.asistenteEventoID + "," + val.beneficiariosID + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    if (indice > 0) {
        $("#opc_2").css({ 'border-left-color': '#20B016' });
    }

    indice++;

    tablaHTML += "<tr id='AsistenteRenglon_" + indice + "'>";
    tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
    tablaHTML += "<td><input type='text' id='AsistenteNombre_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td><input type='checkbox' id='cboxAsisEvento_Nvo'></td>";
    tablaHTML += "<td></td>";
    tablaHTML += "<td></td>";
    tablaHTML += "<td><input type='text' id='AsistenteNota_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guarda Asistente' onclick='GuardaNuevoAsistenteEvento(" + idEvento + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divAsistentesNvoEvento").html(tablaHTML);
    $("#AsistenteNombre_Nuevo").autocomplete(autocompleteNombreAsistente);

}

/****************************************************************
 *  BORRAR Asistente al Evento
 ****************************************************************/
function EliminaRowAsistente(eventoID, asistenteEventoID) {
    //console.log("peticionID: " + peticionID);
    //console.log("ciudadanoID: " + ciudadanoID);
    //console.log("beneficiariosID: " + beneficiariosID);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Eventoes/BorrarAsistenteEvento",
        cache: false,
        async: false,
        data: { asistenteEventoID },
        success: (response) => {
            if (response == 1) {
                GeneraTablaAsistentesNvoEvento(eventoID);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}

/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de Petiviones
 **********************************************************************************************/
function MostrarModalSubirArchivoAnexoEvento(idEvento) {
    $("#FileUploadFormFileEvento").val("");
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

/**********************************************************************************************
 * Muestra Complemento de Evento
 **********************************************************************************************/
function mostrarComplementoEvento(idEvento) {
    GeneraTablaArchivosAnexosNEvento(idEvento);
    GeneraTablaAsistentesNvoEvento(idEvento)
}

/**********************************************************************************************
 * Muestra MODAL detalle de Evento
 **********************************************************************************************/
function mostrarModalDetalleEvento(idEvento) {
    var indice = 0;
    var nomEven = "";
    var tablaHTML = "";
    $("#modalMuestraDatosEvento").appendTo("body");
    $("#modalMuestraDatosEvento").modal("show");

    $("#divDatosEvento").html("");
    $("#AsistenciaEventoId").html("");
    $("#ListaArchivosEventoId").html("");

    /* DETALLE DE EVENTO */

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/ObtieneDetalleEvento",
        data: { idEvento },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {

                tablaHTML += "<div class='card'>";
                tablaHTML += "<h4 class='card-header' style='text-align: center; background-color: rgba(13, 77, 168, 1); color: white; border-radius: 10px 10px 10px 10px; padding:2px;'>EVENTO</h4>";
                tablaHTML += "<div class='card-body'>";
                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'>Legislatura</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'>Folio</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='20%'>Estatus</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='15%'>Número Asistentes</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='20%'>Fecha Evento</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'>Hora</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='15%'>Tipo</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.nombreLegislatura + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.folio + "</td>";

                switch (val.estatusId) {
                    case 0:
                        tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>SIN ESTATUS</td>";
                        break;
                    case 1:
                        tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>PLANEADO</td>";
                        break;
                    case 2:
                        tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>REALIZADO</td>";
                        break;
                    case 3:
                        tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>POSPUESTO</td>";
                        break;
                    case 4:
                        tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>CANCELADO</td>";
                        break;
                    default:
                        tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'></td>";
                        break;
                }

                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + val.numAsistentes + "</td>";

                if (moment(val.fechaEvento).format('DD/MM/yyyy') != "01/01/1900") {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>" + moment(val.fechaEvento).format('DD/MM/yyyy') + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }

                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.horaInicio + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + val.tipo + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";

                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='30%'>Lugar</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='20%'>Colonia</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='20%'>Calle</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'># Exterior</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'># Interior</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'>CP</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='30%'>" + val.lugar + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>" + val.colonia + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>" + val.calle + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.numExterior + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.numInterior + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.cp + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";

                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr style='padding:2px;'>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='25%'>Latitud</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='25%'>" + val.latitud + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='25%'>Longitud</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='25%'>" + val.longitud + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";

                nomEven = val.nombreEvento.replace(/&#13/g, '\n');

                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr style='padding:2px;'>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='15%'>Nombre del Evento</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='85%'>" + nomEven + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";
                tablaHTML += "</div>";
                tablaHTML += "</div>";
            });
        }
    });

    $("#divDatosEvento").html(tablaHTML);


    /* ARCHIVOS ANEXOS */

    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaArchivosAnexosNEvento'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='94%'>";
    tablaHTML += "Nombre de Archivo";
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
                tablaHTML += "<tr id='ArchivoRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td><a href='" + val.url + "' target='_blank' title='Archivo'>" + val.nombreArchivo + "</a></td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";


    if (indice > 0) {
        $("#ListaArchivosEventoId").html(tablaHTML);
    }


    /* ASISTENTES AL EVENTO */
    indice = 0;
    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaAsistentesNvoEvento'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Nombre";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='15%'>";
    tablaHTML += "Asistencia";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Colonia";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Calle";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='25%'>";
    tablaHTML += "Comentarios";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='25%'>";
    tablaHTML += "<a href='/Apoyo/Ciudadanoes/AsistentesEventoToExcel/" + idEvento + "'><span style='cursor: pointer; color:black;' class='fas fa-file-excel' title='Exportar a Excel'></span></a>";
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
                tablaHTML += "<tr id='AsistenteRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td>" + val.nombreCompleto + "</td>";

                if (val.asistencia == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }

                tablaHTML += "<td>" + val.colonia + "</td>";
                tablaHTML += "<td>" + val.calle + "</td>";
                tablaHTML += "<td colspan='2'>" + val.comentarios + "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";


    if (indice > 0) {
        $("#AsistenciaEventoId").html(tablaHTML);
    }


}


/************************************************************************************************************************
 *  Guarda Nuevo Asistente a Evento y Notas
 ************************************************************************************************************************/
function GuardaNuevoAsistenteEvento(idEvento) {
    var asistenteId = $("#hAsistenteBuscar").val();
    var comentarios = $("#AsistenteNota_Nuevo").val();
    var cbAsisEvento = 0;
    
    if ($("#cboxAsisEvento_Nvo").is(":checked")) {
        cbAsisEvento = 1;
    }


    var DatosGuardadosBeneficiario = false;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Eventoes/GuardaNuevoAsistente",
        data: { idEvento, asistenteId, comentarios, cbAsisEvento },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val > 0) {
                    console.log("LOS DATOS DE ASISTENTE FUERON GUARDADOS");
                }
            })
        },
        error: function (response) {
            DatosGuardadosBeneficiario = false;
        }
    });

    //if (DatosGuardadosCSC) {
    GeneraTablaAsistentesNvoEvento(idEvento);
    //}
}

/************************************************************************************************************************
 *  Guarda ACTUALIZACIÓN de Asistente a Evento y Notas
 ************************************************************************************************************************/
function GuardaCambiosAsistente(idEvento, asistenteEventoID, asistenteId) {
    var comentarios = $("#comentarioAsis_" + asistenteEventoID).val();
    var cbAsisEvento = 0;

    if ($("#cboxAsisEvento_" + asistenteEventoID).is(":checked")) {
        cbAsisEvento = 1;
    }


    var DatosGuardadosBeneficiario = false;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Eventoes/ActualizaAsistenteEvento",
        data: { asistenteEventoID, idEvento, asistenteId, comentarios, cbAsisEvento },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val > 0) {
                    console.log("LOS DATOS DE ASISTENTE FUERON ACTUALIZADOS");
                }
            })
        },
        error: function (response) {
            DatosGuardadosBeneficiario = false;
        }
    });

    //if (DatosGuardadosCSC) {
    GeneraTablaAsistentesNvoEvento(idEvento);
    //}
}

