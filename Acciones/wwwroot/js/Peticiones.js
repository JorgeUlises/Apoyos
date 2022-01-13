
$('#FileUploadFormFileApoyos').on('change', function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);

    }
    $(this).next('.custom-file-label').html(files.join(', '));
    //var TmpPath = URL.createObjectURL(e.target.files[0]);
})




const onInputDescripcion = event => {
    event.target.value = event.target.value.replace(/[\'\"\&#\\]/g, '')
}

/*********************************************************************************************************
 * Guarda Nueva Petición
 *********************************************************************************************************/
function GuardarNuevaPeticion() {
    var DatosGuardados = false;
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
    if ($("#cboxHito").is(":checked")) {
        hito = 1;
    }


    console.log("origenSolicitud: " + origenSolicitud);
    console.log("fechaSolicitud: " + fechaSolicitud);
    console.log("fechaCompromiso: " + fechaCompromiso);
    console.log("fechaConclusion: " + fechaConclusion);
    console.log("estatus: " + estatus);
    console.log("solicitanteId: " + solicitanteId);
    console.log("asociacionId: " + asociacionId);
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
            origenSolicitud, folio, fechaSolicitud, fechaCompromiso, fechaConclusion, estatus, solicitanteId, asociacionId, descripcionSolicitud, hito
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
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Categoría y Subcategoria' onclick='EliminaRowPeticionCatSubcat(" + idPeticion + "," + val.peticionCategoriaId + "," + val.peticionSubCategoriaId + "," + val.categoriaId + "," + val.subcategoriaId + ");'></span></td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
        }
    });

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
                tablaHTML += "<td><span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowArchivo(" + val.archivoId + ");'></span></td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
        }
    });

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
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowBeneficiario(" + val.peticionID + "," + val.ciudadanoID + ");'></span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Actualiza el apoyo recibido' onclick='GuardaCambiosApoyoBeneficiario(" + val.peticionID + "," + val.ciudadanoID + "," + val.beneficiariosID + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
        }
    });

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
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='35%'>";
    tablaHTML += "Actividad";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Fecha Registro";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Fecha Compromiso";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Fecha Conclusion";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Responsable";
    tablaHTML += "</td>";

    tablaHTML += "<td style='text-align:center;padding:1px;' width='2%'>";
    tablaHTML += "<span style='font-size:18px; cursor:pointer' title='Agrega Espacio para nuevo registro de Categoría-Subcategoría' onclick='AgregaRowCatSubC(" + indice + ");'>+</span>";
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
                tablaHTML += "<td style='text-align:center;'>" + val.bitacoraBase.descripcion + "</td>";
                tablaHTML += "<td><input type='text' name = 'FR_Bitacora' id='FR_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + moment(val.bitacoraBase.fechaRegistro).format('DD/MM/yyyy') + "'/></td>";
                tablaHTML += "<td><input type='text' name = 'FC_Bitacora' id='FC_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + moment(val.bitacoraBase.fechaCompromiso).format('DD/MM/yyyy') + "'/></td>";
                tablaHTML += "<td><input type='text' name = 'FF_Bitacora' id='FF_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + moment(val.bitacoraBase.fechaConclusion).format('DD/MM/yyyy') + "'/></td>";

                tablaHTML += "<td>";
                tablaHTML += "<select id='SelEstatus_'" + val.bitacoraBase.bitacoraId + ">";
                tablaHTML += "<option value=''></option>";
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

                tablaHTML += "<td><input type='text' id='Responsable_" + val.bitacoraBase.bitacoraId + "' style='width:100%; max-width:100%;' value='" + val.bitacoraBase.responsable + "'/></td>";
                tablaHTML += "<td>";
                tablaHTML += "<span class='fas fa-trash-alt' style='font-size:18px; cursor:pointer' title='Elimina Archivo' onclick='EliminaRowBitacora(" + val.bitacoraBase.bitacoraId + "," + idPeticion + ");'></span>";
                tablaHTML += "<span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Actualiza el apoyo recibido' onclick='GuardaCambiosBitacora(" + val.bitacoraBase.bitacoraId + "," + idPeticion + ");'></span>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            //$('#divCatSubCatNPeticion tbody').append(tablaHTML);
        }
    });

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
    tablaHTML += "<div class='input-group date' id='dpBitacoraFC'>";
    tablaHTML += "<input asp-for='FC_Bitacora' name='FC_Bitacora' id='FC_BitacoraNva' class='form-control'/>";
    tablaHTML += "</div>";
    tablaHTML += "</td>";

    tablaHTML += "<td>";
    tablaHTML += "<div class='input-group date' id='dpBitacoraFF'>";
    tablaHTML += "<input asp-for='FF_Bitacora' name='FF_Bitacora' id='FF_BitacoraNva' class='form-control'/>";
    tablaHTML += "</div>";
    tablaHTML += "</td>";

    tablaHTML += "<td>";
    tablaHTML += "<select name='a' id='EstatusBitacora'>";
    tablaHTML += "<option value='0'></option>";
    tablaHTML += "<option value='1'>FINALIZADA</option>";
    tablaHTML += "<option value='2'>PROCESO</option>";
    tablaHTML += "<option value='3'>CANCELADA</option>";
    tablaHTML += "</select>";
    tablaHTML += "</td>";

    tablaHTML += "<td><input type='text' id='BitacoraResponsable' style='width:100%; max-width:100%;' value=''/></td>";
    tablaHTML += "<td><span class='fas fa-save' style='font-size:18px; cursor:pointer' title='Guardar Actividad' onclick='GuardaNvaActividadBitacora(" + idPeticion + ");'></span></td>";
    tablaHTML += "</tr>";

    tablaHTML += "</tbody'>";
    tablaHTML += "</table>";
    tablaHTML += "</div>";

    $("#divBitacoraNPeticion").html(tablaHTML);

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
 *  Guarda Actualización en Solicitud de Petición
 ************************************************************************************************************************/
function GuardarActualizacionPeticion(idPeticion) {
    var DatosGuardados = false;
    var origenSolicitud = $("#OrigenPeticion").val();
    var folio = $("#FolioPeticionEdicion").val();
    var SolicitanteOriginalId = $("#SolicitanteOriginalId").val();
    
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

    if (asociacionId == null || asociacionId==0) {
        asociacionId = 1;
    }

    console.log("idPeticion: " + idPeticion);
    console.log("origenSolicitud: " + origenSolicitud);
    console.log("folio: " + folio);
    console.log("SolicitanteOriginalId: " + SolicitanteOriginalId);
    
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
            idPeticion, origenSolicitud, folio, fechaSolicitud, fechaCompromiso, fechaConclusion, estatus, solicitanteId, asociacionId, descripcionSolicitud, hito
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
 * Muestra MODAL para Subir Archivo Anexo de Petiviones
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

/*********************************************************************************************************************
 * FILTRAR PETICIONES - Identifica opción seleccionada
 *********************************************************************************************************************/
$('#LegBusqueda').click(function () {
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

/*********************************************************************************************************************
 * FILTRAR Iniciativas
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


    var hito = $("#HitoBusqueda").val();

    var fechaInicioSolicitud = $("#hideFechaInicioRegistro").val();
    var fechaFinSolicitud = $("#hideFechaFinRegistro").val();

    fechaInicioSolicitud = fechaInicioSolicitud == "" ? "0" : fechaInicioSolicitud;
    fechaFinSolicitud = fechaFinSolicitud == "" ? "0" : fechaFinSolicitud;


    var fechaInicioConclusion = $("#hideFechaInicioConclusion").val();
    var fechaFinConclusion = $("#hideFechaFinConclusion").val();

    console.log("Folio: " + folio);

    //console.log("INICIO: " + fechaInicioRecibido);
    //console.log("FIN: " + fechaFinRecibido);


    //console.log("Opción BUSQUEDA Origen: " + origenInciativa);

    //console.log("PARAMETROS: LegislaturaId: " + LegislaturaId + " numTurnoParam: " + numTurnoParam + " tipoIniciativaParam: " + tipoIniciativaParam + " estatusParam: " + estatusParam);

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='13%' style='text-align:center;'>Fecha Registro</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Nombre Solicitante</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripcion</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Clasificación-Subclasificación</th>";
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
        data: { RegXpag, offsetPeticiones, LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice = index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fechaRegistro + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.nombreCompleto + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitud(" + val.peticionId + ");'>(" + val.peticionId + ") " + val.descripcion + "</span></td>";

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

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";

                //switch (val.estatusid) {
                //    case EstatusIniciativa.PENDIENTE:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_1.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.RECHAZADA_COMISION:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_2.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.APROBADA_COMISION:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_3.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.RECHAZADA_PLENO:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_4.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.APROBADA_PLENO:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_5.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.PUBLICADA_SA:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_6.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.SELECCIONADA_PARA_COMISION:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_16.png' alt='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.SELECCIONADA_PARA_PLENO:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_17.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.PUBLICADA_SA:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_5.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.BAJA:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Error.png' title='" + val.estatus + "' class='center-block responsive' height='25'/></td>";
                //        break;
                //    default:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";
                //        break;
                //}

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


    var hito = $("#HitoBusqueda").val();

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

    tablaHTML += "<table class='table table-bordered responsive-table' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%; background-color:#3f49b4; color:whitesmoke;'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='8%' style='text-align:center;'>Folio</th>";
    tablaHTML += "<th width='13%' style='text-align:center;'>Fecha Registro</th>";
    tablaHTML += "<th width='25%' style='text-align:center;'>Nombre Solicitante</th>";
    tablaHTML += "<th width='30%' style='text-align:center;'>Descripcion</th>";
    tablaHTML += "<th width='15%' style='text-align:center;'>Clasificación-Subclasificación</th>";
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
        data: { RegXpag, offsetPeticiones, LegislaturaID, origenPeticion, folio, hito, nombreSolicitante, descripcion, categoriaId, subCategoriaId, estatusId, fechaInicioSolicitud, fechaFinSolicitud, fechaInicioConclusion, fechaFinConclusion, asociacionId, dependenciaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                //indice = index + 1;
                indice = (pagina - 1) * RegXpag + index + 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.numFolio + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.fechaRegistro + "</td>";

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.nombreCompleto + "</td>";

                tablaHTML += "<td style='text-align: left; vertical-align: middle; padding:2px;'><span style='font-size:12px; cursor:pointer; color:blue; text-decoration: underline;' title='Detalle de Solicitud de Apoyo' onclick='mostrarModalDetalleSolicitud(" + val.peticionId + ");'>(" + val.peticionId + ") " + val.descripcion + "</span></td>";

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

                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";

                //switch (val.estatusid) {
                //    case EstatusIniciativa.PENDIENTE:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_1.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.RECHAZADA_COMISION:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_2.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.APROBADA_COMISION:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_3.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.RECHAZADA_PLENO:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_4.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.APROBADA_PLENO:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_5.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.PUBLICADA_SA:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_6.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.SELECCIONADA_PARA_COMISION:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_16.png' alt='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.SELECCIONADA_PARA_PLENO:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_17.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.PUBLICADA_SA:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Estatus_5.png' title='" + val.estatus + "' class='center-block responsive' height='20'/></td>";
                //        break;
                //    case EstatusIniciativa.BAJA:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'><img src='/Estadistica/IMAGES/Error.png' title='" + val.estatus + "' class='center-block responsive' height='25'/></td>";
                //        break;
                //    default:
                //        tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.estatus + "</td>";
                //        break;
                //}


                if (val.diasSolucion != -1) {
                    tablaHTML += "<td></td>";
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasSolucion + "</td>";
                } else {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.diasTranscurridos + "</td>";
                    tablaHTML += "<td></td>";
                }

                tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                tablaHTML += "<a href='/Apoyo/Peticiones/Edit/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit fa-lg' title='Edita datos de Solicitud Apoyo'></span></a>";
                tablaHTML += "<a href='/Apoyo/Peticiones/Delete/" + val.peticionId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash fa-lg' title='Elimina Solicitud de Apoyo'></span></a>";
                tablaHTML += "</td>";
                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
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
                tablaHTML += "<td style='text-align: center; vertical-align: middle;' class='fondoAzul_p_LetraNegra_3' width='30%'>Solicitante</td>";
                tablaHTML += "<td style='text-align: left; vertical-align: middle; background-color: white; color: black; padding: 1px; ' width='70%'>" + val.solicitanteNombre + "</td>";
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
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='90%'>Descripción</td>";
                tablaHTML += "<td style='text-align: center; padding: 5px;' class='fondoAzul_p_LetraNegra_3v' width='10%'>Hito</td>";
                tablaHTML += "</tr>";
                tablaHTML += "<tr>";
                tablaHTML += "<td style='text-align: center; background-color: white; color: black; padding: 2px;' width='90%'>" + val.descripcion + "</td>";
                if (val.hito == 1) {
                    tablaHTML += "<td style='text-align: center; vertical-align: middle; background-color: white; color: black; padding: 2px;' width='10%'>";
                    tablaHTML += "<img src='Images/checkbox.png' height='20' />";
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
    tablaHTML += "Fecha Compromiso";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Fecha Conclusion";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='10%'>";
    tablaHTML += "Estatus";
    tablaHTML += "</td>";
    tablaHTML += "<td style='text-align:center; background-color:white; color:black; padding:1px;' width='20%'>";
    tablaHTML += "Responsable";
    tablaHTML += "</td>";

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
                tablaHTML += "<td style='text-align:center;'>" + val.bitacoraBase.descripcion + "</td>";
                tablaHTML += "<td>" + moment(val.bitacoraBase.fechaRegistro).format('DD/MM/yyyy') + "</td>";
                tablaHTML += "<td>" + moment(val.bitacoraBase.fechaCompromiso).format('DD/MM/yyyy') + "</td>";
                tablaHTML += "<td>" + moment(val.bitacoraBase.fechaConclusion).format('DD/MM/yyyy') + "</td>";
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

                tablaHTML += "<td>" + val.bitacoraBase.responsable + "</td>";
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
    console.log("Salio de el campo de Numero de Turno --> " + folio);
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

/*
  T A B 's
*/
var app = new Vue({
    el: '#app',

    mounted: function () {
        document.querySelector('#myTab').addEventListener('mousewheel', (e) => {
            document.querySelector('#myTab').scrollLeft = document.querySelector('#myTab').scrollLeft + e.deltaY;
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    },
});