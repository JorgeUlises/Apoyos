
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
        url: "/Apoyo/Ciudadanoes/InsertaNuevoCiudadano",
        cache: false,
        async: false,
        data: {
            paterno, materno, nombre, fechaNacimiento, genero, coloniaId, calleId, numExterior, numInterior, cp, email, telefono, partido, miembro, seccion, latitud, longitud, notas
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
        window.location.replace("/Apoyo/Ciudadanoes/");
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-");
}