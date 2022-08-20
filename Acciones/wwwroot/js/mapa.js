var map;

var mapLat = 20.553002;
var mapLng = -100.380265;
var mapDefaultZoom = 14;

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


var element = document.getElementById('popup');

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

/****************************************
 * Mapa Publicidad
 ****************************************/
function initialize_mapPublicidad() {

    console.log("initialize_mapPublicidad()");
    $("#map").html("");

    $("#cardMapaCiudadanos").hide();
    if ($("#cardMapa").is(":visible")) {
        $("#cardMapa").hide();
        return;
    } else {
        $("#cardMapa").show();
    }
     
    map = new ol.Map({
        target: "map",
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                })
            })
        ],
        overlays: [overlay],
        view: new ol.View({
            center: ol.proj.fromLonLat([mapLng, mapLat]),
            zoom: mapDefaultZoom
        }),
    });

    getPoints();

    var popup = new ol.Overlay.Popup;
    popup.setOffset([0, 0]);
    map.addOverlay(popup);

    map.on('click', function (evt) {
        console.log("click");
        var f = map.forEachFeatureAtPixel(
            evt.pixel,
            function (ft, layer) { return ft; }
        );
        if (f && f.get('type') == 'click') {
            var geometry = f.getGeometry();
            var coord = geometry.getCoordinates();

            var content = "";

            content += "<img class='imgBorder' src='" + f.get('url') + "' height='60' />";
            content += "<p><a href='/Apoyo/Ciudadanoes/DetalleCiudadano?id=" + f.get('ciudadanoId') + "'>" + f.get('nombre') + '</a></p>';
            content += "<p><a href='tel:" + f.get('telefono') + "'>" + f.get('telefono') + "</a></p>";
            content += "<p>" + f.get('colonia') + "</p>";
            content += "<p>" + f.get('calle') + " " + f.get('numero') + "</p>";
            content += "<p>" + f.get('tamaño') + "</p>";
            content += "<p>" + f.get('tipoPub') + "</p>";

            content += "<div class='row'>"
            if (f.get("logo").length > 0) {
                content += "<p>" + "<img src='/Apoyo/Images/" + f.get("logo") + "' height='20' style='border-radius: 0px; padding: 0px;'/>" + "</p>";
            }
            if (f.get('digital') == 1) {
                content += "&nbsp<img src='/Apoyo/Images/logo_DD.jpg' height='30'/>";
            }
            content += "</div>"

            popup.show(coord, content);

        } else { popup.hide(); }

    });


}

function getPoints() {
    var m = $("#hiddeCoordenadas").val();
    //console.log(m);
    var markers = eval(m);
    
    for (i = 0; i < markers.length; i++) {
        var data = markers[i];

        add_map_point(data.folio, data.nombre, data.tamaño, data.notas, data.colonia, data.calle, data.numero, data.cp, data.latitud, data.longitud, data.url, data.ciudadanoId, data.telefono, data.tipoPub, data.partido, data.logo);
        console.log(i + "NOMBRE: " + data.nombre + "  LATITUD: " + data.latitud + " LONGITUD: " + data.longitud + " CiudadanoId: " + data.ciudadanoId);
    }
}

function add_map_point(folio, nombre, tamaño, notas, colonia, calle, numero, cp, latitud, longitud, url, ciudadanoId, telefono, tipoPub, partido, logo) {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([parseFloat(longitud), parseFloat(latitud)], 'EPSG:4326', 'EPSG:3857')),
                    folio: folio,
                    nombre: nombre,
                    tamaño: tamaño,
                    notas: notas,
                    colonia: colonia,
                    calle: calle,
                    numero: numero,
                    cp: cp,
                    url: url,
                    ciudadanoId: ciudadanoId,
                    telefono: telefono,
                    tipoPub: tipoPub,
                    partido: partido,
                    logo: logo,
                    type: 'click'
                })]
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.3, 0.3],
                    anchorXUnits: "fraction",
                    anchorYUnits: "fraction",
                    //size: [100, 100],
                    scale: 1.0,
                    //src: "/Apoyo/images/b.svg"
                    src: "/Apoyo/images/cafe.png"
                })
            }),
        });

    map.addLayer(vectorLayer);
}

/****************************************
 * Mapa con Ciudadanos y Publicidad 
 ****************************************/
function initialize_mapPublicidadYciudadanos() {

    $("#mapCiudadano").html("");
    $("#cardMapa").hide();

    if ($("#cardMapaCiudadanos").is(":visible")) {
        $("#cardMapaCiudadanos").hide();
        return;
    } else {
        $("#cardMapaCiudadanos").show();
    }

    mapCiudadano = new ol.Map({
        target: "mapCiudadano",
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                })
            })
        ],
        overlays: [overlay],
        view: new ol.View({
            center: ol.proj.fromLonLat([mapLng, mapLat]),
            zoom: mapDefaultZoom
        }),
    });

    getPoints_2();

    var popup = new ol.Overlay.Popup;
    popup.setOffset([0, 0]);
    mapCiudadano.addOverlay(popup);

    mapCiudadano.on('click', function (evt) {
        console.log("click");
        var f = mapCiudadano.forEachFeatureAtPixel(
            evt.pixel,
            function (ft, layer) { return ft; }
        );
        if (f && f.get('type') == 'click') {
            var geometry = f.getGeometry();
            var coord = geometry.getCoordinates();

            var content = "";

            content += "<img class='imgBorder' src='" + f.get('url') + "' height='60' />";
            content += "<p><a href='/Apoyo/Ciudadanoes/DetalleCiudadano?id=" + f.get('ciudadanoId') + "'>" + f.get('nombre') + '</a></p>';
            content += "<p><a href='tel:" + f.get('telefono') + "'>" + f.get('telefono') + "</a></p>";
            content += "<p>" + f.get('colonia') + "</p>";
            content += "<p>" + f.get('calle') + " " + f.get('numero') + "</p>";
            content += "<p>" + f.get('tamaño') + "</p>";
            content += "<p>" + f.get('tipoPub') + "</p>";

            content += "<div class='row'>"
            if (f.get("logo").length > 0) {
                content += "<p>" + "<img style='border:0px; border-radius:0px; padding:0px;' src='/Apoyo/Images/" + f.get("logo") + "' height='20' />" + "</p>";
            }

            if (f.get('afin') == 1) {
                content += "&nbsp<img style='border:0px; border-radius:0px; padding:0px;' src='/Apoyo/Images/checkbox.png' height='20'/>";
            }
            if (f.get('digital') == 1) {
                content += "&nbsp<img style='border:0px; border-radius:0px; padding:0px;' src='/Apoyo/Images/logo_DD.jpg' height='30'/>";
            }
            if (f.get('lider') > 0) {
                content += "&nbsp<img style='border:0px; border-radius:0px; padding:0px;' src='/Apoyo/Images/lider_t.png' height='30'/>";
            }
            content += "</div>"

            popup.show(coord, content);

        } else { popup.hide(); }

    });


}

function getPoints_2() {
    var m = $("#hiddeCoordenadas_2").val();
    //console.log(m);
    var markers = eval(m);

    for (i = 0; i < markers.length; i++) {
        var data = markers[i];
        if (data.digital == 1) {
            if (data.partido == 'PAN') {
                data.icono = '/Apoyo/images/DD_azul_17x27.gif';
            } else {
                data.icono = '/Apoyo/images/DD_verde_17x27.gif';
            }
        }

        var imgDisplay = "";
        var escalaImg = 1;

        if (data.digital == 0) {
            if (data.lider > 0) {
                if (data.afin == 1 || data.partido == 'PAN') {
                    data.icono = "/Apoyo/Images/AzulMar.png";        // Líder + Afin or PAN
                    escalaImg = 0.8;
                } else {
                    data.icono = "/Apoyo/Images/rojo.png";        // Líder
                    escalaImg = 0.8;
                }
            } else {
                if (data.afin == 1) {
                    if (data.partido == "PAN") {
                        data.icono = "/Apoyo/Images/Verde.png";        // Afin - PAN
                        escalaImg = 0.8;
                    } else {
                        data.icono = "/Apoyo/Images/turqueza.png";        // Afin
                        escalaImg = 0.8;
                    }
                } else {
                    if (data.partido == "PAN") {
                        data.icono = "/Apoyo/Images/morado.png";        // No Afin - PAN
                        escalaImg = 0.8;
                    } else {
                        data.icono = "/Apoyo/Images/rosa.png";        // No Afin
                        escalaImg = 0.8;
                    }
                }
            }
        } else {
            if (data.partido == "PAN") {
                data.icono = "/Apoyo/Images/Azul.png";              // Digital - PAN
                escalaImg = 1.4;
            } else {
                data.icono = "/Apoyo/Images/Naranja.png";         // Digital
                escalaImg = 1.4;
            }
        }

        if (data.tipoDato == 'Promocional') {
            //data.icono = "/Apoyo/images/b.svg";         // Promocional
            data.icono = "/Apoyo/images/cafe.png";         // Promocional
            escalaImg = 1.4;
        }

        add_map_point_2(data.folio, data.nombre, data.tamaño, data.notas, data.colonia, data.calle, data.numero, data.cp, data.latitud, data.longitud, data.url, data.ciudadanoId, data.telefono, data.tipoPub, data.partido, data.logo, data.icono, data.escala, data.digital, data.lider, data.afin);
        //console.log(i + "NOMBRE: " + data.nombre + "  LATITUD: " + data.latitud + " LONGITUD: " + data.longitud + " CiudadanoId: " + data.ciudadanoId);
    }
}

function add_map_point_2(folio, nombre, tamaño, notas, colonia, calle, numero, cp, latitud, longitud, url, ciudadanoId, telefono, tipoPub, partido, logo, icono, escala, digital, lider, afin) {
    var factor = 1.0;
    //if (escala == 1) {
    //    factor = 0.4;
    //}
    //else {
    //    factor = 0.6;
    //}

    console.log("FACTOR: " + factor);
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(longitud), parseFloat(latitud)], 'EPSG:4326', 'EPSG:3857')),
                folio: folio,
                nombre: nombre,
                afin: afin,
                tamaño: tamaño,
                notas: notas,
                colonia: colonia,
                calle: calle,
                numero: numero,
                cp: cp,
                url: url,
                ciudadanoId: ciudadanoId,
                telefono: telefono,
                tipoPub: tipoPub,
                partido: partido,
                logo: logo,
                digital: digital,
                lider: lider,
                type: 'click'
            })]
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                //size: [100, 100],
                scale: factor,
                //src: "/Apoyo/images/b.svg"
                src: icono
            })
        }),
    });

    mapCiudadano.addLayer(vectorLayer);
}

