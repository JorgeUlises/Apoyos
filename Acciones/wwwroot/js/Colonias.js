/*********************************************************************************************************************
Tabla de Calles de una Colonia
 *********************************************************************************************************************/
function CallesDeColonia(coloniaId) {
    var indice = 0;
    var tablaHTML = "";

    tablaHTML += "<table class='table table-bordered' style = 'width:100%;padding: 1px;'>";
    tablaHTML += "<thead>";
    tablaHTML += "<tr style='text-align:center; width:98%;' class='fondoAzulClaroLetraNegra_2'>";
    tablaHTML += "<th width='2%' style='border-radius: 10px 0px 0px 10px; text-align:center;'>#</th>";
    tablaHTML += "<th width='10%' style='text-align:center;'>Calle</th>";
    //tablaHTML += "<th width='10%' style='text-align:center;'></th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";

    tablaHTML += "<tbody>";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Calles/ObtieneCalles",
        data: { coloniaId },
        cache: false,
        async: false,
        success: (response) => {
            $.each(response, (index, val) => {
                indice += 1;
                tablaHTML += "<tr>";
                tablaHTML += "<td scope='row' style='text-align: center; vertical-align: middle;padding:1px;'>" + indice + "</td>";
                tablaHTML += "<td style='text-align: center; vertical-align: middle;padding:1px;'>" + val.nombreCalle + "</td>";
                //tablaHTML += "<td style='text-align: center; vertical-align: middle;'>";
                //tablaHTML += "<a href='/Apoyo/Calles/Edit/" + val.calleId + "'><span style='cursor: pointer; color:black;' class='fas fa-edit' title='Edita datos de Ciudadano'></span></a>";
                //tablaHTML += "<a href='/Apoyo/Calles/Delete/" + val.calleId + "'><span style='cursor: pointer; color:black;' class='fas fa-trash' title='Elimina Registro de Ciudadano'></span></a>";
                //tablaHTML += "</td>";

                tablaHTML += "</tr>";
            });
            tablaHTML += "</tbody>";
            tablaHTML += "</table>";
            $("#divCallesDeColonia").html(tablaHTML);
        }
    });
}