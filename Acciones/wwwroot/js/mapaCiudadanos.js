var map;

var mapLat = 20.553002;
var mapLng = -100.380265;
var mapDefaultZoom = 14;

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


var element = document.getElementById('popup');

var vectorLayer;

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

//closer.onclick = function () {
//    overlay.setPosition(undefined);
//    closer.blur();
//    return false;
//};

function actualizaMapa() { 
    var afin = 0;
    var panista = 0;
    var ddigital = 0;
    var lider = 0;

    if ($("#cb_Afin").is(":checked")) {
        afin = 1;
    }

    if ($("#cb_Panistas").is(":checked")) {
        panista = 1;
    }

    if ($("#cb_Ddigital").is(":checked")) {
        ddigital = 1;
    }

    if ($("#cb_lider").is(":checked")) {
        lider = 1;
    }

    console.log("Afin = " + afin + " Panista = " + panista + " Ddigital = " + ddigital + " Lider = " + lider);

    //var m = -1;
    //var nomLayer = "";
    var numLayers = map.getLayers().getLength() + 1;
    for (x = 0; x < numLayers; x++) {
        map.getLayers().forEach(layer => {
            //nomLayer = 'source_tiles_' + m;
            //console.log("NOMBRE de LAYER: " + nomLayer + " ------>" + layer.get('name'));
            if (layer && layer.get('name') !== undefined) {
                if (layer && layer.get('name').includes('source_tiles_')) {
                    //      console.log("  R E M O V E : " + layer.get('name'));
                    map.removeLayer(layer);
                }
            }
            //      m = m + 1;
        });
    }


    $.ajax({
        type: "GET",
        url: "/Apoyo/Reportes/SeleccionaUbicacionCiudadanos",
        data: { afin, panista, ddigital, lider },
        cache: false,
        async: false,
        success: (response) => {
            var m = response;
            var markers = eval(m);

            $('#numeroDatos').text(markers.length);

            for (i = 0; i < markers.length; i++) {
                var data = markers[i];
                add_map_pointCiudadano(i, data.lat, data.lng, data.title, data.afin, data.telefono, data.foto, data.ciudadanoId, data.colonia, data.calle, data.numero, data.cp, data.partido, data.logo, data.digital, data.lider);
                //console.log(i + " - NOMBRE: " + data.title + "  LATITUD: " + data.lat + " LONGITUD: " + data.lng + " CiudadanoId: " + data.ciudadanoId);
            }

            setCurrentPosition();
        }
    });
}




function initialize_mapCiudadanoUbicacion() {
    console.log("EN .............. initialize_mapCiudadanoUbicacion");
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

            content += "<img src='" + f.get('foto') + "' height='60' />";
            content += "<p><a href='/Apoyo/Ciudadanoes/DetalleCiudadano?id=" + f.get('ciudadanoId') + "'>" + f.get('nombre') + '</a></p>';
            content += "<p><a href='tel:" + f.get('tel') + "'>" + f.get('tel') + "</a></p>";
            content += "<p>" + f.get('colonia') + "</p>";
            content += "<p>" + f.get('calle') + ", " + f.get('numero') + "</p>";
            content += "<div class='row'>"
            if (f.get("logo").length > 0) {
                content += "<p>" + "<img src='/Apoyo/Images/" + f.get("logo") + "' height='20' />" + "</p>";
            }

            if (f.get('afin') == 1) {
                content += "&nbsp<img src='/Apoyo/Images/checkbox.png' height='20'/>";
            }
            if (f.get('digital') == 1) {
                content += "&nbsp<img src='/Apoyo/Images/logo_DD.jpg' height='30'/>";
            }
            if (f.get('lider') > 0) {
                content += "&nbsp<img src='/Apoyo/Images/lider_t.png' height='30'/>";
            }
            content += "</div>"
            popup.show(coord, content);

        } else { popup.hide(); }

    });

    setCurrentPosition();
}

function getPoints() {
    var m = $("#hiddeUbicacionCiudadanos").val();
    var markers = eval(m);


    $('#numeroDatos').text(markers.length);
    for (i = 0; i < markers.length; i++) {
        var data = markers[i];
        add_map_pointCiudadano(i, data.lat, data.lng, data.title, data.afin, data.telefono, data.foto, data.ciudadanoId, data.colonia, data.calle, data.numero, data.cp, data.partido, data.logo, data.digital, data.lider);
        //console.log(i + " - NOMBRE: " + data.title + "  LATITUD: " + data.lat + " LONGITUD: " + data.lng + " CiudadanoId: " + data.ciudadanoId);
    }
}

function add_map_pointCiudadano(n, lat, lng, label, afin, tel, foto, ciudadanoId, colonia, calle, numero, cp, partido, logo, digital, lider) {
    //console.log("ADD_MAP_POINT: " + n + "  " + label + "  " + lat + "  " + lng);
    var imgDisplay = "";
    var escalaImg = 1;

    if (digital == 0) {
        if (lider > 0) {
            if (afin == 1 || partido == 'PAN') {
                imgDisplay = "/Apoyo/Images/AzulMar.png";        // Líder + Afin or PAN
                escalaImg = 0.8;
            } else {
                imgDisplay = "/Apoyo/Images/rojo.png";        // Líder
                escalaImg = 0.8;
            }
        } else {
            if (afin == 1) {
                if (partido == "PAN") {
                    //imgDisplay = "/Apoyo/Images/ubicacion.svg";
                    imgDisplay = "/Apoyo/Images/Verde.png";        // Afin - PAN
                    escalaImg = 0.8;
                } else {
                    imgDisplay = "/Apoyo/Images/turqueza.png";     // Afin
                    escalaImg = 0.8;
                }
            } else {
                if (partido == "PAN") {
                    imgDisplay = "/Apoyo/Images/morado.png";        // No Afin - PAN
                    escalaImg = 0.8;
                } else {
                    //imgDisplay = "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg";  // NoAfin
                    imgDisplay = "/Apoyo/Images/rosa.png";        // No Afin
                    escalaImg = 0.8;
                }
            }
        }
    } else {
        if (partido == "PAN") {
            //imgDisplay = "/Apoyo/Images/DD_azul_17x27.gif";              // Digital - PAN
            imgDisplay = "/Apoyo/Images/azul.png";              // Digital - PAN
            escalaImg = 0.8;
        } else {
            //imgDisplay = "/Apoyo/Images/DD_verde_17x27.gif";         // Digital
            imgDisplay = "/Apoyo/Images/naranja.png";         // Digital
            escalaImg = 0.8;
        }
    }

    vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
                name: label,
                title: label,
                nombre: label,
                afin: afin,
                tel: tel,
                foto: foto,
                colonia: colonia,
                calle: calle,
                numero: numero,
                cp: cp,
                ciudadanoId: ciudadanoId,
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
                scale: escalaImg,
                //src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
                //src: "/Apoyo/Images/ubicacion.svg"
                src: imgDisplay
            })
        }),
    });
    var naL = "";
    naL = 'source_tiles_' + n;
    console.log("SET NAME: " + naL);
    vectorLayer.set('name', naL);

    map.addLayer(vectorLayer);
}


function setCurrentPosition() {
    var lat;
    var lng;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            console.log("LATITUD-->" + lat + "     LONGITUD-->" + lng);
            vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
                    })]
                }),
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        anchorXUnits: "fraction",
                        anchorYUnits: "fraction",
                        scale: 1.5,
                        src: "//img.icons8.com/officexs/16/000000/filled-flag.png"
                    })
                }),
            });
            map.addLayer(vectorLayer);
        })
    }
}