
$('#FileUploadFormFileApoyos').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);

    }
    $(this).next('.custom-file-label').html(files.join(', '));
    //var TmpPath = URL.createObjectURL(e.target.files[0]);
})


$('#FileUploadFormFilePeticionBitacora').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));
})



const onInputDescripcion = event => {
    event.target.value = event.target.value.replace(/[\'\"\&#\\]/g, '')
}

/*********************************************************************************************************
 * Guarda Nueva Petición
 *********************************************************************************************************/
function GuardarNuevaPeticion() { 
    var DatosGuardados = false;
    var legislaturaId = $("#LegPeticionNuevo").val();
    var origenSolicitud = $("#OrigenPeticion").val();
    var folio = $("#FolioPeticion").val();
    var fechaSolicitud = $("#FechaSolicitud").val();
    var fechaCompromiso = $("#FechaCompromiso").val();
    var fechaConclusion = $("#FechaConclusion").val();
    var estatus = $("#estatusPeticion").val();
    var solicitanteId = $("#hCiudadanoSolicitanteBuscar").val();
    var asociacionId = $("#AsociacionId").val();
    var descripcionSolicitud = $("#DescripcionApoyo").val().trim().replace(/\n/g, '&#13');
    var hito = 0;
    var costo = $("#CostoPeticionId").val();
    var responsableId = $("#responsablePeticion").val();

    if ($("#cboxHito").is(":checked")) {
        hito = 1;
    }

    if (costo == null || costo=="") {
        costo = "0";
    }

    if (asociacionId == null || asociacionId == "") {
        asociacionId = 0;
    }

    console.log("legislaturaId: " + legislaturaId);
    console.log("origenSolicitud: " + origenSolicitud);
    console.log("folio: " + folio);
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

    var datosCompletos = false;

    if (origenSolicitud <= 1) {
        $("#msgAlerta_Origensolicitud").show();
        setTimeout(function () {
            $('#msgAlerta_Origensolicitud').fadeOut('fast');
        }, 3000);
        return;
    }

    //if (folio.length <= 0) {
    //    $("#msgAlerta_FolioPeticion").show();
    //    setTimeout(function () {
    //        $('#msgAlerta_FolioPeticion').fadeOut('fast');
    //    }, 3000);
    //    return;
    //}

    if (descripcionSolicitud.length <= 0) {
        $("#msgAlerta_DescripcionPeticion").show();
        setTimeout(function () {
            $('#msgAlerta_DescripcionPeticion').fadeOut('fast');
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

    $("#OrigenPeticion").val(1);
    $("#hCiudadanoSolicitanteBuscar").val(0);
    $("#NombreCiudadanoSolicitante").val("");
    $("#AsociacionId").val(0);

    datosCompletos = true;


    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/NuevaPeticion",
        cache: false,
        async: false,
        data: {
            origenSolicitud, folio, fechaSolicitud, fechaCompromiso, fechaConclusion, estatus, solicitanteId, asociacionId, descripcionSolicitud, hito, costo, responsableId, legislaturaId
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
        $("#divArchivoAnexosApoyo").show();
        var idPeticion = $("#hPeticionId").val();
        GeneraTablaCatSubCatNSolicitud(idPeticion);
        GeneraTablaArchivosAnexosNSolicitud(idPeticion);
        GeneraTablaBeneficiariosNSolicitud(idPeticion);
        GeneraTablaBitacoraNSolicitud(idPeticion);
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-" + $("#hPeticionId").val());
}

/*********************************************************************************************************
 * Edita Petición
 *********************************************************************************************************/
function MuestraComplementoPeticion(idPeticion) {
    GeneraTablaCatSubCatNSolicitud(idPeticion);
    GeneraTablaArchivosAnexosNSolicitud(idPeticion);
    GeneraTablaBeneficiariosNSolicitud(idPeticion);
    GeneraTablaBitacoraNSolicitud(idPeticion);
}

/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Categoria-Subcategoria para registro de Nueva Solicitud de Apoyo
 ***********************************************************************************************************/
function GeneraTablaCatSubCatNSolicitud(idPeticion) {
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
    // tablaHTML += "<span style='font-size:18px; cursor:pointer' title='Agrega Espacio para nuevo registro de Categoría-Subcategoría' onclick='AgregaRowCatSubC(" + indice + ");'>+</span>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtieneListaCatSubCat",
        data: { idPeticion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                tablaHTML += "<tr id='CatSubRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td>" + val.descripcionCat + "</td>";
                tablaHTML += "<td>" + val.descripcionSubcat + "</td>";
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Categoría y Subcategoria' onclick='EliminaRowPeticionCatSubcat(" + idPeticion + "," + val.peticionCategoriaID + "," + val.peticionSubcategoriaID + "," + val.categoriaID + "," + val.subcategoriasID + ");'></span></td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
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
    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guarda Nueva Categoría y Subcategoria' onclick='GuardaNuevaCategoriaSubcategoria(" + idPeticion + ");'></span></td>";
    tablaHTML += "</tr>";

    //$('#divCatSubCatNPeticion tbody').append(tablaHTML).autocomplete(autocompleteOptions);

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divCatSubCatNPeticion").html(tablaHTML);
    $("#Cat_Nuevo").autocomplete(autocompleteCategorias);
    $("#SubCat_Nuevo").autocomplete(autocompleteSubCategorias);

}


/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Archivos Anexos para registro de Nueva Solicitud de Apoyo
 ***********************************************************************************************************/
function GeneraTablaArchivosAnexosNSolicitud(idPeticion) {
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
    tablaHTML += "<span class='fas fa-file-upload' style='font-size:18px; cursor:pointer' title='Subir Archivo Anexo' onclick='MostrarModalSubirArchivoAnexo(" + idPeticion + ");'></span>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtieneListaArchivos",
        data: { idPeticion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                console.log("ARCHIVO: " + val.url);
                tablaHTML += "<tr id='ArchivoRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
                tablaHTML += "<td><a href='" + val.url + "' target='_blank' title='Archivo'>" + val.nombreArchivo + "</a></td>";
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowArchivoPeticion(" + val.archivosPeticionesID + "," + idPeticion + ");'></span></td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);  
        }
    });

    if (indice > 0) {
        $("#opc_2").css({ 'border-left-color': '#20B016' });
    }
    //indice++;


    //tablaHTML += "<tr id='ArchivoRenglon_" + indice + "'>";
    //tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";
    //tablaHTML += "<td><input type='text' id='Archivo_" + indice + "' style='width:100%; max-width:100%;' value=''/></td>";
    //tablaHTML += "<td><span class='fas fa-file-upload' style='font-size:18px; cursor:pointer' title='Subir Archivo Anexo' onclick='MostrarModalSubirArchivoAnexo(" + idPeticion + ");'></span></td>";
    //tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divArchivosAnexosNPeticion").html(tablaHTML);

}



/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Beneficiarios para registro de Nueva Solicitud de Apoyo
 ***********************************************************************************************************/
function GeneraTablaBeneficiariosNSolicitud(idPeticion) {
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
    //tablaHTML += "<span style='font-size:18px; cursor:pointer' title='Agrega Espacio para nuevo registro de Categoría-Subcategoría' onclick='AgregaRowCatSubC(" + indice + ");'>+</span>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtieneListaBeneficiariosPeticionId",
        data: { idPeticion },
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
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowBeneficiarioPeticion(" + val.peticionID + "," + val.ciudadanoID + "," + val.beneficiariosID + ");'></span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Actualiza el apoyo recibido' onclick='GuardaCambiosApoyoBeneficiario(" + val.peticionID + "," + val.ciudadanoID + "," + val.beneficiariosID + ");'></span>";
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
    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guarda Beneficiario' onclick='GuardaNuevoBeneficiario(" + idPeticion + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divBeneficiariosNPeticion").html(tablaHTML);
    $("#BeneNombre_Nuevo").autocomplete(autocompleteNombreBeneficiario);

}


/************************************************************************************************************
 * Muestra Encabezado y primer renglón de Bitácora para registro de Nueva Solicitud de Apoyo
 ***********************************************************************************************************/
function GeneraTablaBitacoraNSolicitud(idPeticion) {
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
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='15%'>";
    tablaHTML += "Archivos";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='15%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</td>";

    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    tablaHTML += "</td>";
    tablaHTML += "</tr>";
    var selAux = "";
    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtieneBitacoraPeticionId",
        data: { idPeticion },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice++;
                selAux = "";
                tablaHTML += "<tr id='BitacoraRenglon_" + indice + "'>";
                tablaHTML += "<td style='text-align:center;'>" + indice + "</td>";

                tablaHTML += "<td><input type='text' id='BitacoraActividad_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + val.bitacoraBase.descripcion + "'/></td>";

                tablaHTML += "<td><input type='text' name = 'FR_Bitacora' id='FR_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + moment(val.bitacoraBase.fechaRegistro).format('DD/MM/yyyy') + "'/></td>";
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
                        tablaHTML += "<span class='fas fa-trash-alt' style='font-size:16px; cursor:pointer;' title='Elimina Archivo' onclick='EliminaArchivoBitacoraPeticion(" + val.archivosRelacionadosBitacora[elemento].archivosBitacoraId + "," + val.archivosRelacionadosBitacora[elemento].bitacoraId + "," + idPeticion + ");'>&nbsp;</span>";
                        tablaHTML += "<span class='fas fa-file-upload' style='font-size:16px; cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPeticionBitacora(" + val.archivosRelacionadosBitacora[elemento].bitacoraId + "," + idPeticion + ");'></span>";
                        tablaHTML += "</td>";
                        tablaHTML += "</tr>";
                    }
                    tablaHTML += "</table>";
                } else {
                    tablaHTML += "<table style='width: 100%; border:none; margin:0; padding:0; border-collapse: collapse;' cellpadding='0' cellspacing='0'>";
                    tablaHTML += "<tr>";
                    tablaHTML += "<td width='70%'></td>";
                    tablaHTML += "<td width='30%'>";
                    tablaHTML += "<span class='fas fa-file-upload' style='font-size:16px; cursor:pointer;' title='Anexar Archivo' onclick='MostrarModalSubirArchivoPeticionBitacora(" + val.bitacoraBase.bitacoraId  + "," + idPeticion + ");'></span>";
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

                tablaHTML += "<td>";
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowBitacoraPeticion(" + val.bitacoraBase.bitacoraId + "," + idPeticion + ");'></span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Actualiza el apoyo recibido' onclick='ActualizaBitacora(" + val.bitacoraBase.bitacoraId + "," + idPeticion + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
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

    tablaHTML += "<td>";
    tablaHTML += "<div class='input-group date' id='dpBitacoraFF'>";
    tablaHTML += "<input asp-for='FF_Bitacora' name='FF_Bitacora' id='FF_BitacoraNva' class='form-control'/>";
    tablaHTML += "</div>";
    tablaHTML += "</td>";


    tablaHTML += "<td>";
    tablaHTML += "</td>";

    tablaHTML += "<td>";
    tablaHTML += "<select name='a' id='EstatusBitacora'>";
    tablaHTML += "<option value='0'></option>";
    tablaHTML += "<option value='1'>FINALIZADA</option>";
    tablaHTML += "<option value='2'>PROCESO</option>";
    tablaHTML += "<option value='3'>CANCELADA</option>";
    tablaHTML += "</select>";
    tablaHTML += "</td>";

    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guardar Actividad' onclick='GuardaNvaActividadBitacora(" + idPeticion + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divBitacoraNPeticion").html(tablaHTML);

    $('input[name="FR_Bitacora"]').datepicker({
        dateFormat: 'dd/mm/yy',
        locale: 'es'
    });

    $('input[name="FC_Bitacora"]').datepicker({
        dateFormat: 'dd/mm/yy'
    });

    $('input[name="FF_Bitacora"]').datepicker({
        dateFormat: 'dd/mm/yy'
    });
}


/************************************************************************************************************************
 *  Guarda datos de Categoría y Subcategoría, en el StoreProcedure valida que este registrada Categoría y Subcategoría
 ************************************************************************************************************************/
function GuardaNuevaCategoriaSubcategoria(idPeticion) {
    var categoriaId = $("#hCategoriaBuscar").val();
    var subCategoriaId = $("#hSubCategoriaBuscar").val();
    var DatosGuardadosCSC = false;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/GuardaCategoriaSubCategoriaBD",
        data: { idPeticion, categoriaId, subCategoriaId },
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
    GeneraTablaCatSubCatNSolicitud(idPeticion);
    //}
}

/************************************************************************************************************************
 *  Guarda Nuevo Beneficiario y Apoyo Brindado
 ************************************************************************************************************************/
function GuardaNuevoBeneficiario(idPeticion) {
    var beneficiarioId = $("#hBeneficiarioBuscar").val();
    var descripcionApoyo = $("#BeneApoyo_Nuevo").val();
    var DatosGuardadosBeneficiario = false;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/GuardaNuevoBeneficiario",
        data: { idPeticion, beneficiarioId, descripcionApoyo },
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
    GeneraTablaBeneficiariosNSolicitud(idPeticion);
    //}
}

/************************************************************************************************************************
 *  Actualiza Apoyo a un Beneficiario
 ************************************************************************************************************************/
function GuardaCambiosApoyoBeneficiario(idPeticion, beneficiarioId, idRow) {

    var descripcionApoyo = $("#DescripcionApoyo_" + idRow).val();
    var DatosGuardadosBeneficiario = false;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/ActualizaDescripcionApoyoBeneficiario",
        data: { idPeticion, beneficiarioId, descripcionApoyo },
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
    GeneraTablaBeneficiariosNSolicitud(idPeticion);
}


/************************************************************************************************************************
 *  Guarda Nueva Actividad en la Bitácora
 ************************************************************************************************************************/
function GuardaNvaActividadBitacora(idPeticion) {
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
        url: "/Apoyo/Peticiones/GuardaNuevaActividadBitacora",
        data: { idPeticion, actividad, fechaRegistro, fechaCompromiso, fechaConclusion, estatusBitacora, responsableBitacora },
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
    GeneraTablaBitacoraNSolicitud(idPeticion);
    //}
}


/************************************************************************************************************************
 *  Guarda ACTUALIZACIÓN de Actividad en Bitácora
 ************************************************************************************************************************/
function ActualizaBitacora(bitacoraId, idPeticion) {

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
    console.log("idPeticion: " + idPeticion);
    console.log("bitacoraId: " + bitacoraId);

    //return;

    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/ActualizaActividadBitacora",
        data: { bitacoraId, idPeticion, actividad, fechaRegistro, fechaCompromiso, fechaConclusion, estatusBitacora, responsableBitacora },
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
    GeneraTablaBitacoraNSolicitud(idPeticion);
    //}
}



/************************************************************************************************************************
 *  Guarda Actualización en Solicitud de Petición
 ************************************************************************************************************************/
function GuardarActualizacionPeticion(idPeticion) {
    var DatosGuardados = false;
    var legislaturaId = $("#LegislaturaId").val();
    var origenSolicitud = $("#OrigenPeticion").val();
    var folio = $("#FolioPeticionEdicion").val();
    //var SolicitanteOriginalId = $("#SolicitanteOriginalId").val();
    
    var fechaSolicitud = $("#FechaSolicitud").val();
    var fechaCompromiso = $("#FechaCompromiso").val();
    var fechaConclusion = $("#FechaConclusion").val();
    var estatus = $("#estatusPeticion").val();



    var solicitanteId = $("#hCiudadanoSolicitanteBuscar").val();

    var asociacionId = $("#AsociacionId").val();
    var descripcionSolicitud = $("#DescripcionApoyo").val().trim().replace(/\n/g, '&#13');
    var hito = 0;
    if ($("#cboxHito").is(":checked")) {
        hito = 1;
    }

    var costo = $("#CostoApoyoEdit").val();
    var responsableId = $("#responsableId").val();

    if (asociacionId == null || asociacionId==0) {
        asociacionId = 1;
    }

    console.log("idPeticion: " + idPeticion);
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
        url: "/Apoyo/Peticiones/ActualizaPeticion",
        cache: false,
        async: false,
        data: {
            idPeticion, origenSolicitud, folio, fechaSolicitud, fechaCompromiso, fechaConclusion, estatus, solicitanteId, asociacionId, descripcionSolicitud, hito, costo, responsableId, legislaturaId
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
        $("#divArchivoAnexosApoyo").show();
        var idPeticion = $("#hPeticionId").val();
        GeneraTablaCatSubCatNSolicitud(idPeticion);
        GeneraTablaArchivosAnexosNSolicitud(idPeticion);
        GeneraTablaBeneficiariosNSolicitud(idPeticion);
        GeneraTablaBitacoraNSolicitud(idPeticion);
    }

    console.log("Regresa de >>>> DESPUES D GUARDAR REGRESA : -" + DatosGuardados + "-" + $("#hPeticionId").val());
}

/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de Peticiones
 **********************************************************************************************/
function MostrarModalSubirArchivoAnexo(idPeticion) {
    $("#ModalSeleccionarArchivosPeticiones").appendTo("body");
    $("#ModalSeleccionarArchivosPeticiones").modal("show");

    $('#HiddenPeticionId').val(idPeticion);
}

/***********************************************************************************
 * Subir Archivo de Peticiones de Apoyo
 ***********************************************************************************/
function subirArchivosApoyoButton(nombreArchivoAsubir) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    var PeticionId = $('#HiddenPeticionId').val();

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("PeticionId", PeticionId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + PeticionId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Peticiones/SubirArchivoPeticion",
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
            $('#ModalSeleccionarArchivosPeticiones').modal('hide');
            GeneraTablaArchivosAnexosNSolicitud(PeticionId);
        },
        error: function (error) {
            console.log('Error al subir el archivo');
            //console.log("MENSAJE ERROR AL SUBIR ARCHIVO: " + response.ServerMessage);
        }
    });
}



/**********************************************************************************************
 * Muestra MODAL para Subir Archivo Anexo de ACTIVIDADES DE PETICIONES
 **********************************************************************************************/
function MostrarModalSubirArchivoPeticionBitacora(BitacoraId, PeticionId) {
    $("#ModalSeleccionarArchivosPeticionesBitacora").appendTo("body");
    $("#ModalSeleccionarArchivosPeticionesBitacora").modal("show");

    console.log("PeticionId: " + PeticionId);
    console.log("BitacoraId: " + BitacoraId);
    $('#HiddenPeticionActId').val(PeticionId);
    $('#HiddenPeticionBitacoraId').val(BitacoraId);
}


/***********************************************************************************
 * Subir Archivo de PETICIÓN - BITACORA
 ***********************************************************************************/
function subirArchivosPeticionBitacoraButton(nombreArchivoAsubir) {
    var formData = new FormData();
    var input = document.getElementById(nombreArchivoAsubir);
    var files = input.files;

    var PeticionId = $('#HiddenPeticionActId').val();
    var BitacoraId = $('#HiddenPeticionBitacoraId').val();

    for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("PeticionId", PeticionId);
    formData.append("BitacoraId", BitacoraId);

    console.log("LISTO PARA SUBIR ARCHIVOS: " + PeticionId + "---" + BitacoraId);
    $.ajax({
        type: 'POST',
        url: "/Apoyo/Peticiones/SubirArchivoPeticionBitacora",
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
            $('#ModalSeleccionarArchivosPeticionesBitacora').modal('hide');
            GeneraTablaBitacoraNSolicitud(PeticionId);
        },
        error: function (error) {
            console.log('Error al subir el archivo');
        }
    });
}


/*********************************************************************************************************************
 * FILTRAR PETICIONES - Identifica opción seleccionada
 *********************************************************************************************************************/
$('#LegBusqueda').click(function () {
    $('#LegPeticionReferencia').val($('#LegBusqueda').val()).select = true;
    FiltraPeticiones();
});

$('#ClasificacionBusqueda').click(function () {
    console.log("VALOR SELECCIONADO clasificación: " + $("#ClasificacionBusqueda").val());
    FiltraPeticiones();
});

$('#SubclasificacionBusqueda').click(function () {
    console.log("VALOR SELECCIONADO SubClasificación: " + $("#SubclasificacionBusqueda").val());
    FiltraPeticiones();
});

$('#OrigenBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#OrigenBusqueda").val());
    FiltraPeticiones();
});

$('#EstatusBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#EstatusBusqueda").val());
    FiltraPeticiones();
});

$('#HitoBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#HitoBusqueda").val());
    FiltraPeticiones();
});

$('#AsociacionBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#AsociacionBusqueda").val());
    FiltraPeticiones();
});

$('#DependenciaBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#DependenciaBusqueda").val());
    FiltraPeticiones();
});

$('#ResponsableBusqueda').click(function () {
    console.log("VALOR SELECCIONADO: " + $("#ResponsableBusqueda").val());
    FiltraPeticiones();
});

/*********************************************************************************************************************
 * FILTRAR Peticiones
 *********************************************************************************************************************/
function FiltraPeticiones() {
    //    var LegislaturaId = $("#LegBusqueda").val();
    var LegislaturaId = 2;

    var e = document.getElementById("selNumeroRegistrosXpagina");
    var RegXpag = e.options[e.selectedIndex].value;
    var offsetSolicitudes = 0;

    console.log("...Filtra Peticiones de Apoyo: -" + LegislaturaId + "-" + RegXpag + "-" + offsetSolicitudes + "-->" + $("#hideFechaInicioRegistro").val());

    GeneraTablaSolicitudApoyos(LegislaturaId, RegXpag, offsetSolicitudes);
}

/***************************************
 * Busqueda Rápida Peticiones
 ***************************************/
function BusqudaRapPeticiones() {
    var valorBR = $('#BRPeticionId').val().trim();
    $("#descripcionFiltro").val(valorBR);
    FiltraPeticiones()
}

$('#filtro_P').click(function () {
    console.log("BOTÓN DE FILTRO..................");
    $('#BRPeticionId').val("");
    $("#descripcionFiltro").val("");
});


/*********************************************************************************************************************
 * Muestra Tabla de Solicitud de Apoyos 
 *********************************************************************************************************************/
function GeneraTablaSolicitudApoyos(LegislaturaId, RegXpag, offsetPeticiones) {
    var indice = 0;
    var tablaHTML = "";

    var LegislaturaID = $("#LegBusqueda").val();
    var folio = $("#NumFolioBusqueda").val();
    var origenPeticion = $("#OrigenBusqueda").val();
    var nombreSolicitante = $("#solicitanteFiltro").val();
    var descripcion = $("#descripcionFiltro").val();
    var categoriaId = $("#ClasificacionBusqueda").val();
    var subCategoriaId = $("#SubclasificacionBusqueda").val();
    var estatusId = $("#EstatusBusqueda").val();
    var asociacionId = $("#AsociacionBusqueda").val();
    var dependenciaId = $("#DependenciaBusqueda").val();
    var responsableId = $("#ResponsableBusqueda").val();


    var hito = $("#HitoBusqueda").val();

    var fechaInicioSolicitud = $("#hideFechaInicioRegistro").val();
    var fechaFinSolicitud = $("#hideFechaFinRegistro").val();

    fechaInicioSolicitud = fechaInicioSolicitud == "" ? "0" : fechaInicioSolicitud;
    fechaFinSolicitud = fechaFinSolicitud == "" ? "0" : fechaFinSolicitud;


    var fechaInicioConclusion = $("#hideFechaInicioConclusion").val();
    var fechaFinConclusion = $("#hideFechaFinConclusion").val();

    console.log("Folio: " + folio);

    console.log("INICIO: " + fechaInicioSolicitud);
    console.log("FIN: " + fechaFinSolicitud);


    //console.log("Opción BUSQUEDA Origen: " + origenInciativa);

    //console.log("PARAMETROS: LegislaturaId: " + LegislaturaId + " numTurnoParam: " + numTurnoParam + " tipoIniciativaParam: " + tipoIniciativaParam + " estatusParam: " + estatusParam);

    tablaHTML += "<div class='table-responsive'>";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
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
        url: "/Apoyo/Peticiones/ObtienePeticiones",
        data: { RegXpag, offsetPeticiones, LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId, responsableId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                switch (val.estatusId){
                    case 2: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#D1D6D9;'>" + indice + "</td>";
                        break;
                    case 3: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#48C4F5;'>" + indice + "</td>";
                        break;
                    case 4: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#F96606;'>" + indice + "</td>";
                        break;
                    case 5: // VERDE - Entregado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#5EF711;'>" + indice + "</td>";
                        break;
                    case 6: // AZUL OBSCURO - RECHAZADO
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#FA2406;'>" + indice + "</td>";
                        break;
                    case 7: // VERDE OSCURO - No Procede
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1AA10C;'>" + indice + "</td>";
                        break;
                    case 8: // VERDE OSCURO - Reasignado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1AA10C;'>" + indice + "</td>";
                        break;
                }
                
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

                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:1px;'>$ " + val.costo + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasTranscurridos + "</td>";
                if (val.diasSolucion != -1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasSolucion + "</td>";
                } else {
                    tablaHTML += "<td></td>";
                }


                //tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                switch (val.estatusId) {
                    case 2: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#D1D6D9;'>";
                        break;
                    case 3: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#48C4F5;'>";
                        break;
                    case 4: // VERDE - Atendido
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#F96606;'>";
                        break;
                    case 5: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#5EF711;'>";
                        break;
                    case 6: // AZUL OBSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#FA2406;'>";
                        break;
                    case 7: // VERDE OSCURO - No Procede
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1AA10C;'>";
                        break;
                    case 8: // VERDE OSCURO - Reasignado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1AA10C;'>";
                        break;
                    default:
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#fff;'>";
                        break;
                }
                tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            tablaHTML += "</div>";

            $("#divIniciativas").html(tablaHTML);


        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroPeticiones",
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
        url: "/Apoyo/Peticiones/ObtieneNumeroPeticionesXfiltro",
        data: { LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId, responsableId },
        cache: false,
        async: false,
        success: (response) => {
            numeroRegistrosFiltrados = response;
            $("#hideNumRegistros").val(numeroRegistrosFiltrados);
        }
    });

    
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
                var LegislaturaId = $("#LegBusqueda").val();
                GeneraTablaSolicitudApoyos_2(LegislaturaId, RegXpag, RegXpag * (page - 1), page);
            }
        });
    } else {
        $("#hideNumPaginas").val(numPaginas);
        $('#pagina-solicitudes').twbsPagination('destroy');
    }

}


/*********************************************************************************************************************
 * Muestra Tabla de Solicitudes de Apoyo
 *********************************************************************************************************************/
function GeneraTablaSolicitudApoyos_2(LegislaturaId, RegXpag, offsetPeticiones, pagina) {
    var indice = 0;
    var tablaHTML = "";

    var LegislaturaID = $("#LegBusqueda").val();
    var folio = $("#NumFolioBusqueda").val();
    var origenPeticion = $("#OrigenBusqueda").val();
    var nombreSolicitante = $("#solicitanteFiltro").val();
    var descripcion = $("#descripcionFiltro").val();
    var categoriaId = $("#ClasificacionBusqueda").val();
    var subCategoriaId = $("#SubclasificacionBusqueda").val();
    var estatusId = $("#estatusIdFiltro").val();
    var asociacionId = $("#AsociacionBusqueda").val();
    var dependenciaId = $("#DependenciaBusqueda").val();
    var responsableId = $("#ResponsableBusqueda").val();

    var hito = $("#HitoBusqueda").val();

    var fechaInicioSolicitud = $("#hideFechaInicioRegistro").val();
    var fechaFinSolicitud = $("#hideFechaFinRegistro").val();

    fechaInicioSolicitud = fechaInicioSolicitud == "" ? "0" : fechaInicioSolicitud;
    fechaFinSolicitud = fechaFinSolicitud == "" ? "0" : fechaFinSolicitud;


    var fechaInicioConclusion = $("#hideFechaInicioConclusion").val();
    var fechaFinConclusion = $("#hideFechaFinConclusion").val();


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
        url: "/Apoyo/Peticiones/ObtienePeticiones",
        data: { RegXpag, offsetPeticiones, LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId, responsableId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                //indice = index + 1;
                indice = (pagina - 1) * RegXpag + index + 1;
                tablaHTML += "<tr>";
                switch (val.estatusId) {
                    case 2: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#D1D6D9;'>" + indice + "</td>";
                        break;
                    case 3: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#48C4F5;'>" + indice + "</td>";
                        break;
                    case 4: // VERDE - Atendido
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#F96606;'>" + indice + "</td>";
                        break;
                    case 5: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#5EF711;'>" + indice + "</td>";
                        break;
                    case 6: // AZUL OBSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#FA2406;'>" + indice + "</td>";
                        break;
                    case 7: // VERDE OSCURO - No Procede
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1AA10C;'>" + indice + "</td>";
                        break;
                    case 8: // VERDE OSCURO - Reasignado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-left-width:3px; border-left-color:#1AA10C;'>" + indice + "</td>";
                        break;
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fechaSolicitud + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.nombreCompleto + "</td>";

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
                    case 2: // AMARILLO  - Sin Asignar
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#D1D6D9;'>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                        break;
                    case 3: // AZUL CLARO - Solicitado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#48C4F5;'>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                        break;
                    case 4: // VERDE - Atendido
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#F96606;'>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                        break;
                    case 5: // NARANJA - Cancelado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#5EF711;'>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                        break;
                    case 6: // AZUL OBSCURO - En Proceso
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#FA2406;'>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                        break;
                    case 7: // VERDE OSCURO - No Procede
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1AA10C;'>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                        break;
                    case 8: // VERDE OSCURO - Reasignado
                        tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle; padding:1px; border-right-width:3px; border-right-color:#1AA10C;'>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Solicitud Apoyo'></span></a>";
                        tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Solicitud de Apoyo'></span></a>";
                        break;
                }
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            tablaHTML += "</div>";
            $("#divIniciativas").html(tablaHTML);


        }
    });

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/numeroPeticiones",
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
        url: "/Apoyo/Peticiones/ObtieneNumeroPeticionesXfiltro",
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
function mostrarModalDetalleSolicitud(PeticionId) {
    var indice = 0;
    var tablaHTML = "";
    $("#modalMuestraDatosSolicitud").appendTo("body");
    $("#modalMuestraDatosSolicitud").modal("show");

    $("#divDatosSolicitud").html("");
    $("#divCatSubCatNPeticion").html("");
    $("#divArchivosAnexosNPeticion").html("");
    $("#divBeneficiariosNPeticion").html("");
    $("#divBitacoraNPeticion").html("");

    /* DETALLE DE SOLICITUD DE APOYO */

    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtieneDetallePeticion",
        data: { PeticionId },
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

    $("#divDatosSolicitud").html(tablaHTML);

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
    var idPeticion = PeticionId;
    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/ObtieneListaCatSubCat",
        data: { idPeticion },
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
        $("#divCatSubCatNPeticion").html(tablaHTML);
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
        url: "/Apoyo/Peticiones/ObtieneListaArchivos",
        data: { idPeticion },
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
        $("#divArchivosAnexosNPeticion").html(tablaHTML);
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
        url: "/Apoyo/Peticiones/ObtieneListaBeneficiariosPeticionId",
        data: { idPeticion },
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
        $("#divBeneficiariosNPeticion").html(tablaHTML);
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
    tablaHTML += "Fecha Conclusion";
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
        url: "/Apoyo/Peticiones/ObtieneBitacoraPeticionId",
        data: { idPeticion },
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
        $("#divBitacoraNPeticion").html(tablaHTML);
    }
}


/*************************************************************************************
 *  Filtro Rango de fecha PETICIONES DE APOYO Registradas
 *************************************************************************************/
$(document).ready(function () {
    jQuery('#filtro_rangoRegistro').daterangepicker({
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
            FiltraPeticiones();
        }
    );
});

$('input[id="filtro_rangoRegistro"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('input[id="filtro_rangoRegistro"]').on('cancel.daterangepicker', function (ev, picker) {
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
$('#FolioPeticion').focusout(function () {
    var folio = $('#FolioPeticion').val();
    var legislaturaId = $('#LegPeticionNuevo').val();
    console.log("Salio de el campo de Numero de Turno --> " + folio);
    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/BuscaNumeroFolio",
        data: { folio, legislaturaId },
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


/*********************************************************************************************************
 * EDITA - Revisa que el número de Folio de Petición no exista en la BD
 *********************************************************************************************************/
$('#FolioPeticionEdicion').focusout(function () {
    var folio = $('#FolioPeticionEdicion').val();
    var folioOriginal = $('#FolioOriginal').val();

    if (folio == folioOriginal) { return };

    console.log("Cambio el Folio --> " + folioOriginal + " --> " + folio);
    $.ajax({
        type: "GET",
        url: "/Apoyo/Peticiones/BuscaNumeroFolio",
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
$('#ClasificacionBusqueda').click(function () {
    if ($('#ClasificacionBusqueda').val() == 0) {
        $("#SubclasificacionBusqueda").prop('disabled', true);
        return;
    }
    $("#SubclasificacionBusqueda").prop('disabled', false);
    clasificacionId = $("#ClasificacionBusqueda").val();                          // Obtiene la Legislatura seleccionada
    $("#SubclasificacionBusqueda").empty();
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
                $("#SubclasificacionBusqueda").append(new Option(item.text, item.value));
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
 *  RESUMEN APOYOS X CATEGORÍA X SUBCATEGORIA X ESTATUS
 ***********************************************************************/
function resumenApoyo_Cat_Subcat_Estatus(LegislaturaID, anioSel, mesSel) {
    var totalSinClasificacion = 0;
    var totalSolicitado = 0;
    var totalCancelado = 0;
    var totalEntregado = 0;
    var totalRechazado = 0;

    totalTotal = 0;

    tablaHTML = "<hr/>";
    tablaHTML += "<div align='center' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<h3>Solicitudes de Apoyos X Categoría-Subcategoría X Estatus</h3>";
    tablaHTML += "</div>";
    tablaHTML += "<hr/>";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<tbody>";
    tablaHTML += "<tr>";
    tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>#</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Categoría</td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>Subcategoría</td>";
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
        url: "/Apoyo/Peticiones/resumenXclasificacionXSubclasificacion_Apoyo",
        data: { LegislaturaID, anioSel, mesSel },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.categoria + "</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle;padding:5px;'>" + val.subcategoria + "</td>";
                if (val.sinEstatus != 0) {
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


                promedio = Math.round((val.cancelado + val.entregado + val.rechazado) * 100 / val.total);
                tablaHTML += "<td class='centrarVH' style='font-size:small;'>";
                tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
                tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
                tablaHTML += "</div>" + promedio + "%</td>";

                tablaHTML += "</tr>";

                totalSinClasificacion += val.sinClasificacion;
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
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;' colspan='2'><strong>TOTAL</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSinClasificacion + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalSolicitado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalCancelado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalEntregado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalRechazado + "</strong></td>";
    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><strong>" + totalTotal + "</strong></td>";

    promedio = Math.round((totalCancelado + totalEntregado + totalRechazado) * 100 / totalTotal);
    tablaHTML += "<td class='centrarVH'>";
    tablaHTML += "<div class='progress centrarV' style='height: 10px;'>";
    tablaHTML += "<div class='progress-bar bg-success' style='width:" + promedio + "%; height:20px;' title='" + promedio + "%' aria-valuenow='" + promedio + "'></div>";
    tablaHTML += "</div>" + promedio + "%</td>";

    tablaHTML += "</tr>";

    tablaHTML += "</tbody>";
    tablaHTML += "</table>";
    $("#CardClasificacionSubclasificacionApoyo").html(tablaHTML);
}


/****************************************************************
 *  BORRAR Categoría y Subcategoría Apoyo
 ****************************************************************/
function EliminaRowPeticionCatSubcat(idPeticion, peticionCategoriaId, peticionSubcategoriaId, categoriaId, subcategoriaId) {
    console.log("idPeticion: " + idPeticion);
    console.log("peticionCategoriaId: " + peticionCategoriaId);
    console.log("peticionSubCategoriaId: " + peticionSubcategoriaId);
    console.log("categoriaId: " + categoriaId);
    console.log("subcategoriaId: " + subcategoriaId);
    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/BorrarCategoriaSubCategoria",
        cache: false,
        async: false,
        data: { peticionCategoriaId, peticionSubcategoriaId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaCatSubCatNSolicitud(idPeticion);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}

/****************************************************************
 *  BORRAR Archivo Apoyo
 ****************************************************************/
function EliminaRowArchivoPeticion(archivoId, idPeticion) {
    console.log("archivoId: " + archivoId);
    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/BorrarArchivoPeticion",
        cache: false,
        async: false,
        data: { archivoId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaArchivosAnexosNSolicitud(idPeticion);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}

/****************************************************************
 *  BORRAR Beneficiario Apoyo
 ****************************************************************/
function EliminaRowBeneficiarioPeticion(peticionID, ciudadanoID, beneficiariosID) {
    console.log("peticionID: " + peticionID);
    console.log("ciudadanoID: " + ciudadanoID);
    console.log("beneficiariosID: " + beneficiariosID);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/BorrarBeneficiarioPeticion",
        cache: false,
        async: false,
        data: { beneficiariosID },
        success: (response) => {
            if (response == 1) {
                GeneraTablaBeneficiariosNSolicitud(peticionID);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}


/****************************************************************
 *  BORRAR Archivo Bitácora Apoyos
 ****************************************************************/
function EliminaArchivoBitacoraPeticion(archivosBitacoraId, bitacoraId, idPeticion) {
    console.log("archivosBitacoraId: " + archivosBitacoraId);
    console.log("bitacoraId: " + bitacoraId);
    console.log("idPeticion: " + idPeticion);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/BorrarArchivoBitacoraPeticion",
        cache: false,
        async: false,
        data: { archivosBitacoraId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaBitacoraNSolicitud(idPeticion);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}



/****************************************************************
 *  BORRAR Actividad Bitácora Apoyo
 ****************************************************************/
function EliminaRowBitacoraPeticion(bitacoraId, idPeticion) {

    console.log("bitacoraId: " + bitacoraId);
    console.log("idPeticion: " + idPeticion);

    $.ajax({
        type: "POST",
        url: "/Apoyo/Peticiones/BorrarActividadBitacoraPeticion",
        cache: false,
        async: false,
        data: { bitacoraId },
        success: (response) => {
            if (response == 1) {
                GeneraTablaBitacoraNSolicitud(idPeticion);
            } else {
                console.log("NO BORRO ");
            }
        }
    });
}

/*********************************************************************************************************************
 * SELECCIONA LEGISLATURA
 *********************************************************************************************************************/
$('#LegPeticionReferencia').click(function () {
    var LegRef = $('#LegPeticionReferencia').val();
    console.log("VALOR DE LEGISLATURA DE REFERNCIA: " + LegRef);
    $("#LegBusqueda").val(LegRef);
    FiltraPeticiones();
});

///************************************************
//  T A B 's
//*************************************************/
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



/**********************************************************************
 *  Click Desde DashBoard para Mostrar Beneficiarios de los Apoyos
 **********************************************************************/
function MuestraBeneficiariosApoyo() {
    var anioSel = $('#anioReporteId').val();
    var mesSel = $("#mesReporteId").val();
    var legislaturaId = $('#legislaturaId').val();
    window.location.href = "/Apoyo/Peticiones/Beneficiarios?LegislaturaID=" + legislaturaId + "&anioSel=" + anioSel + "&mesSel=" + mesSel;
}


/***********************************************************************
 * En Dashboard Selecciona MES
 ***********************************************************************/
$('#anioSelId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaId').val();

    anioSel = $('#anioReporteId').val();
    mesSel = $("#mesReporteId").val();

    console.log("MES = " + mesSel);

    Resumen(legislaturaId, anioSel, mesSel);
});

/***********************************************************************
 * En Dashboard Selecciona MES
 ***********************************************************************/
$('#mesSelId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaId').val();

    anioSel = $('#anioReporteId').val();
    mesSel = $("#mesReporteId").val();

    console.log("MES = " + mesSel);

    Resumen(legislaturaId, anioSel, mesSel);
});





/***********************************************************************
 * En BENEFICIARIOS Selecciona LEGISLATURA
 ***********************************************************************/
$('#legislaturaBenId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaBenId').val();

    anioSel = $('#anioBenId').val();
    mesSel = $("#mesBenId").val();

    console.log("MES = " + mesSel);

    window.location.href = "/Apoyo/Peticiones/Beneficiarios?LegislaturaID=" + legislaturaId + "&anioSel=" + anioSel + "&mesSel=" + mesSel;
});


/***********************************************************************
 * En BENEFICIARIOS Selecciona LEGISLATURA
 ***********************************************************************/
$('#anioBenId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaBenId').val();

    anioSel = $('#anioBenId').val();
    mesSel = $("#mesBenId").val();

    console.log("MES = " + mesSel);

    window.location.href = "/Apoyo/Peticiones/Beneficiarios?LegislaturaID=" + legislaturaId + "&anioSel=" + anioSel + "&mesSel=" + mesSel;
});


/***********************************************************************
 * En BENEFICIARIOS Selecciona LEGISLATURA
 ***********************************************************************/
$('#mesBenId').click(function () {
    var anioSel = 0;
    var mesSel = 0;
    var legislaturaId = $('#legislaturaBenId').val();

    anioSel = $('#anioBenId').val();
    mesSel = $("#mesBenId").val();

    console.log("MES = " + mesSel);

    window.location.href = "/Apoyo/Peticiones/Beneficiarios?LegislaturaID=" + legislaturaId + "&anioSel=" + anioSel + "&mesSel=" + mesSel;
});

