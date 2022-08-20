
/*****************************************************************************************
 *  Autocomplete Buscar INTEGRANTE DE ASOCIACIÓN
 *****************************************************************************************/
var autocompleteNombreIntegranteAsoc = {
    source: function (request, response) {
        document.getElementById("hIntegranteBuscar").value = "";
        if ($('#IntegranteNombre_Nuevo').val().length < 1) {
            console.log("en datos Integrante de Asociación");
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
        $("#hIntegranteBuscar").val(ui.item.id);
        console.log("valor de ciudadanos es: " + $("#hIntegranteBuscar").val());
    },
    change: function (event, ui) {
        if (ui.item === null) {
            $(this).val('');
            $('#field_id').val('');
            console.log("NO SE SELECCIONO UN VALOR");
        }
    },
    error: function (error) {
        console.log("Mensaje de error: autocompleteNombreIntegranteAsoc: " + error.e);
        window.location = '/Apoyo';
    }
}
//const onInputNotas = event => {
//    event.target.value = event.target.value.replace(/[\'\"\&#\\]/g, '')
//}

/*********************************************************************************************************
 * Guarda Nueva Asociación
 *********************************************************************************************************/
function GuardarNuevaAsociacion() {
    var DatosGuardados = false;
    var nombre = $("#IngresaNombreAsociacion").val();
    var email = $("#IngresaEmailAsociacion").val().trim();
    var telefono = $("#IngresaTelefonoAsociacion").val().trim();
    var coloniaId = $("#hColoniaBuscar").val();
    var calleId = $("#hCalleBuscar").val();
    var numExterior = $("#IngresaNumExt").val().trim();
    var numInterior = $("#IngresaNumInt").val().trim();
    var cp = $("#IngresaCP").val().trim();
    var latitud = $("#Latitud").val().trim();
    var longitud = $("#Longitud").val().trim();
    var notas = $("#Notas").val().trim().replace(/\n/g, '&#13');


    console.log("nombre: " + nombre);
    console.log("email: " + email);
    console.log("telefono: " + telefono);
    console.log("coloniaId: " + coloniaId);
    console.log("calleId: " + calleId);
    console.log("numExterior: " + numExterior);
    console.log("numInterior: " + numInterior);
    console.log("cp: " + cp);
    console.log("latitud: " + latitud);
    console.log("longitud: " + longitud);
    console.log("notas: " + notas);




    var datosCompletos = false;


    if (nombre.length > 0) {
        if (coloniaId > 0) {
            if (calleId > 0) {
                datosCompletos = true;
            }
        }
    }

    if (!datosCompletos) {
        $("#msgAlerta_DatosIncompletos").show();
        setTimeout(function () {
            $('#msgAlerta_DatosIncompletos').fadeOut('fast');
        }, 3000);
        return;
    }

    $.ajax({
        type: "POST",
        url: "/Apoyo/Asociaciones/InsertaNuevaAsociacion",
        cache: false,
        async: false,
        data: {
            nombre, coloniaId, calleId, numExterior, numInterior, cp, email, telefono, latitud, longitud, notas
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : -" + response + "-");

            switch (response) {
                case 0:
                    $("#mensajeAsoci_Existente").show();
                    setTimeout(function () {
                        $('#mensajeAsoci_Existente').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = false;
                    break;
                case -1:
                    $("#mensajeAsoci_Error").show();
                    setTimeout(function () {
                        $('#mensajeAsoci_Error').fadeOut('fast');
                    }, 2000);
                    $("#IngresaNumeroTurno").val("");
                    DatosGuardados = false;
                    break;
                default:
                    $("#mensajeAsoci_OK").show();
                    setTimeout(function () {
                        $('#mensajeAsoci_OK').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = true;
                    $("#hAsociacionId").val(response);
                    break;
            }
        },
        error: function (response) {
            $("#mensajeAsoci_Error").show();
            setTimeout(function () {
                $('#mensajeAsoci_Error').fadeOut('fast');
            }, 2000);
            //$("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        },
        failure: function (response) {
            $("#mensajeAsoci_Error").show();
            setTimeout(function () {
                $('#mensajeAsoci_Error').fadeOut('fast');
            }, 2000);
            //$("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        }

    });

    if (DatosGuardados) {
        $("#divAsociacionesComplemento").show();
        var idAsociacion = $("#hAsociacionId").val();
        GeneraTablaIntegrantesAsociacion(idAsociacion);
    }

    console.log("Regresa >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
}

/*********************************************************************************************************
 * Actualiza Asociación
 *********************************************************************************************************/
function ActualizaAsociacion() { 
    var DatosGuardados = false;
    var nombre = $("#IngresaNombreAsociacion").val();
    var email = $("#IngresaEmailAsociacion").val().trim();
    var telefono = $("#IngresaTelefonoAsociacion").val().trim();
    var coloniaId = $("#hColoniaBuscar").val();
    var calleId = $("#hCalleBuscar").val();
    var numExterior = $("#IngresaNumExt").val().trim();
    var numInterior = $("#IngresaNumInt").val().trim();
    var cp = $("#IngresaCP").val().trim();
    var latitud = "0";// $("#Latitud").val().trim();
    var longitud = "0";// $("#Longitud").val().trim();
    var notas = $("#Notas").val().trim().replace(/\n/g, '&#13');
    
    var asociacionId = $("#hAsociacionId").val();

    console.log("nombre: " + nombre);
    console.log("email: " + email);
    console.log("telefono: " + telefono);
    console.log("coloniaId: " + coloniaId);
    console.log("calleId: " + calleId);
    console.log("numExterior: " + numExterior);
    console.log("numInterior: " + numInterior);
    console.log("cp: " + cp);
    console.log("latitud: " + latitud);
    console.log("longitud: " + longitud);
    console.log("notas: " + notas);




    var datosCompletos = false;


    if (nombre.length > 0) {
        if (coloniaId > 0) {
            if (calleId > 0) {
                datosCompletos = true;
            }
        }
    }

    if (!datosCompletos) {
        $("#msgAlerta_DatosIncompletos").show();
        setTimeout(function () {
            $('#msgAlerta_DatosIncompletos').fadeOut('fast');
        }, 3000);
        return;
    }

    $.ajax({
        type: "POST",
        url: "/Apoyo/Asociaciones/ActualizaAsociacion",
        cache: false,
        async: false,
        data: {
            asociacionId, nombre, coloniaId, calleId, numExterior, numInterior, cp, email, telefono, latitud, longitud, notas
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : -" + response + "-");

            switch (response) {
                case 0:
                    $("#mensajeAsoci_Existente").show();
                    setTimeout(function () {
                        $('#mensajeAsoci_Existente').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = false;
                    break;
                case -1:
                    $("#mensajeAsoci_Error").show();
                    setTimeout(function () {
                        $('#mensajeAsoci_Error').fadeOut('fast');
                    }, 2000);
                    $("#IngresaNumeroTurno").val("");
                    DatosGuardados = false;
                    break;
                default:
                    $("#mensajeAsoci_OK").show();
                    setTimeout(function () {
                        $('#mensajeAsoci_OK').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = true;
                    $("#hAsociacionId").val(response);
                    break;
            }
        },
        error: function (response) {
            $("#mensajeAsoci_Error").show();
            setTimeout(function () {
                $('#mensajeAsoci_Error').fadeOut('fast');
            }, 2000);
            //$("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        },
        failure: function (response) {
            $("#mensajeAsoci_Error").show();
            setTimeout(function () {
                $('#mensajeAsoci_Error').fadeOut('fast');
            }, 2000);
            //$("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        }

    });

    if (DatosGuardados) {
        $("#divAsociacionesComplemento").show();
        var idAsociacion = $("#hAsociacionId").val();
        GeneraTablaIntegrantesAsociacion(idAsociacion);
    }

    console.log("Regresa >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
}

/*********************************************************************************************************************
 * FILTRAR ASOCIACIONES - Identifica opción seleccionada
 *********************************************************************************************************************/
//$('#LegBusqueda').click(function () {
//    FiltraAsociaciones();
//});

//$('#opcionMesCumple').click(function () {
//    console.log("VALOR SELECCIONADO opcionMesCumple: " + $("#opcionMesCumple").val());
//    FiltraAsociaciones();
//});

//$('#opcionGeneroId').click(function () {
//    console.log("VALOR SELECCIONADO opcionGeneroId: " + $("#opcionGeneroId").val());
//    FiltraAsociaciones();
//});


/*********************************************************************************************************************
 * FILTRAR CIUDADANO
 *********************************************************************************************************************/
function FiltraAsociaciones() {

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    console.log("...Filtra Asociaciones: -" + RegXpag + "-" + offsetSolicitudes);

    GeneraTablaAsociaciones(RegXpag, offsetSolicitudes);
}


/*********************************************************************************************************************
 * Muestra Tabla de ASOCIACIONES
 *********************************************************************************************************************/
function GeneraTablaAsociaciones(RegXpag, offsetPeticiones) {
    var pagina = 1;

    var Nombre = $("#BuscaNombreAsociacion").val();
    var Email = $("#BuscaEmailAsociacion").val().trim();
    var Telefono = $("#BuscaTelefonoAsociacion").val().trim();
    var Colonia = $("#coloniasBuscarAsociacion").val();
    var Calle = $("#callesBuscarAsociacion").val();
    var CP = $("#CPbuscarAsociacion").val().trim();


    console.log("Nombre: " + Nombre);
    console.log("Email: " + Email);
    console.log("Telefono: " + Telefono);
    console.log("Colonia: " + Colonia);
    console.log("Calle: " + Calle);
    console.log("CP: " + CP);

    var numeroRegistrosFiltrados = 0;

    var numeroRegistros = ObtieneNumAsociaciones();
    var numeroRegistrosFiltrados = ObtieneNumAsociacionesFiltradas(RegXpag, offsetPeticiones, Nombre, Email, Telefono, Colonia, Calle, CP);

    $("#labelNumeroRegistros").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    $("#labelNumeroRegistros_footer").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);

    DibujaTablaAsociaciones(RegXpag, offsetPeticiones, pagina, Nombre, Email, Telefono, Colonia, Calle, CP)

    var numPaginas = 0;
    if (numeroRegistrosFiltrados != 0) {
        numPaginas = Math.ceil(numeroRegistrosFiltrados / RegXpag);
        $("#hideNumPaginas").val(numPaginas);
        //console.log("NÚMERO DE PAGINA: " + numPaginas);
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
                DibujaTablaAsociaciones(RegXpag, RegXpag * (page - 1), page, Nombre, Email, Telefono, Colonia, Calle, CP);
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
function DibujaTablaAsociaciones(RegXpag, offsetPeticiones, pagina, Nombre, Email, Telefono, Colonia, Calle, CP) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Nombre</th>";
    tablaHTML += "<th width='20%' style='text-align:center;'>Representante</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>e-mail</th>";
    tablaHTML += "<th width='7%' style='text-align:center;'>Teléfono</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Colonia</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Calle</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>CP</th>";
    tablaHTML += "<th width='3%' style='text-align:center;'>Opciones</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";

    console.log("RegXpag=" + RegXpag);
    console.log("offsetPeticiones=" + offsetPeticiones);

    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/ObtieneAsociaciones",
        data: { RegXpag, offsetPeticiones, Nombre, Email, Telefono, Colonia, Calle, CP },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = (pagina - 1) * RegXpag + index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:3px;'>" + val.nombre + "</td>";

                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Asociación'> <a href='/Apoyo/Asociaciones/DetalleAsociacion?id=" + val.asociacionID +"'>" + val.nombre.replace(/&#13/g, '\n') + "</a></span></td>";

                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Asociación' onclick='mostrarModalDetalleAsociacion(" + val.asociacionID + ");'>(" + val.asociacionID + ") " + val.nombre + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Asociación' onclick='mostrarModalDetalleAsociacion(" + val.asociacionID + ");'>" + val.nombre + "</span></td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.presidente + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.email + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.telefono + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:2px;'>" + val.colonia + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:2px;'>" + val.calle + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.cp + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                tablaHTML += "<a href='/Apoyo/Asociaciones/Edit/" + val.asociacionID + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Asociación'></span></a>";
                tablaHTML += "<a href='/Apoyo/Asociaciones/Delete/" + val.asociacionID + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Registro de Asociación'></span></a>";
                tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            $("#divAsociaciones").html(tablaHTML);
        }
    });
}

/*********************************************************************************************************************
 * Obtiene el total de ASOCIACIONES
 *********************************************************************************************************************/
function ObtieneNumAsociaciones() {
    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/numeroAsociaciones",
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistros = response - 1;
        }
    });
    return numeroRegistros;
}

/*********************************************************************************************************************
 * Obtiene el número de ASOCIACIONES seleccionadas al aplicar el filtro
 *********************************************************************************************************************/
function ObtieneNumAsociacionesFiltradas(RegXpag, offsetPeticiones, Nombre, Email, Telefono, Colonia, Calle, CP ) {
    var numeroRegistrosFiltrados = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/ObtieneAsociacionesXfiltro",
        data: { RegXpag, offsetPeticiones, Nombre, Email, Telefono, Colonia, Calle, CP  },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistrosFiltrados = response;
            $("#hideNumRegistros").val(numeroRegistrosFiltrados);
        }
    });
    return numeroRegistrosFiltrados;
}




/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Integrantes de Nueva Asociación
 ***********************************************************************************************************/
function GeneraTablaIntegrantesAsociacion(idAsociacion) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaAsistentesNvoEvento'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='30%'>";
    tablaHTML += "Nombre";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Representante";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Puesto";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='27%'>";
    tablaHTML += "Nota";
    tablaHTML += "</td>";

    tablaHTML += "<td style='text-align:center;padding:1px;' width='10%'>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/ObtieneListaIntegrantesAsociacion",
        data: { idAsociacion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++; 
                tablaHTML += "<tr id='AsociacionRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td>" + val.nombreCompleto + "</td>";

                if (val.representante != 0) {
                    tablaHTML += "<td><input type='checkbox' id='cboxAsisEvento_" + val.integrantesAsociacionID + "' checked></td>";
                } else {
                    tablaHTML += "<td><input type='checkbox' id='cboxAsisEvento_" + val.integrantesAsociacionID + "'></td>";
                }

                //tablaHTML += "<td>" + val.puesto + "</td>";
                tablaHTML += "<td><input type='text' id='IntegrantePuesto_" + val.integrantesAsociacionID + "' style='width:100%; max-width:100%;' value='" + val.puesto + "'/></td>";

                //tablaHTML += "<td>" + val.nota + "</td>";
                tablaHTML += "<td><input type='text' id='IntegranteNota_" + val.integrantesAsociacionID + "' style='width:100%; max-width:100%;' value='" + val.nota + "'/></td>";
                tablaHTML += "<td scope='row' align='center'>";
                tablaHTML += "<span class='fas fa-trash-alt' style='cursor:pointer' title='Elimina Integrante' onclick='EliminaRowIntegrantesAsoc(" + val.asociacionID + "," + val.ciudadanoID + ");'></span>&nbsp;";
                tablaHTML += "<span class='fas fa-save' style='cursor:pointer' title='Actualiza Integrante' onclick='GuardaCambiosIntegranteAsoc(" + val.asociacionID + "," + val.ciudadanoID + "," + val.integrantesAsociacionID + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    if (indice > 0) {
        $("#opc_1").css({ 'border-left-color': '#20B016' });
    }

    indice++;

    tablaHTML += "<tr id='IntegranteRenglon_" + indice + "'>";
    tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
    tablaHTML += "<td><input type='text' id='IntegranteNombre_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";

    tablaHTML += "<td><input type='checkbox' id='cboxRepresentante_Nvo'></td>";

    tablaHTML += "<td><input type='text' id='IntegrantePuesto_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td><input type='text' id='IntegranteNota_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td style='text-align:center;'><span class='fas fa-save' style='font-size:18px; cursor:pointer;' title='Guarda Nuevo Integrante' onclick='GuardaNuevoIntegranteAsoc(" + idAsociacion + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divIntegrantesAsociacion").html(tablaHTML);
    $("#IntegranteNombre_Nuevo").autocomplete(autocompleteNombreIntegranteAsoc);

}


/************************************************************************************************************************
 *  Guarda Nuevo Integrante de Asociación
 ************************************************************************************************************************/
function GuardaNuevoIntegranteAsoc(idAsociacion) {
    var integranteId = $("#hIntegranteBuscar").val();
    var notas = $("#IntegranteNota_Nuevo").val();
    var puesto = $("#IntegrantePuesto_Nuevo").val();
    var cbRepresentante = 0;

    console.log("integranteId: " + integranteId);
    console.log("notas: " + notas);
    console.log("puesto: " + puesto);
    
    if ($("#cboxRepresentante_Nvo").is(":checked")) {
        cbRepresentante = 1;
    }
    $.ajax({
        type: "POST",
        url: "/Apoyo/Asociaciones/GuardaNuevoIntegrante",
        data: { idAsociacion, integranteId, puesto, notas, cbRepresentante },
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

    GeneraTablaIntegrantesAsociacion(idAsociacion);
}


GuardaCambiosIntegranteAsoc(" + val.asociacionID + ", " + val.ciudadanoID + ", " + val.integrantesAsociacionID + ")

/************************************************************************************************************************
 *  ACTUALIZA Integrante de Asociación
 ************************************************************************************************************************/
function GuardaCambiosIntegranteAsoc(idAsociacion, ciudadanoId, integrantesAsociacionId) {
    var integranteId = ciudadanoId;
    var notas = $("#IntegranteNota_" + integrantesAsociacionId).val();
    var puesto = $("#IntegrantePuesto_" + integrantesAsociacionId).val();
    var cbRepresentante = 0;

    console.log("integranteId: " + integranteId);
    console.log("notas: " + notas);
    console.log("puesto: " + puesto);

    if ($("#cboxAsisEvento_" + integrantesAsociacionId).is(":checked")) {
        cbRepresentante = 1;
    }
    $.ajax({
        type: "POST",
        url: "/Apoyo/Asociaciones/ActualizaIntegrante",
        data: { integrantesAsociacionId, idAsociacion, integranteId, puesto, notas, cbRepresentante },
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

    GeneraTablaIntegrantesAsociacion(idAsociacion);
}

/**********************************************************************************************
 * Muestra Complemento de Asociación
 **********************************************************************************************/
function MuestraComplementoAsociacion(idAsociacion) {
    GeneraTablaIntegrantesAsociacion(idAsociacion)
}

/**********************************************************************************************
 * Muestra DETALLE DE ASOCIACIÓN
 **********************************************************************************************/
function mostrarModalDetalleAsociacion(idAsociacion) {
    var indice = 0;
    var tablaHTML = "";
    console.log("valor de idAsociacion: " + idAsociacion);

    $("#modalMuestraDatosAsociacion").appendTo("body");
    $("#modalMuestraDatosAsociacion").modal("show");

    $("#DetalleAsociacion").html("");

    /* DETALLE DE ASOCIACION */

    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/ObtieneDetalleAsociacion",
        data: { idAsociacion },
        cache: false,
        async: false,  
        success: (response) => {
            $.each(response, (index, val) => {

                tablaHTML += "<div class='card'>";
                tablaHTML += "<h4 class='card-header' style='text-align: center; background-color: rgba(13, 77, 168, 1); color: white; border-radius: 10px 10px 10px 10px; padding:2px;'>DETALLE DE ASOCIACIÓN</h4>";
                tablaHTML += "<div class='card-body'>";
                tablaHTML += "<div class='card-body'>";
                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='30%'>Nombre</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='20%'>Representante</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='30%'>e-mail</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='20%'>Teléfono</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='30%'>" + val.nombre + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='20%'>" + val.presidente + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='30%'>" + val.email + "</td > ";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='20%'>" + val.telefono + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";
                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td class='fondoMenuFactor' width='30%' style='text-align: center; vertical-align: middle;'>Colonia</td>";
                tablaHTML += "<td class='fondoMenuFactor' width='40%' style='text-align: center; vertical-align: middle;'>Calle</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'># Exterior</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'># Interior</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'>CP</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='30%'>" + val.colonia + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='40%'>" + val.calle + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.numeroExterior + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.numeroInterior + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.cp + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";
                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr style='padding:2px;'>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoMenuFactorH' width='7%'>Notas</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='93%'>" + val.notas + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";
                tablaHTML += "</div >";
                tablaHTML += "</div >";
            });
        }
    });

    $("#DetalleAsociacion").html(tablaHTML);


    $("#IntegrantesAsociacionId").html("");

    /* INTEGRANTES DE LA ASOCIACIÓN */
    indice = 0;
    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaAsistentesNvoEvento'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='30%'>";
    tablaHTML += "Nombre";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Representante";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Puesto";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='27%'>";
    tablaHTML += "Nota";
    tablaHTML += "</td>";

    //tablaHTML += "<td style='text-align:center;padding:1px;' width='10%'>";
    //tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Asociaciones/ObtieneListaIntegrantesAsociacion",
        data: { idAsociacion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr id='AsociacionRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td>" + val.nombreCompleto + "</td>";

                if (val.representante == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }

                tablaHTML += "<td>" + val.puesto + "</td>";
                tablaHTML += "<td>" + val.nota + "</td>";
                //tablaHTML += "<td>";
                //tablaHTML += "<span class='fas fa-trash-alt' style='font-size:12px; cursor:pointer' title='Elimina Integrante' onclick='EliminaRowIntegrantesAsoc(" + val.asociacionID + "," + val.ciudadanoID + ");'></span>";
                //tablaHTML += "<span class='fas fa-save' style='font-size:12px; cursor:pointer' title='Actualiza Integrante' onclick='GuardaCambiosIntegranteAsoc(" + val.asociacionID + "," + val.ciudadanoID + "," + val.integrantesAsociacionID + ");'></span>";
                //tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
        }
    });
    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    if (indice > 0) {
        $("#IntegrantesAsociacionId").html(tablaHTML);
    }


}