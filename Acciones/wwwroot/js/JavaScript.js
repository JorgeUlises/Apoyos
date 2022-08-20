function lD() {
    var prefijo = "";

    $.ajax({
        type: "GET",
        url: "/Apoyo/Home/prefijo",
        cache: false,
        async: false,
        success: (response) => {
            
            $.each(response, (index, val) => {
                $("head").append(val.trim());
                console.log("val: " + val);
            });
        }
    });

    //var js1 = "<script src='" + prefijo + "/site.js'></script>";
    //var js2 = "<script src='" + prefijo + "/Ciudadanos.js'></script>";
    //var js3 = "<script src='" + prefijo + "/Peticiones.js'></script>";
    //var js4 = "<script src='" + prefijo + "/Gestiones.js'></script>";
    //var js5 = "<script src='" + prefijo + "/Eventos.js'></script>";
    //var js6 = "<script src='" + prefijo + "/Asociaciones.js'></script>";
    //var js7 = "<script src='" + prefijo + "/Colonias.js'></script>";

    //console.log("js1: " + js1);

    //$("body").append(js1);
    //$("body").append(js2);
    //$("body").append(js3);
    //$("body").append(js4);
    //$("body").append(js5);
    //$("body").append(js6);
    //$("body").append(js7);

}
$(function () {
    lD();
});