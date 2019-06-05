var hoffmannMap, baseLayers, overlayLayers;

// Overlay Layer mit GeoJSON
var standorteJSON = {
		"type": "FeatureCollection",
		"name": "standorte",
		"features": [
		{ "type": "Feature", "properties": { "id": 1, "Standort": "Delmenhorst", "Typ": "Hauptsitz" }, "geometry": { "type": "Point", "coordinates": [ 8.63577916047009, 53.042231176676147 ] } },
		{ "type": "Feature", "properties": { "id": 2, "Standort": "Bremen-Mitte", "Typ": "Filiale" }, "geometry": { "type": "Point", "coordinates": [ 8.817632722279082, 53.079164399449454 ] } },
		{ "type": "Feature", "properties": { "id": 5, "Standort": "Oldenburg", "Typ": "Filiale" }, "geometry": { "type": "Point", "coordinates": [ 8.227247890224806, 53.132030567409586 ] } },
		{ "type": "Feature", "properties": { "id": 4, "Standort": "Weyhe", "Typ": "Filiale" }, "geometry": { "type": "Point", "coordinates": [ 8.860994019945151, 52.988926456094539 ] } },
		{ "type": "Feature", "properties": { "id": 3, "Standort": "Cloppenburg", "Typ": "Filiale"}, "geometry": { "type": "Point", "coordinates": [ 8.052236450021846, 52.846415632237466 ] } }
		]
	};
	
// Render Funktionen
// Steuern des Pop-Ups
function hoffmannStandortePopUp(feature, layer) {
	if (feature.properties && feature.properties.Standort) {
		layer.bindPopup(feature.properties.Standort);
	}
}
	
// Eine Funktion um Kreismarker zu erzeugen
function circleMarker (feature, latlng) {
	return L.circleMarker(latlng);
}
	
// Eine Styling Funktion, die Feature Werte beachtet
function styleMarker(feature) {
	switch (feature.properties.Typ) {
		case 'Filiale': return {color: "#0000ff", bubblingMouseEvents:true};
		case 'Hauptsitz':   return {color: "#ff0000",bubblingMouseEvents:true};
	}
}

function initMap(event){
	hoffmannMap = L.map('HoffmannMap');
	hoffmannMap.setView([53.04229, 8.6335013],10, );

	var topPlusLayer = L.tileLayer.wms('http://sgx.geodatenzentrum.de/wms_topplus_open?', {format: 'image/png', layers: 'web', attribution: '&copy; <a href="http://www.bkg.bund.de">Bundesamt f&uuml;r Kartographie und Geod&auml;sie 2019</a>, <a href=" http://sg.geodatenzentrum.de/web_public/Datenquellen_TopPlus_Open.pdf">Datenquellen</a>'});
	var osmLayer = L.tileLayer.wms('http://maps.heigit.org/osm-wms/service?', {format: 'image/png', layers: 'osm_auto:all', attribution:'&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
	var cartodb = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'});
	var watercolor = L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://stamen.com/">Stamen</a>'});
	
	topPlusLayer.addTo(hoffmannMap);
	// Ezeugen eines baseLayers Objektes - key:value
	baseLayers = {
		"Top Plus": topPlusLayer,
		"Open Street Map": osmLayer,
		"Carto DB": cartodb,
		"Stamen Water": watercolor
	};	
	
	var standorteJSONLayer = L.geoJSON(standorteJSON, {pointToLayer: circleMarker, onEachFeature: hoffmannStandortePopUp, style: styleMarker});	
	// Erzeugen eines Overlay Layers Objektes - key:value
	overlayLayers = {
		"Standorte": standorteJSONLayer
	};
	
	// Erzeugen und Hinzufügen des Layer Controls
	layerControl = L.control.layers(baseLayers, overlayLayers);
	layerControl.addTo(hoffmannMap)
	
	// Erzeugen und Hinzufügen des Scale Controls
	scaleControl = L.control.scale({maxWidth:200, metric:true, imperial:false});
	scaleControl.setPosition('bottomleft');
	scaleControl.addTo(hoffmannMap);
	
	// Ergänzen der Attribution
	attributionControl = hoffmannMap.attributionControl;
	attributionControl.addAttribution("und die BO");

}

function adjustMap(position) {
	
	var lat = position.coords.longitude;
	var lon = position.coords.latitude;
	
	hoffmannMap.setView([lon, lat],10, );
}

document.addEventListener('DOMContentLoaded', initMap);

// Fehlermethode ist nicht notwendig
navigator.geolocation.getCurrentPosition(adjustMap);
