$('#FileUploadFormFilePublicidad').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));
})


/*********************************************************************************************************
 * Guarda Nueva Publicidad
 *********************************************************************************************************/
function GuardarNuevaPublicidad() {
    var DatosGuardados = false;
    var folioPublicidad = $("#inputFolioPublicidad").val().trim();
    var tipoPublicidadId = $("#TipoPublicidadId").val();
    var origenPublicidadId = $("#OrigenPublicidadId").val();
    var tamañoPublicidad = $("#inputTamañoPublicidad").val().trim();

    //var ciudadanoId = $("#hCiudadanoSolicitanteBuscar").val();
    var ciudadanoId = $("#hCiudadanoPublicidadBuscar").val();
    
    var coloniaId = $("#hColoniaBuscar").val();
    var calleId = $("#hCalleBuscar").val();
    var numExteriorPublicidad = $("#inputNumExtPublicidad").val().trim();
    var cp = $("#inputCpPublicidad").val();

    var latitudPub = $("#inputLatitudPublicidad").val().trim();
    var longitudPub = $("#inputLongitudPublicidad").val().trim();
    var notasPublicidad = $("#inputNotasPublicidad").val().trim();


    console.log("folioPublicidad: " + folioPublicidad);
    console.log("tipoPublicidadId: " + tipoPublicidadId);
    console.log("tipoPublicidadId: " + tipoPublicidadId);
    console.log("origenPublicidadId: " + origenPublicidadId);
    console.log("tamañoPublicidad: " + tamañoPublicidad);
    console.log("ciudadanoId: " + ciudadanoId);
    console.log("calleid: " + calleId);
    console.log("coloniaId: " + coloniaId);
    console.log("numExteriorPublicidad: " + numExteriorPublicidad);
    console.log("cp: " + cp);

    console.log("latitudPub: " + latitudPub);
    console.log("longitudPub: " + longitudPub);
    console.log("notasPublicidad: " + notasPublicidad);

    var datosCompletos = false;


    if (ciudadanoId > 0) {
        if (tipoPublicidadId > 0) {
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
        url: "/Apoyo/Publicidad/InsertaNuevaPublicidad",
        cache: false,
        async: false,
        data: {
            folioPublicidad, tipoPublicidadId, origenPublicidadId, tamañoPublicidad, ciudadanoId, coloniaId, calleId, numExteriorPublicidad, cp, latitudPub, longitudPub, notasPublicidad
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
        //window.location.replace("/Apoyo/Ciudadanoes/Edit?id=" + $('#hCiudadanoId').val());
        window.location.replace("/Apoyo/Publicidad/");
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
}


/*********************************************************************************************************
 * Guarda Actualizaciones Publicidad - EDIT
 *********************************************************************************************************/
function GuardarActualizacionPublicidad() {
    var DatosGuardados = false;
    var folioPublicidad = $("#inputFolioPublicidadEdit").val().trim();
    var tipoPublicidadId = $("#TipoPublicidadIdEdit").val();
    var origenPublicidadId = $("#OrigenPublicidadIdEdit").val();
    var tamañoPublicidad = $("#inputTamañoPublicidadEdit").val().trim();

    var ciudadanoId = $("#hCiudadanoPublicidadBuscar").val();
    var coloniaId = $("#hColoniaBuscarEdit").val();
    var calleId = $("#hCalleBuscarEdit").val();
    var numExteriorPublicidad = $("#inputNumExtPublicidadEdit").val().trim();
    var cp = $("#inputCpPublicidadEdit").val();

    var latitudPub = $("#inputLatitudPublicidadEdit").val().trim();
    var longitudPub = $("#inputLongitudPublicidadEdit").val().trim();
    var notasPublicidad = $("#inputNotasPublicidadEdit").val().trim();

    var publicidadId = $('#HiddenPublicidadId').val();

    console.log("publicidadId: " + publicidadId);

    console.log("GuardarActualizacionPublicidad folioPublicidad: " + folioPublicidad);
    console.log("tipoPublicidadId: " + tipoPublicidadId);
    console.log("origenPublicidadId: " + origenPublicidadId);
    console.log("tamañoPublicidad: " + tamañoPublicidad);
    console.log("ciudadanoId: " + ciudadanoId);
    console.log("calleid: " + calleId);
    console.log("coloniaId: " + coloniaId);
    console.log("numExteriorPublicidad: " + numExteriorPublicidad);
    console.log("cp: " + cp);

    console.log("latitudPub: " + latitudPub);
    console.log("longitudPub: " + longitudPub);
    console.log("notasPublicidad: " + notasPublicidad);

    var datosCompletos = false;


    if (ciudadanoId > 0) {
        datosCompletos = true;
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
        url: "/Apoyo/Publicidad/ActualizaPublicidad",
        cache: false,
        async: false,
        data: {
            publicidadId, folioPublicidad, tipoPublicidadId, origenPublicidadId, tamañoPublicidad, ciudadanoId, coloniaId, calleId, numExteriorPublicidad, cp, latitudPub, longitudPub, notasPublicidad
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
        //        window.location.replace("/Apoyo/Publicidad/Index");
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
    CerrarModalEditarPublicidad();
    //ListaPublicidadCiudadano();
    FiltraPublicidad();
}



/******************************************************************************
 * 
 ******************************************************************************/
//function ListaPublicidadCiudadano() {

//    /* PUBLICIDAD X CIUDADANO */
//    tablaHTML = "<div align='center'>";
//    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;' id='TablaPublicidadXciudadano'>";
//    tablaHTML += "<thead>";
//    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
//    tablaHTML += "<th style='text-align:center; padding:1px;' width='3%'>";
//    tablaHTML += "#";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='5%'>";
//    tablaHTML += "Folio";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='10%'>";
//    tablaHTML += "Ciudadano";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='10%'>";
//    tablaHTML += "Tipo";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='12%'>";
//    tablaHTML += "Tamaño";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='15%'>";
//    tablaHTML += "Colonia";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='15%'>";
//    tablaHTML += "Calle";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='5%'>";
//    tablaHTML += "Número";
//    tablaHTML += "</th>";
//    tablaHTML += "<th style='text-align:center;' width='18%'>";
//    tablaHTML += "Archivos";
//    tablaHTML += "</th>";
//    tablaHTML += "<th colspan='2' style='text-align:center; vertical-align:middle;' width='7%'>";
//    //tablaHTML += "<div>";
//    //tablaHTML += "<a data-toggle='collapse' href='#collapseDatosPublicidad' role='button' aria-expanded='true' aria-controls='collapseDatosPublicidad'>";
//    //tablaHTML += "<i class='fas fa-plus-circle' style='color:white;'></i>";
//    //tablaHTML += "</a>";
//    //tablaHTML += "<a onclick='initialize_mapPublicidad()' style='cursor:pointer;'><i class='fas fa-map-marker-alt fa-lg text-danger'></i></a>";

//    //tablaHTML += "<div class='dropdown'>";
//    //tablaHTML += "<i class='fas fa-filter' onclick='muestraMenuFiltro()'></i>";
//    //tablaHTML += "<div id='myDropdown1' class='dropdown-content'>";
//    //tablaHTML += "<a href='#java' onclick='initialize_mapPublicidad()'>Ubicación Publicidad</a>";
//    //tablaHTML += "<a href='#python' onclick='python()'>123</a>";
//    //tablaHTML += "<a href='#c++' onclick='cpp()'>XYZ</a>";
//    //tablaHTML += "<a href='#c' onclick='c()'>hola</a>";
//    //tablaHTML += "</div>";
//    //tablaHTML += "</div>";

//    //tablaHTML += "</div>";
//    tablaHTML += "</th>";


//    tablaHTML += "</tr>";
//    tablaHTML += "</thead'>";
//    tablaHTML += "<tbody'>";

//    var selAux = "";
//    indice = 0;
//    $.ajax({
//        type: "GET",
//        url: "/Apoyo/Publicidad/ObtieneListadoPublicidad",
//        cache: false,
//        async: false,
//        success: (response) => {
//            $.each(response, (index, val) => {
//                indice++;
//                selAux = "";
//                tablaHTML += "<tr id='PersPubRenglon_" + indice + "'>";

//                tablaHTML += "<td style='text-align:center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
//                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.publicidadBase.folio + "</td>";
//                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.nombreCiudadano + "</td>";

//                //tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.tipoPublicidad + "</td>";

//                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Publicidad' onclick='mostrarModalDetallePublicidad(" + val.publicidadBase.publicidadId + "," + val.publicidadBase.ciudadanoId + "); '>" + val.tipoPublicidad + "</span></td>";

//                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.publicidadBase.tamaño + "</td>";
//                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.nombreColonia + "</td>";
//                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.nombreCalle + "</td>";
//                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>" + val.publicidadBase.numExterior + "</td>";

//                tablaHTML += "<td style='text-align:left; vertical-align: middle;padding:1px;'>";
//                if (val.archivosRelacionadosPublicidad.length != 0) {
//                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
//                    var indiceArch = 0;
//                    for (const elemento in val.archivosRelacionadosPublicidad) {
//                        indiceArch++;
//                        //console.log("URL--> " + val.archivosRelacionadosPublicidad[elemento].url);
//                        tablaHTML += "<tr style='border:none;'>";
//                        tablaHTML += "<td style='border:none;' width='5%'>" + indiceArch + "</td>";
//                        tablaHTML += "<td style='border:none; width:65%'><a href='" + val.archivosRelacionadosPublicidad[elemento].url + "' target='_blank' title='" + val.archivosRelacionadosPublicidad[elemento].nombreArchivo + "'>" + val.archivosRelacionadosPublicidad[elemento].nombreArchivo.substring(0, 20) + "</a></td>";
//                        tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
//                        tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Archivo' onclick='EliminaArchivoPublicidad(" + val.archivosRelacionadosPublicidad[elemento].archivosPublicidadId + "," + val.publicidadBase.publicidadId + ");'>&nbsp;</span>";
//                        tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
//                        tablaHTML += "</td>";
//                        tablaHTML += "</tr>";
//                    }
//                    tablaHTML += "</table>";
//                } else {
//                    tablaHTML += "<table class='table table-hover' style='border:none; width:100%;'>";
//                    tablaHTML += "<tr style='border:none;'>";
//                    tablaHTML += "<td style='border:none; width:5%'></td>";
//                    tablaHTML += "<td style='border:none; width:65%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
//                    tablaHTML += "<td style='text-align:center; vertical-align:middle; border:none; width:30%;'>";
//                    tablaHTML += "<span class='fas fa-trash' style='color:#E0E0E0;' title='Elimina Archivo' disabled>&nbsp;</span>";
//                    tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
//                    tablaHTML += "</td>";
//                    tablaHTML += "</tr>";
//                    tablaHTML += "</table>";
//                }
//                tablaHTML += "</td>";

//                tablaHTML += "<td colspan='2' style='text-align:center; vertical-align:middle;'>";
//                tablaHTML += "<span class='fas fa-edit' style='cursor:pointer;' title='Edita Registro de Publicidad' onclick='MostrarModalEditarPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
//                tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Registro de Publicidad' onclick='EliminaRegistroPublicidad(" + val.publicidadBase.publicidadId + ");'>&nbsp;</span>";
//                tablaHTML += "</td>";

//                tablaHTML += "</tr>";
//            });
//        }
//    });

//    tablaHTML += "</tbody'>";
//    tablaHTML += "</table>";
//    tablaHTML += "</div>";


//    //if (indice > 0) {
//    $("#divListaLonasBardas").html(tablaHTML);
//    //}
//}

function muestraMenuFiltro() {
    document.getElementById("myDropdown1").classList.toggle("show")
}

/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de PUBLICIDAD
 **********************************************************************************************/
function MostrarModalSubirArchivoPublicidad(PublicidadId) {
    $("#ModalSeleccionarArchivosPublicidad").modal("show");
    console.log("PublicidadId: " + PublicidadId);
    $('#HiddenPublicidadId').val(PublicidadId);
}

/**********************************************************************************************
 * Muestra MODAL Editar Registro de PUBLICIDAD
 **********************************************************************************************/
function MostrarModalEditarPublicidad(PublicidadId) {
    $("#information_modal").appendTo("body");
    $("#information_modal").modal("show");
    $('#HiddenPublicidadId').val(PublicidadId);

    ObtieneDatosPublicidad(PublicidadId);
}

/**********************************************************************************************
 * Ocultar MODAL Editar Registro de PUBLICIDAD
 **********************************************************************************************/
function CerrarModalEditarPublicidad() {
    $("#information_modal").modal("hide");
}


/************************************************************************************************************************
 *  EDITAR Datos de Publicidad
 ************************************************************************************************************************/
function ObtieneDatosPublicidad(publicidadId) {

    $.ajax({
        type: "GET",
        url: "/Apoyo/Publicidad/GetDatosPublicidad",
        data: { publicidadId },
        cache: false,
        async: false,
        success: (response) => {

            //console.log("TAMAÑO: " + );
            $('#TipoPublicidadIdEdit').val(response.publicidadBase.tipoPublicidadId);
            $('#OrigenPublicidadIdEdit').val(response.publicidadBase.origenId);
            $('#inputFolioPublicidadEdit').val(response.publicidadBase.folio);
            $('#inputTamañoPublicidadEdit').val(response.publicidadBase.tamaño);

            $('#NombreCiudadanoPublicidadEdit').val(response.nombreCiudadano);
            $('#coloniasBuscarEdit').val(response.nombreColonia);
            $('#callesBuscarEdit').val(response.nombreCalle);
            $('#inputNumExtPublicidadEdit').val(response.publicidadBase.numExterior);
            $('#inputCpPublicidadEdit').val(response.publicidadBase.cp);

            $('#inputLatitudPublicidadEdit').val(response.publicidadBase.latitud);
            $('#inputLongitudPublicidadEdit').val(response.publicidadBase.longitud);
            $('#inputNotasPublicidadEdit').val(response.publicidadBase.notas);

            $('#hColoniaBuscarEdit').val(response.publicidadBase.coloniaId);
            $('#hCalleBuscarEdit').val(response.publicidadBase.calleId);
            $('#hCiudadanoPublicidadBuscar').val(response.publicidadBase.ciudadanoId);

        },
        error: function (response) {
            $("#msg_ErrorCatSubCat").show();
            setTimeout(function () {
                $('#msg_ErrorCatSubCat').fadeOut('fast');
            }, 2000);
            LecturaDatosPublicidad = false;
        }
    });
}

$(function () {
    $("#NombreCiudadanoPublicidadEdit").focus(function (e) {
        $('#NombreCiudadanoPublicidadEdit').val("");
        $("#hCiudadanoPublicidadBuscar").val(0);
    });

    $("#coloniasBuscarEdit").focus(function (e) {
        $('#coloniasBuscarEdit').val("");
        $('#callesBuscarEdit').val("");
        $("#hColoniaBuscarEdit").val(0);
        $("#hCalleBuscarEdit").val(0);
    });

    $("#callesBuscarEdit").focus(function (e) {
        $('#coloniasBuscarEdit').val("");
        $('#callesBuscarEdit').val("");
        $("#hColoniaBuscarEdit").val(0);
        $("#hCalleBuscarEdit").val(0);
    });
})

/**********************************************************************************************
 * Muestra MODAL detalle de PUBLICIDAD
 **********************************************************************************************/
function mostrarModalDetallePublicidad(publicidadId, ciudadanoId) {
    var indice = 0;
    var tablaHTML = "";
    //$("#carousel-example").carousel("pause").removeData();
    //$('.carousel-item').removeData();
    

    $("#modalMuestraDatosPublicidad").appendTo("body");
    $("#modalMuestraDatosPublicidad").modal("show");

    $('.carousel-item').empty();
    $("#divDatosPublicidadFotos").html("");
    $("#divFotoAmpliada").html("");

    /* DETALLE DE PUBLICIDAD */

    $.ajax({
        type: "GET",
        url: "/Apoyo/Publicidad/PublicidadXciudadano",
        data: { ciudadanoId },
        cache: false,
        async: false,
        success: (response) => {
            $("#FotoPersonaPub").html("<img src='" + response.url + "' class='card-img-top imgBorder' width='200px'>");
            $("#NombrePersonaPub").html("<h5 class='card-title'>" + response.nombre + "</h5>");
            tablaHTML += "<p>Colonia: " + response.nombreColonia + "</p>";
            tablaHTML += "<p>Calle: " + response.nombreCalle + ", " + response.numExterior + "</p>";
            tablaHTML += "<p>Teléfono: " + response.telefono + "</p>";
            tablaHTML += "<p>" + response.tamaño + "</p>";
            tablaHTML += "<p>" + response.tipoPublicidad + "</p>";
            $("#DatosPersonaPub").html(tablaHTML);
        }
    });


    //return;

    var contador = 0;
    var divInnerHtml = "";
    $("#divCarrouselFotosPublicidad").html("");
    
    //var carrouselFormatoHtmlFinal = "";


    //divInnerHtml += "<div class='top-content'>";
    //divInnerHtml += "<div class='container-fluid'>";
    //divInnerHtml += "<div id='carousel-example' class='carousel slide' data-ride='carousel'>";
    //divInnerHtml += "<div class='carousel-inner row w-100 mx-auto' role='listbox'>";

    new WOW().init();

    $.ajax({
        type: "GET",
        url: "/Apoyo/Publicidad/ObtieneFotosPublicidad",
        data: { publicidadId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (contador == 0) {
                //    divInnerHtml += "<div class='carousel-item active'>";
                    muestraFoto(val.url);
                }
                //else {
                //    divInnerHtml += "<div class='carousel-item'>";
                //}
                contador++;
                divInnerHtml += "<img src='" + val.url + "' class='img-fluid mx-auto d-block' alt='img1' width='100px' height = '100px' onclick='muestraFoto(\"" + val.url + "\")'>";
//                divInnerHtml += "</div>";
            });

            //divInnerHtml += "</div>";

            //divInnerHtml += "<a class='carousel-control-prev' href='#carousel-example' role='button' data-slide='prev'>";
            //divInnerHtml += "<span class='carousel-control-prev-icon' aria-hidden='true'></span>";
            //divInnerHtml += "<span class='sr-only'>Previous</span>";
            //divInnerHtml += "</a>";
            //divInnerHtml += "<a class='carousel-control-next' href='#carousel-example' role='button' data-slide='next'>";
            //divInnerHtml += "<span class='carousel-control-next-icon' aria-hidden='true'></span>";
            //divInnerHtml += "<span class='sr-only'>Next</span>";
            //divInnerHtml += "</a>";
            //divInnerHtml += "</div>";
            //divInnerHtml += "</div>";
            //divInnerHtml += "</div>";
            //divInnerHtml += "</div>";

            $("#divCarrouselFotosPublicidad").html(divInnerHtml);
            //$('#carousel-example').carousel();
            //console.log(divInnerHtml);
        }

    });

    //$('#carousel-example').on('slide.bs.carousel', function (e) {
    //    /* PRUEBA */
    //    var $e = $(e.relatedTarget);
    //    var idx = $e.index();
    //    var itemsPerSlide = 2;
    //    var totalItems = $('.carousel-item').length;
    //    //console.log("  NÚMERO DE ITEMS: " + totalItems);
    //    if (idx >= totalItems - (itemsPerSlide - 1)) {
    //        var it = itemsPerSlide - (totalItems - idx);
    //        for (var i = 0; i < it; i++) {
    //            // append slides to end
    //            if (e.direction == "left") {
    //                $('.carousel-item').eq(i).appendTo('.carousel-inner');
    //            }
    //            else {
    //                $('.carousel-item').eq(0).appendTo('.carousel-inner');
    //            }
    //        }
    //    }
    //});


}

/***********************************************************************************
 * Muestra Foto Ampliada
 ***********************************************************************************/
function muestraFoto(url) {
    var html = "";
    $("#divFotoAmpliada").html("");
    html += "<img src='" + url + "' width='500px' class='responsive col-lg-8 col-md-6 col-sm-2'>";
    //console.log(html);
    $("#divFotoAmpliada").html(html);
}

/***********************************************************************************
 * Subir Archivo de PUBLICIDAD
 ***********************************************************************************/
function subirArchivosPublicidadButton(nombreArchivoAsubir) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    var PublicidadId = $('#HiddenPublicidadId').val();
    var CiudadanoId = $('#hCiudadanoId').val();


    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("PublicidadId", PublicidadId);
    formData.append("CiudadanoId", CiudadanoId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + PublicidadId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Publicidad/SubirArchivoPublicidad",
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
            $('#ModalSeleccionarArchivosPublicidad').modal('hide');
            //ListaPublicidadCiudadano();
            FiltraPublicidad();
        },
        error: function (error) {
            console.log('Error al subir el archivo');
        }
    });
}

/****************************************************************
 *  BORRAR Archivo PUBLICIDAD
 ****************************************************************/
function EliminaArchivoPublicidad(archivosPublicidadId, publicidadId) {
    console.log("archivosPublicidadId: " + archivosPublicidadId);
    console.log("publicidadId: " + publicidadId);

    $.ajax({
        type: "DELETE",
        url: "/Apoyo/Publicidad/BorrarArchivoPublicidad",
        cache: false,
        async: false,
        data: { archivosPublicidadId },
        success: (response) => {
            if (response == 1) {
                //ListaPublicidadCiudadano();
                FiltraPublicidad();
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}



/*********************************************************************************************************************
 * FILTRAR PUBLICIDAD - Identifica opción seleccionada
 *********************************************************************************************************************/
$('#BuscarTipoPublicidadId').click(function () {
    FiltraPublicidad();
});

$('#BuscarOrigenPublicidadId').click(function () {
    FiltraPublicidad();
});



/*********************************************************************************************************************
 * FILTRAR CIUDADANO
 *********************************************************************************************************************/
function FiltraPublicidad() {

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    //console.log("...Filtra Peticiones de Apoyo: -" + RegXpag + "-" + offsetSolicitudes + "-->" + $("#hideFechaInicioRegistro").val());

    GeneraTablaPublicidad(RegXpag, offsetSolicitudes);
}


/***************************************
 * Busqueda Rápida Gestión
 ***************************************/
function BusRapPubColonia() {
    var valorBR = $('#BRpubColonia').val().trim();
    $("#coloniasBuscar").val(valorBR);
    FiltraPublicidad();
}


/*********************************************************************************************************************
 * Muestra Tabla de Solicitud de Apoyos 
 *********************************************************************************************************************/
function GeneraTablaPublicidad(RegXpag, offsetPeticiones) {
    var pagina = 1;

    var Folio = $("#BuscarFolioPublicidad").val();
    var TamañoPub = $("#BuscarTamañoPublicidad").val();
    var Ciudadano = $("#BuscarPubCiudadano").val();
    var Colonia = $("#coloniasBuscar").val();
    var Calle = $("#callesBuscar").val();

    var TipoPub = $("#BuscarTipoPublicidadId").val();
    var OrigenPub = $("#BuscarOrigenPublicidadId").val();


    var numeroRegistrosFiltrados = 0;

    var numeroRegistros = ObtieneNumPublicidad();
    var numeroRegistrosFiltrados = ObtieneNumPublicidadFiltrados(RegXpag, offsetPeticiones, Folio, TamañoPub, Ciudadano, Colonia, Calle, TipoPub, OrigenPub);

    $("#labelNumeroRegistros").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);
    $("#labelNumeroRegistros_footer").html("<strong>Total de Registros: </strong>" + numeroRegistrosFiltrados + "<strong>/</strong>" + numeroRegistros);

    DibujaTablaPublicidad(RegXpag, offsetPeticiones, pagina, Folio, TamañoPub, Ciudadano, Colonia, Calle, TipoPub, OrigenPub)

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
                DibujaTablaPublicidad(RegXpag, RegXpag * (page - 1), page, Folio, TamañoPub, Ciudadano, Colonia, Calle, TipoPub, OrigenPub);
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
function DibujaTablaPublicidad(RegXpag, offsetPeticiones, pagina, Folio, TamañoPub, Ciudadano, Colonia, Calle, TipoPub, OrigenPub) {
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
        url: "/Apoyo/Publicidad/ObtieneListadoPublicidad_2",
        data: { RegXpag, offsetPeticiones, Folio, TamañoPub, Ciudadano, Colonia, Calle, TipoPub, OrigenPub },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = (pagina - 1) * RegXpag + index + 1;
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
                        tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Archivo' onclick='EliminaArchivoPublicidad(" + val.archivosRelacionadosPublicidad[elemento].archivosPublicidadId + "," + val.publicidadBase.publicidadId + ");'>&nbsp;</span>";
                        tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
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
                    tablaHTML += "<span class='fas fa-trash' style='color:#D3D3D3;' title='Elimina Archivo' disabled>&nbsp;</span>";
                    tablaHTML += "<span class='fas fa-file-upload' style='cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
                    tablaHTML += "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }
                tablaHTML += "</td>";

                tablaHTML += "<td colspan='2' style='text-align:center; vertical-align:middle;'>";
                tablaHTML += "<span class='fas fa-edit' style='cursor:pointer;' title='Edita Registro de Publicidad' onclick='MostrarModalEditarPublicidad(" + val.publicidadBase.publicidadId + ");'></span>";
                tablaHTML += "<span class='fas fa-trash' style='cursor:pointer;' title='Elimina Registro de Publicidad' onclick='EliminaRegistroPublicidad(" + val.publicidadBase.publicidadId + ");'>&nbsp;</span>";
                tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divListaLonasBardas").html(tablaHTML);
}


/*********************************************************************************************************************
 * Elimina Registro de Publicidad con todas sus fotos
 *********************************************************************************************************************/
function EliminaRegistroPublicidad(publicidadId) {
    $.ajax({
        type: "DELETE",
        url: "/Apoyo/Publicidad/EliminaPublicidad",
        data: { publicidadId },
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
function ObtieneNumPublicidad() {
    $.ajax({
        type: "GET",
        url: "/Apoyo/Publicidad/numeroPublicidad",
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
function ObtieneNumPublicidadFiltrados(RegXpag, offsetPeticiones, Folio, TamañoPub, Ciudadano, Colonia, Calle, TipoPub, OrigenPub) {
    var numeroRegistrosFiltrados = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Publicidad/ObtieneNumPublicidadFiltrados",
        data: { Folio, TamañoPub, Ciudadano, Colonia, Calle, TipoPub, OrigenPub },
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
