

/*****************************************************************************************
 *  Autocomplete Buscar Colonias
 *****************************************************************************************/
$(document).ready(function () {

    $('#coloniasBuscar').autocomplete({
        source: function (request, response) {
            document.getElementById("callesBuscar").value = "";
            document.getElementById("hCalleBuscar").value = "";
            if ($('#coloniasBuscar').val().length < 3) {
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
    $("#hCiudadanoSolicitanteBuscar").val(0);
    $('#NombreCiudadanoSolicitante').autocomplete({
        source: function (request, response) {
            document.getElementById("hCiudadanoSolicitanteBuscar").value = "";
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
 *  Identifica la opción seleccionada en Origen de Solicitud de Apoyo
 *****************************************************************************************/
function optSelecEnOrigen() {
    console.log("opcion seleccionada:" + $('#OrigenPeticion').val());
    $("#tablaAsociacion").hide();
    $("#NombreCiudadanoSolicitante").val("");
    $("#NombreCiudadanoSolicitante").val("");

    $('#Asociacion').selectedIndex = "0";
    $('#Asociacion').val("");

    //    $("#tablaCiudadano").hide();


    if ($('#OrigenPeticion').val() == 3) {
        $("#tablaAsociacion").show();
    }

    //if ($('#OrigenPeticion').val() == 2) {
    //    $("#tablaCiudadano").show();
    //}

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
            var latlong = position.coords.latitude + "," + position.coords.longitude;

            // Set Google map source url
            var mapLink = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlong + "&zoom=16&size=400x300&output=embed";

            // Create and insert Google map
            document.getElementById("dvMap").innerHTML = "<img alt='Map Holder' src='" + mapLink + "'>";
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
 * RESUMEN
 **********************************************************************************************/
function Resumen() {
    var LegislaturaID = 2;
    var totalpeticiones = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroPeticiones",
        data: { LegislaturaID },
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
        url: "/Apoyo/Peticiones/numeroEventos",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumEventos').html("<h3>" + response + "</h3>");
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroVisitas",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumVisitas').html("<h3>" + response + "</h3>");
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroCiudadanos",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumCiudadanos').html("<h3>" + response + "</h3>");
        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroAsociaciones",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumAsociaciones').html("<h3>" + response + "</h3>");
        }
    });


    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroPeticionesHitos",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            $('#resumenNumHitos').html("<h3>" + response + "</h3>");
        }
    });

    var tablaHTML = "";
    var totalSol = 0;
    var nombreEs = "";

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Solicitudes X Estatus</h3>";
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
        data: { LegislaturaID },
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
                promedio = Math.round(val.cantidad * 100 / totalpeticiones);

                //                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + promedio + " %</td>";


                tablaHTML += "<td class='centrarVH' style='background-color: white; font-size:small;'>";
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
                tablaHTML += "</div>" + promedio + "%</td>";

                tablaHTML += "</tr>";
                totalSol += val.cantidad;

                if (val.estatus == 'ATENDIDO' || val.estatus == 'CANCELADO' || val.estatus == 'NO PROCEDE' || val.estatus == 'REASIGNADO') {
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

    
        promedio = Math.round(solAtendidas * 100 / totalSol);
    
        tablaHTML = "<hr/>";
        tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
        tablaHTML += "<h3>Avance Global</h3>";
        tablaHTML += "</div>";
        //tablaHTML += "<div style='text-align:center; vertical-align:central;'>";
        tablaHTML += "<span class='chart' data-percent='" + promedio + "'>";
        tablaHTML += "<span class='percent'>" + promedio + "%</span>";
        tablaHTML += "</span>";
        //tablaHTML += "</div>";
        
        $("#CardEstatusAvanceGlobal").html(tablaHTML);
    

    //google.charts.load("current", { packages: ["corechart"] });
    //google.charts.setOnLoadCallback(drawChart);

    //function drawChart() {
    //    var data = google.visualization.arrayToDataTable([
    //        ['Task', ''],
    //        ['Avance', solAtendidas],
    //        ['Pendiente', totalSol - solAtendidas],
    //    ]);

    //    var options = {
    //        title: '',
    //        pieHole: 0.6,
    //    };

    //    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    //    chart.draw(data, options);
    //}


    // Peticiones X Clasificación X Estatus
    var totalSinClasifi = 0;
    var totalSolicitado = 0;
    var totalAtendido = 0;
    var totalCancelado = 0;
    var totalEnProceso = 0;
    var totalNoProcede = 0;
    var totalReasignado = 0;
    var totalTotal = 0;

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Solicitudes X Clasificación X Estatus</h3>";
    tablaHTML += "</div>";
    tablaHTML += "<hr/>";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Clasificacion</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Sin Estatus</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Solicitado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Atendido</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Cancelado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>En Proceso</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>No Procede</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Reasignado</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Total</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Avance</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/resumenXclasificacion",
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                //nombreEs = val.estatus == "_" ? "" : val.estatus;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.clasificacion + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.sinClasificacion + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.solicitado + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.atendido + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.cancelado + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.enProceso + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.noProcede + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.reasignado + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.total + "</td>";

                promedio = Math.round((val.atendido + val.cancelado + val.noProcede + val.reasignado) * 100 / val.total);
                tablaHTML += "<td class='centrarVH' style='font-size:small;'>";
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
                tablaHTML += "</div>" + promedio + "%</td>";

                tablaHTML += "</tr>";
                totalSinClasifi += val.sinClasificacion;
                totalSolicitado += val.solicitado;
                totalAtendido += val.atendido;
                totalCancelado += val.cancelado;
                totalEnProceso += val.enProceso;
                totalNoProcede += val.noProcede;
                totalReasignado += val.reasignado;
                totalTotal += val.total;
            })
        }
    });
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>TOTAL</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSinClasifi + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSolicitado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalAtendido + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalCancelado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalEnProceso + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalNoProcede + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalReasignado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalTotal + "</strong></td>";

    promedio = Math.round((totalAtendido + totalCancelado + totalNoProcede + totalReasignado) * 100 / totalTotal);
    tablaHTML += "<td class='centrarVH'>";
    tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
    tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
    tablaHTML += "</div>" + promedio + "%</td>";

    tablaHTML += "</tr>";

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";
    $("#CardClasificacion").html(tablaHTML);

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
        data: { LegislaturaID },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                //nombreEs = val.estatus == "_" ? "" : val.estatus;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.tipo + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.sinEstatus + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.planeado + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.realizado + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.pospuesto + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.cancelado + "</td>";
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