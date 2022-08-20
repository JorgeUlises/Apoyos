$('#FileUploadFormFileGestion').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);

    }
    $(this).next('.custom-file-label').html(files.join(', '));
    //var TmpPath = URL.createObjectURL(e.target.files[0]);
})

$('#FileUploadFormFileGestionBitacora').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));
})


/*********************************************************************************************************
 * Guarda Nueva Gestión
 *********************************************************************************************************/
function GuardarNuevaGestion() {
    var DatosGuardados = false;
    var legislaturaId = $("#LegGestionNuevo").val();
    var origenSolicitud = $("#OrigenGestion").val();
    var folio = $("#FolioGestion").val();
    var fechaSolicitud = $("#FechaSolicitudG").val();
    var fechaCompromiso = $("#FechaCompromisoG").val();
    var fechaConclusion = $("#FechaConclusionG").val();
    var estatus = $("#estatusGestion").val();
    var solicitanteId = $("#hCiudadanoSolicitanteBuscar").val();
    var asociacionId = $("#AsociacionIdG").val();
    var dependenciaId = $("#DependenciaIdG").val();

    var descripcionSolicitud = $("#DescripcionGestion").val().trim().replace(/\n/g, '&#13');
    var hito = 0;
    var costo = $("#CostoGestionId").val();
    var responsableId = $("#responsableGestion").val();

    if ($("#cboxHitoG").is(":checked")) {
        hito = 1;
    }

    if (costo == null || costo == "") {
        costo = "0";
    }

    if (asociacionId == null || asociacionId == "") {
        asociacionId = 0;
    }


    console.log("legislaturaId: " + legislaturaId);
    console.log("folio: " + folio);
    console.log("origenSolicitud: " + origenSolicitud);
    console.log("fechaSolicitud: " + fechaSolicitud);
    console.log("fechaCompromiso: " + fechaCompromiso);
    console.log("fechaConclusion: " + fechaConclusion);
    console.log("estatus: " + estatus);
    console.log("solicitanteId: " + solicitanteId);
    console.log("asociacionId: " + asociacionId);
    console.log("descripcionSolicitud: " + descripcionSolicitud);
    console.log("hito: " + hito);
    console.log("costo: " + costo);
    console.log("responsableId: " + responsableId);
    console.log("dependenciaId: " + dependenciaId);

    var datosCompletos = false;

    if (origenSolicitud <= 1) {
        $("#msgAlerta_OrigenGestion").show();
        setTimeout(function () {
            $('#msgAlerta_OrigenGestion').fadeOut('fast');
        }, 3000);
        return;
    }

    if (folio.length <= 0) {
        $("#msgAlerta_FolioGestion").show();
        setTimeout(function () {
            $('#msgAlerta_FolioGestion').fadeOut('fast');
        }, 3000);
        return;
    }

    if (fechaSolicitud.length <= 0) {
        $("#msgAlerta_FechaGestion").show();
        setTimeout(function () {
            $('#msgAlerta_FechaGestion').fadeOut('fast');
        }, 3000);
        return;
    }

    if (solicitanteId <= 0) {
        $("#msgAlerta_SolicitanteGestion").show();
        setTimeout(function () {
            $('#msgAlerta_SolicitanteGestion').fadeOut('fast');
        }, 3000);
        return;
    }

    if (descripcionSolicitud.length <= 0) {
        $("#msgAlerta_DescripcionGestion").show();
        setTimeout(function () {
            $('#msgAlerta_DescripcionGestion').fadeOut('fast');
        }, 3000);
        return;
    }


    if (origenSolicitud == 3 && asociacionId <= 1) {
        $("#msgAlerta_AsociacionGestion").show();
        setTimeout(function () {
            $('#msgAlerta_AsociacionGestion').fadeOut('fast');
        }, 3000);
        return;
    }

    $("#OrigenGestion").val(1);
    $("#hCiudadanoSolicitanteBuscar").val(0);
    $("#NombreCiudadanoSolicitante").val("");
    $("#AsociacionId").val(0);

    datosCompletos = true;


    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/NuevaGestion",
        cache: false,
        async: false,
        data: {
            origenSolicitud, folio, fechaSolicitud, fechaCompromiso, fechaConclusion, estatus, solicitanteId, asociacionId, descripcionSolicitud, hito, costo, responsableId, dependenciaId, legislaturaId
        },
        success: (response) => {
            console.log(">>>> DESPUES D GUARDAR REGRESA : >" + response + "<");

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
                    $("#hGestionId").val(response);
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
        $("#divArchivoAnexosApoyo").show();
        var idGestion = $("#hGestionId").val();
        GeneraTablaCatSubCatNSolicitudGestion(idGestion);
        GeneraTablaArchivosAnexosNSolicitudGestion(idGestion);
        GeneraTablaBeneficiariosNSolicitudGestion(idGestion);
        GeneraTablaBitacoraNSolicitudGestion(idGestion);
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-" + $("#hGestionId").val());
}

/*********************************************************************************************************
 * Edita GESTIÓN
 *********************************************************************************************************/
function MuestraComplementoGestion(idGestion) {
    GeneraTablaCatSubCatNSolicitudGestion(idGestion);
    GeneraTablaArchivosAnexosNSolicitudGestion(idGestion);
    GeneraTablaBeneficiariosNSolicitudGestion(idGestion);
    GeneraTablaBitacoraNSolicitudGestion(idGestion);
}

/***************************************************************************************************************
 * Muestra Encabezado y primer renglón de Categoria-Subcategoria para registro de Nueva Solicitud de GESTIÓN
 ***************************************************************************************************************/
function GeneraTablaCatSubCatNSolicitudGestion(idGestion) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='49%'>";
    tablaHTML += "Categoria";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='46%'>";
    tablaHTML += "Subcategoria";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneListaCatSubCat_G",
        data: { idGestion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr id='CatSubRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td>" + val.descripcionCat + "</td>";
                tablaHTML += "<td>" + val.descripcionSubcat + "</td>";
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Categoría y Subcategoria' onclick='EliminaRowGestionCatSubcat(" + idGestion + "," + val.gestionCategoriaID + "," + val.gestionSubcategoriaID + "," + val.categoriaID + "," + val.subcategoriasID + ");'></span></td>";
                tablaHTML += "</tr>";
            });
        }
    });

    if (indice > 0) {
        $("#opc_1").css({ 'border-left-color': '#20B016' });
    }


    indice++;

    tablaHTML += "<tr id='CatSubRenglon_" + indice + "'>";
    tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
    tablaHTML += "<td><input type='text' id='Cat_Nuevo' style='width:100%; max-width:100%;' /></td>";
    tablaHTML += "<td><input type='text' id='SubCat_Nuevo' style='width:100%; max-width:100%;' /></td>";
    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guarda Nueva Categoría y Subcategoría' onclick='GuardaNuevaCategoriaSubcategoriaGestion(" + idGestion + ");'></span></td>";
    tablaHTML += "</tr>";


    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divCatSubCatNGestion").html(tablaHTML);
    $("#Cat_Nuevo").autocomplete(autocompleteCategorias);
    $("#SubCat_Nuevo").autocomplete(autocompleteSubCategorias);

}


/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Archivos Anexos para registro de Nueva Solicitud de Apoyo
 ***********************************************************************************************************/
function GeneraTablaArchivosAnexosNSolicitudGestion(idGestion) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='94%'>";
    tablaHTML += "Nombre de Archivo";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    //tablaHTML += "<span style='font-size:18px; cursor:pointer' title='Agrega Espacio para nuevo registro de Archivo Anexo' onclick='AgregaRowCatSubC(" + indice + ");'>+</span>";
    tablaHTML += "<span class='fas fa-file-upload' style='font-size:18px; cursor:pointer' title='Subir Archivo Anexo' onclick='MostrarModalSubirArchivoGestion(" + idGestion + ");'></span>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneListaArchivos_G",
        data: { idGestion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                console.log("ARCHIVO: " + val.url);
                tablaHTML += "<tr id='ArchivoRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td><a href='" + val.url + "' target='_blank' title='Archivo'>" + val.nombreArchivo + "</a></td>";
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowArchivoGestion(" + val.archivosGestionesID + "," + idGestion + ");'></span></td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
        }
    });

    if (indice > 0) {
        $("#opc_2").css({ 'border-left-color': '#20B016' });
    }

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divArchivosAnexosNGestion").html(tablaHTML);

}



/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Beneficiarios para registro de Nueva Solicitud de Apoyo
 ***********************************************************************************************************/
function GeneraTablaBeneficiariosNSolicitudGestion(idGestion) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
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
        url: "/Apoyo/Gestiones/ObtieneListaBeneficiariosGestionId",
        data: { idGestion },
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
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowBeneficiarioGestion(" + val.gestionID + "," + val.ciudadanoID + "," + val.beneficiariosID + ");'></span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Actualiza el apoyo recibido' onclick='GuardaCambiosApoyoBeneficiarioGestion(" + val.gestionID + "," + val.ciudadanoID + "," + val.beneficiariosID + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
        }
    });

    if (indice > 0) {
        $("#opc_3").css({ 'border-left-color': '#20B016' });
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


/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Bitácora para registro de Nueva Solicitud de GESTIÓN
 ***********************************************************************************************************/
function GeneraTablaBitacoraNSolicitudGestion(idGestion) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:left; background-color:white; color:black; padding:1px;' width='35%'>";
    tablaHTML += "Actividad";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='15%'>";
    tablaHTML += "Fecha Registro";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='15%'>";
    tablaHTML += "Fecha Conclusion";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Archivos";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</td>";

    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";
    var selAux = "";
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneBitacoraGestionId",
        data: { idGestion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                selAux = "";
                tablaHTML += "<tr id='BitacoraRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";

                //tablaHTML += "<td style='text-align:center;'>" + val.bitacoraBase.descripcion + "</td>";

                tablaHTML += "<td><input type='text' id='BitacoraActividad_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + val.bitacoraBase.descripcion + "'/></td>";

                tablaHTML += "<td><input type='text' name = 'FR_Bitacora' id='FR_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + moment(val.bitacoraBase.fechaRegistro).format('DD/MM/yyyy') + "'/></td>";
                //tablaHTML += "<td><input type='text' name = 'FC_Bitacora' id='FC_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + moment(val.bitacoraBase.fechaCompromiso).format('DD/MM/yyyy') + "'/></td>";
                tablaHTML += "<td><input type='text' name = 'FF_Bitacora' id='FF_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + moment(val.bitacoraBase.fechaConclusion).format('DD/MM/yyyy') + "'/></td>";


                tablaHTML += "<td>";
                if (val.archivosRelacionadosBitacora.length != 0) {
                    tablaHTML += "<table style='width: 100%; border:none; margin:0; padding:0; border-collapse: collapse;' cellpadding='0' cellspacing='0'>";
                    var indiceArch = 0;
                    for (const elemento in val.archivosRelacionadosBitacora) {
                        indiceArch++;
                        console.log("URL--> " + val.archivosRelacionadosBitacora[elemento].url);
                        tablaHTML += "<tr>";
                        tablaHTML += "<td width='5%'>" + indiceArch + "</td>";
                        tablaHTML += "<td width='65%'><a href='" + val.archivosRelacionadosBitacora[elemento].url + "' target='_blank' title='" + val.archivosRelacionadosBitacora[elemento].nombreArchivo + "'>" + val.archivosRelacionadosBitacora[elemento].nombreArchivo.substring(0, 20) + "</a></td>";
                        tablaHTML += "<td width='30%'>";
                        tablaHTML += "<span class='fas fa-trash-alt' style='font-size:16px; cursor:pointer;' title='Elimina Archivo' onclick='EliminaArchivoBitacoraGestion(" + val.archivosRelacionadosBitacora[elemento].archivosBitacoraId + "," + val.archivosRelacionadosBitacora[elemento].bitacoraId + "," + idGestion + ");'>&nbsp;</span>";
                        tablaHTML += "<span class='fas fa-file-upload' style='font-size:16px; cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoGestionBitacora(" + val.archivosRelacionadosBitacora[elemento].bitacoraId + "," + idGestion + ");'></span>";
                        tablaHTML += "</td>";
                        tablaHTML += "</tr>";
                    }
                    tablaHTML += "</table>";
                } else {
                    tablaHTML += "<table style='width: 100%; border:none; margin:0; padding:0; border-collapse: collapse;' cellpadding='0' cellspacing='0'>";
                    tablaHTML += "<tr>";
                    tablaHTML += "<td width='70%'></td>";
                    tablaHTML += "<td width='30%'>";
                    tablaHTML += "<span class='fas fa-file-upload' style='font-size:16px; cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoGestionBitacora(" + val.bitacoraBase.bitacoraId + "," + idGestion + ");'></span>";
                    tablaHTML += "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }
                tablaHTML += "</td>";


                tablaHTML += "<td>";
                tablaHTML += "<select width='100%' id='SelEstatus_" + val.bitacoraBase.bitacoraId + "'>";
                tablaHTML += "<option value='0'></option>";
                switch (val.bitacoraBase.estatus) {
                    case 0:
                        tablaHTML += "<option value='1'>FINALIZADA</option>";
                        tablaHTML += "<option value='2'>PROCESO</option>";
                        tablaHTML += "<option value='3'>CANCELADA</option>";
                        break;
                    case 1:
                        tablaHTML += "<option value='1' selected>FINALIZADA</option>";
                        tablaHTML += "<option value='2'>PROCESO</option>";
                        tablaHTML += "<option value='3'>CANCELADA</option>";
                        break;
                    case 2:
                        tablaHTML += "<option value='1'>FINALIZADA</option>";
                        tablaHTML += "<option value='2' selected>PROCESO</option>";
                        tablaHTML += "<option value='3'>CANCELADA</option>";
                        break;
                    case 3:
                        tablaHTML += "<option value='1'>FINALIZADA</option>";
                        tablaHTML += "<option value='2'>PROCESO</option>";
                        tablaHTML += "<option value='3' selected>CANCELADA</option>";
                        break;
                }
                tablaHTML += "</select>";
                tablaHTML += "</td>";

                //tablaHTML += "<td><input type='text' id='Responsable_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + val.bitacoraBase.responsable + "'/></td>";

                tablaHTML += "<td>";
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:16px; cursor:pointer; display:inline;' title='Elimina Actividad' onclick='EliminaRowBitacoraGestion(" + val.bitacoraBase.bitacoraId + "," + idGestion + ");'>&nbsp;</span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:16px; cursor:pointer; display:inline;' title='Actualiza el apoyo recibido' onclick='ActualizaBitacoraGestion(" + val.bitacoraBase.bitacoraId + "," + idGestion + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
        }
    });

    if (indice > 0) {
        $("#opc_4").css({ 'border-left-color': '#20B016' });
    }

    indice++;

    tablaHTML += "<tr id='BitacoraRenglon_" + indice + "'>";
    tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
    tablaHTML += "<td><input type='text' id='BitacoraActividad' style='width:100%; max-width:100%;' value=''/></td>";

    tablaHTML += "<td>";
    tablaHTML += "<div id='dpBitacoraFR'>";
    tablaHTML += "<input name='FR_Bitacora' id='FR_BitacoraNva' class='form-control'/>";
    tablaHTML += "</div>";
    tablaHTML += "</td>";

    //tablaHTML += "<td>";
    //tablaHTML += "<div class='input-group date' id='dpBitacoraFC'>";
    //tablaHTML += "<input asp-for='FC_Bitacora' name='FC_Bitacora' id='FC_BitacoraNva' class='form-control'/>";
    //tablaHTML += "</div>";
    //tablaHTML += "</td>";

    tablaHTML += "<td>";
    tablaHTML += "<div class='input-group date' id='dpBitacoraFF'>";
    tablaHTML += "<input asp-for='FF_Bitacora' name='FF_Bitacora' id='FF_BitacoraNva' class='form-control'/>";
    tablaHTML += "</div>";
    tablaHTML += "</td>";

    tablaHTML += "<td>";
    //tablaHTML += "<input type='text' style='width:90%; max-width:90%; display:inline;' value=''/>";
    //tablaHTML += "<span class='fas fa-trash-alt' style='font-size:16px; cursor:pointer; display:inline; width:10%' title='Anexar Archivo' onclick='AnexarArchivoBitacora(" + idGestion + ");'></span>";


    //tablaHTML += "<table style='width: 100%; border:none;'>";
    //tablaHTML += "<tr>";
    //tablaHTML += "<td style='width: 100%;'><input type='text' value='' disabled /></td>";
    //tablaHTML += "<td><span class='fas fa-file-upload' style='font-size:16px; cursor:pointer;' title='Anexar Archivo' onclick='AnexarArchivoBitacora(" + idGestion + ");'></span></td>";
    //tablaHTML += "</tr>";
    //tablaHTML += "</table>";

    //tablaHTML += "<div class='input-group mb-3'>";
    //tablaHTML += "<input type='text' value='' disabled />";
    //tablaHTML += "<div class='input-group-append'>";
    //tablaHTML += "&nbsp;<span class='fas fa-file-upload' style='font-size:16px; cursor:pointer;' title='Anexar Archivo' onclick='AnexarArchivoBitacora(" + idGestion + ");'></span>";
    //tablaHTML += "</div>";
    //tablaHTML += "</div>";

    tablaHTML += "</td>";


    tablaHTML += "<td>";
    tablaHTML += "<select name='a' id='EstatusBitacora'>";
    tablaHTML += "<option value='0'></option>";
    tablaHTML += "<option value='1'>FINALIZADA</option>";
    tablaHTML += "<option value='2'>PROCESO</option>";
    tablaHTML += "<option value='3'>CANCELADA</option>";
    tablaHTML += "</select>";
    tablaHTML += "</td>";

    //tablaHTML += "<td><input type='text' id='BitacoraResponsable' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td><span class='fas fa-save' style='font-size:16px; cursor:pointer' title='Guardar Actividad' onclick='GuardaNvaActividadBitacoraGestion(" + idGestion + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divBitacoraNGestion").html(tablaHTML);

    //$('#FR_Bitacora').datepicker({
    $('input[name="FR_Bitacora"]').datepicker({
        dateFormat: 'dd/mm/yy',
        locale: 'es'
    });

    //$('#FC_Bitacora').datepicker({
    $('input[name="FC_Bitacora"]').datepicker({
        dateFormat: 'dd/mm/yy'
    });

    //$('#FF_Bitacora').datepicker({
    $('input[name="FF_Bitacora"]').datepicker({
        dateFormat: 'dd/mm/yy'
    });
}


/************************************************************************************************************************
 *  Guarda datos de Categoría y Subcategoría, en el StoreProcedure valida que este registrada Categoría y Subcategoría
 ************************************************************************************************************************/
function GuardaNuevaCategoriaSubcategoriaGestion(idGestion) {
    var categoriaId = $("#hCategoriaBuscar").val();
    var subCategoriaId = $("#hSubCategoriaBuscar").val();
    var DatosGuardadosCSC = false;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/GuardaCategoriaSubCategoriaBD_G",
        data: { idGestion, categoriaId, subCategoriaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val > 0) {
                    console.log("LOS DATOS DE CATAGORÍA Y SUBCATEGORÍA FUERON GUARDADOS");
                    $("#msg_OKCatSubCat").show();
                    setTimeout(function () {
                        $('#msg_OKCatSubCat').fadeOut('fast');
                    }, 2000);
                    DatosGuardadosCSC = true;
                } else {
                    console.log("error - al guardar DATOS DE CATAGORÍA Y SUBCATEGORÍA");
                    $("#msg_ErrorCatSubCat").show();
                    setTimeout(function () {
                        $('#msg_ErrorCatSubCat').fadeOut('fast');
                    }, 2000);
                    DatosGuardadosCSC = false;
                }
            })
        },
        error: function (response) {
            $("#msg_ErrorCatSubCat").show();
            setTimeout(function () {
                $('#msg_ErrorCatSubCat').fadeOut('fast');
            }, 2000);
            DatosGuardadosCSC = false;
        }
    });

    //if (DatosGuardadosCSC) {
    GeneraTablaCatSubCatNSolicitudGestion(idGestion);
    //}
}

/************************************************************************************************************************
 *  Guarda Nuevo Beneficiario y Apoyo Brindado GESTIÓN
 ************************************************************************************************************************/
function GuardaNuevoBeneficiario_G(idGestion) {
    var beneficiarioId = $("#hBeneficiarioBuscar").val();
    var descripcionApoyo = $("#BeneApoyo_Nuevo").val();
    var DatosGuardadosBeneficiario = false;

    console.log("PARAMETROS : " + " idGestion = " + idGestion + " beneficiarioId = " + beneficiarioId + " descripcionApoyo = " + descripcionApoyo);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/GuardaNuevoBeneficiario_G",
        data: { idGestion, beneficiarioId, descripcionApoyo },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val > 0) {
                    console.log("LOS DATOS DE BENEFICIARIO FUERON GUARDADOS");
                    //    $("#msg_OKCatSubCat").show();
                    //    setTimeout(function () {
                    //        $('#msg_OKCatSubCat').fadeOut('fast');
                    //    }, 2000);
                    //    DatosGuardadosCSC = true;
                    //} else {
                    //    console.log("error - al guardar DATOS DE CATAGORÍA Y SUBCATEGORÍA");
                    //    $("#msg_ErrorCatSubCat").show();
                    //    setTimeout(function () {
                    //        $('#msg_ErrorCatSubCat').fadeOut('fast');
                    //    }, 2000);
                    //    DatosGuardadosCSC = false;
                }
            })
        },
        error: function (response) {
            //$("#msg_ErrorCatSubCat").show();
            //setTimeout(function () {
            //    $('#msg_ErrorCatSubCat').fadeOut('fast');
            //}, 2000);
            DatosGuardadosBeneficiario = false;
        }
    });

    //if (DatosGuardadosCSC) {
    GeneraTablaBeneficiariosNSolicitudGestion(idGestion);

    //}
}

/************************************************************************************************************************
 *  Actualiza Apoyo a un Beneficiario
 ************************************************************************************************************************/
function GuardaCambiosApoyoBeneficiarioGestion(idGestion, beneficiarioId, idRow) {

    var descripcionApoyo = $("#DescripcionApoyo_" + idRow).val();
    var DatosGuardadosBeneficiario = false;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/ActualizaDescripcionGestionBeneficiario",
        data: { idGestion, beneficiarioId, descripcionApoyo },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val > 0) {
                    console.log("Los datos de descripción de apoyo a BENEFICIARIO fueron actualizados");
                }
            })
        },
        error: function (response) {
            //$("#msg_ErrorCatSubCat").show();
            //setTimeout(function () {
            //    $('#msg_ErrorCatSubCat').fadeOut('fast');
            //}, 2000);
            DatosGuardadosBeneficiario = false;
        }
    });
    GeneraTablaBeneficiariosNSolicitudGestion(idGestion);

}


/************************************************************************************************************************
 *  Guarda Nueva Actividad en la Bitácora
 ************************************************************************************************************************/
function GuardaNvaActividadBitacoraGestion(idGestion) {
    var actividad = $("#BitacoraActividad").val();
    var fechaRegistro = $("#FR_BitacoraNva").val();
    var fechaCompromiso = $("#FC_BitacoraNva").val();
    var fechaConclusion = $("#FF_BitacoraNva").val();
    var estatusBitacora = $("#EstatusBitacora").val();
    var responsableBitacora = $("#BitacoraResponsable").val();
    var DatosGuardadosBitacora = false;

    console.log("actividad: " + actividad);
    console.log("fechaRegistro: " + fechaRegistro);
    console.log("fechaCompromiso: " + fechaCompromiso);
    console.log("fechaConclusion: " + fechaConclusion);
    console.log("estatusBitacora: " + estatusBitacora);
    console.log("responsableBitacora: " + responsableBitacora);

    //return;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/GuardaNuevaActividadBitacora_G",
        data: { idGestion, actividad, fechaRegistro, fechaCompromiso, fechaConclusion, estatusBitacora, responsableBitacora },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val > 0) {
                    console.log("LOS DATOS DE Nueva Actividad Bitácora FUERON GUARDADOS");
                }
            })
        },
        error: function (response) {
            DatosGuardadosBeneficiario = false;
        }
    });

    //if (DatosGuardadosBitacora) {
    GeneraTablaBitacoraNSolicitudGestion(idGestion);
    //}
}


/************************************************************************************************************************
 *  Guarda ACTUALIZACIÓN de Actividad en Bitácora
 ************************************************************************************************************************/
function ActualizaBitacoraGestion(bitacoraId, idGestion) {

    var actividad = $("#BitacoraActividad_" + bitacoraId).val();
    var fechaRegistro = $("#FR_" + bitacoraId).val();
    var fechaCompromiso = $("#FC_" + bitacoraId).val();
    var fechaConclusion = $("#FF_" + bitacoraId).val();
    var estatusBitacora = $("#SelEstatus_" + bitacoraId).val();
    var responsableBitacora = $("#BitacoraResponsable").val();
    var DatosGuardadosBitacora = false;

    console.log("actividad: " + actividad);
    console.log("fechaRegistro: " + fechaRegistro);
    console.log("fechaCompromiso: " + fechaCompromiso);
    console.log("fechaConclusion: " + fechaConclusion);
    console.log("estatusBitacora: " + estatusBitacora);
    console.log("idGestion: " + idGestion);
    console.log("bitacoraId: " + bitacoraId);

    //return;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/ActualizaActividadBitacora_G",
        data: { bitacoraId, idGestion, actividad, fechaRegistro, fechaCompromiso, fechaConclusion, estatusBitacora, responsableBitacora },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                if (val > 0) {
                    console.log("LOS DATOS DE Actividad Bitácora FUERON ACTUALIZADOS");
                }
            })
        },
        error: function (response) {
            DatosGuardadosBeneficiario = false;
        }
    });

    //if (DatosGuardadosBitacora) {
    GeneraTablaBitacoraNSolicitudGestion(idGestion);
    //}
}

/************************************************************************************************************************
 *  Guarda Actualización en Solicitud de Petición
 ************************************************************************************************************************/
function GuardarActualizacionGestion(idGestion) {
    var DatosGuardados = false;
    var legislaturaId = $("#LegislaturaId").val();
    var origenSolicitud = $("#OrigenGestion").val();
    var folio = $("#FolioGestionEdicion").val();
    //var SolicitanteOriginalId = $("#SolicitanteOriginalId").val();

    var fechaSolicitud = $("#FechaSolicitud").val();
    var fechaCompromiso = $("#FechaCompromiso").val();
    var fechaConclusion = $("#FechaConclusion").val();
    var estatus = $("#estatusGestion").val();

    var dependenciaId = $("#dependenciaId").val();



    var solicitanteId = $("#hCiudadanoSolicitanteBuscar").val();

    var asociacionId = $("#AsociacionIdG").val();
    var descripcionSolicitud = $("#DescripcionApoyo").val().trim().replace(/\n/g, '&#13');
    var hito = 0;
    if ($("#cboxHito").is(":checked")) {
        hito = 1;
    }

    var costo = $("#CostoApoyoEdit").val();
    var responsableId = $("#responsableId").val();

    if (asociacionId == null || asociacionId == 0) {
        asociacionId = 1;
    }

    console.log("idGestion: " + idGestion);
    console.log("origenSolicitud: " + origenSolicitud);
    console.log("folio: " + folio);
    //console.log("SolicitanteOriginalId: " + SolicitanteOriginalId);

    console.log("fechaSolicitud: " + fechaSolicitud);
    console.log("fechaCompromiso: " + fechaCompromiso);
    console.log("fechaConclusion: " + fechaConclusion);
    console.log("estatus: " + estatus);
    console.log("solicitanteId: " + solicitanteId);
    console.log("---asociacionId: " + asociacionId);
    console.log("descripcionSolicitud: " + descripcionSolicitud);
    console.log("hito: " + hito);

    var datosCompletos = false;

    if (origenSolicitud <= 1) {
        $("#msgAlerta_Origensolicitud").show();
        setTimeout(function () {
            $('#msgAlerta_Origensolicitud').fadeOut('fast');
        }, 3000);
        return;
    }

    if (fechaSolicitud.length <= 0) {
        $("#msgAlerta_Fechasolicitud").show();
        setTimeout(function () {
            $('#msgAlerta_Fechasolicitud').fadeOut('fast');
        }, 3000);
        return;
    }

    if (solicitanteId <= 0) {
        $("#msgAlerta_Solicitante").show();
        setTimeout(function () {
            $('#msgAlerta_Solicitante').fadeOut('fast');
        }, 3000);
        return;
    }

    if (origenSolicitud == 3 && asociacionId <= 1) {
        $("#msgAlerta_Asociacion").show();
        setTimeout(function () {
            $('#msgAlerta_Asociacion').fadeOut('fast');
        }, 3000);
        return;
    }


    //$("#OrigenPeticion").val(1);
    //$("#hCiudadanoSolicitanteBuscar").val(0);
    //$("#NombreCiudadanoSolicitante").val("");
    //$("#AsociacionId").val(0);

    datosCompletos = true;

    //return;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/ActualizaGestion",
        cache: false,
        async: false,
        data: {
            idGestion, origenSolicitud, folio, fechaSolicitud, fechaCompromiso, fechaConclusion, estatus, solicitanteId, asociacionId, descripcionSolicitud, hito, costo, responsableId, dependenciaId, legislaturaId
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
                    $("#hGestionId").val(response);
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
        $("#divArchivoAnexosApoyo").show();
        var idGestion = $("#hGestionId").val();
        GeneraTablaCatSubCatNSolicitudGestion(idGestion);
        GeneraTablaArchivosAnexosNSolicitudGestion(idGestion);
        GeneraTablaBeneficiariosNSolicitudGestion(idGestion);
        GeneraTablaBitacoraNSolicitudGestion(idGestion);
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-" + $("#hGestionId").val());
}

/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de GESTIÓN
 **********************************************************************************************/
function MostrarModalSubirArchivoGestion(idGestion) {
    $("#ModalSeleccionarArchivosGestiones").appendTo("body");
    $("#ModalSeleccionarArchivosGestiones").modal("show");

    $('#HiddenGestionId').val(idGestion);
}


/***********************************************************************************
 * Subir Archivo de GESTIÓN
 ***********************************************************************************/
function subirArchivosGestionButton(nombreArchivoAsubir) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    var GestionId = $('#HiddenGestionId').val();

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("GestionId", GestionId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + GestionId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Gestiones/SubirArchivoGestion",
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
            $('#ModalSeleccionarArchivosGestiones').modal('hide');
            GeneraTablaArchivosAnexosNSolicitudGestion(GestionId);
        },
        error: function (error) {
            console.log('Error al subir el archivo');
            //console.log("MENSAJE ERROR AL SUBIR ARCHIVO: " + response.ServerMessage);
        }
    });
}


/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de ACTIVIDADES DE GESTIÓN
 **********************************************************************************************/
function MostrarModalSubirArchivoGestionBitacora(BitacoraId, GestionId) {
    $("#ModalSeleccionarArchivosGestionesBitacora").appendTo("body");
    $("#ModalSeleccionarArchivosGestionesBitacora").modal("show");

    console.log("GestionId: " + GestionId);
    console.log("BitacoraId: " + BitacoraId);
    $('#HiddenGestionActId').val(GestionId);
    $('#HiddenGestionBitacoraId').val(BitacoraId);
}


/***********************************************************************************
 * Subir Archivo de GESTIÓN - BITACORA
 ***********************************************************************************/
function subirArchivosGestionBitacoraButton(nombreArchivoAsubir) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    var GestionId = $('#HiddenGestionActId').val();
    var BitacoraId = $('#HiddenGestionBitacoraId').val();

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("GestionId", GestionId);
    formData.append("BitacoraId", BitacoraId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + GestionId + "---" + BitacoraId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Gestiones/SubirArchivoGestionBitacora",
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
            $('#ModalSeleccionarArchivosGestionesBitacora').modal('hide');
            GeneraTablaBitacoraNSolicitudGestion(GestionId);
        },
        error: function (error) {
            console.log('Error al subir el archivo');
        }
    });
}

/*********************************************************************************************************************
 * FILTRAR GESTIONES - Identifica opción seleccionada
 *********************************************************************************************************************/
$('#LegBusqueda_G').click(function () {
    $('#LegGestionReferencia').val($('#LegBusqueda_G').val()).select = true;
    FiltraGestiones();
});

$('#ClasificacionBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO clasificación: " + $("#ClasificacionBusqueda_G").val());
    FiltraGestiones();
});

$('#SubclasificacionBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO SubClasificación: " + $("#SubclasificacionBusqueda_G").val());
    FiltraGestiones();
});

$('#OrigenBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#OrigenBusqueda_G").val());
    FiltraGestiones();
});

$('#EstatusBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#EstatusBusqueda_G").val());
    FiltraGestiones();
});

$('#HitoBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#HitoBusqueda_G").val());
    FiltraGestiones();
});

$('#AsociacionBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#AsociacionBusqueda_G").val());
    FiltraGestiones();
});

$('#DependenciaBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#DependenciaBusqueda_G").val());
    FiltraGestiones();
});

$('#ResponsableBusqueda_G').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#ResponsableBusqueda_G").val());
    FiltraGestiones();
});

/*********************************************************************************************************************
 * FILTRAR Gestiones
 *********************************************************************************************************************/
function FiltraGestiones() {
    //    var LegislaturaId = $("#LegBusqueda").val();
    var LegislaturaId = 2;

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    console.log("...Filtra Gestiones: -" + LegislaturaId + "-" + RegXpag + "-" + offsetSolicitudes + "-->" + $("#hideFechaInicioRegistro").val());

    GeneraTablaSolicitudGestiones(LegislaturaId, RegXpag, offsetSolicitudes);
}

/*************************************** 
 * Busqueda Rápida Gestión
 ***************************************/
function BusqudaRapGestiones() {
    var valorBR = $('#BRGestionId').val().trim();
    $("#descripcionFiltro").val(valorBR);
    FiltraGestiones()
}

$('#filtro_G').click(function () {
    console.log("BOTÓN DE FILTRO..................");
    $('#BRGestionId').val("");
    $("#descripcionFiltro").val("");
});

/*********************************************************************************************************************
 * Muestra Tabla de Solicitud de Apoyos 
 *********************************************************************************************************************/
function GeneraTablaSolicitudGestiones(LegislaturaId, RegXpag, offsetPeticiones) {
    var indice = 0;
    var tablaHTML = "";

    var LegislaturaID = $("#LegBusqueda_G").val();
    var folio = $("#NumFolioBusqueda").val();
    var origenPeticion = $("#OrigenBusqueda_G").val();
    var nombreSolicitante = $("#solicitanteFiltro").val();
    var descripcion = $("#descripcionFiltro").val();
    var categoriaId = $("#ClasificacionBusqueda_G").val();
    var subCategoriaId = $("#SubclasificacionBusqueda_G").val();
    var estatusId = $("#EstatusBusqueda_G").val();
    var asociacionId = $("#AsociacionBusqueda_G").val();
    var dependenciaId = $("#DependenciaBusqueda_G").val();
    var responsableId = $("#ResponsableBusqueda_G").val();


    var hito = $("#HitoBusqueda_G").val();

    var fechaInicioSolicitud = $("#hideFechaInicioRegistro").val();
    var fechaFinSolicitud = $("#hideFechaFinRegistro").val();

    fechaInicioSolicitud = fechaInicioSolicitud == "" ? "0" : fechaInicioSolicitud;
    fechaFinSolicitud = fechaFinSolicitud == "" ? "0" : fechaFinSolicitud;


    var fechaInicioConclusion = $("#hideFechaInicioConclusion").val();
    var fechaFinConclusion = $("#hideFechaFinConclusion").val();

    console.log("Folio: " + folio);

    console.log("Gestión -- INICIO: " + fechaInicioSolicitud);
    console.log("Gestión -- FIN: " + fechaFinSolicitud);


    //console.log("Opción BUSQUEDA Origen: " + origenInciativa);

    console.log("PARAMETROS: LegislaturaId: " + LegislaturaId + " estatusId: " + estatusId);
    console.log("RegXpag: " + RegXpag + " offsetPeticiones: " + offsetPeticiones + " LegislaturaID: " + LegislaturaID + " origenPeticion: " + origenPeticion + " folio: " + folio + " hito: " + hito + " nombreSolicitante: " + nombreSolicitante + " descripcion: " + descripcion + " categoriaId: " + categoriaId + " subCategoriaId: " + subCategoriaId + " estatusId: " + estatusId + " fechaInicioSolicitud: " + fechaInicioSolicitud + " fechaFinSolicitud: " + fechaFinSolicitud + " fechaInicioConclusion: " + fechaInicioConclusion + " fechaFinConclusion: " + fechaFinConclusion + " asociacionId: " + asociacionId + " dependenciaId: " + dependenciaId + " responsableId: " + responsableId);

    tablaHTML += "<div class='table-responsive'>";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px; overflow-x: hidden'>";
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

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneGestiones",
        data: { RegXpag, offsetPeticiones, LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId, responsableId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                switch (val.estatusId) {
                    case 2: // AMARILLO  - Ingresa a Dependencia
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#cce0ff;'>" + indice + "</td>";
                        break;
                    case 3: // AZUL CLARO - Copia Entregada a Ciudadano
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#48C4F5;'>" + indice + "</td>";
                        break;
                    case 4: // VERDE - Gestión con Respuesta
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#CDED61;'>" + indice + "</td>";
                        break;
                    case 5: // NARANJA - Respuesta positiva
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#6AF906;'>" + indice + "</td>";
                        break;
                    case 6: // AZUL OBSCURO - Respuesta Negativa
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#F76D08;'>" + indice + "</td>";
                        break;
                    case 7: // VERDE OSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1AA10C;'>" + indice + "</td>";
                        break;
                    case 8: // VERDE OSCURO - Cancelada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#F72108;'>" + indice + "</td>";
                        break;
                    case 9: // VERDE OSCURO - Reasignada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1C4A98;'>" + indice + "</td>";
                        break;
                    default:
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#C5C6C8;'>" + indice + "</td>";
                        break;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fechaSolicitud + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>" + val.nombreCompleto + "</td>";

                //tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Gestión' onclick='mostrarModalDetalleSolicitudGestion(" + val.gestionId + ");'>(" + val.gestionId + ") " + val.descripcion + "</span></td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Gestión' onclick='mostrarModalDetalleSolicitudGestion(" + val.gestionId + ");'>" + val.descripcion + "</span></td>";

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

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>$ " + val.costo + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasTranscurridos + "</td>";
                if (val.diasSolucion != -1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasSolucion + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }


                switch (val.estatusId) {
                    case 2: // AMARILLO  - Ingresa a Dependencia
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#cce0ff;'>";
                        break;
                    case 3: // AZUL CLARO - Copia Entregada a Ciudadano
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#48C4F5;'>";
                        break;
                    case 4: // VERDE - Gestión con Respuesta
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#CDED61;'>";
                        break;
                    case 5: // NARANJA - Respuesta positiva
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#6AF906;'>";
                        break;
                    case 6: // AZUL OBSCURO - Respuesta Negativa
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#F76D08;'>";
                        break;
                    case 7: // VERDE OSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1AA10C;'>";
                        break;
                    case 8: // VERDE OSCURO - Cancelada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#F72108;'>";
                        break;
                    case 9: // VERDE OSCURO - Reasignada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1C4A98;'>";
                        break;
                    default:
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#C5C6C8;'>";
                        break;
                }
                tablaHTML += "<a href='/Apoyo/Gestiones/Edit/" + val.gestionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud de Gestión'></span></a>";
                tablaHTML += "<a href='/Apoyo/Gestiones/Delete/" + val.gestionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Gestión'></span></a>";
                tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            tablaHTML += "</div>";

            $("#divGestiones").html(tablaHTML);


        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/numeroGestiones",
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
        url: "/Apoyo/Gestiones/ObtieneNumeroGestionesXfiltro",
        data: { LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId, responsableId },
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
                var LegislaturaId = $("#LegBusqueda_G").val();
                GeneraTablaSolicitudGestiones_2(LegislaturaId, RegXpag, RegXpag * (page - 1), page);
            }
        });
    } else {
        $("#hideNumPaginas").val(numPaginas);
        $('#pagina-solicitudes').twbsPagination('destroy');
    }

}


/*********************************************************************************************************************
 * Muestra Tabla de Solicitudes de Gestiones
 *********************************************************************************************************************/
function GeneraTablaSolicitudGestiones_2(LegislaturaId, RegXpag, offsetPeticiones, pagina) {
    var indice = 0;
    var tablaHTML = "";

    var LegislaturaID = $("#LegBusqueda_G").val();
    var folio = $("#NumFolioBusqueda").val();
    var origenPeticion = $("#OrigenBusqueda_G").val();
    var nombreSolicitante = $("#solicitanteFiltro").val();
    var descripcion = $("#descripcionFiltro").val();
    var categoriaId = $("#ClasificacionBusqueda_G").val();
    var subCategoriaId = $("#SubclasificacionBusqueda_G").val();
    var estatusId = $("#estatusIdFiltro").val();
    var asociacionId = $("#AsociacionBusqueda_G").val();
    var dependenciaId = $("#DependenciaBusqueda_G").val();
    var responsableId = $("#ResponsableBusqueda_G").val();

    var hito = $("#HitoBusqueda_G").val();

    var fechaInicioSolicitud = $("#hideFechaInicioRegistro").val();
    var fechaFinSolicitud = $("#hideFechaFinRegistro").val();

    fechaInicioSolicitud = fechaInicioSolicitud == "" ? "0" : fechaInicioSolicitud;
    fechaFinSolicitud = fechaFinSolicitud == "" ? "0" : fechaFinSolicitud;


    var fechaInicioConclusion = $("#hideFechaInicioConclusion").val();
    var fechaFinConclusion = $("#hideFechaFinConclusion").val();



    //console.log("INICIO: " + fechaInicioRecibido);
    //console.log("FIN: " + fechaFinRecibido);



    //console.log("Opción BUSQUEDA Origen: " + origenInciativa);

    //console.log("PARAMETROS: LegislaturaId: " + LegislaturaId + " numTurnoParam: " + numTurnoParam + " tipoIniciativaParam: " + tipoIniciativaParam + " estatusParam: " + estatusParam);
    //console.log("PARAMETROS: LegislaturaId: " + LegislaturaId + " origenPeticion: " + origenPeticion + " nombreSolicitante: " + nombreSolicitante + " descripcion: " + descripcion);
    //console.log("PARAMETROS: categoriaId: " + categoriaId + " subCategoriaId: " + subCategoriaId + " estatusId: " + estatusId + " fechaInicioSolicitud: " + fechaInicioSolicitud);
    //console.log("REGISTROS POR PAGINA: " + RegXpag + "            offset = " + offsetPeticiones);

    tablaHTML += "<div class='table-responsive'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%; background-color:#3f49b4; color:whitesmoke;'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='13%' style='text-align:center;'>Fecha Registro</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Nombre Solicitante</th>";
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

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneGestiones",
        data: { RegXpag, offsetPeticiones, LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId, responsableId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                //indice = index + 1;
                indice = (pagina - 1) * RegXpag + index + 1;
                tablaHTML += "<tr>";
                switch (val.estatusId) {
                    case 2: // AMARILLO  - Ingresa a Dependencia
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#cce0ff;'>" + indice + "</td>";
                        break;
                    case 3: // AZUL CLARO - Copia Entregada a Ciudadano
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#48C4F5;'>" + indice + "</td>";
                        break;
                    case 4: // VERDE - Gestión con Respuesta
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#CDED61;'>" + indice + "</td>";
                        break;
                    case 5: // NARANJA - Respuesta positiva
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#6AF906;'>" + indice + "</td>";
                        break;
                    case 6: // AZUL OBSCURO - Respuesta Negativa
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#F76D08;'>" + indice + "</td>";
                        break;
                    case 7: // VERDE OSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1AA10C;'>" + indice + "</td>";
                        break;
                    case 8: // VERDE OSCURO - Cancelada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#F72108;'>" + indice + "</td>";
                        break;
                    case 9: // VERDE OSCURO - Reasignada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1C4A98;'>" + indice + "</td>";
                        break;
                    default:
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#C5C6C8;'>" + indice + "</td>";
                        break;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fechaSolicitud + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.nombreCompleto + "</td>";

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

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>$ " + val.costo + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";

                if (val.diasSolucion != -1) {
                    tablaHTML += "<td></td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasSolucion + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasTranscurridos + "</td>";
                    tablaHTML += "<td></td>";
                }

                switch (val.estatusId) {
                    case 2: // AMARILLO  - Ingresa a Dependencia
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#cce0ff;'>";
                        break;
                    case 3: // AZUL CLARO - Copia Entregada a Ciudadano
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#48C4F5;'>";
                        break;
                    case 4: // VERDE - Gestión con Respuesta
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#CDED61;'>";
                        break;
                    case 5: // NARANJA - Respuesta positiva
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#6AF906;'>";
                        break;
                    case 6: // AZUL OBSCURO - Respuesta Negativa
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#F76D08;'>";
                        break;
                    case 7: // VERDE OSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1AA10C;'>";
                        break;
                    case 8: // VERDE OSCURO - Cancelada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#F72108;'>";
                        break;
                    case 9: // VERDE OSCURO - Reasignada
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1C4A98;'>";
                        break;
                    default:
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#C5C6C8;'>";
                        break;
                }
                tablaHTML += "<a href='/Apoyo/Gestiones/Edit/" + val.gestionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud de Gestión'></span></a>";
                tablaHTML += "<a href='/Apoyo/Gestiones/Delete/" + val.gestionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Gestión'></span></a>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });

            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            tablaHTML += "</div>";
            $("#divGestiones").html(tablaHTML);


        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/numeroGestiones",
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
        url: "/Apoyo/Gestiones/ObtieneNumeroGestionesXfiltro",
        data: { LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId },
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


/**********************************************************************************************
 * Muestra MODAL detalle de Solicitud de Apoyo
 **********************************************************************************************/
function mostrarModalDetalleSolicitudGestion(GestionId) {
    var indice = 0;
    var tablaHTML = "";
    $("#modalMuestraDatosSolicitudGestion").appendTo("body");
    $("#modalMuestraDatosSolicitudGestion").modal("show");

    $("#divDatosSolicitud").html("");
    $("#divCatSubCatNGestion").html("");
    $("#divArchivosAnexosNGestion").html("");
    $("#divBeneficiariosNGestionn").html("");
    $("#divBitacoraNGestion").html("");

    /* DETALLE DE SOLICITUD DE GESTION */

    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneDetalleGestion",
        data: { GestionId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {

                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='15%'>Origen de Solicitud</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='20%'>Folio</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='15%'>Fecha Solicitud</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='15%'>Fecha Compromiso</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='15%'>Fecha Conclusión</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='20%'>Estatus</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + val.origenPeticionNombre + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 1px;' width='20%'>" + val.folio + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 1px;' width='15%'>" + moment(val.fechaSolicitud).format('DD/MM/yyyy') + "</td>";
                if (moment(val.fechaCompromiso).format('DD/MM/yyyy') != "01/01/1900") {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + moment(val.fechaCompromiso).format('DD/MM/yyyy') + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }

                if (moment(val.fechaConclusion).format('DD/MM/yyyy') != "01/01/1900") {
                    tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + moment(val.fechaConclusion).format('DD/MM/yyyy') + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }

                //tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='15%'>" + moment(val.fechaConclusion).format('DD/MM/yyyy') + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='20%'>" + val.estatusDescripcion + "</td>";
                tablaHTML += "</tr>";
                tablaHTML += "</table>";
                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr style='padding:2px;'>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='25%'>Solicitante</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='25%'>" + val.solicitanteNombre + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='25%'>Responsable</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='25%'>" + val.nombreResponsable + "</td>";


                tablaHTML += "</tr>";
                tablaHTML += "</table>";
                if (val.asociacionNombre != null) {
                    tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                    tablaHTML += "<tr style='padding:2px;'>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='30%'>Asociación</td>";
                    tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='70%'>" + val.asociacionNombre + "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }

                if (val.dependenciaNombre != null) {
                    tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                    tablaHTML += "<tr style='padding:2px;'>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='30%'>Dependencia</td>";
                    tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='70%'>" + val.dependenciaNombre + "</td>";
                    tablaHTML += "</tr>";
                    tablaHTML += "</table>";
                }

                tablaHTML += "<table class='table table-bordered' style='width:100%;'>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='60%'>Descripción</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='30%'>Costo</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'>Hito</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='60%'>" + val.descripcion + "</td>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='30%'><table width='100%' style=' border-color: #c1c4c9;'><tr><td width='20%' style='background-color: #c1c4c9; border-radius: 10px 0px 0px 10px; text-align:center;'>$</td><td width='80%' style='text-align:left;'>" + val.costo + "</td></tr></table></td>";
                if (val.hito == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='10%'>";
                    tablaHTML += "<img src='/Apoyo/Images/checkbox.png' height='20' />";
                    tablaHTML += "</td>";
                }

                tablaHTML += "</tr>";
                tablaHTML += "</table>";
            });
        }
    });

    $("#divDatosSolicitudGestion").html(tablaHTML);

    /* CATEGORIA - SUBCATEGORIA */
    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='49%'>";
    tablaHTML += "Categoria";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='46%'>";
    tablaHTML += "Subcategoria";
    tablaHTML += "</tr>";

    indice = 0;
    var idGestion = GestionId;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneListaCatSubCat_G",
        data: { idGestion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr id='CatSubRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td>" + val.descripcionCat + "</td>";
                tablaHTML += "<td>" + val.descripcionSubcat + "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    if (indice > 0) {
        $("#divCatSubCatNGestion").html(tablaHTML);
    }

    /* ARCHIVOS ANEXOS */

    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='94%'>";
    tablaHTML += "Nombre de Archivo";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneListaArchivos_G",
        data: { idGestion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                console.log("ARCHIVO: " + val.url);
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
        $("#divArchivosAnexosNGestion").html(tablaHTML);
    }


    /* BENEFICIARIOS */
    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
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
    tablaHTML += "</tr>";

    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneListaBeneficiariosGestionId",
        data: { idGestion },
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
                tablaHTML += "<td>" + val.notas + "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    if (indice > 0) {
        $("#divBeneficiariosNGestion").html(tablaHTML);
    }

    /* BITÁCORA DE ACTIVIDADES */
    tablaHTML = "<div align='center'>";
    tablaHTML += "<table class='table table-bordered responsive-table' style='width:100%;' id='TablaCategoriaSubcategoriaNSolicitud'>";
    tablaHTML += "<tbody'>";
    tablaHTML += "<tr>";
    tablaHTML += "<td style='text-align:center; padding:1px;' width='3%'>";
    tablaHTML += "#";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='35%'>";
    tablaHTML += "Actividad";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Fecha Registro";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Fecha Conclusión";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Archivos";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</td>";
    //tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    //tablaHTML += "Responsable";
    //tablaHTML += "</td>";

    tablaHTML += "</tr>";
    var selAux = "";
    indice = 0;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/ObtieneBitacoraGestionId",
        data: { idGestion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                selAux = "";
                tablaHTML += "<tr id='BitacoraRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align:left;'>" + val.bitacoraBase.descripcion + "</td>";
                tablaHTML += "<td>" + moment(val.bitacoraBase.fechaRegistro).format('DD/MM/yyyy') + "</td>";
                //tablaHTML += "<td>" + moment(val.bitacoraBase.fechaCompromiso).format('DD/MM/yyyy') + "</td>";
                tablaHTML += "<td>" + moment(val.bitacoraBase.fechaConclusion).format('DD/MM/yyyy') + "</td>";

                tablaHTML += "<td>";
                tablaHTML += "<table style='width: 100%; border:none; margin:0; padding:0; border-collapse: collapse;' cellpadding='0' cellspacing='0'>";
                var indiceArch = 0;
                for (const elemento in val.archivosRelacionadosBitacora) {
                    indiceArch++;
                    tablaHTML += "<tr>";
                    tablaHTML += "<td width='5%'>" + indiceArch + "</td>";
                    tablaHTML += "<td width='95%'><a href='" + val.archivosRelacionadosBitacora[elemento].url + "' target='_blank' title='" + val.archivosRelacionadosBitacora[elemento].nombreArchivo + "'>" + val.archivosRelacionadosBitacora[elemento].nombreArchivo.substring(0, 20) + "</a></td>";
                    tablaHTML += "</tr>";
                }
                tablaHTML += "</table>";
                tablaHTML += "</td>";


                tablaHTML += "<td>";
                switch (val.bitacoraBase.estatus) {
                    case 0:
                        tablaHTML += "";
                        break;
                    case 1:
                        tablaHTML += "FINALIZADA";
                        break;
                    case 2:
                        tablaHTML += "PROCESO";
                        break;
                    case 3:
                        tablaHTML += "CANCELADA";
                        break;
                }
                tablaHTML += "</select>";
                tablaHTML += "</td>";

                //tablaHTML += "<td>" + val.bitacoraBase.responsable + "</td>";
                tablaHTML += "</tr>";
            });
        }
    });

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";


    if (indice > 0) {
        $("#divBitacoraNGestion").html(tablaHTML);
    }
}


/*************************************************************************************
 *  Filtro Rango de fecha PETICIONES DE APOYO Registradas
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoRegistroGestion').daterangepicker({
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
            $("#hideFechaInicioRegistro").val(start.format('DD-MM-YYYY 00:00'));
            $("#hideFechaFinRegistro").val(end.format('DD-MM-YYYY 11:59'));
            FiltraGestiones();
        }
    );
});

$('input[id="filtro_rangoRegistroGestion"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoRegistroGestion"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});



/*************************************************************************************
 *  Filtro Rango de fecha CONCLUSIONES DE PETICIONES DE APOYO 
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoConclusion').daterangepicker({
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
            //console.log('>>>>>>>>>>>>>>RANGO DE FECHAS<<<<<<<<<<<<<<<<<: ' + start.format('YYYY-MM-DD 00:00') + ' to ' + end.format('YYYY-MM-DD 11:59') + ' (predefined range: ' + label + ')');
            $("#hideFechaInicioConclusion").val(start.format('DD-MM-YYYY 00:00'));
            $("#hideFechaFinConclusion").val(end.format('DD-MM-YYYY 11:59'));
            FiltraPeticiones();
        }
    );
});

$('input[id="filtro_rangoConclusion"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoConclusion"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});


/*********************************************************************************************************
 * Revisa que el número de Folio de Petición no exista en la BD
 *********************************************************************************************************/
$('#FolioGestion').focusout(function () {
    var folio = $('#FolioGestion').val();
    var legislaturaId = $('#LegGestionNuevo').val();
    console.log("Salio de el campo de Numero de Folio --> " + folio);
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/BuscaNumeroFolio",
        data: { folio, legislaturaId },
        cache: false,
        async: false,
        success: (response) => {
            if (response >= 1) {
                $("#msgAlertNumFolioExistente").show();
                setTimeout(function () {
                    $('#msgAlertNumFolioExistente').fadeOut('fast');
                }, 2000); // <-- milliseconds
                $('#FolioGestion').val("");
            } else {
                console.log("NO NUMERO DE FOLIO " + response);
            }
        }
    });
});


/*********************************************************************************************************
 * EDITA - Revisa que el número de Folio de GESTION no exista en la BD
 *********************************************************************************************************/
$('#FolioPeticionEdicion').focusout(function () {
    var folio = $('#FolioPeticionEdicion').val();
    var folioOriginal = $('#FolioOriginal').val();

    if (folio == folioOriginal) { return };

    console.log("Cambio el Folio --> " + folioOriginal + " --> " + folio);
    $.ajax({
        type: "GET",
        url: "/Apoyo/Gestiones/BuscaNumeroFolio",
        data: { folio },
        cache: false,
        async: false,
        success: (response) => {
            if (response >= 1) {
                $("#msgAlertNumFolioExistente").show();
                setTimeout(function () {
                    $('#msgAlertNumFolioExistente').fadeOut('fast');
                }, 2000); // <-- milliseconds
                $('#FolioPeticion').val("");
            } else {
                console.log("NO NUMERO DE FOLIO " + response);
            }
        }
    });
});

/***********************************************************************
 * Cuando Selecciona una Categoría
 * Llena el Combo de Subcategorías
 ***********************************************************************/
$('#ClasificacionBusqueda_G').click(function () {
    if ($('#ClasificacionBusqueda_G').val() == 0) {
        $("#SubclasificacionBusqueda_G").prop('disabled', true);
        return;
    }
    $("#SubclasificacionBusqueda_G").prop('disabled', false);
    clasificacionId = $("#ClasificacionBusqueda_G").val();                          // Obtiene la Legislatura seleccionada
    $("#SubclasificacionBusqueda_G").empty();
    $.ajax({                                                                                    // Agrega al Combo las Areas de la Unidad/Dependencia
        type: "GET",
        url: "/Apoyo/Peticiones/CargaValoresSubCategoria",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        async: false,
        data: { clasificacionId },
        success: (response) => {
            $.each(response, function (i, item) {
                $("#SubclasificacionBusqueda_G").append(new Option(item.text, item.value));
            });
        }
    });
});




/*************************************************
 * Valida que sea un NUMERO
 *************************************************/
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


/***********************************************************************
 *  RESUMEN GESTIONES X CATEGORÍA X SUBCATEGORIA X ESTATUS
 ***********************************************************************/
function resumenGestion_Cat_Subcat_Estatus(LegislaturaID, anioSel, mesSel) {

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
    tablaHTML += "<h3>Solicitudes de Gestión X Categoría-Subcategoría X Estatus</h3>";
    tablaHTML += "</div>";
    tablaHTML += "<hr/>";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Dependencia</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Categoría</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Subcategoría</td>";
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
        url: "/Apoyo/Gestiones/resumenXclasificacionXSubclasificacion_Gestion",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                if (val.dependencia != '-') {
                    tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.dependencia + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'></td>";
                }

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.clasificacion + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.subclasificacion + "</td>";
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
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;' colspan='3'><strong>TOTAL</strong></td>";
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
    $("#CardClasificacionSubclasificacionGestion").html(tablaHTML);
}

/****************************************************************
 *  BORRAR Categoría y Subcategoría
 ****************************************************************/
function EliminaRowGestionCatSubcat(idGestion, gestionCategoriaId, gestionSubCategoriaId, categoriaId, subcategoriaId) {
    console.log("idGestion: " + idGestion);
    console.log("gestionCategoriaId: " + gestionCategoriaId);
    console.log("gestionSubCategoriaId: " + gestionSubCategoriaId);
    console.log("categoriaId: " + categoriaId);
    console.log("subcategoriaId: " + subcategoriaId);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/BorrarCategoriaSubCategoria",
        cache: false,
        async: false,
        data: { gestionCategoriaId, gestionSubCategoriaId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaCatSubCatNSolicitudGestion(idGestion)
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}

/****************************************************************
 *  BORRAR Archivo Gestión
 ****************************************************************/
function EliminaRowArchivoGestion(archivoId, idGestion) {
    console.log("archivoId: " + archivoId);
    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/BorrarArchivoGestion",
        cache: false,
        async: false,
        data: { archivoId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaArchivosAnexosNSolicitudGestion(idGestion);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}

/****************************************************************
 *  BORRAR Beneficiario Gestión
 ****************************************************************/
function EliminaRowBeneficiarioGestion(gestionID, ciudadanoID, beneficiariosID) {
    console.log("gestionID: " + gestionID);
    console.log("ciudadanoID: " + ciudadanoID);
    console.log("beneficiariosID: " + beneficiariosID);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/BorrarBeneficiarioGestion",
        cache: false,
        async: false,
        data: { beneficiariosID },
        success: (response) => {
            if (response == 1) {
                GeneraTablaBeneficiariosNSolicitudGestion(gestionID);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}


/****************************************************************
 *  BORRAR Archivo Bitácora Gestión
 ****************************************************************/
function EliminaArchivoBitacoraGestion(archivosBitacoraId, bitacoraId, idGestion) {
    console.log("archivosBitacoraId: " + archivosBitacoraId);
    console.log("bitacoraId: " + bitacoraId);
    console.log("idGestion: " + idGestion);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/BorrarArchivoBitacoraGestion",
        cache: false,
        async: false,
        data: { archivosBitacoraId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaBitacoraNSolicitudGestion(idGestion);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}



/****************************************************************
 *  BORRAR Actividad Bitácora Gestión
 ****************************************************************/
function EliminaRowBitacoraGestion(bitacoraId, idGestion) {

    console.log("bitacoraId: " + bitacoraId);
    console.log("idGestion: " + idGestion);
    
    $.ajax({
        type: "POST",
        url: "/Apoyo/Gestiones/BorrarActividadBitacoraGestion",
        cache: false,
        async: false,
        data: { bitacoraId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaBitacoraNSolicitudGestion(idGestion);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}

/*********************************************************************************************************************
 * SELECCIONA LEGISLATURA REFERENCIA
 *********************************************************************************************************************/
$('#LegGestionReferencia').click(function () {
    var LegRef = $('#LegGestionReferencia').val();
    console.log("VALOR DE LEGISLATURA DE REFERNCIA: " + LegRef);
    $("#LegBusqueda_G").val(LegRef);
    FiltraGestiones();
});


///********************************
//  T A B 's
//*********************************/
//var app = new Vue({
//    el: '#app',

//    mounted: function () {
//        document.querySelector('#myTab').addEventListener('mousewheel', (e) => {
//            document.querySelector('#myTab').scrollLeft = document.querySelector('#myTab').scrollLeft + e.deltaY;
//            e.preventDefault();
//            e.stopPropagation();
//            return false;
//        });
//    },
//});