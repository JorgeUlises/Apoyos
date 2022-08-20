$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
////import 'ol/ol.css';
////import Feature from 'ol/Feature';
////import Map from 'ol/Map';
////import Overlay from 'ol/Overlay';
////import Point from 'ol/geom/Point';
////import TileJSON from 'ol/source/TileJSON';
////import VectorSource from 'ol/source/Vector';
////import View from 'ol/View';
////import { Icon, Style, Text } from 'ol/style';
////import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
////import { fromLonLat } from 'ol/proj';
////import { getVectorContext } from 'ol/render';

var ChartDonutAvance;
var LineaAcumulada;

/*****************************************************************************************
 *  Autocomplete Buscar Colonias
 *****************************************************************************************/
$(document).ready(function () {

    $('#coloniasBuscar').autocomplete({
        source: function (request, response) {
            document.getElementById("callesBuscar").value = "";
            document.getElementById("hCalleBuscar").value = "";
            if ($('#coloniasBuscar').val().length < 1) {
                console.log("en datos colonia");
                return;
            }

            $.ajax({
                url: "/Apoyo/Colonias/BusquedaColonias",
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: { term: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            value: item.aNombreColonia,
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
            $("#hColoniaBuscar").val(ui.item.id);
            console.log("valor de colonia es: " + $("#hColoniaBuscar").val());
            document.getElementById("callesBuscar").value = "";
            document.getElementById("hCalleBuscar").value = "";

        },
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id').val('');
                console.log("NO SE SELECCIONO UN VALOR");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en coloniasBuscar: " + error.e);
            window.location = '/Apoyo';
        }
    });
});


/*****************************************************************************************
 *  Autocomplete Buscar Colonias en PUBLICIDAD
 *****************************************************************************************/
$(document).ready(function () {

    $('#coloniasBuscarPublicidad').autocomplete({
        source: function (request, response) {
            document.getElementById("callesBuscarPublicidad").value = "";
            document.getElementById("hCalleBuscarPublicidad").value = "";
            if ($('#coloniasBuscarPublicidad').val().length < 1) {
                console.log("en datos colonia");
                return;
            }

            $.ajax({
                url: "/Apoyo/Colonias/BusquedaColonias",
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: { term: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            value: item.aNombreColonia,
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
            $("#hColoniaBuscarPublicidad").val(ui.item.id);
            //console.log("valor de colonia es: " + $("#hColoniaBuscar").val());
            document.getElementById("callesBuscarPublicidad").value = "";
            document.getElementById("hCalleBuscarPublicidad").value = "";

        },
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id').val('');
                console.log("NO SE SELECCIONO UN VALOR");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en coloniasBuscar: " + error.e);
            window.location = '/Apoyo';
        }
    });
});


/******************************************************************
 *  Autocomplete Nombre del Usuario Solicitante de una Sala 
 ******************************************************************/
$(document).ready(function () {
    $('#autocompleteUsuarioSolicitoId').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/Sa/CatUsuarios/BusquedaUsuarios",
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: { term: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            value: item.aNombre,
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
            $("#husuarioBuscar").val(ui.item.id);
        },
        appendTo: $('#modalNuevaSolicitud'),
        minLength: 1,
        messages: {
            noResults: "Sin Resultados",
            results: function (count) {
                return count + (count == 0 ? ' result' : ' results');
            }
        }
    });

});


/*****************************************************************************************
 *  Autocomplete_2 Buscar Colonias
 *****************************************************************************************/
$('#coloniasBuscar_2').click(function () {
    element = $("#coloniasBuscar_2");
    element.removeClass("datoRequerido_OK");
    element.addClass("datoRequerido");
    $("#divCallesDeColonia").html("");
    $("#callesBuscar_2").val("");
    $("#hColoniaBuscar").val("");
    $("#hCalleBuscar").val("");
});


$(document).ready(function () {
    var element;
    $('#coloniasBuscar_2').autocomplete({
        source: function (request, response) {
            document.getElementById("callesBuscar_2").value = "";
            document.getElementById("hCalleBuscar").value = "";
            if ($('#coloniasBuscar_2').val().length < 1) {
                console.log("en datos colonia");
                $("#saveNewColoniaId").prop('disabled', true);
                element = $("#coloniasBuscar_2");
                element.removeClass("datoRequerido_OK");
                element.addClass("datoRequerido");
                $("#divCallesDeColonia").html("");
                return;
            }
            $.ajax({
                url: "/Apoyo/Colonias/BusquedaColonias",
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: { term: request.term },
                success: function (data) {
                    if (data.length == 0) {
                        $("#saveNewColoniaId").removeAttr('disabled');
                    }
                    response($.map(data, function (item) {
                        return {
                            value: item.aNombreColonia,
                            id: item.id
                        };
                    }));
                },
                error: function (response) {
                    alert("Error al buscar Colonia: " + response.responseText);
                },
                failure: function (response) {
                    alert("Failure al buscar Colonia: " + response.responseText);
                }
            })
        },
        select: function (event, ui) {
            $("#hColoniaBuscar").val(ui.item.id);
            console.log("valor de colonia es: " + $("#hColoniaBuscar").val());
            document.getElementById("callesBuscar_2").value = "";
            document.getElementById("hCalleBuscar").value = "";
            element = $("#coloniasBuscar_2");
            element.addClass("datoRequerido_OK");
            $("#saveNewColoniaId").prop('disabled', true);
            $("#saveNewCalleId_2").prop('disabled', false);
            CallesDeColonia(ui.item.id);
        },
        change: function (event, ui) {
            if (ui.item === null) {
//                $(this).val('');
                $('#field_id').val('');
                console.log("NO SE SELECCIONO UN VALOR");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en coloniasBuscar: " + error.e);
            window.location = '/Apoyo';
        }
    });
});

/*****************************************************************************************
 *  Autocomplete Buscar Calles
 *****************************************************************************************/
$(document).ready(function () {
    var coloniaId = 0;


    $('#callesBuscar').autocomplete({
        source: function (request, response) {
            coloniaId = $("#hColoniaBuscar").val();
            console.log("El ID de la colonia es: " + coloniaId);

            $.ajax({
                url: "/Apoyo/Calles/BusquedaCalles",
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: { term: request.term, coloniaId: coloniaId },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            value: item.aNombreCalle,
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
            $("#hCalleBuscar").val(ui.item.id);
        },
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id').val('');
                console.log("NO SE SELECCIONO UN VALOR");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en callesBuscar: " + error.e);
            window.location = '/Apoyo';
        }
        //appendTo: $('#modalNuevaSolicitud'),
        //minLength: 1,
        //messages: {
        //    noResults: "No results",
        //    results: function (count) {
        //        return count + (count == 0 ? ' result' : ' results');
        //    }
        //}
    });

});

/*****************************************************************************************
 *  Autocomplete Buscar CATEGORIA
 *****************************************************************************************/
var autocompleteCategorias = {
    source: function (request, response) {
        $("#hCategoriaBuscar").val("");
        $("#hSubCategoriaBuscar").val("");
        console.log("en datos Categoría: " + request.term);
        $.ajax({
            url: "/Apoyo/Categorias/BusquedaCategoria",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: { term: request.term },
            success: function (data) {
                response($.map(data, function (item) {
                    return {
                        value: item.aNombreCategoria,
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
        $("#hCategoriaBuscar").val(ui.item.id);
        console.log("valor de categoría es: " + $("#hCategoriaBuscar").val());
        $("#SubCat_Nuevo").val("");
        $("#hSubCategoriaBuscar").val("");
    },
    change: function (event, ui) {
        if (ui.item === null) {
            $(this).val('');
            $('#field_id').val('');
            console.log("NO SE SELECCIONO UN VALOR");
        }
    },
    error: function (error) {
        console.log("Mensaje de error: TIEMPO en autocompleteCategorias: " + error.e);
        window.location = '/Apoyo';
    }
}


/*****************************************************************************************
 *  Autocomplete Buscar Subcategorías
 *****************************************************************************************/
var autocompleteSubCategorias = {
    source: function (request, response) {
        var categoriaId = 0;
        categoriaId = $("#hCategoriaBuscar").val();
        console.log("El ID de la categoria es: " + categoriaId);

        $.ajax({
            url: "/Apoyo/Subcategorias/BusquedaSubcategoria",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: { term: request.term, categoriaId: categoriaId },
            success: function (data) {
                response($.map(data, function (item) {
                    return {
                        value: item.aNombreSubcategoria,
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
        $("#hSubCategoriaBuscar").val(ui.item.id);
        console.log("valor de Subcategoría es: " + $("#hSubCategoriaBuscar").val());
    },
    change: function (event, ui) {
        if (ui.item === null) {
            $(this).val('');
            $('#field_id').val('');
            console.log("NO SE SELECCIONO UN VALOR");
        }
    },
    error: function (error) {
        console.log("Mensaje de error: TIEMPO en autocompleteSubCategorias: " + error.e);
        window.location = '/Apoyo';
    }
}

/*****************************************************************************************
 *  Autocomplete Buscar Beneficiario
 *****************************************************************************************/
var autocompleteNombreBeneficiario = {
    source: function (request, response) {
        document.getElementById("hBeneficiarioBuscar").value = "";
        if ($('#BeneNombre_Nuevo').val().length < 1) {
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
        $("#hBeneficiarioBuscar").val(ui.item.id);
        console.log("valor de ciudadanos es: " + $("#hBeneficiarioBuscar").val());
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


/*****************************************************************************************
 *  Autocomplete Buscar Ciudadano Solicitante
 *****************************************************************************************/
$(document).ready(function () {
    //$("#hCiudadanoSolicitanteBuscar").val(0);
    $('#NombreCiudadanoSolicitante').autocomplete({
        source: function (request, response) {
            document.getElementById("hCiudadanoSolicitanteBuscar").value = 0;
            if ($('#NombreCiudadanoSolicitante').val().length < 0) {
                console.log("en datos ciudadano solicitante");
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
            $("#hCiudadanoSolicitanteBuscar").val(ui.item.id);
            console.log("valor de ciudadanos es: " + $("#hCiudadanoSolicitanteBuscar").val());
        },
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id').val('');
                console.log("NO SE SELECCIONO UN VALOR");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en NombreCiudadanoSolicitante: " + error.e);
            window.location = '/Apoyo';
        }
    });
});



/*****************************************************************************************
 *  Autocomplete Buscar Ciudadano Solicitante en Publicidad
 *****************************************************************************************/
$(document).ready(function () {
    //$("#hCiudadanoSolicitanteBuscar").val(0);
    $('#NombreCiudadanoPublicidad').autocomplete({
        source: function (request, response) {
            document.getElementById("hCiudadanoPublicidadBuscar").value = 0;
            if ($('#NombreCiudadanoPublicidad').val().length < 0) {
                console.log("en datos ciudadano Publicidad");
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
            $("#hCiudadanoPublicidadBuscar").val(ui.item.id);
            console.log("valor de ciudadanos es: " + $("#hCiudadanoPublicidadBuscar").val());
            obtieneDatosCiudadanoParaPublicidad(ui.item.id);
        },
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id').val('');
                console.log("NO SE SELECCIONO UN VALOR");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en NombreCiudadanoSolicitante: " + error.e);
            window.location = '/Apoyo';
        }
    });
});


/*****************************************************
 * En Publicidad, llena los datos del Ciudadano 
 *****************************************************/
function obtieneDatosCiudadanoParaPublicidad(idCiudadano) {
    console.log("En obtieneDatosCiudadanoParaPublicidad: " + idCiudadano);
    $.ajax({
        type: "GET",
        url: "/Apoyo/Ciudadanoes/ObtieneDetalleCiudadanos",
        data: { idCiudadano },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                $('#coloniasBuscar').val(val.colonia);
                $('#callesBuscar').val(val.calle);
                $('#inputNumExtPublicidad').val(val.numeroExterior);
                $('#inputCpPublicidad').val(val.cp);
                $('#inputLatitudPublicidad').val(val.latitud);
                $('#inputLongitudPublicidad').val(val.longitud);
                $('#hColoniaBuscar').val(val.coloniaID);
                $('#hCalleBuscar').val(val.calleID);
            });
        }
    });
}



$("#NombreCiudadanoPublicidad").on("input", function () {
    $('#coloniasBuscar').val("");
    $('#callesBuscar').val("");
    $('#inputNumExtPublicidad').val("");
    $('#inputCpPublicidad').val("");
    $('#inputLatitudPublicidad').val("");
    $('#inputLongitudPublicidad').val("");
    $('#hColoniaBuscar').val(0);
    $('#hCalleBuscar').val(0);
});


/*****************************************************************************************
 *  Identifica la opción seleccionada en Origen de Solicitud de Apoyo
 *****************************************************************************************/
function optSelecEnOrigen() {
    console.log("opcion seleccionada:" + $('#OrigenPeticion').val());
    $("#tablaAsociacion").hide();
    $("#NombreCiudadanoSolicitante").val("");
    $("#NombreCiudadanoSolicitante").val("");

    $('#AsociacionId').selectedIndex = "0";
    $('#AsociacionId').val("");

    if ($('#OrigenPeticion').val() == 3) {
        $("#tablaAsociacion").show();
    }
}



/*****************************************************************************************
 *  Autocomplete Buscar Ciudadano Actualizar Publicidad
 *****************************************************************************************/
$(document).ready(function () {
    //$("#hCiudadanoSolicitanteBuscar").val(0);
    $('#NombreCiudadanoPublicidadEdit').autocomplete({
        source: function (request, response) {
            document.getElementById("hCiudadanoPublicidadBuscar").value = 0;
            if ($('#NombreCiudadanoPublicidadEdit').val().length < 0) {
                console.log("en datos ciudadano Publicidad");
                return;
            }
            console.log("NOMBRE PERSONA PUBLICIDAD: " + request.term);
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
        appendTo: $('#information_modal'),
        select: function (event, ui) {
            $("#hCiudadanoPublicidadBuscar").val(ui.item.id);
            console.log("valor de ciudadanos es: " + $("#hCiudadanoPublicidadBuscar").val());
        },
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id').val('');
                console.log("NO SE SELECCIONO UN VALOR");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en hCiudadanoPublicidadBuscar: " + error.e);
            window.location = '/Apoyo';
        }
    });
});


/*****************************************************************************************
 *  Identifica la opción seleccionada en Origen de Solicitud de GESTIÓN
 *****************************************************************************************/
function optSelecEnOrigen_G() {
    console.log("opcion seleccionada:" + $('#OrigenGestion').val());
    $("#tablaAsociacion_G").hide();
    //$("#NombreCiudadanoSolicitante").val("");
    //$("#NombreCiudadanoSolicitante").val("");

    $('#AsociacionIdG').selectedIndex = "0";
    $('#AsociacionIdG').val("");

    if ($('#OrigenGestion').val() == 3) {
        $("#tablaAsociacion_G").show();
    }
}


/*****************************************************************************************
 *  Obtiene Lalitud y Longitud de la ubicación actual
 *****************************************************************************************/
function ObtieneLalitudLongitudActual() {
    console.log("En ObtieneLalitudLongitudActual");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Latitude: " + position.coords.latitude);
            console.log("Longitud: " + position.coords.longitude);

            $("#Latitud").val(position.coords.latitude);
            $("#Longitud").val(position.coords.longitude);

            //var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //var mapOptions = {
            //    center: LatLng,
            //    zoom: 13,
            //    mapTypeId: google.maps.MapTypeId.ROADMAP
            //};
            //var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
            //var marker = new google.maps.Marker({
            //    position: LatLng,
            //    map: map,
            //    title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude
            //});
            //google.maps.event.addListener(marker, "click", function (e) {
            //    var infoWindow = new google.maps.InfoWindow();
            //    infoWindow.setContent(marker.title);
            //    infoWindow.open(map, marker);
            //});

            //function showMap(position) {
            // Get location data
            //var latlong = position.coords.latitude + "," + position.coords.longitude;

            //// Set Google map source url
            //var mapLink = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlong + "&zoom=16&size=400x300&output=embed";

            //// Create and insert Google map
            //document.getElementById("dvMap").innerHTML = "<img alt='Map Holder' src='" + mapLink + "'>";
            //}

        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

}

/**********************************************************************************************
 * Muestra MODAL Registro de Nueva Colonia
 **********************************************************************************************/
function mostrarModalNuevaColonia() {
    $("#divModalAltaColonia").appendTo("body");
    $("#divModalAltaColonia").modal("show");
    $("#coloniasBuscar").val("");

    //$('#HiddenIniciativaId').val(IniciativaId);
}

/**********************************************************************************************
 * Muestra MODAL Registro de Nueva Calle
 **********************************************************************************************/
function mostrarModalNuevaCalle() {
    var idColonia = $("#hColoniaBuscar").val();
    if (idColonia <= 0) {
        $("#msgSelColonia_AntesDeNvaCalle").show();
        setTimeout(function () {
            $('#msgSelColonia_AntesDeNvaCalle').fadeOut('fast');
        }, 2000);
        return;
    }
    $("#divModalAltaCalle").appendTo("body");
    $("#divModalAltaCalle").modal("show");
    $("#callesBuscar").val("");
}

/**********************************************************************************************
 * Guarda una nueva Colonia desde Modal
 **********************************************************************************************/
function GuardarNuevaColoniaButton() {
    var nombreColonia = $("#inputNombreColonia").val();
    if (nombreColonia.length <= 0) {
        return;
    }
    $.ajax({
        type: "POST",
        url: "/Apoyo/Colonias/RegistraNuevaColonia",
        data: { nombreColonia },
        cache: false,
        async: false,
        success: (response) => {
            console.log("valor de regreso al guardar una Colonia: " + response);
            if (response > 0) {
                $("#mensajeColonia_OK").show();
                setTimeout(function () {
                    $('#mensajeColonia_OK').fadeOut('fast');
                }, 2000);
            }
            else {
                if (response == 0) {
                    $("#mensajeColonia_Existente").show();
                    setTimeout(function () {
                        $('#mensajeColonia_Existente').fadeOut('fast');
                    }, 2000);
                } else {
                    $("#mensajeColonia_Error").show();
                    setTimeout(function () {
                        $('#mensajeColonia_Error').fadeOut('fast');
                    }, 2000);
                }
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en GuardaNuevaColoniaButton: " + error.e);
            window.location = '/Apoyo';
        }
    });
    $("#coloniasBuscar").val("");
    $('#divModalAltaColonia').modal('hide');
}

/**********************************************************************************************
 * Guarda una nueva Calle desde Modal
 **********************************************************************************************/
function GuardarNuevaCalleButton() {
    var nombreCalle = $("#inputNombreCalle").val();
    if (nombreCalle.length <= 0) {
        return;
    }
    var coloniaId = $("#hColoniaBuscar").val();
    $.ajax({
        type: "POST",
        url: "/Apoyo/Calles/RegistraNuevaCalle",
        data: { nombreCalle, coloniaId },
        cache: false,
        async: false,
        success: (response) => {
            console.log("valor de regreso al guardar una Calle: " + response);
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en GuardaNuevaCalleButton: " + error.e);
            window.location = '/Apoyo';
        }
    });
    //$("#inputNombreColonia").val("");
    $('#divModalAltaCalle').modal('hide');
}

/**********************************************************************************************
 * Guarda una nueva Colonia desde CATALOGO
 **********************************************************************************************/
function GuardarNuevaColoniaButton_2() {
    var nombreColonia = $("#coloniasBuscar_2").val().trim();
    console.log("NOMBRE COLONIA: " + nombreColonia);
    if (nombreColonia.length <= 0) {
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/Apoyo/Colonias/RegistraNuevaColonia",
        data: { nombreColonia },
        cache: false,
        async: false,
        success: (response) => {
            console.log("valor de regreso al guardar una Colonia: " + response);
            if (response > 0) {
                $("#mensajeColonia_OK").show();
                setTimeout(function () {
                    $('#mensajeColonia_OK').fadeOut('fast');
                }, 2000);
                $("#hColoniaBuscar").val(response);
                $("#saveNewColoniaId").prop('disabled', true);
                $("#saveNewCalleId_2").prop('disabled', false);
                CallesDeColonia(response);
            }
            else {
                if (response == 0) {
                    $("#mensajeColonia_Existente").show();
                    setTimeout(function () {
                        $('#mensajeColonia_Existente').fadeOut('fast');
                    }, 2000);
                } else {
                    $("#mensajeColonia_Error").show();
                    setTimeout(function () {
                        $('#mensajeColonia_Error').fadeOut('fast');
                    }, 2000);
                }
                $("#coloniasBuscar_2").val("");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: GuardaNuevaColoniaButton: " + error.e);
            window.location = '/Apoyo';
        }
    });
    
}

/**********************************************************************************************
 * Guarda una nueva Calle desde Modal
 **********************************************************************************************/
function GuardarNuevaCalleButton_2() {
    var nombreCalle = $("#callesBuscar_2").val();
    if (nombreCalle.length <= 0) {
        return;
    }
    var coloniaId = $("#hColoniaBuscar").val();
    $.ajax({
        type: "POST",
        url: "/Apoyo/Calles/RegistraNuevaCalle",
        data: { nombreCalle, coloniaId },
        cache: false,
        async: false,
        success: (response) => {
            if (response > 0) {
                $("#mensajeCalle_OK").show();
                setTimeout(function () {
                    $('#mensajeCalle_OK').fadeOut('fast');
                }, 2000);
                CallesDeColonia(coloniaId);
            }
            else {
                if (response == 0) {
                    $("#mensajeCalle_Existente").show();
                    setTimeout(function () {
                        $('#mensajeCalle_Existente').fadeOut('fast');
                    }, 2000);
                } else {
                    $("#mensajeCalle_Error").show();
                    setTimeout(function () {
                        $('#mensajeCalle_Error').fadeOut('fast');
                    }, 2000);
                }
                $("#callesBuscar_2").val("");
            }
        },
        error: function (error) {
            console.log("Mensaje de error: TIEMPO en GuardaNuevaCalleButton: " + error.e);
            window.location = '/Apoyo';
        }
    });
}



/***********************************************************************
 * En Dashboard Selecciona AÑO
 * Habilita el combo de MES
 ***********************************************************************/
$('#anioReporteId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaId').val();

    anioSel = $('#anioReporteId').val();
    console.log("AÑO = " + anioSel);
    if (anioSel == 0) {
        $("#mesReporteId").val(0);
        $("#mesReporteId").prop('disabled', true);
        Resumen(legislaturaId, anioSel, mesSel);
    } else {
        $("#mesReporteId").prop('disabled', false);
        mesSel = $("#mesReporteId").val();
        Resumen(legislaturaId, anioSel, mesSel);
    }
    console.log("MES = " + mesSel);
});

/***********************************************************************
 * En Dashboard Selecciona MES
 ***********************************************************************/
$('#mesReporteId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaId').val();

    anioSel = $('#anioReporteId').val();
    mesSel = $("#mesReporteId").val();

    console.log("MES = " + mesSel);

    Resumen(legislaturaId, anioSel, mesSel);
});


/***********************************************************************
 * En Dashboard Selecciona LEGISLATURA
 ***********************************************************************/
$('#legislaturaId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaId').val();

    anioSel = $('#anioReporteId').val();
    mesSel = $("#mesReporteId").val();

    console.log("MES = " + mesSel);

    Resumen(legislaturaId, anioSel, mesSel);
});


/**********************************************************************************************
 * RESUMEN
 **********************************************************************************************/
function Resumen(legislaturaId, anioSel, mesSel) {
    console.log("legislaturaId: " + legislaturaId);
    console.log("anioSel: " + anioSel);
    console.log("mesSel: " + mesSel);

    var LegislaturaID = legislaturaId;
    var totalpeticiones = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroPeticiones",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            response--;
            $('#resumenNumSol').html("<h3>" + response + "</h3>");
            totalpeticiones = response;
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroBeneficiariosPeticiones",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            response--;
            $('#resumenNumBeneficiariosSolicitudes').html("<h3>" + response + "</h3>");
            totalpeticionesBeneficiarios = response;
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/numeroGestiones",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            response--;
            $('#resumenNumGestiones').html("<h3>" + response + "</h3>");
            totalGestiones = response;
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/numeroBeneficiariosGestiones",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            response--;
            $('#resumenNumBeneficiariosGestion').html("<h3>" + response + "</h3>");
            totalGestionesBeneficiarios = response;
        }
    });


    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroEventosResumen",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumEventos').html("<h3>" + response + "</h3>");
        }
    });

    //$.ajax({
    //    type: "GET",
    //    url: "/Apoyo/Peticiones/numeroVisitas",
    //    data: { LegislaturaID },
    //    cache: false,
    //    async: false,
    //    success: (response) => {
    //        $('#resumenNumVisitas').html("<h3>" + response + "</h3>");
    //    }
    //});

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroCiudadanos",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumCiudadanos').html("<h3>" + response + "</h3>");
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroAsociacionesResumen",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumAsociaciones').html("<h3>" + response + "</h3>");
        }
    });


    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/numeroGestionesHitos",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumHitosGestion').html("<h3>" + response + "</h3>");
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroPeticionesHitos",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumHitos').html("<h3>" + response + "</h3>");
        }
    });


    var tablaHTML = "<br/>";
    var totalSol = 0;
    var nombreEs = "";

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Solicitudes de Apoyo X Estatus</h3>";
    tablaHTML += "</div>";

    tablaHTML += "<table class='table table-hover' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Estatus</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Cantidad</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Porcentaje</td>";
    tablaHTML += "</tr>";

    var promedio = 0;
    var solAtendidas = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/resumenXestatus",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                nombreEs = val.estatus == "_" ? "Sin Estatus" : val.estatus;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px; background-color: white;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px; background-color: white;'>" + nombreEs + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: white;'>" + val.cantidad + "</td>";
                if (totalpeticiones != 0) {
                    promedio = Math.round(val.cantidad * 100 / totalpeticiones);
                }

                //                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + promedio + " %</td>";


                tablaHTML += "<td class='centrarVH' style='background-color: white; font-size:small;'>";
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
                tablaHTML += "</div>" + promedio + "%</td>";

                tablaHTML += "</tr>";
                totalSol += val.cantidad;

                if (val.estatus == 'CANCELADO' || val.estatus == 'ENTREGADO' || val.estatus == 'RECHAZADO') {
                    solAtendidas += val.cantidad;
                }
            })
        }
    });

    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>TOTAL</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSol + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";

    $("#CardEstatus").html(tablaHTML);


    if (totalSol != 0) {
        promedio = Math.round(solAtendidas * 100 / totalSol);
    } else {
        promedio = 0;
    }


    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Avance Global Solicitudes de Apoyo</h3>";
    tablaHTML += "</div>";
    //tablaHTML += "<div style='text-align:center; vertical-align:central;'>";
    tablaHTML += "<span class='chart' data-percent='" + promedio + "'>";
    tablaHTML += "<span class='percent'>" + promedio + "%</span>";
    tablaHTML += "</span>";
    //tablaHTML += "</div>";

    $("#CardEstatusAvanceGlobal").html(tablaHTML);

    GraficaDona(promedio);

    tableHTML = "<strong>" + solAtendidas + "/" + totalSol + "</strong>";
    $("#NumSolicitudes").html(tableHTML);

    // DATOS DE GESTIONES X ESTATUS

    totalSol = 0;

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Solicitudes de Gestiones X Estatus</h3>";
    tablaHTML += "</div>";

    tablaHTML += "<table class='table table-hover' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Estatus</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Cantidad</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Porcentaje</td>";
    tablaHTML += "</tr>";

    var promedioGestion = 0;
    var solAtendidas = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/resumenXestatus",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                nombreEs = val.estatus == "_" ? "Sin Estatus" : val.estatus;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px; background-color: white;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px; background-color: white;'>" + nombreEs + "</td>";

                if (val.cantidad != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: white;'>" + val.cantidad + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: white;'></td>";
                }

                
                if (totalGestiones != 0) {
                    promedioGestion = Math.round(val.cantidad * 100 / totalGestiones);
                }

                //                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + promedio + " %</td>";


                tablaHTML += "<td class='centrarVH' style='background-color: white; font-size:small;'>";
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedioGestion + "%; height:20px;' title='" + promedioGestion + "%' aria-valuenow='" + promedioGestion + "'></div>";
                tablaHTML += "</div>" + promedioGestion + "%</td>";

                tablaHTML += "</tr>";
                totalSol += val.cantidad;

                if (val.estatus == 'Respuesta Positiva Entregada a Ciudadano' || val.estatus == 'Respuesta Negativa' || val.estatus == 'Cancelada' || val.estatus == 'Reasignada') {
                //if (val.estatus == 5 || val.estatus == 6 || val.estatus == 8 || val.estatus == 9) {
                    solAtendidas += val.cantidad;
                }
            })
        }
    });

    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>TOTAL</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSol + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";

    $("#CardEstatusGestion").html(tablaHTML);


    if (totalSol != 0) {
        promedioGestion = Math.round(solAtendidas * 100 / totalSol);
    } else {
        promedioGestion = 0;
    }


    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Avance Global Solicitudes de Apoyo</h3>";
    tablaHTML += "</div>";
    //tablaHTML += "<div style='text-align:center; vertical-align:central;'>";
    tablaHTML += "<span class='chart' data-percent='" + promedioGestion + "'>";
    tablaHTML += "<span class='percent'>" + promedioGestion + "%</span>";
    tablaHTML += "</span>";
    //tablaHTML += "</div>";

    $("#CardEstatusAvanceGlobalGestion").html(tablaHTML);

    GraficaDonaGestion(promedioGestion);
   // GraficaSolicitudesAcumuladas(anioSel);
    tableHTML = "<strong>" + solAtendidas + "/" + totalSol + "</strong>";
    $("#NumGestiones").html(tableHTML);




    // Peticiones X Clasificación X Estatus

    var totalBeneficiarios = 0;

    var totalSinClasifi = 0;
    var totalSolicitado = 0;
    var totalCancelado = 0;
    var totalEntregado = 0;
    var totalRechazado = 0;


    var totalTotal = 0;

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Solicitudes de Apoyo X Categoría X Estatus</h3>";
    tablaHTML += "</div>";
    tablaHTML += "<hr/>";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Categoría</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Beneficiarios</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Sin Estatus</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Solicitado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Cancelado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Entregado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Rechazado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Avance</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
//        url: "/Apoyo/Peticiones/resumenXclasificacion",
        url: "/Apoyo/Peticiones/resumenXclasificacion_mas_beneficios",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                //nombreEs = val.estatus == "_" ? "" : val.estatus;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.categoria + "</td>";

                if (val.beneficiarios != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.beneficiarios + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.sinClasificacion != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.sinClasificacion + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.solicitado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.solicitado + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.cancelado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.cancelado + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.entregado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.entregado + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.rechazado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.rechazado + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.total != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.total + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.total != 0) {
                    promedio = Math.round((val.entregado + val.cancelado + val.rechazado) * 100 / val.total);
                } else {
                    promedio = 0;
                }
                
                tablaHTML += "<td class='centrarVH' style='font-size:small;'>";
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
                tablaHTML += "</div>" + promedio + "%</td>";

                tablaHTML += "</tr>";
                totalBeneficiarios += val.beneficiarios;
                totalSinClasifi += val.sinClasificacion;
                totalSolicitado += val.solicitado;
                totalCancelado += val.cancelado;
                totalEntregado += val.entregado;
                totalRechazado += val.rechazado;
                totalTotal += val.total;
            })
        }
    });
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>TOTAL</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalBeneficiarios + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSinClasifi + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSolicitado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalCancelado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalEntregado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalRechazado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalTotal + "</strong></td>";

    promedio = Math.round((totalEntregado + totalCancelado + totalRechazado) * 100 / totalTotal);
    tablaHTML += "<td class='centrarVH'>";
    tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
    tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
    tablaHTML += "</div>" + promedio + "%</td>";

    tablaHTML += "</tr>";

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";
    $("#CardClasificacion").html(tablaHTML);


    // GESTIONES X Clasificación X Estatus

    var totalSinEstatusGestion = 0;
    var totalIngresaDependencia = 0;
    var totalCopiaCiudadano = 0;
    var totalConRespuesta = 0;
    var totalRespuestaPositiva = 0;
    var totalRespuestaNegativa = 0;
    var totalEnProceso = 0;
    var totalCanceladaGestion = 0;
    var totalReasignada = 0;

    totalTotal = 0;

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Solicitudes de Gestión X Categoría X Estatus</h3>";
    tablaHTML += "</div>";
    tablaHTML += "<hr/>";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Categoría</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Sin Estatus</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Ingresa Dependencia</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Copia Ciudadano</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Con Respuesta Ciudadano</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Respuesta Positiva</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Respuesta Negativa</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>En Proceso</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Cancelada</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Reasignada</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Avance</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/resumenXclasificacionGestion",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                //nombreEs = val.estatus == "_" ? "" : val.estatus;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.clasificacion + "</td>";

                if (val.sinEstatus != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.sinEstatus + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.ingresaDependencia != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.ingresaDependencia + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.copiaCiudadano != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.copiaCiudadano + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.gestionRespuesta != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.gestionRespuesta + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.respuestaPositiva != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.respuestaPositiva + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.respuestaNegativa != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.respuestaNegativa + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.enProceso != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.enProceso + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }

                if (val.cancelada != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.cancelada + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.reasignada != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.reasignada + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.total != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.total + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }



                promedio = Math.round((val.respuestaPositiva + val.respuestaNegativa + val.cancelada + val.reasignada) * 100 / val.total);
                tablaHTML += "<td class='centrarVH' style='font-size:small;'>";
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
                tablaHTML += "</div>" + promedio + "%</td>";

                tablaHTML += "</tr>";

                totalSinEstatusGestion += val.sinEstatus;
                totalIngresaDependencia += val.ingresaDependencia;
                totalCopiaCiudadano += val.copiaCiudadano;
                totalConRespuesta += val.gestionRespuesta;
                totalRespuestaPositiva += val.respuestaPositiva;
                totalRespuestaNegativa += val.respuestaNegativa;
                totalEnProceso += val.enProceso;
                totalCanceladaGestion += val.cancelada;
                totalReasignada += val.reasignada;

                totalTotal += val.total;
            })
        }
    });
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>TOTAL</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSinEstatusGestion + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalIngresaDependencia + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalCopiaCiudadano + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalConRespuesta + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalRespuestaPositiva + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalRespuestaNegativa + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalEnProceso + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalCanceladaGestion + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalReasignada + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalTotal + "</strong></td>";

    promedio = Math.round((totalRespuestaPositiva + totalRespuestaNegativa + totalCanceladaGestion + totalReasignada) * 100 / totalTotal);
    tablaHTML += "<td class='centrarVH'>";
    tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
    tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
    tablaHTML += "</div>" + promedio + "%</td>";

    tablaHTML += "</tr>";

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";
    $("#CardClasificacionGestion").html(tablaHTML);

    // Eventos
    var totalSinEstatus = 0;
    var totalPlaneado = 0;
    var totalRealizado = 0;
    var totalPospuesto = 0;
    var totalCancelado = 0;
    var totalEventos = 0;

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Eventos X Tipo X Estatus</h3>";
    tablaHTML += "</div>";
    tablaHTML += "<hr/>";

    tablaHTML += "<table class='table table-bordered responsive-table' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Tipo</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Sin Estatus</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Planeado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Realizado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Pospuesto</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Cancelado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Eventoes/resumenXtipo",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                //nombreEs = val.estatus == "_" ? "" : val.estatus;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.tipo + "</td>";

                if (val.sinEstatus != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.sinEstatus + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.planeado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.planeado + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.realizado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.realizado + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.pospuesto != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.pospuesto + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                if (val.cancelado != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.cancelado + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'></td>";
                }


                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.total + "</td>";
                tablaHTML += "</tr>";

                totalSinEstatus += val.sinEstatus;
                totalPlaneado += val.planeado;
                totalRealizado += val.realizado;
                totalPospuesto += val.pospuesto;
                totalCancelado += val.cancelado;
                totalEventos += val.total;
            })
        }
    });
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>TOTAL</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSinEstatus + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalPlaneado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalRealizado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalPospuesto + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalCancelado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalEventos + "</strong></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";
    $("#CardEventos").html(tablaHTML);


    /* COSTOS */
    // PETICIONES COSTO X CATEGORIA

    $("#cPeticionCEA").html("");
    $("#cPeticionSeguridad").html("");
    $("#cPeticionDeportes").html("");
    $("#cPeticionSocial").html("");
    $("#cPeticionSalud").html("");
    $("#cPeticionSinCategoria").html("");

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtenCostoPeticionXCategoria",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                switch (val.categoriaId) {
                    case 0:
                        if (val.costo != 0) {
                            $("#cPeticionSinCategoria").html("$" + val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        } else {
                            $("#cPeticionSinCategoria").html("");
                        }
                        
                        break;
                    case 1:
                        $("#cPeticionCEA").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 2:
                        $("#cPeticionSeguridad").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 3:
                        $("#cPeticionDeportes").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 4:
                        $("#cPeticionSocial").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 5:
                        $("#cPeticionSalud").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                }
            })
        }
    });

    /* COSTOS */
    // GESTIONES COSTO X CATEGORIA

    $("#cGestionCEA").html("");
    $("#cGestionSeguridad").html("");
    $("#cGestionDeportes").html("");
    $("#cGestionSocial").html("");
    $("#cGestionSalud").html("");
    $("#cGestionSinCategoria").html("");

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtenCostoGestionXCategoria",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                switch (val.categoriaId) {
                    case 0:
                        if (val.costo != 0) {
                            $("#cGestionSinCategoria").html("$" + val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        } else {
                            $("#cGestionSinCategoria").html("");
                        }
                        break;
                    case 1:
                        $("#cGestionCEA").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 2:
                        $("#cGestionSeguridad").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 3:
                        $("#cGestionDeportes").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 4:
                        $("#cGestionSocial").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                    case 5:
                        $("#cGestionSalud").html(val.costo.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        break;
                }
            })
        }
    });

}

/******************************************************************************************
 * Genera Tabla de Nùmero de Solicitudes X Semana
 ******************************************************************************************/
function NumeroSolicitudesXsemana(LegislaturaId, DiputadoId, ResponsableId){
    var tablaHTML = "";

    tablaHTML = "<hr/>";
    //tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    //tablaHTML += "<h3>Número de Solicitudes X Estatus X Semana</h3>";
    //tablaHTML += "</div>";

    tablaHTML += "<table class='table table-hover' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr>";
    tablaHTML += "<th rowspan='2' style='text-align: center; vertical-align: middle;padding:1px;'>#</th>";
    tablaHTML += "<th rowspan='2' style='text-align: center; vertical-align: middle;padding:1px;'>Año</th>";
    tablaHTML += "<th rowspan='2' style='text-align: center; vertical-align: middle;padding:1px;'>Mes</th>";
    tablaHTML += "<th rowspan='2' style='text-align: center; vertical-align: middle;padding:1px;'>Numero Semana</th>";
    tablaHTML += "<th rowspan='2' style='text-align: center; vertical-align: middle;padding:1px;'>Inicio Semana</th>";
    tablaHTML += "<th rowspan='2' style='text-align: center; vertical-align: middle;padding:1px;'>Fin Semana</th>";
    tablaHTML += "<th colspan='7' style='text-align: center; vertical-align: middle;padding:1px;'>GESTIÓN</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Concluidas en Semana</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas en Proceso</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas Concluidas</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>%</td>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Avance</td>";
    tablaHTML += "<th colspan='7' style='text-align: center; vertical-align: middle;padding:1px;'>APOYO</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Concluidas en Semana</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas en Proceso</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas Concluidas</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>%</td>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Avance</td>";
    tablaHTML += "</tr>";

    tablaHTML += "<tr>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>#</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Año</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Mes</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Numero Semana</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Inicio Semana</th>";
    //tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Final Semana</th>";

    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Solicitudes en Semana</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Concluidas en Semana</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas en Proceso</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas Concluidas</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>%</td>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Avance</td>";

    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Solicitudes en Semana</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Concluidas en Semana</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas en Proceso</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Acumuladas Concluidas</th>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>%</td>";
    tablaHTML += "<th style='text-align: center; vertical-align: middle;padding:1px;'>Avance</td>";
    tablaHTML += "</tr>";
    
    tablaHTML += "</thead>";
    tablaHTML += "<tbody>";

    var promedio = 0;
    var promedio_A = 0;
    var solAtendidas = 0;
    var P_G = 0;
    var C_G = 0;
    var T_G = 0;

    var P_A = 0;
    var C_A = 0;
    var T_A = 0;

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/SolicitudesAvanceXsemana",
        data: { LegislaturaId, DiputadoId, ResponsableId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                nombreEs = val.estatus == "_" ? "Sin Estatus" : val.estatus;
                tablaHTML += "<tr>";

                if (val.estaSemana != 0) {
                    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px; background-color: yellow;'>" + indice + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: yellow;'>" + val.anio + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: yellow;'>" + val.mes + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: yellow;'>" + val.numeroSemana + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: yellow;'>" + moment(val.fechaInicioSemana).format('DD/MM/yyyy') + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: yellow;'>" + moment(val.fechaFinSemana).format('DD/MM/yyyy') + "</td>";
                } else {
                    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px; background-color: white;'>" + indice + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: white;'>" + val.anio + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: white;'>" + val.mes + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: white;'>" + val.numeroSemana + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: white;'>" + moment(val.fechaInicioSemana).format('DD/MM/yyyy') + "</td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: white;'>" + moment(val.fechaFinSemana).format('DD/MM/yyyy') + "</td>";
                }





                // Avance Semanal GESTIÓN
                if (val.registradaEnSemana_G != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: #f5dfba;'>" + val.registradaEnSemana_G + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'></td>";
                }

                if (val.concluidaEnSemana_G != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'>" + val.concluidaEnSemana_G + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'></td>";
                }

                if (val.procesoAcumuladas_G != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: #f5dfba;'>" + val.procesoAcumuladas_G + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'></td>";
                }

                if (val.concluidasAcumulada_G != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'>" + val.concluidasAcumulada_G + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'></td>";
                }

                if (val.total_G != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'>" + val.total_G + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'></td>";
                }



                if (val.total_G != 0) {
                    promedio = Math.round(val.concluidasAcumulada_G * 100 / val.total_G);
                } else {
                    promedio = 0;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #f5dfba;'>" + promedio + "%</td>";

                if (val.estaSemana != 0) {
                    tablaHTML += "<td class='centrarVH' style='background-color: yellow; font-size:small;'>";
                } else {
                    tablaHTML += "<td class='centrarVH' style='background-color: white; font-size:small;'>";
                }
                
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
                tablaHTML += "</div>";
                tablaHTML += "</td>";


                P_G = val.procesoAcumuladas_G;
                C_G = val.concluidasAcumulada_G;
                T_G = val.total_G;


                // AVANCE DE APOYOS
                if (val.registradaEnSemana != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: #dce8f7;'>" + val.registradaEnSemana + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'></td>";
                }

                if (val.concluidaEnSemana != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'>" + val.concluidaEnSemana + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'></td>";
                }

                if (val.procesoAcumuladas != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:5px; background-color: #dce8f7;'>" + val.procesoAcumuladas + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'></td>";
                }

                if (val.concluidasAcumulada != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'>" + val.concluidasAcumulada + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'></td>";
                }

                if (val.total != 0) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'>" + val.total + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'></td>";
                }



                if (val.total != 0) {
                    promedio_A = Math.round(val.concluidasAcumulada * 100 / val.total);
                } else {
                    promedio_A = 0;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px; background-color: #dce8f7;'>" + promedio_A + "%</td>";

                if (val.estaSemana != 0) {
                    tablaHTML += "<td class='centrarVH' style='background-color: yellow; font-size:small;'>";
                } else {
                    tablaHTML += "<td class='centrarVH' style='background-color: white; font-size:small;'>";
                }

                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio_A + "%; height:20px;' title='" + promedio_A + "%' aria-valuenow='" + promedio_A + "'></div>";
                tablaHTML += "</div>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";

                P_A = val.procesoAcumuladas;
                C_A = val.concluidasAcumulada;
                T_A = val.total;
            })
        }
    });

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";
    tablaHTML += "<hr/>";

    $("#TablaNumeroSolicitudesXSemana").html(tablaHTML);

    tablaHTML = "<div class='card'>";
    tablaHTML += "<div class='card-header' style='background: #f5dfba; color: black;'>GESTIONES</div>";
    tablaHTML += "<div class='card-body'>";
    tablaHTML += "<table width='100%' style='border:none;'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align: left; background-color: #fff; border-bottom: 1px solid #CFD2D5;'>Proceso</td>";
    tablaHTML += "<td style='text-align: right; background-color: #fff; border-left: 1px solid #CFD2D5; border-bottom: 1px solid #CFD2D5;' id='totalProceso'>" + P_G + "</td>";
    tablaHTML += "</tr>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align: left; background-color: #fff; border-bottom: 1px solid #CFD2D5;'>Concluido</td>";
    tablaHTML += "<td style='text-align: right; background-color: #fff; border-left: 1px solid #CFD2D5; border-bottom: 1px solid #CFD2D5;' id='totalConcluido'>" + C_G + "</td>";
    tablaHTML += "</tr>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align: center; background-color: #fff;'>TOTAL</td>";
    tablaHTML += "<td style='text-align: right; background-color: #fff; border-left: 1px solid #CFD2D5;' id='totalTotal'>" + T_G + "</td>";
    tablaHTML += "</tr>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";
    tablaHTML += "<div class='card-footer text-muted'>";
    tablaHTML += "<p class='card-text'>";
    tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
    tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
    tablaHTML += "</div>";
    tablaHTML += "</p>";
    tablaHTML += "</div>";
    tablaHTML += "</div>";


    $("#R_S_G").html(tablaHTML);

    tablaHTML = "<div class='card'>";
    tablaHTML += "<div class='card-header' style='background: #dce8f7; color: black;'>APOYOS</div>";
    tablaHTML += "<div class='card-body'>";
    tablaHTML += "<table width='100%' style='border:none;'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align: left; background-color: #fff; border-bottom: 1px solid #CFD2D5;'>Proceso</td>";
    tablaHTML += "<td style='text-align: right; background-color: #fff; border-left: 1px solid #CFD2D5; border-bottom: 1px solid #CFD2D5;' id='totalProceso'>" + P_A + "</td>";
    tablaHTML += "</tr>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align: left; background-color: #fff; border-bottom: 1px solid #CFD2D5;'>Concluido</td>";
    tablaHTML += "<td style='text-align: right; background-color: #fff; border-left: 1px solid #CFD2D5; border-bottom: 1px solid #CFD2D5;' id='totalConcluido'>" + C_A + "</td>";
    tablaHTML += "</tr>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align: center; background-color: #fff;'>TOTAL</td>";
    tablaHTML += "<td style='text-align: right; background-color: #fff; border-left: 1px solid #CFD2D5;' id='totalTotal'>" + T_A + "</td>";
    tablaHTML += "</tr>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";
    tablaHTML += "<div class='card-footer text-muted'>";
    tablaHTML += "<p class='card-text'>";
    tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
    tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio_A + "%; height:20px;' title='" + promedio_A + "%' aria-valuenow='" + promedio_A + "'></div>";
    tablaHTML += "</div>";
    tablaHTML += "</p>";
    tablaHTML += "</div>";
    tablaHTML += "</div>";


    $("#R_S_A").html(tablaHTML);
}

/**********************************************************************************************
 * Inicializa Grafica de EasyPie
 **********************************************************************************************/
$(function () {
    $('.chart').easyPieChart({
        barColor: '#78E97D',
        trackColor: '#DEE1DE',
        scaleColor: '#fff',
        scaleLength: 25,
        lineCap: 'round',
        lineWidth: 15,
        trackWidth: undefined,
        size: 200,
        rotate: 0, // in degrees
        animate: {
            duration: 1000,
            enabled: true
        },
        easing: function (x, t, b, c, d) { // easing function
            t = t / (d / 2);
            if (t < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        //onStep: function (from, to, percent) {
        //    $(this.el).find('.percent').text(Math.round(percent));
        //}
    });
});

/*************************************
 *  Grafica Doughnut Petición
 *************************************/

function GraficaDona(valAvance) {

    if (window.ChartDonutAvance instanceof Chart) {
        window.ChartDonutAvance.destroy();
    }

    var ctx = document.getElementById("avanceGlobalDonut").getContext("2d");

    ChartDonutAvance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Avance', 'Pendiente'],
            datasets: [{
                label: 'AVANCE EN ATENCIÓN DE SOLICITUDES',
                data: [valAvance, 100 - valAvance],
                backgroundColor: [
                    'rgba(13, 158, 52, 0.8)',
                    'rgba(144, 155, 171, 0.2)'
                ],
                borderColor: [
                    'rgba(13, 158, 52, 1)',
                    'rgba(144, 155, 171, 0.6)'
                ],
                borderWidth: 1
            }]
        },
        "options": {
            plugins: {
                datalabels: {
                    formatter: (value) => {
                        return value + '%';
                    }
                }
            },
            percentageInnerCutout: 50,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

/****************************
 *  Grafica Doughnut Gestión
 ****************************/

function GraficaDonaGestion(valAvance) {

    if (window.ChartDonutAvanceGestion instanceof Chart) {
        window.ChartDonutAvanceGestion.destroy();
    }

    var ctxGestion = document.getElementById("avanceGlobalDonutGestion").getContext("2d");

    ChartDonutAvanceGestion = new Chart(ctxGestion, {
        type: 'doughnut',
        data: {
            labels: ['Avance', 'Pendiente'],
            datasets: [{
                label: 'AVANCE EN ATENCIÓN DE SOLICITUDES',
                data: [valAvance, 100 - valAvance],
                backgroundColor: [
                    'rgba(13, 158, 52, 0.8)',
                    'rgba(144, 155, 171, 0.2)'
                ],
                borderColor: [
                    'rgba(13, 158, 52, 1)',
                    'rgba(144, 155, 171, 0.6)'
                ],
                borderWidth: 1
            }]
        },
        "options": {
            plugins: {
                datalabels: {
                    formatter: (value) => {
                        return value + '%';
                    }
                }
            },
            percentageInnerCutout: 50,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

/*********************************************
 *  Grafica Estatus Acumulado X Semana X Año
 *********************************************/

//function GraficaSolicitudesAcumuladas(anioSel) {
//    var ctx_lineas = document.getElementById("EstatusAcumulado").getContext("2d");

//    const data = [];
//    const data2 = [];
//    const data3 = [];

//    $.ajax({
//        type: "GET",
//        url: "/Apoyo/Peticiones/SolicitudesAvanceXseana",
//        data: { anioSel },
//        cache: false,
//        async: false,
//        success: (response) => {
//            $.each(response, (index, val) => {
//                data.push({ x: index + 1, y: val.concluido });
//                data2.push({ x: index + 1, y: val.proceso });
//                data3.push({ x: index + 1, y: val.total });
//            })
//        }
//    });

//    const totalDuration = 100;
//    const delayBetweenPoints = totalDuration / data.length;
//    const previousY = (ctx_lineas) => ctx_lineas.index === 0 ? ctx_lineas.chart.scales.y.getPixelForValue(100) : ctx_lineas.chart.getDatasetMeta(ctx_lineas.datasetIndex).data[ctx_lineas.index - 1].getProps(['y'], true).y;
//    const animation = {
//        x: {
//            type: 'number',
//            easing: 'linear',
//            duration: delayBetweenPoints,
//            from: NaN, // the point is initially skipped
//            delay(ctx_lineas) {
//                if (ctx_lineas.type !== 'data' || ctx_lineas.xStarted) {
//                    return 0;
//                }
//                ctx_lineas.xStarted = true;
//                return ctx_lineas.index * delayBetweenPoints;
//            }
//        },
//        y: {
//            type: 'number',
//            easing: 'linear',
//            duration: delayBetweenPoints,
//            from: previousY,
//            delay(ctx_lineas) {
//                if (ctx_lineas.type !== 'data' || ctx_lineas.yStarted) {
//                    return 0;
//                }
//                ctx_lineas.yStarted = true;
//                return ctx_lineas.index * delayBetweenPoints;
//            }
//        }
//    };






//    if (window.LineaAcumulada instanceof Chart) {
//        window.LineaAcumulada.destroy();
//    }


//    LineaAcumulada = new Chart(ctx_lineas, {
//        type: 'line',
//        data: {
//            datasets: [{
//                borderColor: [
//                    'rgba(13, 158, 52, 1)',
//                    'rgba(144, 155, 171, 0.6)'
//                ],
//                borderWidth: 1,
//                radius: 0,
//                data: data,
//            },
//            {
//                borderColor: [
//                    'rgba(13, 158, 52, 1)',
//                    'rgba(144, 155, 171, 0.6)'
//                ],
//                borderWidth: 1,
//                radius: 0,
//                data: data2,
//            },
//            {
//                borderColor: [
//                    'rgba(13, 158, 52, 1)',
//                    'rgba(144, 155, 171, 0.6)'
//                ],
//                borderWidth: 1,
//                radius: 0,
//                data: data3,
//            }]
//        },
//        options: {
//            responsive: false,
//            animation,
//            interaction: {
//                intersect: false
//            },
//            plugins: {
//                legend: false
//            },
//            scales: {
//                x: {
//                    type: 'linear'
//                },
//                xAxis: {
//                    ticks: {
//                        stepSize: 2,
//                        maxTicksLimit: 2
//                    }
//                }
//            }
//        }
//    });
//}


/*********************************************************************************************
 * Cuando Selecciona un UsuarioResponsable muestra la ACTIVIDAD de la Semana de esa persona
 *********************************************************************************************/
$('#UsrResponsablesSelect').click(function () {
    var idUsuarioSel = $('#UsrResponsablesSelect').val();                   // Obtiene la Legislatura Seleccionada

    console.log("Usuario Seleccionado: " + idUsuarioSel);

    var legislaturaId = $('#reporteLegSelect').val();

    NumeroSolicitudesXsemana(legislaturaId, 8, idUsuarioSel);
});

/*********************************************************************************************
 * Cuando Selecciona una LEGISLATURA muestra la ACTIVIDAD de la Semana de esa persona
 *********************************************************************************************/
$('#reporteLegSelect').click(function () {
    var idUsuarioSel = $('#UsrResponsablesSelect').val();                   // Obtiene la Legislatura Seleccionada

    console.log("Usuario Seleccionado: " + idUsuarioSel);

    var legislaturaId = $('#reporteLegSelect').val();

    NumeroSolicitudesXsemana(legislaturaId, 8, idUsuarioSel);
});


/****************************************************
 *  Para el Login
 ****************************************************/
$(document).ready(function () {
    $('#SubmitClaveContrasena').click(function () {
        console.log("CLick");
        var clave = $('#inputUsrId').val();
        var contrasena = $('#inputPswId').val();
        console.log("clave:" + clave + "  contraseña:" + contrasena);
        if (clave == "" || contrasena == "") {
            window.alert("Debe proporcionar los datos indicados");
        } else {
            window.location.href = "/Apoyo/Home/LoginUser?clave=" + clave + "&contrasena=" + contrasena;                       // &&& Publicaciòn
        }
    });
});

/***********************************************************
 *  Click Selecciona Categoria 
 ***********************************************************/
function CategoriaSeleccionada(categoriaId, subcategoriaId, editCategoriaId, editSubcategoriaId) {
    var tablaHTML = "";
    console.log("Categoría seleccionada: " + categoriaId);

    $("#divCategoriaNR").html("");
    $("#divCatSubCategoriaNR").html("");

    $("#idCS").val(categoriaId);
    

    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr>";
    tablaHTML += "<th style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='45%'>";
    tablaHTML += "Categoria";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='25%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='27%'>";
    tablaHTML += "Opciones";
    tablaHTML += "</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";
    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Categorias/ObtieneListaCat",
        data: { categoriaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                if (categoriaId == val.categoriaId) {
                    tablaHTML += "<tr style='background-color: #97BDF9; color:#000;'>";
                } else {
                    tablaHTML += "<tr>";
                }
                
                tablaHTML += "<td style='text-align:center; cursor: pointer;' onclick='CategoriaSeleccionada(" + val.categoriaId + ",0,0,0)'>" + indice + "</td>";

                if (categoriaId == val.categoriaId && editCategoriaId == 1) {
                    tablaHTML += "<td><input class='form-control' id='categoriaCambiosInput' value='" + val.descripcion + "'></td>";
                    tablaHTML += "<td><select id='categoriaCambiosSel' class='form-control'>'";
                    if (val.estatus == 1) {
                        tablaHTML += "<option value='0'>Deshabilitado</option>";
                        tablaHTML += "<option value='1' selected>Habilitado</option>";
                    } else {
                        tablaHTML += "<option value='0' selected>Deshabilitado</option>";
                        tablaHTML += "<option value='1'>Habilitado</option>";
                    }
                    tablaHTML += "</select>";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align:left; cursor: pointer;' onclick='CategoriaSeleccionada(" + val.categoriaId + ",0,0,0)'>" + val.descripcion + "</td>";
                    if (val.estatus == 0) {
                        tablaHTML += "<td style='color:red; cursor: pointer;' onclick='CategoriaSeleccionada(" + val.categoriaId + ",0,0,0)'>Deshabilitada</td>";
                    } else {
                        tablaHTML += "<td style='color:green; cursor: pointer;' onclick='CategoriaSeleccionada(" + val.categoriaId + ",0,0,0)'>Habilitada</td>";
                    }
                }
                
               
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px;'>";

                if (editCategoriaId == 0) {
                    tablaHTML += "<a onclick='CategoriaSeleccionada(" + val.categoriaId + ",0,1,0)'><span style='cursor: pointer' class='fas fa-edit' title='Editar Categoría'></span>&nbsp;</a>";
                    tablaHTML += "<a onclick='eliminaCategoria(" + val.categoriaId + ")'><span style='cursor: pointer' class='fas fa-trash-alt' title='Eliminar Categoría'></span></a>";

                } else {
                    if (categoriaId != val.categoriaId) {
                        tablaHTML += "<a onclick='CategoriaSeleccionada(" + val.categoriaId + ",0,1,0)'><span style='cursor: pointer' class='fas fa-edit' title='Editar Categoría'></span>&nbsp;</a>";
                        tablaHTML += "<a onclick='eliminaCategoria(" + val.categoriaId + ")'><span style='cursor: pointer' class='fas fa-trash-alt' title='Eliminar Categoría'></span></a>";

                    } else {
                        tablaHTML += "<a onclick='actualizaCategoria(" + val.categoriaId + ")'><span style='cursor: pointer' class='fas fa-save' title='Editar SubCategoría'></span>&nbsp;</a>";
                    }

                }
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";

    /*console.log(tablaHTML);*/
    
    if (indice > 0) {
        $("#divCategoriaNR").html(tablaHTML);
    }

    tablaHTML = "<table class='table table-bordered responsive-table' style='width:100%;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr>";
    tablaHTML += "<th style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='50%'>";
    tablaHTML += "SubCategoria";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='20%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</th>";
    tablaHTML += "<th style='text-align:center;' width='27%'>";
    tablaHTML += "Opciones";
    tablaHTML += "</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";
    tablaHTML += "<tbody>";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Subcategorias/ObtieneListaSubCat",
        data: { categoriaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr>";

                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                //tablaHTML += "<td>" + val.descripcion + "</td>";
                //if (val.estatus == 0) {
                //    tablaHTML += "<td style='color:red;'>Deshabilitada</td>";
                //} else {
                //    tablaHTML += "<td style='color:green;'>Habilitada</td>";
                //}



                if (subcategoriaId == val.subcategoriasId && editSubcategoriaId == 1) {
                    tablaHTML += "<td><input class='form-control' id='subCategoriaCambiosInput' value='" + val.descripcion + "'></td>";
                    tablaHTML += "<td><select id='subCategoriaCambiosSel' class='form-control'>'";
                    if (val.estatus == 1) {
                        tablaHTML += "<option value='0'>Deshabilitado</option>";
                        tablaHTML += "<option value='1' selected>Habilitado</option>";
                    } else {
                        tablaHTML += "<option value='0' selected>Deshabilitado</option>";
                        tablaHTML += "<option value='1'>Habilitado</option>";
                    }
                    tablaHTML += "</select>";
                    tablaHTML += "</td>";
                } else {
                    tablaHTML += "<td style='text-align:left; cursor: pointer;'>" + val.descripcion + "</td>";
                    if (val.estatus == 0) {
                        tablaHTML += "<td style='color:red; cursor: pointer;'>Deshabilitada</td>";
                    } else {
                        tablaHTML += "<td style='color:green; cursor: pointer;'>Habilitada</td>";
                    }
                }



                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px;'>";
                //if (editSubcategoriaId == 0) {
                //    tablaHTML += "<a href='/Apoyo/Subcategorias/Edit/" + val.subcategoriasId + "'><span style='cursor: pointer' class='fas fa-edit' title='Editar SubCategoría'></span>&nbsp;</a>";
                //    tablaHTML += "<a href='/Apoyo/Subcategorias/Delete/" + val.subcategoriasId + "'><span style='cursor: pointer' class='fas fa-trash-alt' title='Eliminar SubCategoría'></span></a>";

                //} else {
                //    if (subcategoriaId != val.subcategoriasId) {
                //        tablaHTML += "<a href='/Apoyo/Subcategorias/Edit/" + val.subcategoriasId + "'><span style='cursor: pointer' class='fas fa-edit' title='Editar SubCategoría'></span>&nbsp;</a>";
                //        tablaHTML += "<a href='/Apoyo/Subcategorias/Delete/" + val.subcategoriasId + "'><span style='cursor: pointer' class='fas fa-trash-alt' title='Eliminar SubCategoría'></span></a>";

                //    } else {
                //        tablaHTML += "<a href='/Apoyo/Subcategorias/Edit/" + val.subcategoriasId + "'><span style='cursor: pointer' class='fas fa-save' title='Editar SubCategoría'></span>&nbsp;</a>";
                //    }
                    
                //}


                if (editSubcategoriaId == 0) {
                    tablaHTML += "<a onclick='CategoriaSeleccionada(" + val.categoriaId + "," + val.subcategoriasId + ",0,1)'><span style='cursor: pointer' class='fas fa-edit' title='Editar SubCategoría'></span>&nbsp;</a>";
                    tablaHTML += "<a onclick='eliminaSubCategoria(" + val.subcategoriasId + "," + val.categoriaId + ")'><span style='cursor: pointer' class='fas fa-trash-alt' title='Eliminar SubCategoría'></span></a>";

                } else {
                    if (subcategoriaId != val.subcategoriasId) {
                        tablaHTML += "<a onclick='CategoriaSeleccionada(" + val.categoriaId + "," + val.subcategoriasId + ",0,1)'><span style='cursor: pointer' class='fas fa-edit' title='Editar SubCategoría'></span>&nbsp;</a>";
                        tablaHTML += "<a onclick='eliminaSubCategoria(" + val.subcategoriasId + "," + val.categoriaId + ")'><span style='cursor: pointer' class='fas fa-trash-alt' title='Eliminar SubCategoría'></span></a>";

                    } else {
                        tablaHTML += "<a onclick='actualizaSubCategoria(" + val.subcategoriasId + "," + val.categoriaId + ")'><span style='cursor: pointer' class='fas fa-save' title='Editar SubCategoría'></span>&nbsp;</a>";
                    }

                }

                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    
    if (indice > 0) {
        $("#divCatSubCategoriaNR").html(tablaHTML);
    }
}


/***********************************************************
 *  Click Actualiza Categoria 
 ***********************************************************/
function actualizaCategoria(categoriaId) {
    var descCategoria = $("#categoriaCambiosInput").val();
    var estatus = $("#categoriaCambiosSel").val();

    $.ajax({
        type: "PUT",
        url: "/Apoyo/Categorias/ActualizaCategoria",
        cache: false,
        async: false,
        data: { categoriaId, descCategoria, estatus },
        success: (response) => {
            //console.log("VALOR R E S P O N S E - - -->" + response);
        }
    });

    CategoriaSeleccionada(categoriaId,0,0,0);
}

/***********************************************************
 *  Click Elimina Categoria 
 ***********************************************************/
function eliminaCategoria(categoriaId) {

    $.ajax({
        type: "DELETE",
        url: "/Apoyo/Categorias/EliminaCategoria",
        cache: false,
        async: false,
        data: { categoriaId },
        success: (response) => {
            if (response == 2) {
                $("#msjNoSeElimino").show();
                setTimeout(function () {
                    $('#msjNoSeElimino').fadeOut('fast');
                }, 3500); // <-- milliseconds
            }
        }
    });

    CategoriaSeleccionada(categoriaId, 0, 0, 0);
}


/***********************************************************
 *  Click Actualiza SubCategoria 
 ***********************************************************/
function actualizaSubCategoria(subCategoriaId, categoriaId) {
    var descSubCategoria = $("#subCategoriaCambiosInput").val();
    var estatus = $("#subCategoriaCambiosSel").val();

    $.ajax({
        type: "PUT",
        url: "/Apoyo/Subcategorias/ActualizaSubCategoria",
        cache: false,
        async: false,
        data: { subCategoriaId, descSubCategoria, estatus },
        success: (response) => {
            //console.log("VALOR R E S P O N S E - - -->" + response);
        }
    });

    CategoriaSeleccionada(categoriaId, 0, 0, 0);
}

/***********************************************************
 *  Click Elimina SubCategoria 
 ***********************************************************/
function eliminaSubCategoria(subCategoriaId, categoriaId) {

    $.ajax({
        type: "DELETE",
        url: "/Apoyo/Subcategorias/EliminaSubCategoria",
        cache: false,
        async: false,
        data: { subCategoriaId },
        success: (response) => {
            //console.log("VALOR R E S P O N S E - - -->" + response);
        }
    });

    CategoriaSeleccionada(categoriaId, 0, 0, 0);
}


