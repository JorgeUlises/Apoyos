$('#FileUploadFormFileFoto').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));
})

$('#FileUploadFormFileINE').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));
})


const onInputNotas = event => {
    event.target.value = event.target.value.replace(/[\'\"\&#\\]/g, '')
}

/*********************************************************************************************************
 * Guarda Nuevo Ciudadano
 *********************************************************************************************************/
function GuardarNuevoCiudadano() {
    var DatosGuardados = false;
    var paterno = $("#IngresaPaterno").val().trim();
    var materno = $("#IngresaMaterno").val().trim();
    var nombre = $("#IngresaNombre").val();
    var fechaNacimiento = $("#FechaNacimiento").val();
    var genero = $("#opcionGeneroId").val();

    var coloniaId = $("#hColoniaBuscar").val();
    var calleId = $("#hCalleBuscar").val();
    var numExterior = $("#IngresaNumExt").val().trim();
    var numInterior = $("#IngresaNumInt").val().trim();
    var cp = $("#IngresaCP").val().trim();
    var email = $("#IngresaEmail").val().trim();
    var telefono = $("#IngresaTelefono").val().trim();
    var partido = $("#CatPartidoId").val();
    var miembro = $("#TipoMiembroId").val();
    var seccion = $("#IngresaSeccion").val().trim();
    var latitud = $("#Latitud").val().trim();
    var longitud = $("#Longitud").val().trim();
    var notas = $("#Notas").val().trim().replace(/\n/g, '&#13');
    var rfc = $("#RFCciudadanoSolicitante").val().trim();
    var cbCumple = 0;
    var curp = $("#CURPciudadanoSolicitante").val().trim();
    var cbAfin = 0;
    var cbRCasilla = 0;
    var cbDDigital = 0;
    var cbLNegra = 0;
    
    var municipio = $("#MunicipioId").val();
    var partidoId = $("#PartidoId").val();

    if ($("#cboxRecordarCumple").is(":checked")) {
        cbCumple = 1;
    }

    if ($("#cboxAfin").is(":checked")) {
        cbAfin = 1;
    }

    if ($("#cboxRCasilla").is(":checked")) {
        cbRCasilla = 1;
    }
    
    if ($("#cboxLNegra").is(":checked")) {
        cbLNegra = 1;
    }

    if ($("#cboxDDigital").is(":checked")) {
        cbDDigital = 1;
    }

    console.log("paterno: " + paterno);
    console.log("materno: " + materno);
    console.log("nombre: " + nombre);
    console.log("fechaNacimiento: " + fechaNacimiento);
    console.log("genero: " + genero);
    console.log("coloniaId: " + coloniaId);
    console.log("calleId: " + calleId);
    console.log("numExterior: " + numExterior);
    console.log("numInterior: " + numInterior);
    console.log("cp: " + cp);
    console.log("email: " + email);
    console.log("telefono: " + telefono);
    console.log("partido: " + partido);
    console.log("miembro: " + miembro);
    console.log("seccion: " + seccion);
    console.log("latitud: " + latitud);
    console.log("longitud: " + longitud);
    console.log("notas: " + notas);

    console.log("curp: " + curp);
    console.log("cbAfin: " + cbAfin);
    console.log("cbRCasilla: " + cbRCasilla);
    console.log("cbLNegra: " + cbLNegra);

    console.log("municipio: " + municipio);
    
    var datosCompletos = false;


    //if (nombre.length > 0) {
    //    if (email.length > 0 || telefono.length > 0) {
    //        datosCompletos = true;
    //    }
    //}

    if (nombre.length > 0) {
        if (coloniaId > 0 && calleId > 0) {
            datosCompletos = true;
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
        url: "/Apoyo/Ciudadanoes/InsertaNuevoCiudadano",
        cache: false,
        async: false,
        data: {
            paterno, materno, nombre, fechaNacimiento, genero, coloniaId, calleId, numExterior, numInterior, cp, email, telefono, partido, miembro, seccion, latitud, longitud, notas, rfc, curp, cbCumple, cbAfin, cbRCasilla, cbLNegra, municipio, partidoId, cbDDigital
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : -" + response + "-");

            switch (response) {
                case 0:
                    $("#mensajeAlerta_PersonaExistente").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_PersonaExistente').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = false;
                    break;
                case -1:
                    $("#mensajeAlerta_Error").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_Error').fadeOut('fast');
                    }, 2000);
                    $("#IngresaNumeroTurno").val("");
                    DatosGuardados = false;
                    break;
                default:
                    $("#mensajeAlerta_OK").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_OK').fadeOut('fast');
                    }, 2000);

                    $('#hCiudadanoId').val(response);
                    DatosGuardados = true;
                    break;
            }
        },
        error: function (response) {
            $("#mensajeAlerta_Error").show();
            setTimeout(function () {
                $('#mensajeAlerta_Error').fadeOut('fast');
            }, 2000);
            $("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        },
        failure: function (response) {
            $("#mensajeAlerta_Error").show();
            setTimeout(function () {
                $('#mensajeAlerta_Error').fadeOut('fast');
            }, 2000);
            $("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        }

    });


    if (DatosGuardados) {
        window.location.replace("/Apoyo/Ciudadanoes/Edit?id=" + $('#hCiudadanoId').val());
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
}


/*********************************************************************************************************
 * ACTUALIZA Ciudadano
 *********************************************************************************************************/
function ActualizaCiudadano() {
    var DatosGuardados = false;
    var paterno = $("#IngresaPaterno").val().trim();
    var materno = $("#IngresaMaterno").val().trim();
    var nombre = $("#IngresaNombre").val();
    var fechaNacimiento = $("#FechaNacimiento").val();
    var genero = $("#opcionGeneroId").val();

    var coloniaId = $("#hColoniaBuscar").val();
    var calleId = $("#hCalleBuscar").val();
    var numExterior = $("#IngresaNumExt").val().trim();
    var numInterior = $("#IngresaNumInt").val().trim();
    var cp = $("#IngresaCP").val().trim();
    var email = $("#IngresaEmail").val().trim();
    var telefono = $("#IngresaTelefono").val().trim();
    var partido = $("#CatPartidoId").val();
    var miembro = $("#TipoMiembroId").val();
    var seccion = $("#IngresaSeccion").val().trim();
    var latitud = $("#Latitud").val().trim();
    var longitud = $("#Longitud").val().trim();
    var notas = $("#Notas").val().trim().replace(/\n/g, '&#13');
    var rfc = $("#RFCciudadanoSolicitante").val().trim();

    var curp = $("#CURPciudadanoSolicitante").val().trim();
    var cbAfin = 0;
    var cbRCasilla = 0;
    var cbLNegra = 0;
    var cbDDigital = 0;

    var ciudadanoId = $("#hCiudadanoId").val();
    var cbCumple = 0;
    var url = $("#hURL").val();
    var nombreArchivoBd = $("#hNombreArchivoBD").val();
    var municipio = $("#EditMunicipioId").val();
    var partidoId = $("#PartidoId").val();

    if ($("#cboxRecordarCumple").is(":checked")) {
        cbCumple = 1;
    }

    if ($("#cboxAfin").is(":checked")) {
        cbAfin = 1;
    }

    if ($("#cboxRCasilla").is(":checked")) {
        cbRCasilla = 1;
    }

    if ($("#cboxLNegra").is(":checked")) {
        cbLNegra = 1;
    }

    if ($("#cboxDDigital").is(":checked")) {
        cbDDigital = 1;
    }

    console.log("paterno: " + paterno);
    console.log("materno: " + materno);
    console.log("nombre: " + nombre);
    console.log("fechaNacimiento: " + fechaNacimiento);
    console.log("genero: " + genero);
    console.log("coloniaId: " + coloniaId);
    console.log("calleId: " + calleId);
    console.log("numExterior: " + numExterior);
    console.log("numInterior: " + numInterior);
    console.log("cp: " + cp);
    console.log("email: " + email);
    console.log("telefono: " + telefono);
    console.log("partido: " + partido);
    console.log("miembro: " + miembro);
    console.log("seccion: " + seccion);
    console.log("latitud: " + latitud);
    console.log("longitud: " + longitud);
    console.log("notas: " + notas);




    var datosCompletos = false;


    if (nombre.length > 0) {
        if (email.length > 0 || telefono.length > 0) {
            datosCompletos = true;
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
        url: "/Apoyo/Ciudadanoes/ActualizaCiudadano",
        cache: false,
        async: false,
        data: {
            ciudadanoId, paterno, materno, nombre, fechaNacimiento, genero, coloniaId, calleId, numExterior, numInterior, cp, email, telefono, partido, miembro, seccion, latitud, longitud, notas, rfc, cbCumple, url, nombreArchivoBd, curp, cbAfin, cbRCasilla, cbLNegra, municipio, partidoId, cbDDigital
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : -" + response + "-");

            switch (response) {
                case 0:
                    $("#mensajeAlerta_PersonaExistente").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_PersonaExistente').fadeOut('fast');
                    }, 2000);
                    DatosGuardados = false;
                    break;
                case -1:
                    $("#mensajeAlerta_Error").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_Error').fadeOut('fast');
                    }, 2000);
                    $("#IngresaNumeroTurno").val("");
                    DatosGuardados = false;
                    break;
                default:
                    $("#mensajeAlerta_OK").show();
                    setTimeout(function () {
                        $('#mensajeAlerta_OK').fadeOut('fast');
                    }, 2000);

                    $('#hCiudadanoId').val(response);
                    DatosGuardados = true;
                    break;
            }
        },
        error: function (response) {
            $("#mensajeAlerta_Error").show();
            setTimeout(function () {
                $('#mensajeAlerta_Error').fadeOut('fast');
            }, 2000);
            $("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        },
        failure: function (response) {
            $("#mensajeAlerta_Error").show();
            setTimeout(function () {
                $('#mensajeAlerta_Error').fadeOut('fast');
            }, 2000);
            $("#IngresaNumeroTurno").val("");
            DatosGuardados = false;
        }

    });


    if (DatosGuardados) {
        window.location.replace("/Apoyo/Ciudadanoes/Edit?id=" + $('#hCiudadanoId').val());
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
}


/*********************************************************************************************************************
 * FILTRAR CIUDADANOS - Identifica opción seleccionada
 *********************************************************************************************************************/
$('#LegBusqueda').click(function () {
    FiltraCiudadanos();
});

$('#opcionMesCumple').click(function () {
    console.log("VALOR SELECCIONADO opcionMesCumple: " + $("#opcionMesCumple").val());
    FiltraCiudadanos();
});

$('#opcionGeneroId').click(function () {
    console.log("VALOR SELECCIONADO opcionGeneroId: " + $("#opcionGeneroId").val());
    FiltraCiudadanos();
});

$('#opcionCumpleId').click(function () {
    console.log("VALOR SELECCIONADO opcionCumpleId: " + $("#opcionCumpleId").val());
    FiltraCiudadanos();
});


$('#MunicipioBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#MunicipioBusqueda").val());
    FiltraCiudadanos();
});

$('#PartidoBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#PartidoBusqueda").val());
    FiltraCiudadanos();
});

//$('#OrigenBusqueda').click(function () {
//    console.log("VALOR SELECCIONADO: " + $("#OrigenBusqueda").val());
//    FiltraCiudadanos();
//});

//$('#EstatusBusqueda').click(function () {
//    console.log("VALOR SELECCIONADO: " + $("#EstatusBusqueda").val());
//    FiltraCiudadanos();
//});

//$('#HitoBusqueda').click(function () {
//    console.log("VALOR SELECCIONADO: " + $("#HitoBusqueda").val());
//    FiltraCiudadanos();
//});

//$('#AsociacionBusqueda').click(function () {
//    console.log("VALOR SELECCIONADO: " + $("#AsociacionBusqueda").val());
//    FiltraCiudadanos();
//});

//$('#DependenciaBusqueda').click(function () {
//    console.log("VALOR SELECCIONADO: " + $("#DependenciaBusqueda").val());
//    FiltraCiudadanos();
//});

/*********************************************************************************************************************
 * FILTRAR CIUDADANO
 *********************************************************************************************************************/
function FiltraCiudadanos() {

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    //console.log("...Filtra Peticiones de Apoyo: -" + RegXpag + "-" + offsetSolicitudes + "-->" + $("#hideFechaInicioRegistro").val());

    GeneraTablaCiudadanos(RegXpag, offsetSolicitudes);
}


/***************************************
 * Busqueda Rápida Gestión
 ***************************************/
function BusqudaRapCiudadano() {
    var valorBR = $('#BRciudadanoId').val().trim();
    $("#IngresaNombre").val(valorBR);
    FiltraCiudadanos()
}


/*********************************************************************************************************************
 * Muestra Tabla de Solicitud de Apoyos 
 *********************************************************************************************************************/
function GeneraTablaCiudadanos(RegXpag, offsetPeticiones) {
    var pagina = 1;

    var Nombre = $("#IngresaNombre").val();
    var MesCumple = $("#opcionMesCumple").val();
    var Colonia = $("#coloniasBuscarCiudadano").val();
    var Calle = $("#callesBuscarCiudadano").val();

    var Municipio = $("#MunicipioBusqueda").val();

    var CP = $("#IngresaCP").val();
    var Email = $("#IngresaEmail").val();
    var Telefono = $("#IngresaTelefono").val();
    var Genero = $("#opcionGeneroId").val();
    var cumple = $("#opcionCumpleId").val();


    var BpartidoId = $("#PartidoBusqueda").val();
    var Blider = 0;
    var Bafin = 0;
    var BrCasilla = 0;
    var BlNegra = 0;
    var BdDigital = 0;

    if ($("#cboxLider").is(":checked")) {
        Blider = 1;
    }
    if ($("#cboxAfin").is(":checked")) {
        Bafin = 1;
    }
    if ($("#cboxRCasilla").is(":checked")) {
        BrCasilla = 1;
    }
    if ($("#cboxLNegra").is(":checked")) {
        BlNegra = 1;
    }
    if ($("#cboxDDigital").is(":checked")) {
        BdDigital = 1;
    }


    var numeroRegistrosFiltrados = 0;

    var numeroRegistros = ObtieneNumCiudadanos();
    var numeroRegistrosFiltrados = ObtieneNumCiudadanosFiltrados(RegXpag, offsetPeticiones, Nombre, MesCumple, Colonia, Calle, CP, Email, Telefono, Genero, cumple, Municipio, BpartidoId, Blider, Bafin, BrCasilla, BlNegra, BdDigital);

    $("#labelNumeroRegistros").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    $("#labelNumeroRegistros_footer").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);

    DibujaTablaCiudadanos(RegXpag, offsetPeticiones, pagina, Nombre, MesCumple, Colonia, Calle, CP, Email, Telefono, Genero, cumple, Municipio, BpartidoId, Blider, Bafin, BrCasilla, BlNegra, BdDigital)

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
                DibujaTablaCiudadanos(RegXpag, RegXpag * (page - 1), page, Nombre, MesCumple, Colonia, Calle, CP, Email, Telefono, Genero, cumple, Municipio, BpartidoId, Blider, Bafin, BrCasilla, BlNegra, BdDigital);
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
function DibujaTablaCiudadanos(RegXpag, offsetPeticiones, pagina, Nombre, MesCumple, Colonia, Calle, CP, Email, Telefono, Genero, cumple, Municipio, BpartidoId, Blider, Bafin, BrCasilla, BlNegra, BdDigital) {
    var indice = 0;
    var fechFormateada;
    var tablaHTML = "";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>RFC</th>";
    tablaHTML += "<th width='9%' style='text-align:center;'>Nombre</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Paterno</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Materno</th>";

    tablaHTML += "<th width='15%' style='text-align:center;'>Colonia</th>";
    //tablaHTML += "<th width='15%' style='text-align:center;'>Calle</th>";
    //tablaHTML += "<th width='5%' style='text-align:center;'># Externo</th>";
    //tablaHTML += "<th width='5%' style='text-align:center;'># Interno</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Fecha Nacimiento</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Cumpleaños</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>CP</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>e-mail</th>";
    tablaHTML += "<th width='7%' style='text-align:center;'>Teléfono</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Género</th>";
    tablaHTML += "<th width='3%' style='text-align:center;'>Opciones</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneCiudadanos",
        data: { RegXpag, offsetPeticiones, Nombre, MesCumple, Colonia, Calle, CP, Email, Telefono, Genero, cumple, Municipio, BpartidoId, Blider, Bafin, BrCasilla, BlNegra, BdDigital },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = (pagina - 1) * RegXpag + index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.rfc + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Ciudadano'> <a href='/Apoyo/Ciudadanoes/DetalleCiudadano?id=" + val.ciudadanoID + "'>" + val.nombre + "</a></span></td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.paterno + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.materno + "</td>";

                //tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.nombre + "</td>";

                

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.colonia + "</td>";
                /*tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.calle + "</td>";*/
                //tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numeroExterior + "</td>";
                //tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numeroInterior + "</td>";

                fechFormateada = moment(val.fechaNacimiento).format('DD/MM/yyyy');
                if (fechFormateada == "01/01/1900") {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + moment(val.fechaNacimiento).format('DD/MM/yyyy') + "</td>";
                }

                if (val.recordarCumple == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;'></td>";
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.cp + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.email + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.telefono + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.genero + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                tablaHTML += "<a href='/Apoyo/Ciudadanoes/Edit/" + val.ciudadanoID + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Ciudadano'></span></a>";
                tablaHTML += "<a href='/Apoyo/Ciudadanoes/Delete/" + val.ciudadanoID + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Registro de Ciudadano'></span></a>";
                tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            $("#divCiudadanos").html(tablaHTML);
        }
    });
}

/*********************************************************************************************************************
 * Obtiene el total de Ciudadanos
 *********************************************************************************************************************/
function ObtieneNumCiudadanos() {
    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/numeroCiudadanos",
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
function ObtieneNumCiudadanosFiltrados(RegXpag, offsetPeticiones, Nombre, MesCumple, Colonia, Calle, CP, Email, Telefono, Genero, cumple, Municipio, BpartidoId, Blider, Bafin, BrCasilla, BlNegra, BdDigital) {
    var numeroRegistrosFiltrados = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneCiudadanosXfiltro",
        data: { RegXpag, offsetPeticiones, Nombre, MesCumple, Colonia, Calle, CP, Email, Telefono, Genero, cumple, Municipio, BpartidoId, Blider, Bafin, BrCasilla, BlNegra, BdDigital },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistrosFiltrados = response;
            $("#hideNumRegistros").val(numeroRegistrosFiltrados);
        }
    });
    return numeroRegistrosFiltrados;
}


/***********************************************************************************
 * Subir Archivo de Foto Ciudadano
 ***********************************************************************************/
function subirArchivosFotoButton(nombreArchivoAsubir, CiudadanoId) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    //var CiudadanoId = $('#hCiudadanoId').val();

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("CiudadanoId", CiudadanoId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + CiudadanoId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Ciudadanoes/SubirFotoCiudadano",
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
            console.log('El archivo ha sido subido-->' + response.serverMessage);
            $("#imaForoCiudadano").removeAttr("src").attr('src', response.serverMessage + '?v=${new Date().getTime()}');
        },
        error: function (error) {
            console.log('Error al subir el archivo');
            console.log("MENSAJE ERROR AL SUBIR ARCHIVO: " + response.serverMessage);
        }
    });
}


/***********************************************************************************
 * Subir Archivo de INE Ciudadano
 ***********************************************************************************/
function subirArchivosINEButton(nombreArchivoAsubir, CiudadanoId) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("CiudadanoId", CiudadanoId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + CiudadanoId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Ciudadanoes/SubirINECiudadano",
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
            console.log('El archivo ha sido subido-->' + response.serverMessage);
            $("#imaINE_Ciudadano").removeAttr("src").attr('src', response.serverMessage + '?v=${new Date().getTime()}');
        },
        error: function (error) {
            console.log('Error al subir el archivo');
            console.log("MENSAJE ERROR AL SUBIR ARCHIVO: " + response.serverMessage);
        }
    });
}

/**********************************************************************************************
 * Muestra DETALLE DE CIUDADANO
 **********************************************************************************************/
function muestraDetalleCiudadano(idCiudadano) {
    var indice = 0;
    var tablaHTML = "";
    var fechaN;
    var fechaE;
    var LegislaturaID = 2;
    console.log("valor de idCiudadano: " + idCiudadano);

    $("#DetalleCiudadano").html("");

    /* DETALLE DE CIUDADANO */

    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneDetalleCiudadanos",
        data: { idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                tablaHTML += "<img src='" + val.url + "' height='60' />";
                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='15%'>RFC</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='15%'>Nombres</td > ";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='15%'>Paterno</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='15%'>Materno</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'>Cumpleaños</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='15%'>Fecha Nacimiento</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='15%'>Genero</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='15%'>" + val.rfc + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='15%'>" + val.nombre + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='15%'>" + val.paterno + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='15%'>" + val.materno + "</td>";

                if (val.recordarCumple == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='10%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }
                fechaN = moment(val.fechaNacimiento).format('DD/MM/yyyy');
                if (fechaN != '01/01/1900') {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + fechaN + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }
                
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + val.genero + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";



                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='20%'>CURP</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='20%'>Afin</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='20%'>Representante de Casilla</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='20%'>Lista Negra</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='20%'>Distrito Digital</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='20%'>" + val.curp + "</td>";

                if (val.afin == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='20%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }

                if (val.rcasilla == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='20%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }

                if (val.noafin == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='20%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }

                if (val.dDigital == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='20%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }
                

                tablaHTML += "</tr>";
                tablaHTML += "</table>";


                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td class='fondoMenuFactor' width='20%' style='text-align: center; vertical-align: middle;'>Colonia</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;'class='fondoMenuFactor' width='30%'>Calle</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;'class='fondoMenuFactor' width='20%'>Municipio</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'># Exterior</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'># Interior</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'>CP</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='20%'>" + val.colonia + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='30%'>" + val.calle + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='20%'>" + val.municipio + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.numeroExterior + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.numeroInterior + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.cp + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";

                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='40%'>e-mail</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='30%'>Teléfono</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'>Partido</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'>Miembro</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoMenuFactor' width='10%'>Sección</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='40%'>" + val.email + "</td>";
                tablaHTML += "<td style='text-align: center; color: black; padding: 2px;' width='30%'>" + val.telefono + "</td>";

                if (val.logoPartido.length > 0) {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'><img src='/Apoyo/Images/" + val.logoPartido + "' height='20' style='border-radius: 0px; padding: 0px;'/>&nbsp" + val.partido + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.partido + "</td>";
                }
                

                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.tipoMiembro + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='10%'>" + val.seccion + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";


                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr style='padding:2px;'>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoMenuFactorH' width='10%'>Notas</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='90%'>" + val.notas + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";

                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr style='padding: 2px;'>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoMenuFactorH' width='15%'>";
                tablaHTML += "<label class='control-label'>Latitud</label>";
                tablaHTML += "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='15%'>";
                tablaHTML += "<input type='text' class='form-control' value='" + val.latitud + "'/>";
                tablaHTML += "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoMenuFactorH' width='15%'>";
                tablaHTML += "<label class='control-label'>Longitud</label>";
                tablaHTML += "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='15%'>";
                tablaHTML += "<input type='text' class='form-control' value='" + val.longitud + "'/>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";

            });
        }
    });

    $("#DetalleCiudadano").html(tablaHTML);

    // PETICIONES REALIZADAS X UN CIUDADANO

    tablaHTML = "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='13%' style='text-align:center;'>Fecha Registro</th>";
    tablaHTML += "<th width='20%' style='text-align:center;'>Nombre Solicitante</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripcion</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Categoría-Subcategoría</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Costo</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Estatus</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Días Transcurridos</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Días Solución</th>";
    tablaHTML += "<th width='3%' style='text-align:center;'>Opciones</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtienePeticionesXciudadano",
        data: { LegislaturaID, idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fechaSolicitud + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.nombreCompleto + "</td>";

                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitud(" + val.peticionId + ");'>(" + val.peticionId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitud(" + val.peticionId + ");'>" + val.descripcion + "</span></td>";

                tablaHTML += "<td style='vertical-align: middle; padding:1px;'>";
                tablaHTML += "<table class='table table-bordered table-striped'>";

                for (var elemento in val.detalleCategoriaSubcategoria) {
                    tablaHTML += "<tr>";

                    tablaHTML += "<td width='42%' style='vertical-align: middle; padding:1px;'>";
                    tablaHTML += val.detalleCategoriaSubcategoria[elemento].categoria;
                    tablaHTML += "</td>";

                    tablaHTML += "<td width='48%' style='vertical-align: middle; padding:1px;'>";
                    tablaHTML += val.detalleCategoriaSubcategoria[elemento].subcategoria;
                    tablaHTML += "</td>";

                    tablaHTML += "</tr>";
                }

                tablaHTML += "</table>";
                tablaHTML += "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.costo + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasTranscurridos + "</td>";
                if (val.diasSolucion != -1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasSolucion + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }


                tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            if (indice == 0) {
                $("#divSolicitudesCiudadano").html("");
            } else {
                $("#divSolicitudesCiudadano").html(tablaHTML);
            }
            
        }
    });



    // GESTIONES REALIZADAS X UN CIUDADANO

    tablaHTML = "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='13%' style='text-align:center;'>Fecha Registro</th>";
    tablaHTML += "<th width='20%' style='text-align:center;'>Nombre Solicitante</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripcion</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Categoría-Subcategoría</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Costo</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Estatus</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Días Transcurridos</th>";
    tablaHTML += "<th width='4%' style='text-align:center;'>Días Solución</th>";
    tablaHTML += "<th width='3%' style='text-align:center;'>Opciones</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneGestionesXciudadano",
        data: { LegislaturaID, idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fechaSolicitud + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.nombreCompleto + "</td>";

                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitudGestion(" + val.gestionId + ");'>(" + val.gestionId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitudGestion(" + val.gestionId + ");'>" + val.descripcion + "</span></td>";

                tablaHTML += "<td style='vertical-align: middle; padding:1px;'>";
                tablaHTML += "<table class='table table-bordered table-striped'>";

                for (var elemento in val.detalleCategoriaSubcategoria) {
                    tablaHTML += "<tr>";

                    tablaHTML += "<td width='42%' style='vertical-align: middle; padding:1px;'>";
                    tablaHTML += val.detalleCategoriaSubcategoria[elemento].categoria;
                    tablaHTML += "</td>";

                    tablaHTML += "<td width='48%' style='vertical-align: middle; padding:1px;'>";
                    tablaHTML += val.detalleCategoriaSubcategoria[elemento].subcategoria;
                    tablaHTML += "</td>";

                    tablaHTML += "</tr>";
                }

                tablaHTML += "</table>";
                tablaHTML += "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.costo + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasTranscurridos + "</td>";
                if (val.diasSolucion != -1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasSolucion + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }


                tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                tablaHTML += "<a href='/Apoyo/Gestiones/Edit/" + val.gestionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                tablaHTML += "<a href='/Apoyo/Gestiones/Delete/" + val.gestionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            
            if (indice == 0) {
                $("#divSolicitudesGestionCiudadano").html("");
            } else {
                $("#divSolicitudesGestionCiudadano").html(tablaHTML);
            }
        }
    });


// PETICIÓN - BENEFICIOS RECIBIDOS X CIUDADANO

    tablaHTML = "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Apoyo</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Estatus</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Fecha Solicitud</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Fecha Conclusión</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripción de Apoyo</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Hito</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneBeneficiosXciudadano",
        data: { idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.folio + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitud(" + val.peticionId + ");'>(" + val.peticionId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitud(" + val.peticionId + ");'>" + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.fechaSolicitud + "</td>";

                fechaN = moment(val.fechaSolicitud).format('DD/MM/yyyy');
                if (fechaN != '01/01/1900') {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + fechaN + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }

                //tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.fechaConclusion + "</td>";

                fechaN = moment(val.fechaConclusion).format('DD/MM/yyyy');
                if (fechaN != '01/01/1900') {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + fechaN + "</td>";
                } else {
                    tablaHTML += "<td></td>";

                }
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.notas + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.hito + "</td>";
                if (val.hito == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='10%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            
            if (indice == 0) {
                $("#divBeneficios").html("");
            } else {
                $("#divBeneficios").html(tablaHTML);
            }
        }
    });


    // GESTIÓN - BENEFICIOS RECIBIDOS X CIUDADANO

    tablaHTML = "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Gestión</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Estatus</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Fecha Solicitud</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Fecha Conclusión</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripción de Apoyo</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Hito</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneBeneficiosXciudadano_Gestion",
        data: { idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.folio + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Gestión' onclick='mostrarModalDetalleSolicitudGestion(" + val.gestionId + ");'>(" + val.gestionId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Gestión' onclick='mostrarModalDetalleSolicitudGestion(" + val.gestionId + ");'>" + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.fechaSolicitud + "</td>";

                fechaN = moment(val.fechaSolicitud).format('DD/MM/yyyy');
                if (fechaN != '01/01/1900') {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + fechaN + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }

                fechaN = moment(val.fechaConclusion).format('DD/MM/yyyy');
                if (fechaN != '01/01/1900') {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + fechaN + "</td>";
                } else {
                    tablaHTML += "<td></td>";

                }
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.notas + "</td>";

                if (val.hito == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='10%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            
            if (indice == 0) {
                $("#divBeneficios_Gestion").html("");
            } else {
                $("#divBeneficios_Gestion").html(tablaHTML);
            }
        }
    });

    // ASISTENCIA A EVENTOS X CIUDADANO

    tablaHTML = "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Evento</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Fecha</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Tipo</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Asistencia</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneAsisEventoXciudadano",
        data: { idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.folio + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>(" + val.eventoId + ") " + val.nombreEvento + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Evento' onclick='mostrarModalDetalleEvento(" + val.eventoId + ");'>" + val.nombreEvento + "</span></td>";

                fechaE = moment(val.fechaEvento).format('DD/MM/yyyy');
                if (fechaE != '01/01/1900') {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + fechaE + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.tipoEvento + "</td>";
                if (val.asistencia == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='10%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            
            if (indice == 0) {
                $("#divAsistenciaEventos").html("");
            } else {
                $("#divAsistenciaEventos").html(tablaHTML);
            }
        }
    });


    // ASOCIACIONES A LAS QUE PERTENECE UN CIUDADANO

    tablaHTML = "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='48%' style='text-align:center;'>Asociación</th>";
    tablaHTML += "<th width='45%' style='text-align:center;'>Puesto</th>";
    tablaHTML += "<th width='5%' style='text-align:center;'>Representante</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneAsociacionesParticipa",
        data: { idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.nombre + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Asociación' onclick='mostrarModalDetalleAsociacion(" + val.asociacionId + ");'>" + val.nombre + "</span></td>";



                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.puesto + "</td>";

                if (val.representante == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='10%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; padding: 2px; vertical-align: middle;' width='10%'></td>";
                }
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            
            if (indice == 0) {
                $("#divAsociacionesPertenece").html("");
            } else {
                $("#divAsociacionesPertenece").html(tablaHTML);
            }
        }
    });


    // PROMOCIONALES

    var indice = 0;
    var fechFormateada;
    var tablaHTML = "";

    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;' id='TablaPublicidadXciudadano'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='5%'>";
    tablaHTML += "Folio";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='10%'>";
    tablaHTML += "Ciudadano";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='10%'>";
    tablaHTML += "Tipo";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='12%'>";
    tablaHTML += "Tamaño";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='15%'>";
    tablaHTML += "Colonia";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='15%'>";
    tablaHTML += "Calle";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='5%'>";
    tablaHTML += "Número";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='18%'>";
    tablaHTML += "Archivos";
    tablaHTML += "</th>";
    tablaHTML += "<th colspan='2' style='text-align:center; vertical-align:middle;' width='7%'>";
    tablaHTML += "</th>";


    tablaHTML += "</tr>";
    tablaHTML += "</thead'>";
    tablaHTML += "<tbody'>";

    var selAux = "";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Publicidad/ObtieneListadoPublicidadXciudadano",
        data: { idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                selAux = "";
                tablaHTML += "<tr id='PersPubRenglon_" + indice + "'>";

                tablaHTML += "<td style='text-align:center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.publicidadBase.folio + "</td>";
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.nombreCiudadano + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Publicidad' onclick='mostrarModalDetallePublicidad(" + val.publicidadBase.publicidadId + "," + val.publicidadBase.ciudadanoId + "); '>" + val.tipoPublicidad + "</span></td>";

                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.publicidadBase.tamaño + "</td>";
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.nombreColonia + "</td>";
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.nombreCalle + "</td>";
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.publicidadBase.numExterior + "</td>";

                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>";
                if (val.archivosRelacionadosPublicidad.length != 0) {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    var indiceArch = 0;
                    for (const elemento in val.archivosRelacionadosPublicidad) {
                        indiceArch++;
                        tablaHTML += "<tr style='border:none;'>";
                        tablaHTML += "<td style='border:none;' width='5%'>" + indiceArch + "</td>";
                        tablaHTML += "<td style='border:none; width:65%'><a href='" + val.archivosRelacionadosPublicidad[elemento].url + "' target='_blank' title='" + val.archivosRelacionadosPublicidad[elemento].nombreArchivo + "'>" + val.archivosRelacionadosPublicidad[elemento].nombreArchivo.substring(0, 20) + "</a></td>";
                        tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
                        //tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Archivo' onclick='EliminaArchivoPublicidad(" + val.archivosRelacionadosPublicidad[elemento].archivosPublicidadId + "," + val.publicidadBase.publicidadId + ");'>&nbsp;</span>";
                        //tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
                        tablaHTML += "</td>";
                        tablaHTML += "</tr>";
                    }
                    tablaHTML += "</table>";
                } else {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    tablaHTML += "<tr style='border:none;'>";
                    tablaHTML += "<td style='border:none; width:5%'></td>";
                    tablaHTML += "<td style='border:none; width:65%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
                    tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
                    //tablaHTML += "<span class='fas fa-trash' style='color:#D3D3D3;' title='Elimina Archivo' disabled>&nbsp;</span>";
                    //tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
                    tablaHTML += "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }
                tablaHTML += "</td>";

                tablaHTML += "<td colspan='2' style='text-align:center; vertical-align:middle;'>";
                //tablaHTML += "<span class='fas fa-edit' style='cursor:pointer;' title='Edita Registro de Publicidad' onclick='MostrarModalEditarPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
                //tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Registro de Publicidad' onclick='EliminaRegistroPublicidad(" + val.publicidadBase.publicidadId + ");'>&nbsp;</span>";
                tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    if (indice == 0) {
        $("#divListaLonasBardasXpersona").html("");
    } else {
        $("#divListaLonasBardasXpersona").html(tablaHTML);
    }
}

function SeleccionaMes(mesNum) {
    var tablaHTML = "";
    for (i = 1; i <= 12; i++) {
        $("#Mes_" + i).removeClass('fondoAzul_p_LetraNegra_2');
        $("#Mes_" + i).addClass('fondoMenuFactor');
    }

    $("#Mes_" + mesNum).removeClass('fondoMenuFactor');
    $("#Mes_" + mesNum).addClass('fondoAzul_p_LetraNegra_2');

    $("#cumplesMes").html(nombreMes(mesNum));

    tablaHTML = "<h3>" + nombreMes(mesNum) + "</h3>"
    // CUMPLEAÑOS DEL MES

    tablaHTML += "<table class='table' style = 'width:90%;padding: 2px; border:none;'>";
    //tablaHTML += "<thead>";
    //tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    //tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    //tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    //tablaHTML += "<th width='25%' style='text-align:center;'>Evento</th>";
    //tablaHTML += "<th width='10%' style='text-align:center;'>Fecha</th>";
    //tablaHTML += "<th width='10%' style='text-align:center;'>Tipo</th>";
    //tablaHTML += "<th width='5%' style='text-align:center;'>Asistencia</th>";
    //tablaHTML += "</tr>";
    //tablaHTML += "</thead>";

    tablaHTML += "<tbody>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneCumplesXmes",
        data: { mesNum },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                if (val.hoy == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><div class='numberCircleCumple'>" + val.diaNumero + "</div></td>";
                    tablaHTML += "<td><a href='https://api.whatsapp.com/send?phone=52" + val.telefono + "&text=¡Felicidades!' target='_blank' rel='noopener'><img src='/Apoyo/Images/logo_whats.svg' height='30'/></a></td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><div class='numberCircle'>" + val.diaNumero + "</div></td>";
                    tablaHTML += "<td></td>";
                }
                
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diaNombre + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='" + val.urlFoto + "' height='30' class='rounded-circle img-no-padding img-responsive'/></td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.nombre + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Ciudadano'> <a href='/Apoyo/Ciudadanoes/DetalleCiudadano?id=" + val.ciudadanoID + "'>" + val.nombre + "</a></span></td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.asociacion + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.puesto + "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            $("#cumplesMes").html(tablaHTML);
        }
    });
}



function nombreMes(valMes) {
    switch (valMes) {
        case 1:
            return "ENERO";
            break;
        case 2:
            return "FEBRERO";
            break;
        case 3:
            return "MARZO";
            break;
        case 4:
            return "ABRIL";
            break;
        case 5:
            return "MAYO";
            break;
        case 6:
            return "JUNIO";
            break;
        case 7:
            return "JULIO";
            break;
        case 8:
            return "AGOSTO";
            break;
        case 9:
            return "SEPTIEMBRE";
            break;
        case 10:
            return "OCTUBRE";
            break;
        case 11:
            return "NOVIEMBRE";
            break;
        case 12:
            return "DICIEMBRE";
            break;
    }
}


/******************************************************************************
 * Validad que se proporcionen sólo Números - y .
 ******************************************************************************/
function validaNumerosPuntoMenos(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /^[0-9-.]*$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

