$('#FileUploadFormFileIniciativa').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));
})

/*********************************************************************************************************
 * Guarda Nueva Iniciativa
 *********************************************************************************************************/
function GuardarNuevaIniciativa() {
    var DatosGuardados = false;
    var LegislaturaId = $("#LegislaturaId").val();
    var TipoIniciativaId = $("#TipoIniciativaId").val();
    var PresidenteId = $("#PresidenteId").val();
    var PromotorId = $("#PromotorId").val();

    var FolioIniciativa = $("#inputFolioIniciativa").val().trim();

    var NumSecuencial = $("#NumSecuencial").val().trim();
    var TituloIni = $("#TituloIni").val();
    var ClasificacionIni = $("#opcionOrigenIniId").val();
    var EstatusIniciativaId = $("#EstatusIniciativaId").val();
    var LinkPagina = $("#LinkPagina").val().trim();

    var FechaRecibidoIni = $("#FechaRecibidoIni").val();
    var FechaComisionIni = $("#FechaComisionIni").val();
    var FechaPlenoIni = $("#FechaPlenoIni").val();
    var FechaPublicaIni = $("#FechaPublicaIni").val();

    var DescripcionIni = $("#DescripcionIni").val().trim();

    var datosCompletos = false;


    if (ClasificacionIni == "-1") {
        ClasificacionIni = "";
    }

    if (TituloIni != "") {
        datosCompletos = true;
    }

    if (TipoIniciativaId > 0) {
        datosCompletos = true;
    } else {
        datosCompletos = false;
    }

    if (EstatusIniciativaId > 0) {
        datosCompletos = true;
    } else {
        datosCompletos = false;
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
        url: "/Apoyo/Iniciativas/InsertaNuevaIniciativa",
        cache: false,
        async: false,
        data: {
            LegislaturaId, TipoIniciativaId, PresidenteId, PromotorId, FolioIniciativa, NumSecuencial, TituloIni, ClasificacionIni, EstatusIniciativaId, LinkPagina, FechaRecibidoIni, FechaComisionIni, FechaPlenoIni, FechaPublicaIni, DescripcionIni
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
        window.location.replace("/Apoyo/Iniciativas/");
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
}

/************************************************************************************************************************
 *  Cierra la ventana Modal Derecha de INICIATIVA
 ************************************************************************************************************************/
function cierraModalDerechoIniciativas() {
    window.location.replace("/Apoyo/Iniciativas/");
}


/************************************************************************************************************************
 *  EDITAR Datos de INICIATIVA
 ************************************************************************************************************************/
function ObtieneDatosIniciativa(IniciativaId) {

    $("#hEditaIniciativaid").val(IniciativaId);
    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/GetDatosIniciativa",
        data: { IniciativaId },
        cache: false,
        async: false,
        success: (response) => {

            //console.log("TAMAÑO: " + );

            $('#LegislaturaId_Edit').val(response.iniciativadBase.legislaturaId);
            $('#TipoIniciativaId_Edit').val(response.iniciativadBase.catTipoIniciativaId);
            $('#inputFolioIniciativa_Edit').val(response.iniciativadBase.numTurno);
            $('#opcionOrigenIniId_Edit').val(response.iniciativadBase.clasificacion);
            $('#EstatusIniciativaId_Edit').val(response.iniciativadBase.estatusIniciativaId);

            $('#TituloIni_Edit').val(response.iniciativadBase.titulo);
            $('#DescripcionIni_Edit').val(response.iniciativadBase.notas);

            $('#PresidenteId_Edit').val(response.iniciativadBase.presidenteId);
            $('#PromotorId_Edit').val(response.iniciativadBase.promotorId);
            $('#NumSecuencial_Edit').val(response.iniciativadBase.numeroSecuencial);
            $('#LinkPagina_Edit').val(response.iniciativadBase.linkReferencia);

            console.log("FECHA REGISTRO INICIATIVA: " + response.iniciativadBase.fechaRecibido.substring(0, 10));
            const Frecibido = response.iniciativadBase.fechaRecibido.substring(0, 10).split("-");
            const Fcomision = response.iniciativadBase.fechaAprobacionComision.substring(0, 10).split("-");
            const Fpleno = response.iniciativadBase.fechaAprobabcionPleno.substring(0, 10).split("-");
            const Fpublicacion = response.iniciativadBase.fechaPublicacionSa.substring(0, 10).split("-");
            //console.log("*** FECHA REGISTRO INICIATIVA: " + F1[2] + "/" + F1[1] + "/" + F1[0]);

            $('#FechaRecibidoIni_Edit').val(Frecibido[0] + "-" + Frecibido[1] + "-" + Frecibido[2]);
            $('#FechaComisionIni_Edit').val(Fcomision[0] + "-" + Fcomision[1] + "-" + Fcomision[2]);
            $('#FechaPlenoIni_Edit').val(Fpleno[0] + "-" + Fpleno[1] + "-" + Fpleno[2]);
            $('#FechaPublicaIni_Edit').val(Fpublicacion[0] + "-" + Fpublicacion[1] + "-" + Fpublicacion[2]);

            //$('#FechaComisionIni_Edit').val(response.iniciativadBase.fechaAprobacionComision);
            //$('#FechaPlenoIni_Edit').val(response.iniciativadBase.fechaAprobabcionPleno);
            //$('#FechaBajaIni_Edit').val(response.iniciativadBase.fechaPublicacionSa);

        },
        error: function (response) {
            $("#msg_ErrorCatSubCat").show();
            setTimeout(function () {
                $('#msg_ErrorCatSubCat').fadeOut('fast');
            }, 2000);
            LecturaDatosPublicidad = false;
        }
    });

    GeneraTablaDeDiputados();
    GeneraTablaDeComisiones();
    GeneraTablaArchivosAnexosIniciativa(IniciativaId);
}


/************************************************************************************************************************
 *  Guarda Actualización DE INICIATIVA
 ************************************************************************************************************************/
function GuardarActualizacionIniciativa() {
    var IniciativaId = $("#hEditaIniciativaid").val();
    var DatosGuardados = false;
    var datosCompletos = false;

    var LegislaturaId = $("#LegislaturaId_Edit").val();
    var TipoIniciativaId = $("#TipoIniciativaId_Edit").val();
    var FolioIniciativa = $("#inputFolioIniciativa_Edit").val().trim();
    var ClasificacionIni = $("#opcionOrigenIniId_Edit").val();
    var PresidenteId = $("#PresidenteId_Edit").val();
    var PromotorId = $("#PromotorId_Edit").val();
    var EstatusIniciativaId = $("#EstatusIniciativaId_Edit").val();
    var TituloIni = $("#TituloIni_Edit").val();
    var DescripcionIni = $("#DescripcionIni_Edit").val().trim();
    var NumSecuencial = $("#NumSecuencial_Edit").val().trim();
    var LinkPagina = $("#LinkPagina_Edit").val().trim();

    var FechaRecibidoIni = $("#FechaRecibidoIni_Edit").val();
    var FechaComisionIni = $("#FechaComisionIni_Edit").val();
    var FechaPlenoIni = $("#FechaPlenoIni_Edit").val();
    var FechaPublicaIni = $("#FechaPublicaIni_Edit").val();



    var datosCompletos = false;


    if (TituloIni != "") {
        datosCompletos = true;
    }

    if (!datosCompletos) {
        $("#msgAlerta_DatosIncompletos").show();
        setTimeout(function () {
            $('#msgAlerta_DatosIncompletos').fadeOut('fast');
        }, 3000);
        return;
    }

    datosCompletos = true;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Iniciativas/ActualizaIniciativa",
        cache: false,
        async: false,
        data: {
            IniciativaId, LegislaturaId, TipoIniciativaId, PresidenteId, PromotorId, FolioIniciativa, NumSecuencial, TituloIni, ClasificacionIni, EstatusIniciativaId, LinkPagina, FechaRecibidoIni, FechaComisionIni, FechaPlenoIni, FechaPublicaIni, DescripcionIni
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : -" + response + "-");

            switch (response) {
                case -1:
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
                    $("#hPeticionId").val(response);
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
        ObtieneDatosIniciativa(IniciativaId)
    }
}

/*********************************************************************************************************************
 * FILTRAR INICIATIVAS - Identifica opción seleccionada
 *********************************************************************************************************************/
$('#TipoIniciativaId_B').click(function () {
    FiltraIniciativa();
});

$('#EstatusIniciativaId_B').click(function () {
    FiltraIniciativa();
});

$('#PresidenteId_B').click(function () {
    FiltraIniciativa();
});

$('#PromotorId_B').click(function () {
    FiltraIniciativa();
});



/*********************************************************************************************************************
 * FILTRAR INICIATIVA
 *********************************************************************************************************************/
function FiltraIniciativa() {

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    console.log("...Filtra Peticiones de Apoyo: -" + RegXpag + "-" + offsetSolicitudes + "-->" + $("#hideFechaInicioRegistro").val());

    GeneraTablaIniciativas(RegXpag, offsetSolicitudes);
}


/***************************************
 * Busqueda Rápida Gestión
 ***************************************/
function BusRapIniciativa() {
    var valorBR = $('#BRiniciativa').val().trim();
    $("#TituloIni_B").val(valorBR);
    console.log("valor a busca: " + valorBR);
    FiltraIniciativa();
}


/*********************************************************************************************************************
 * Muestra Tabla de Solicitud de Apoyos 
 *********************************************************************************************************************/
function GeneraTablaIniciativas(RegXpag, offsetPeticiones) {
    var pagina = 1;

    var Folio = $("#inputFolioIniciativa_B").val();
    var LegislaturaId = $("#LegislaturaId_B").val();
    var TipoIniciativaId = $("#TipoIniciativaId_B").val();
    var EstatusIniciativaId = $("#EstatusIniciativaId_B").val();
    var Titulo = $("#TituloIni_B").val();
    var PromotorId = $("#PromotorId_B").val();
    var PresidenteId = $("#PresidenteId_B").val();
    var AutorId = 0;
    var NumIniciativa = $("#NumSecuencial_B").val();

    var FechaInicioIngreso = $("#hideFechaInicioRecibido").val();
    var FechaFinIngreso = $("#hideFechaFinRecibido").val();

    var FechaInicioComision = $("#hideFechaInicioComision").val();
    var FechaFinComision = $("#hideFechaFinComision").val();

    var FechaInicioPleno = $("#hideFechaInicioPleno").val();
    var FechaFinPleno = $("#hideFechaFinPleno").val();

    FechaInicioIngreso = FechaInicioIngreso == "" ? "0" : FechaInicioIngreso;
    FechaFinIngreso = FechaFinIngreso == "" ? "0" : FechaFinIngreso;

    FechaInicioComision = FechaInicioComision == "" ? "0" : FechaInicioComision;
    FechaFinComision = FechaFinComision == "" ? "0" : FechaFinComision;

    FechaInicioPleno = FechaInicioPleno == "" ? "0" : FechaInicioPleno;
    FechaFinPleno = FechaFinPleno == "" ? "0" : FechaFinPleno;


    //var FechaInicioIngreso = $("#hideFechaInicioRecibido").val();
    //var FechaFinIngreso = $("#hideFechaFinRecibido").val();

    console.log("Titulo: " + Titulo);

    var numeroRegistrosFiltrados = 0;

    var numeroRegistros = ObtieneNumIniciativas();
    var numeroRegistrosFiltrados = ObtieneNumIniciativaFiltrados(RegXpag, offsetPeticiones, LegislaturaId, Folio, TipoIniciativaId, EstatusIniciativaId, Titulo, AutorId, PromotorId, PresidenteId, NumIniciativa, FechaInicioIngreso, FechaFinIngreso, FechaInicioComision, FechaFinComision, FechaInicioPleno, FechaFinPleno);

    $("#labelNumeroRegistros").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    $("#labelNumeroRegistros_footer").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);

    DibujaTablaIniciativas(RegXpag, offsetPeticiones, pagina, LegislaturaId, Folio, TipoIniciativaId, EstatusIniciativaId, Titulo, AutorId, PromotorId, PresidenteId, NumIniciativa, FechaInicioIngreso, FechaFinIngreso, FechaInicioComision, FechaFinComision, FechaInicioPleno, FechaFinPleno)

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
                DibujaTablaIniciativas(RegXpag, RegXpag * (page - 1), page, LegislaturaId, Folio, TipoIniciativaId, EstatusIniciativaId, Titulo, AutorId, PromotorId, PresidenteId, NumIniciativa, FechaInicioIngreso, FechaFinIngreso, FechaInicioComision, FechaFinComision, FechaInicioPleno, FechaFinPleno);
            }
        });
    } else {
        $("#hideNumPaginas").val(numPaginas);
        $('#pagina-solicitudes').twbsPagination('destroy');
    }

}

/*********************************************************************************************************************
 Dibuja la Tabla de Iniciativas
 *********************************************************************************************************************/
function DibujaTablaIniciativas(RegXpag, offsetPeticiones, pagina, LegislaturaId, Folio, TipoIniciativaId, EstatusIniciativaId, Titulo, AutorId, PromotorId, PresidenteId, NumIniciativa, FechaInicioIngreso, FechaFinIngreso, FechaInicioComision, FechaFinComision, FechaInicioPleno, FechaFinPleno) {
    var indice = 0;
    var fechFormateada;
    var tablaHTML = "";

    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;' id='TablaIniciativas'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='3%'>";
    tablaHTML += "Folio";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='10%'>";
    tablaHTML += "Iniciativa";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='5%'>";
    tablaHTML += "Tipo";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='3%'>";
    tablaHTML += "Referencia";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='10%'>";
    tablaHTML += "Archivos";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='12%'>";
    tablaHTML += "Autor";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='7%'>";
    tablaHTML += "Fecha Ingreso";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='7%'>";
    tablaHTML += "Fecha Turno Comisión";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='10%'>";
    tablaHTML += "Comisión";
    tablaHTML += "</th>";

    tablaHTML += "<th style='text-align:center;' width='8%'>";
    tablaHTML += "Presidente de Comisión";
    tablaHTML += "</th>";

    tablaHTML += "<th style='text-align:center;' width='5%'>";
    tablaHTML += "Fecha Aprobación Pleno";
    tablaHTML += "</th>";

    tablaHTML += "<th style='text-align:center;' width='5%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</th>";

    tablaHTML += "<th style='text-align:center;' width='8%'>";
    tablaHTML += "Promotor";
    tablaHTML += "</th>";

    tablaHTML += "<th colspan='2' style='text-align:center; vertical-align:middle;' width='3%'>";
    tablaHTML += "</th>";


    tablaHTML += "</tr>";
    tablaHTML += "</thead'>";
    tablaHTML += "<tbody'>";

    var selAux = "";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneListadoIniciativas",
        data: { RegXpag, offsetPeticiones, LegislaturaId, Folio, TipoIniciativaId, EstatusIniciativaId, Titulo, AutorId, PromotorId, PresidenteId, NumIniciativa, FechaInicioIngreso, FechaFinIngreso, FechaInicioComision, FechaFinComision, FechaInicioPleno, FechaFinPleno },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = (pagina - 1) * RegXpag + index + 1;
                selAux = "";
                tablaHTML += "<tr id='PersPubRenglon_" + indice + "'>";

                tablaHTML += "<td style='text-align:center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.iniciativadBase.numTurno + "</td>";
                //tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.nombreCiudadano + "</td>";

                //                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Ciudadano'> <a href='/Apoyo/Ciudadanoes/DetalleCiudadano?id=" + val.publicidadBase.ciudadanoId + "'>" + val.iniciativaBase.titulo + "</a></span></td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Iniciativa' onclick='mostrarModalDetalleIniciativa(" + val.iniciativadBase.iniciativaId + "," + LegislaturaId + "); '>" + val.iniciativadBase.titulo + "</span></td>";
                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'>" + val.iniciativadBase.titulo + "</span></td>";


                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.tipoIniciativa + "</td>";
                if (val.iniciativadBase.linkReferencia != "") {
                    tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'><a href='" + val.iniciativadBase.linkReferencia + "' target='_blank' title='Documento en página de la Legislatura'>" + val.iniciativadBase.numeroSecuencial + "</a></td>";
                } else {
                    if (val.iniciativadBase.numeroSecuencial != 0) {
                        tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.iniciativadBase.numeroSecuencial + "</td>";
                    } else {
                        tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'></td>";
                    }
                }





                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>";           // Archivos
                if (val.lstArchivosIniciativas.length != 0) {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    var indiceArchivos = 0;
                    for (const elemento in val.lstArchivosIniciativas) {
                        indiceArchivos++;
                        tablaHTML += "<tr style='border:none;'>";
                        tablaHTML += "<td style='border:none;' width='5%'>" + indiceArchivos + "</td>";
                        //tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px; border: none;' width='10%'><img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + val.lstDiputados[elemento].notas + "' alt='Imagen Logotipo' class='center-block responsive' height='20 onclick='MarcaTodoDiputadosDelPartido(" + val.partidoId + ");'/></td>";
                        tablaHTML += "<td style='border:none; width:65%'><a href='" + val.lstArchivosIniciativas[elemento].url + "' target='_blank' title='" + val.lstArchivosIniciativas[elemento].nombreArchivo + "'>" + val.lstArchivosIniciativas[elemento].nombreArchivo.substring(0, 60) + "</a></td>";
                        //tablaHTML += "<td style='border:none; width:65%'>" + val.lstComisiones[elemento].nombre.substring(0, 25) + "</a></td>";
                        tablaHTML += "</tr>";
                    }
                    tablaHTML += "</table>";
                } else {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    tablaHTML += "<tr style='border:none;'>";
                    tablaHTML += "<td style='border:none; width:5%'></td>";
                    tablaHTML += "<td style='border:none; width:65%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
                    tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
                    tablaHTML += "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }
                tablaHTML += "</td>";





                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>";               // Diputados
                if (val.lstDiputados.length != 0) {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    var indiceArch = 0;
                    for (const elemento in val.lstDiputados) {
                        indiceArch++;
                        tablaHTML += "<tr style='border:none;'>";
                        tablaHTML += "<td style='border:none;' width='5%'>" + indiceArch + "</td>";
                        tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px; border: none;' width='10%'><img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + val.lstDiputados[elemento].notas + "' alt='Imagen Logotipo' class='center-block responsive' height='20 onclick='MarcaTodoDiputadosDelPartido(" + val.partidoId + ");'/></td>";
                        tablaHTML += "<td style='border:none; width:65%'>" + val.lstDiputados[elemento].nombre.substring(0, 25) + "</a></td>";
                        tablaHTML += "</tr>";
                    }
                    tablaHTML += "</table>";
                } else {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    tablaHTML += "<tr style='border:none;'>";
                    tablaHTML += "<td style='border:none; width:5%'></td>";
                    tablaHTML += "<td style='border:none; width:65%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
                    tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
                    tablaHTML += "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }
                tablaHTML += "</td>";



                //tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.iniciativadBase.fechaRecibido + "</td>";
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + moment(val.iniciativadBase.fechaRecibido).format('DD/MM/yyyy') + "</td>";

                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + moment(val.iniciativadBase.fechaAprobacionComision).format('DD/MM/yyyy') + "</td>";

                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>";           // Comisión
                if (val.lstComisiones.length != 0) {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    var indiceComisiones = 0;
                    for (const elemento in val.lstComisiones) {
                        indiceComisiones++;
                        tablaHTML += "<tr style='border:none;'>";
                        tablaHTML += "<td style='border:none;' width='5%'>" + indiceComisiones + "</td>";
                        //tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px; border: none;' width='10%'><img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + val.lstDiputados[elemento].notas + "' alt='Imagen Logotipo' class='center-block responsive' height='20 onclick='MarcaTodoDiputadosDelPartido(" + val.partidoId + ");'/></td>";
                        tablaHTML += "<td style='border:none; width:65%'>" + val.lstComisiones[elemento].nombre.substring(0, 25) + "</a></td>";
                        tablaHTML += "</tr>";
                    }
                    tablaHTML += "</table>";
                } else {
                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                    tablaHTML += "<tr style='border:none;'>";
                    tablaHTML += "<td style='border:none; width:5%'></td>";
                    tablaHTML += "<td style='border:none; width:65%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
                    tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
                    tablaHTML += "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }
                tablaHTML += "</td>";

                if (val.logoPresidente != null) {
                    tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'><img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + val.logoPresidente + "' alt='img logo' class='center-block responsive' height='20'/>&nbsp;" + val.presidente + "</td>";
                } else {
                    tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.presidente + "</td>";
                }


                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + moment(val.iniciativadBase.fechaAprobabcionPleno).format('DD/MM/yyyy') + "</td>";//tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val. + "</td>";  // Comisión
                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.estatusIniciativa + "</td>";

                if (val.logoPromotor != null) {
                    tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'><img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + val.logoPromotor + "' alt='img logo' class='center-block responsive' height='20'/>&nbsp;" + val.promotor + "</td>";
                } else {
                    tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.promotor + "</td>";
                }


                //tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>";
                //if (val.archivosRelacionadosPublicidad.length != 0) {
                //    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                //    var indiceArch = 0;
                //    for (const elemento in val.archivosRelacionadosPublicidad) {
                //        indiceArch++;
                //        tablaHTML += "<tr style='border:none;'>";
                //        tablaHTML += "<td style='border:none;' width='5%'>" + indiceArch + "</td>";
                //        tablaHTML += "<td style='border:none; width:65%'><a href='" + val.archivosRelacionadosPublicidad[elemento].url + "' target='_blank' title='" + val.archivosRelacionadosPublicidad[elemento].nombreArchivo + "'>" + val.archivosRelacionadosPublicidad[elemento].nombreArchivo.substring(0, 20) + "</a></td>";
                //        tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
                //        tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Archivo' onclick='EliminaArchivoPublicidad(" + val.archivosRelacionadosPublicidad[elemento].archivosPublicidadId + "," + val.publicidadBase.publicidadId + ");'>&nbsp;</span>";
                //        tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
                //        tablaHTML += "</td>";
                //        tablaHTML += "</tr>";
                //    }
                //    tablaHTML += "</table>";
                //} else {
                //    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
                //    tablaHTML += "<tr style='border:none;'>";
                //    tablaHTML += "<td style='border:none; width:5%'></td>";
                //    tablaHTML += "<td style='border:none; width:65%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
                //    tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
                //    tablaHTML += "<span class='fas fa-trash' style='color:#D3D3D3;' title='Elimina Archivo' disabled>&nbsp;</span>";
                //    tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
                //    tablaHTML += "</td>";
                //    tablaHTML += "</tr>";
                //    tablaHTML += "</table>";
                //}
                //tablaHTML += "</td>";

                //tablaHTML += "<td></td>";

                tablaHTML += "<td colspan='2' style='text-align:center; vertical-align:middle;'>";
                tablaHTML += "<span class='fas fa-edit' style='cursor:pointer;' title='Edita Registro de Publicidad' onclick='MostrarModalEditarIniciativa(" + val.iniciativadBase.iniciativaId + ");'></span>";
                //tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Registro de Publicidad' onclick='EliminaRegistroIniciativa(" + val.iniciativadBase.iniciativaId + ");'>&nbsp;</span>";
                tablaHTML += "<a href='/Apoyo/Iniciativas/Delete/" + val.iniciativadBase.iniciativaId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Registro de Iniciativa'></span></a>";
                tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divListaIniciativas").html(tablaHTML);
}



/**********************************************************************************************
 * Muestra MODAL detalle de Iniciativa
 **********************************************************************************************/
function mostrarModalDetalleIniciativa(IniciativaId, LegislaturaID) {
    var indice = 0;
    var tablaHTML = "";
    $("#modalMuestraDatosIniciativa").appendTo("body");
    $("#modalMuestraDatosIniciativa").modal("show");

    $("#divDatosIniciativa").html("");

    /* DETALLE DE INICIATIVA */

    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneDatosIniciativa",
        data: { IniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            tablaHTML += "<div class='row'>";
            tablaHTML += "<div class='mb-3 col-md-2'>";
            tablaHTML += "<label class='form-label'>Legislatura</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + response.legislatura + "' disabled/>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-2'>";
            tablaHTML += "<label class='form-label'>Folio</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + response.iniciativadBase.numTurno + "'disabled/>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-2'>";
            tablaHTML += "<label class='form-label'>Tipo Iniciativa</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + response.tipoIniciativa + "'disabled/>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-3'>";
            tablaHTML += "<label class='form-label'>Origen</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + response.iniciativadBase.clasificacion + "' disabled/>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-3'>";
            tablaHTML += "<label class='form-label'>Estatus Iniciativa</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + response.estatusIniciativa + "' disabled/>";
            tablaHTML += "</div>";
            tablaHTML += "</div>";

            tablaHTML += "<div class='row'>";
            tablaHTML += "<div class='mb-3 col-md-6'>";
            tablaHTML += "<label class='form-label'>Iniciativa</label>";
            //tablaHTML += "<input type='text' class='form-control' value='" + response.iniciativadBase.titulo + "' disabled></input>";
            tablaHTML += "<textarea rows='3' style='width:100%; max-width:100%;' disabled>" + response.iniciativadBase.titulo + "</textarea >";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-6'>";
            tablaHTML += "<label class='form-label'>Descripción</label>";
            //tablaHTML += "<input type='text' class='form-control' disabled>" + response.iniciativadBase.notas + "</input>";
            tablaHTML += "<textarea rows='3' style='width:100%; max-width:100%;' disabled>" + response.iniciativadBase.notas + "</textarea >";
            tablaHTML += "</div>";
            tablaHTML += "</div>";

            tablaHTML += "<div class='row'>";
            tablaHTML += "<div class='mb-3 col-md-5'>";
            tablaHTML += "<label class='form-label'>Presidente</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + response.presidente + "' disabled/>";
            //tablaHTML += "<div class='row'>";
            //tablaHTML += "<img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + response.logoPresidente + "' height='20 />";
            //tablaHTML += "<input type='text' class='form-control' value='" + response.presidente + "' disabled />";
            //tablaHTML += "</div>";
            tablaHTML += "</div>";

            tablaHTML += "<div class='mb-3 col-md-5'>";
            tablaHTML += "<label class='form-label'>Promotor</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + response.promotor + "' disabled/>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-2'>";
            tablaHTML += "<label class='form-label'>Número en Página</label>";
            tablaHTML += "<a href='" + response.iniciativadBase.linkReferencia + "' target='_blank' ><input type='text' class='form-control' value='" + response.iniciativadBase.numeroSecuencial + "' disabled /></a>";
            tablaHTML += "</div>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='row'>";
            tablaHTML += "<div class='mb-3 col-md-3'>";
            tablaHTML += "<label class='form-label'>Fecha de Ingreso</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + moment(response.iniciativadBase.fechaRecibido).format('DD/MM/yyyy') + "' disabled></input>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-3'>";
            tablaHTML += "<label class='form-label'>Fecha Turno a Comisión</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + moment(response.iniciativadBase.fechaAprobacionComision).format('DD/MM/yyyy') + "' disabled></input>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-3'>";
            tablaHTML += "<label class='form-label'>Fecha Aprobación Pleno</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + moment(response.iniciativadBase.fechaAprobabcionPleno).format('DD/MM/yyyy') + "' disabled></input>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='mb-3 col-md-3'>";
            tablaHTML += "<label class='form-label'>Fecha Publicación SA</label>";
            tablaHTML += "<input type='text' class='form-control' value='" + moment(response.iniciativadBase.fechaPublicacionSa).format('DD/MM/yyyy') + "' disabled></input>";
            tablaHTML += "</div>";
            tablaHTML += "</div>";
        }
    });

    tablaHTML += "<table style='width:100%;'>";
    tablaHTML += "<tr style='padding: 1px; vertical-align: top;'>";
    tablaHTML += "<td colspan='2' width='100%' style='padding: 1px; vertical-align: top;'>";
    tablaHTML += "<h5 class='card-header' style='text-align: center; background-color: #23649e; color: white; border-radius: 10px 10px 10px 10px; padding: 1px; cursor: pointer'>ARCHIVOS ANEXOS</h5>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    indice = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneListaArchivosIniciativa",
        data: { IniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr>";
                tablaHTML += "<td width='5%' style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td width='95%'><a href='" + val.url + "' target='_blank' title='Archivo'>" + val.nombreArchivo + "</a></td>";
                tablaHTML += "</tr>";
            });
        }
    });
    tablaHTML += "</table>";


    tablaHTML += "<table style='width:100%;'>";
    tablaHTML += "<tr style='padding: 1px; vertical-align: top;'>";
    tablaHTML += "<td colspan='3' width='100%' style='padding: 1px; vertical-align: top;'>";
    tablaHTML += "<h5 class='card-header' style='text-align: center; background-color: #23649e; color: white; border-radius: 10px 10px 10px 10px; padding: 1px; cursor: pointer'>COMISIÓN</h5>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneComisionDiputadoCargo",
        data: { LegislaturaID, IniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val.estatus != 0) {
                    indice++;
                    tablaHTML += "<tr>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:2px;' width='5%'>" + indice + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%'><input type='checkbox' checked disabled></td>";
                    tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:2px;' width='90%'>" + val.nombre + "</td>";
                    tablaHTML += "</tr>";
                }
            });
        }
    });
    tablaHTML += "</table>";


    tablaHTML += "<table style='width:100%;'>";
    tablaHTML += "<tr style='padding: 1px; vertical-align: top;'>";
    tablaHTML += "<td colspan='5' width='100%' style='padding: 1px; vertical-align: top;'>";
    tablaHTML += "<h5 class='card-header' style='text-align: center; background-color: #23649e; color: white; border-radius: 10px 10px 10px 10px; padding: 1px; cursor: pointer'>AUTOR INTERNO</h5>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    indice = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneDiputadosDisponibles",
        data: { LegislaturaID, IniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val.diputadoseleccionado != 0) {
                    indice++;
                    tablaHTML += "<tr>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%' id='" + val.diputadoId + "'>" + indice + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%'><input type='checkbox' checked disabled></td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px; border: none;' width='5%'><img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + val.logo + "' alt='Imagen Logotipo' class='center-block responsive' height='20'/></td>";
                    tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:1px;' width='80%'>" + val.nombre + "</td>";
                    tablaHTML += "</tr>";
                }
            });

        }
    });
    tablaHTML += "</table>";

    $("#divDatosIniciativa").html(tablaHTML);
}


/*********************************************************************************************************************
 * Elimina Registro de Publicidad con todas sus fotos
 *********************************************************************************************************************/
function EliminaRegistroIniciativa(iniciativaId) {
    $.ajax({
        type: "DELETE",
        url: "/Apoyo/Iniciativas/EliminaIniciativa",
        data: { iniciativaId },
        cache: false,
        async: false,
        success: (response) => {

        }
    });
    FiltraPublicidad();
}

/*********************************************************************************************************************
 * Obtiene el total de Registros de Publicidad
 *********************************************************************************************************************/
function ObtieneNumIniciativas() {
    var numeroRegistros = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/numeroIniciativas",
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
function ObtieneNumIniciativaFiltrados(RegXpag, offsetPeticiones, LegislaturaId, Folio, TipoIniciativaId, EstatusIniciativaId, Titulo, AutorId, PromotorId, PresidenteId, NumIniciativa, FechaInicioIngreso, FechaFinIngreso, FechaInicioComision, FechaFinComision, FechaInicioPleno, FechaFinPleno) {
    var numeroRegistrosFiltrados = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneNumIniciativasFiltrados",
        data: { LegislaturaId, Folio, TipoIniciativaId, EstatusIniciativaId, Titulo, AutorId, PromotorId, PresidenteId, NumIniciativa, FechaInicioIngreso, FechaFinIngreso, FechaInicioComision, FechaFinComision, FechaInicioPleno, FechaFinPleno },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistrosFiltrados = response;
            $("#hideNumRegistros").val(numeroRegistrosFiltrados);
        }
    });
    console.log("Numero de registros filtrados=" + numeroRegistrosFiltrados);
    return numeroRegistrosFiltrados;
}


/*************************************************************************************
 *  Filtro Rango de Iniciativas RECIBIDAS
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoRecibido').daterangepicker({
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
            $("#hideFechaInicioRecibido").val(start.format('DD-MM-YYYY 00:00'));
            $("#hideFechaFinRecibido").val(end.format('DD-MM-YYYY 11:59'));
            FiltraIniciativa();
        }
    );
});

$('input[id="filtro_rangoRecibido"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoRecibido"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});



/*************************************************************************************
 *  Filtro Rango de Iniciativas COMISIÓN
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoComision').daterangepicker({
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
            $("#hideFechaInicioComision").val(start.format('DD-MM-YYYY 00:00'));
            $("#hideFechaFinComision").val(end.format('DD-MM-YYYY 11:59'));
            FiltraIniciativa();
        }
    );
});

$('input[id="filtro_rangoComision"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoComision"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});



/*************************************************************************************
 *  Filtro Rango de Iniciativas PLENO
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoPleno').daterangepicker({
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
            $("#hideFechaInicioPleno").val(start.format('DD-MM-YYYY 00:00'));
            $("#hideFechaFinPleno").val(end.format('DD-MM-YYYY 11:59'));
            FiltraIniciativa();
        }
    );
});

$('input[id="filtro_rangoPleno"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoPleno"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});



/*************************************************************************************
 *  Filtro Rango de Iniciativas BAJA
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoBaja').daterangepicker({
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
            $("#hideFechaInicioBaja").val(start.format('DD-MM-YYYY 00:00'));
            $("#hideFechaFinBaja").val(end.format('DD-MM-YYYY 11:59'));
            FiltraIniciativa();
        }
    );
});

$('input[id="filtro_rangoBaja"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoBaja"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});


/**********************************************************************************************
 * Muestra MODAL Lateral Derecho Nuevo Registro de INICIATIVA
 **********************************************************************************************/
function MostrarModalNvaIniciativa() {
    $("#nuevoRegistroIniciativa_modal").appendTo("body");
    $("#nuevoRegistroIniciativa_modal").modal("show");
}

/**********************************************************************************************
 * Muestra MODAL Lateral Derecho Editar INICIATIVA
 **********************************************************************************************/
function MostrarModalEditarIniciativa(IniciativaId) {
    $("#modalDerechoEditaIniciativa").appendTo("body");
    $("#modalDerechoEditaIniciativa").modal("show");
    $('#hIniciativaId').val(IniciativaId);

    ObtieneDatosIniciativa(IniciativaId);
}

/**********************************************************************************************
 * Ocultar MODAL Editar Registro de INICIATIVA
 **********************************************************************************************/
function CerrarModalEditarIniciativa() {
    $("#modalDerechoEditaIniciativa").modal("hide");
}


/*********************************************************************************************************
 * Lista de Diputados
 *********************************************************************************************************/
function GeneraTablaDeDiputados() {
    var LegislaturaId = $("#LegislaturaId").val();
    var IniciativaId = $("#hEditaIniciativaid").val();
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div id='ListaDeOpcionesDiputados'>";
    tablaHTML += "<div class='card'>";
    tablaHTML += "<h5 class='card-header'>Seleccione Diputados</h5>";
    tablaHTML += "<hr>";
    tablaHTML += "<div class='card-body bg-white'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='ListaDiputadosParaseleccionar'>";
    tablaHTML += "<tbody>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneDiputadosDisponibles",
        data: { LegislaturaId, IniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%' id='" + val.diputadoId + "'>" + indice + "</td>";

                if (val.diputadoseleccionado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%'><input type='checkbox' id='cboxDiputado_" + IniciativaId + "_" + val.diputadoId + "' name='" + val.partidoId + "'" + "class='" + val.diputadoId + "' checked onclick='GuardaDiputadoAutorIniciativa(" + IniciativaId + "," + val.diputadoId + ")'></td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%'><input type='checkbox' id='cboxDiputado_" + IniciativaId + "_" + val.diputadoId + "' name='" + val.partidoId + "'" + "class='" + val.diputadoId + "'         onclick='GuardaDiputadoAutorIniciativa(" + IniciativaId + "," + val.diputadoId + ")'></td>";
                }
                //tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%'><input type='checkbox' id='" + val.diputadoId + "' name='" + val.partidoId + "'></td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px; border: none;' width='10%'><img style='border:0; border-radius:0px; padding:0px;' src='/Apoyo/IMAGES/" + val.logo + "' alt='Imagen Logotipo' class='center-block responsive' height='20 onclick='MarcaTodoDiputadosDelPartido(" + val.partidoId + ");'/></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:1px;' width='80%'>" + val.nombre + "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            tablaHTML += "</div>";
            tablaHTML += "</div>";
            //tablaHTML += "<div class='card-footer'>";
            //tablaHTML += "<button type='button' onclick='CerrarListaDiputados();' class='btn btn-dark redondeada'>Cerrar</button>";
            //tablaHTML += "</div>";
            tablaHTML += "</div>";
        }
    });
    $("#divDiputadosDisponibles").html(tablaHTML);
}


/*********************************************************************************************************
 * Lista de Comisiones para ser seleccionadas  en NUEVA Iniciativa
 *********************************************************************************************************/
function GeneraTablaDeComisiones() {
    var LegislaturaId = $("#LegislaturaId").val();
    var IniciativaId = $("#hEditaIniciativaid").val();
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div id='ListaDeOpcionesComisiones'>";
    tablaHTML += "<div class='card'>";
    tablaHTML += "<h5 class='card-header'>Seleccione las Comisiones</h5>";
    tablaHTML += "<hr>";
    tablaHTML += "<div class='card-body bg-white'>";

    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;'>";
    tablaHTML += "<tbody>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneComisionDiputadoCargo",
        data: { LegislaturaId, IniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:2px;' width='5%'>" + indice + "</td>";

                if (val.estatus != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%'><input type='checkbox' id='cboxComision_" + IniciativaId + "_" + val.comisionId + "' name='" + val.comisionId + "' checked onclick='GuardaComisionIniciativa(" + IniciativaId + "," + val.comisionId + ")'></td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; padding:1px;' width='5%'><input type='checkbox' id='cboxComision_" + IniciativaId + "_" + val.comisionId + "' name='" + val.comisionId + "'         onclick='GuardaComisionIniciativa(" + IniciativaId + "," + val.comisionId + ")'></td>";
                }

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:2px;' width='90%'>" + val.nombre + "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            tablaHTML += "</div>";
            tablaHTML += "</div>";
            tablaHTML += "</div>";
            tablaHTML += "<div class='card-footer'>";
            tablaHTML += "</div>";
        }
    });
    $("#divComisionesDisponibles").html(tablaHTML);
}



/************************************************************************************************************
 * INICIATIVA Muestra Encabezado y primer renglón de Archivos Anexos de INiciativas
 ***********************************************************************************************************/
function GeneraTablaArchivosAnexosIniciativa(iniciativaId) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaArchivoIniciativas'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='94%'>";
    tablaHTML += "Nombre de Archivo";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    tablaHTML += "<span class='fas fa-file-upload' style='font-size:18px; cursor:pointer' title='Subir Archivo Anexo' onclick='MostrarModalSubirArchivoIniciativa(" + iniciativaId + ");'></span>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneListaArchivosIniciativa",
        data: { iniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                console.log("ARCHIVO: " + val.url);
                tablaHTML += "<tr id='ArchivoRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td><a href='" + val.url + "' target='_blank' title='Archivo'>" + val.nombreArchivo + "</a></td>";
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowArchivoIninciativa(" + val.archivosIniciativaID + "," + iniciativaId + ");'></span></td>";
                tablaHTML += "</tr>";
            });
        }
    });

    if (indice > 0) {
        $("#opc_2").css({ 'border-left-color': '#20B016' });
    }

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divArchivosAnexosIniciativa").html(tablaHTML);

}



/************************************************************************************************************************
 *  Guarda Check of Diputado como AUTOR de una Iniciativa
 ************************************************************************************************************************/
function GuardaDiputadoAutorIniciativa(iniciativaId, diputadoId) {
    var cbDiputadoAuto = 0;

    if ($("#cboxDiputado_" + iniciativaId + "_" + diputadoId).is(":checked")) {
        cbDiputadoAuto = 1;
    }

    console.log("PARAMETROS: " + iniciativaId + "-" + diputadoId + "-" + cbDiputadoAuto);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Iniciativas/Guarda_Elimina_DiputadoAutor",
        data: { iniciativaId, diputadoId, cbDiputadoAuto },
        cache: false,
        async: false,
        success: (response) => {
            if (response > 0) {
                console.log("LOS DATOS DE AUTOR DE INICIATIVA FUERON ACTUALIZADOS");
            } else {
                console.log("error LOS DATOS DE AUTOR DE INICIATIVA NO FUERON ACTUALIZADOS");
            }
        },
        error: function (response) {
            console.log("ERROR AL GUARDAR DATOS DE AUTOR DE INICIATIVA");
        }
    });

    GeneraTablaDeDiputados();
}


/************************************************************************************************************************
 *  Guarda Check of Comisones de una Iniciativa
 ************************************************************************************************************************/
function GuardaComisionIniciativa(iniciativaId, comisionId) {
    var cbComision = 0;

    if ($("#cboxComision_" + iniciativaId + "_" + comisionId).is(":checked")) {
        cbComision = 1;
    }

    console.log("PARAMETROS: " + iniciativaId + "-" + comisionId + "-" + cbComision);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Iniciativas/Guarda_Elimina_Comision",
        data: { iniciativaId, comisionId, cbComision },
        cache: false,
        async: false,
        success: (response) => {
            if (response > 0) {
                console.log("LOS DATOS DE AUTOR DE INICIATIVA FUERON ACTUALIZADOS");
            } else {
                console.log("error LOS DATOS DE AUTOR DE INICIATIVA NO FUERON ACTUALIZADOS");
            }
        },
        error: function (response) {
            console.log("ERROR AL GUARDAR DATOS DE AUTOR DE INICIATIVA");
        }
    });

    GeneraTablaDeComisiones();
}


/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de INICIATIVA
 **********************************************************************************************/
function MostrarModalSubirArchivoIniciativa(iniciativaId) {
    $("#ModalSeleccionarArchivoIniciativa").modal("show");
    $('#ModalSeleccionarArchivoIniciativa').css('zIndex', 9999);
    $('#HiddenIniciativaId').val(iniciativaId);
}


/***********************************************************************************
 * Subir Archivo de Iniciativas
 ***********************************************************************************/
function subirArchivosIniciativaButton(nombreArchivoAsubir) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    var iniciativaId = $('#HiddenIniciativaId').val();

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("iniciativaId", iniciativaId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + iniciativaId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Iniciativas/SubirArchivoIniciativa",
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
            $('#ModalSeleccionarArchivoIniciativa').modal('hide');
            //GeneraTablaArchivosAnexosIniciativa(iniciativaId);
            cierraModalDerechoIniciativas();                                                //      REVISAR SI SE PUEDE CAMBIAR PARA QUE AL SUBIR ARCHIVOS, REGRESE A LA VENTANA MODAL DERECHA
        },
        error: function (error) {
            console.log('Error al subir el archivo');
        }
    });
}

/****************************************************************
 *  BORRAR Archivo Iniciativas
 ****************************************************************/
function EliminaRowArchivoIninciativa(archivoId, iniciativaId) {
    console.log("archivoId: " + archivoId);
    $.ajax({
        type: "POST",
        url: "/Apoyo/Iniciativas/BorrarArchivoIniciativa",
        cache: false,
        async: false,
        data: { archivoId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaArchivosAnexosIniciativa(iniciativaId);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}


/******************************************************
 * Autores Externos de Iniciativa
 ******************************************************/
function muestraAutoresExternos(iniciativaId) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:left; background-color:white; color:black; padding:1px;' width='47%'>";
    tablaHTML += "Dependencia";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='47%'>";
    tablaHTML += "Contacto";
    tablaHTML += "</td>";

    tablaHTML += "<td style='text-align:center;padding:1px;' width='3%'>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";
    var selAux = "";
    $.ajax({
        type: "GET",
        url: "/Apoyo/Iniciativas/ObtieneAutoresExternosIniciativaId",
        data: { iniciativaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                selAux = "";
                tablaHTML += "<tr id='AutorExtRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td><input type='text' id='DescripcionApoyo_" + val.beneficiariosID + "' style='width:100%; max-width:100%;' value='" + val.notas + "'/></td>";
                tablaHTML += "<td><input type='text' id='DescripcionApoyo_" + val.beneficiariosID + "' style='width:100%; max-width:100%;' value='" + val.notas + "'/></td>";
                tablaHTML += "<td>";
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowBeneficiarioGestion(" + val.gestionID + "," + val.ciudadanoID + "," + val.beneficiariosID + ");'></span>";
                tablaHTML += "<td>";
                tablaHTML += "</tr>";
            });
        }
    });

    if (indice > 0) {
        $("#opc_4").css({ 'border-left-color': '#20B016' });
    }

    indice++;

    tablaHTML += "<tr id='BeneficiarioRenglon_" + indice + "'>";
    tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
    tablaHTML += "<td><input type='text' id='BeneNombre_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td></td>";
    tablaHTML += "<td></td>";
    tablaHTML += "<td><input type='text' id='BeneApoyo_Nuevo' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guarda Beneficiario' onclick='GuardaNuevoBeneficiario_G(" + idGestion + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divBeneficiariosNGestion").html(tablaHTML);
    $("#BeneNombre_Nuevo").autocomplete(autocompleteNombreBeneficiario);

}

