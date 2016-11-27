﻿
// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = []; //It's core array and used to locate markers on the map
var DbMarkers = []; //It's temporary array and used to clear all db markers on the map
var myArr = [];
var DbStatus = 0;
var dmlApiStatus = 0;
var ClearMultiDbLines = []; //This's core. It's used both to draw and clear lines
var ClearMultiDbPolygones = []; //This's core. It's used both to draw and clear polygons
var myLineList = []; //It's used to populate Line Control Panel
var myPolygonList = []; //It's used to populate Polygon Control Panel
var dmlServer = document.location.protocol + "//" + document.location.host + '/' + window.location.pathname;

$(document).ready(function () {
	var myLocation = $(location).attr('href');
	CallHandler(myLocation);
	// End of Document Ready
});

//****GET DATA AJAX START
function CallHandler(myLocation) {
	var mySaveString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=start&url=" + myLocation + "&CntID=1";
	var savecenter = {};
	savecenter.url = mySaveString;
	savecenter.type = "POST";
	savecenter.data = {};
	savecenter.cache = false;
	savecenter.processData = false;
	savecenter.success = function (result) {
		if (result == 1) {
			// There is table without data. So, shows API panel
			$("#dmlMapContainer").hide();
			$("#dmlApiDiv").show();
		} else if (result == 0) {
			alert("Unknown error");
		} else {
			myArr = $.parseJSON(result);
			var myLenght = myArr.length;
			if (myLenght == 0) {
				// There is table without data. So, shows API panel
				$("#dmlMapContainer").hide();
				$("#dmlApiDiv").show();
			} else {
				if (dmlApiStatus == 0){
					LoadDmlMapApi(myArr[0].CntField3);
				} else {
					dmlLoadMap();
				}

				$("#dmlMapContainer").show();
				$("#dmlApiDiv").hide();
			}
		}
	};
	savecenter.error = function (err) { alert(err.statusText); };
	$.ajax(savecenter);
	event.preventDefault();
}
function LoadDmlMapApi(myApi){
	var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + myApi + "&callback=dmlLoadMap";
	script.id = "dmlMapApi";
	//script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
	dmlApiStatus = 1;
}
function dmlLoadMap(){
	var myMapType = myArr[0].CntField5;
	if (myMapType == "1" || myMapType == "2" || myMapType == "3"){
		initMap(myMapType);
	} else {
		loadJSON2(myMapType);
	}
}
function loadJSON2(myStyleNu) {
   		var myStyleFile = dmlServer + "/dmlmap/styles/style" + myStyleNu + ".json";
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', myStyleFile, true); // Replace 'my_data' with the path to your file
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				initMap(xobj.responseText);
			}
		};
		xobj.send(null);

}
function initMap(myStyle) {
	if (DbStatus == 0) {
		$("#map").attr('style', 'width: 100%; height: ' + myArr[0].CntField4 + 'px; margin: 0; padding: 0;');
		var haightAshbury = { lat: parseFloat(myArr[0].CntField1), lng: parseFloat(myArr[0].CntField2) };


		if (myStyle == "1" || myStyle == "2" || myStyle == "3"){
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: parseInt(myArr[0].CntField8),
				center: haightAshbury,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
			});

			// Determines map type
			if (myStyle == "1") {
				//Displays a normal, default 2D map
				map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			} else if (myStyle == "2") {
				//Displays a photographic map
				map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
			} else if (myStyle == "3") {
				//Displays a map with mountains, rivers, etc.
				map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
			}
		} else {
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: parseInt(myArr[0].CntField8),
				center: haightAshbury,
				styles: JSON.parse(myStyle),
			});
		}

		DbStatus = 1;

		// This event listener will call addMarker() when the map is clicked.
		if ($("#myMap1Edit").html() == 1) {
			map.addListener('click', function (event) {
				addMarker(event.latLng);
			});
		}
		//FILLING MAPHOLDER_ID
		$("#Map1idHolder").html(myArr[0].CntID + '_0_7_' + myArr[0].CntField3 + '_' + myArr[0].CntField4 + '_' + myArr[0].CntField5 + '_' + myArr[0].CntField6 + '_' + myArr[0].CntField8);

		//CLICK ON THE MAP WHEN LOGGEDIN
		google.maps.event.addListener(map, 'click', function (e) {
			$("#LblSonuc").html("");
			if ($("#myMap1Edit").html() == 1) {
				myDeger1 = e.latLng.lat();
				myDeger2 = e.latLng.lng();
				$("#Text1").val(myDeger1);
				$("#Text2").val(myDeger2);


				var position = $("#Repeater1Map").position();

				var y1 = position.top + 44;
				var x1 = position.left + 20;
				$("#BtnSettings").css({ position: "absolute", top: y1 + "px", left: x1 + "px" }).show();
				var y2 = position.top + 44;
				var x2 = position.left + 64;
				$("#BtnDmlMapRefresh").css({ position: "absolute", top: y2 + "px", left: x2 + "px" }).show();

				$("#idholder").html(myArr[0].CntID + "_0_7");
			}
		});
	}

	// Adds a markers at the map.
	addMarkers();
	addLines();
	addPolygons();
}
function addMarkers() {
	var infowindow = new google.maps.InfoWindow({});
	var marker, i;
	var imagePath = dmlServer + '/dmlmap/icons/';
	for (i = 1; i < myArr.length; i++) {

		marker = new google.maps.Marker({
			position: new google.maps.LatLng(myArr[i].CntField1, myArr[i].CntField2),
			map: map,
			icon: imagePath + myArr[i].CntField6 + ".png"
		});

		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				if ($("#myMap1Edit").html() == 1) {
					infowindow.setContent('<strong><span id="' + myArr[i].CntID + '_H">' + myArr[i].CntField3 + '</span></strong><br><span id="' + myArr[i].CntID + '_D">' + myArr[i].CntField4 + '</span><br><div onclick="EditMarkerDescription(' + myArr[i].CntID + ');" class="button btn btn-success btn-sm fontawesome-pencil"></div><div onclick="DeleteDbMarker(' + myArr[i].CntID + ');" class="btn btn-danger btn-sm fontawesome-trash" style="margin-left:2px;"></div><div onclick="FillMarkerSettings(' + myArr[i].CntID + ');" class="btn btn-primary btn-sm fa fa-image" style="margin-left:2px;"></div><div class="btn btn-default btn-sm" style="display:none;"><span class="badge">' + myArr[i].CntID + '</span></div>');
				} else {
					infowindow.setContent('<strong>' + myArr[i].CntField3 + '</strong><br>' + myArr[i].CntField4 + '<br>');
				}
				infowindow.open(map, marker);
			}
		})(marker, i));

		DbMarkers.push(marker);
	}

}
function addLines() {

	var addListenersOnLines = function (myLine) {
		google.maps.event.addListener(myLine, 'click', function (event) {
			FillLineSettingsPanel(myLine.indexID, myLine.strokeColor);
		});
	}

	for (var i = 0; i < myArr.length; i++) {
		if (myArr[i].CntField5 == "L") {
			var MultiLineCorners = [];
			var LatArr = myArr[i].CntField1.split("_");
			var LngArr = myArr[i].CntField2.split("_");
			var myLineColor = PutHashtags(myArr[i].CntField9);
			var myLineID = myArr[i].CntID;
			for (var k = 0; k < LatArr.length; k++) {
				MultiLineCorners.push({
					lat: parseFloat(LatArr[k]),
					lng: parseFloat(LngArr[k])
				});
			}
			var MultiFlightPath = new google.maps.Polyline({
				path: MultiLineCorners,
				geodesic: true,
				strokeColor: myLineColor,
				strokeOpacity: 1.0,
				strokeWeight: 5,
				indexID: myLineID
			});
			MultiFlightPath.setMap(map);

			if ($("#myMap1Edit").html() == 1) {
				addListenersOnLines(MultiFlightPath);
			}

			// Fills LineList for Control Panel
			myLineList.push({
				LineID: myArr[i].CntID,
				LineColor: myArr[i].CntField9
			});
			// Populates clear array
			ClearMultiDbLines.push(MultiFlightPath);
		}
	}
}
function addPolygons() {
	var addListenersOnPolygon = function (polygon, myPolygonDesc) {
		google.maps.event.addListener(polygon, 'click', function (event) {
			if ($("#myMap1Edit").html() == 1) {
				FillPolygonSettingsPanel(polygon.indexID, polygon.strokeColor, polygon.fillColor, myPolygonDesc)
			} else {
				var PolygoninfoWindow = new google.maps.InfoWindow;
				var contentString = myPolygonDesc;
				PolygoninfoWindow.setContent(contentString);
				PolygoninfoWindow.setPosition(event.latLng);
				PolygoninfoWindow.open(map);
			}
		});
	}
	for (var i = 0; i < myArr.length; i++) {
		if (myArr[i].CntField5 == "P") {
			var MultiPolygonCorners = [];
			var LatArr = myArr[i].CntField1.split("_");
			var LngArr = myArr[i].CntField2.split("_");
			var myLineColor = PutHashtags(myArr[i].CntField9);
			var myFillColor = PutHashtags(myArr[i].CntField7);
			var myDescription = myArr[i].CntField3;
			var myPolygonID = myArr[i].CntID;
			for (var k = 0; k < LatArr.length; k++) {
				MultiPolygonCorners.push({
					lat: parseFloat(LatArr[k]),
					lng: parseFloat(LngArr[k])
				});
			}
			var MultiBermudaTriangle = new google.maps.Polygon({
				paths: MultiPolygonCorners,
				strokeColor: myLineColor,
				strokeOpacity: 0.7,
				strokeWeight: 4,
				fillColor: myFillColor,
				fillOpacity: 0.35,
				indexID: myPolygonID
			});
			MultiBermudaTriangle.setMap(map);

			addListenersOnPolygon(MultiBermudaTriangle, myDescription);

			// Fills LineList for Control Panel
			myPolygonList.push({
				PolygonID: myArr[i].CntID,
				PolygonBorderColor: myArr[i].CntField9,
				PolygonFillColor: myArr[i].CntField7
			});
			// Populates clear array
			ClearMultiDbPolygones.push(MultiBermudaTriangle);
		}
	}
}
function PutHashtags(myText){
	myText = myText.replace("hashtag", "#");
	return myText;
}
function ClearAllDbMarkers() {
	for (var i = 0; i < DbMarkers.length; i++) {
		DbMarkers[i].setMap(null);
	}
	for (var j = 0; j < ClearMultiDbLines.length; j++) {
		ClearMultiDbLines[j].setMap(null);
	}
	myLineList = [];
	for (var k = 0; k < ClearMultiDbPolygones.length; k++) {
		ClearMultiDbPolygones[k].setMap(null);
	}
	myPolygonList = [];
}

// **** POPUP FUNCTIONS
// Fills settings popup
function EditMarkerDescription(myMarkerID) {
	// Clears content of panel
	$("#EssSettingsModalBody").html("");
	$("#dmlPnlSettingsTitle").html("Marker Edit Panel");
	$("#BtnSettingsSave").val("Save Text");
	$("#BtnReset").hide();
	var myMarkerTitle = $("#" + myMarkerID + "_H").html();
	var myMarkerDesc = $("#" + myMarkerID + "_D").html();
	//Creates two texboxes for text
	var newElement1 = $(document.createElement('h2')).attr('id', 'dmlMarkerDescription').attr('class', 'modal-title');
	newElement1.after().html("<div id='dmlEditMarkerId' style='display:none;'></div><div class='input-group'><span class='input-group-addon' id='dmlMarkerTitle'>Title</span><input id='dmlMarkerTitleValue' type='text' class='form-control StngElement' aria-describedby='dmlMarkerTitle'></div><div class='input-group'><span class='input-group-addon' id='dmlMarkerDesc'>Desc.</span><input id='dmlMarkerDescValue' type='text' class='form-control StngElement' aria-describedby='dmlMarkerDesc'></div><br />");
	newElement1.appendTo("#EssSettingsModalBody");
	$("#dmlEditMarkerId").html(myMarkerID);
	$("#dmlMarkerTitleValue").val(myMarkerTitle);
	$("#dmlMarkerDescValue").val(myMarkerDesc);
	$("#mySettings").modal("toggle");
}
function FillSettings() {
	if ($("#ModalTitle1").length == 0) {
		// Clears content of panel
		$("#EssSettingsModalBody").html("");
		$("#dmlPnlSettingsTitle").html("Settings Panel");
		$("#BtnSettingsSave").val("Save Settings");
		$("#BtnReset").val("Reset Map");
		var mySettings = $("#Map1idHolder").html();

		//CREATE NEW TEXTBOX
		var newElement1 = $(document.createElement('h5')).attr('id', 'ModalTitle1').attr('class', 'modal-title');
		newElement1.after().html("<div class='input-group'><span class='input-group-addon' id='basic-addon1'>API code (pure code)</span><input id='dmlMapApi' type='text' class='form-control StngElement' aria-describedby='basic-addon1'></div>");
		newElement1.appendTo("#EssSettingsModalBody");

		var newElement2 = $(document.createElement('h5')).attr('id', 'ModalTitle2').attr('class', 'modal-title');
		newElement2.after().html("<div class='input-group'><span class='input-group-addon' id='basic-addon2'>Map height (numbers)</span><input id='dmlMapHeight' type='number' class='form-control StngElement' aria-describedby='basic-addon2'></div>");
		newElement2.appendTo("#EssSettingsModalBody");

		var newElement3 = $(document.createElement('h5')).attr('id', 'ModalTitle6').attr('class', 'modal-title');
		newElement3.after().html("<div class='input-group'><span class='input-group-addon' id='basic-addon6'>Map zoom (numbers)</span><input id='dmlMapZoom' type='number' class='form-control StngElement' aria-describedby='basic-addon6'></div>");
		newElement3.appendTo("#EssSettingsModalBody");

		var newElement5 = $(document.createElement('div')).attr('id', 'ModalTitle7').attr('class', 'StngElement');
		newElement5.after().html("<div class='input-group'><span class='input-group-addon' id='basic-addon6'>Map Style</span><select id='dmlMapTypeOptions' onchange='dmlChangeMapType(this.value);'  class='form-control StngElement' aria-describedby='basic-addon7'></select></div><div id='dmlSelectedStyleThmb'></div><div id='dmlSelectedStyleHolder' style='display:none;'></div>");
		newElement5.appendTo("#EssSettingsModalBody");

		for (var i = 1; i < 11; i++) {
			$('#dmlMapTypeOptions').append($("<option />").val(i).text("Style " + i).attr("id", "dmlOpt" + i));
		}


		var newElementResult = $(document.createElement('div')).attr('id', 'SettingsResult');
		newElementResult.after().html("<div style='clear: both;'></div><div id='LblSettingsSonuc'></div><div id='LblControlType' style='display:none;'></div>");
		newElementResult.appendTo("#EssSettingsModalBody");

		//PASS SETTINGS PARAMETERS TO THE #BtnSettings BUTTON
		var mySettingsParams = mySettings.split("_");
		$("#dmlMapApi").val(mySettingsParams[3]).show();
		$("#dmlMapHeight").val(mySettingsParams[4]).show();
		$("#dmlMapZoom").val(mySettingsParams[7]).show();
		var mySelectedStyle = mySettingsParams[5];
		$("#dmlOpt" + mySelectedStyle).attr("selected", "selected");
		$("#dmlSelectedStyleHolder").html(mySelectedStyle);
		$("#dmlSelectedStyleThmb").html("<div class='input-group'><img src='" + dmlServer + "/dmlmap/styles/thmbs/" + mySelectedStyle + ".png' /></div>");

		//SET CONTROL TYPE
		var myCtrlTypeValue = mySettingsParams[6];
		SelectCtrlType(myCtrlTypeValue);

		//SETTINGS SAVE PARAMETER
		$("#mySettingSaveStart").html(mySettingsParams[0] + "_" + 3);
	}
}
function FillLinesPanel(myLat, myLng) {
	// Clears content of panel
	$("#EssSettingsModalBody").html("");
	$("#dmlPnlSettingsTitle").html("Quản lý đánh dấu đường tắc");
	$("#BtnSettingsSave").val("Đánh dấu mới");
	$("#BtnReset").hide();
	//Creates settings areas
	var newElement1 = $(document.createElement('h2')).attr('id', 'dmlNewCornerToLineContainer').attr('class', 'modal-title');
	newElement1.after().html("<div class='input-group'><span class='input-group-addon' id='dmlLineCorner1'>Lat</span><input id='dmlShapeCornerLat' type='text' class='form-control StngElement' aria-describedby='dmlLineCorner1'></div><div class='input-group'><span class='input-group-addon' id='dmlLineCorner2'>Lng</span><input id='dmlShapeCornerLng' type='text' class='form-control StngElement' aria-describedby='dmlLineCorner2'></div><br />");
	newElement1.appendTo("#EssSettingsModalBody");

	var myPanelLineList;

	if (myLineList.length == 0) {
		myPanelLineList = "<div>Hiện tại không có đường nào đang đánh dấu dở, hãy đánh dấu đường, bạn cần ít nhất 2 điểm để tạo thành đoạn đánh dấu</div>";
	} else {
        myPanelLineList = "<div>Bạn có thể nối điểm vừa tạo này với các điểm đã được tạo trước đó để tạo thành đường:</div>"
		for (var i = 0; i < myLineList.length; i++) {
			if (i == 0) {
				myPanelLineList += "<li class='list-group-item' style='color: " + PutHashtags(myLineList[i].LineColor) + "'><div onclick='CreateNewMarker(" + myLat + ", " + myLng + ", " + myLineList[i].LineID + ", 2);' title='Select this line' class='btn btn-primary btn-xs fontawesome-map-marker'></div> Đường #" + myLineList[i].LineID + " </li>";
			} else {
				myPanelLineList += "<li class='list-group-item' style='color: " + PutHashtags(myLineList[i].LineColor) + "'><div onclick='CreateNewMarker(" + myLat + ", " + myLng + ", " + myLineList[i].LineID + ", 2);' title='Select this line' class='btn btn-primary btn-xs fontawesome-map-marker'></div> Đường #" + myLineList[i].LineID + " </li>";
			}
		}
	}

	var newElement2 = $(document.createElement('ul')).attr('id', 'myLineListUl').attr('class', 'list-group StngElement');
	newElement2.after().html(myPanelLineList);
	newElement2.appendTo("#EssSettingsModalBody");

	$("#dmlShapeCornerLat").val(myLat);
	$("#dmlShapeCornerLng").val(myLng);
}
function FillLineSettingsPanel(myLineID, myLineColor) {
	// Clears content of panel
	$("#EssSettingsModalBody").html("");
	$("#dmlPnlSettingsTitle").html("Thiết lập đường đánh dấu");
	$("#BtnSettingsSave").val("Lưu thiết lập");
	$("#BtnReset").val("Xóa đường").show();
	$("#mySettings").modal("toggle");
	var newElement1 = $(document.createElement('h2')).attr('id', 'dmlLineSettingsCover').attr('class', 'modal-title');
	newElement1.after().html("<div class='input-group'><span class='input-group-addon' id='dmlLineSettingsID'>Line ID</span><label id='dmlLineSettingsIdValue' class='form-control StngElement' aria-describedby='dmlLineSettingsID'>" + myLineID + "</div><div class='input-group'><span class='input-group-addon' id='dmlLineSettingsColor'>Mức độ tắc</span><select class='form-control' id='dmlLineSettingsColorValue'><option value='#FF0000'>Rất tắc</option><option value='#F4A460'>Tắc vừa</option><option value='#FFFF00'>Hơi tắc, có thể lưu thông</option></select></input></div><br />");
	newElement1.appendTo("#EssSettingsModalBody");
	$("#dmlLineSettingsColorValue").val(myLineColor);
}
function FillPolygonesPanel(myLat, myLng) {
	// Clears content of panel
	$("#EssSettingsModalBody").html("");
	$("#dmlPnlSettingsTitle").html("Đánh dấu khu vực");
	$("#BtnSettingsSave").val("Khu vực mới");
	$("#BtnReset").hide();
	//Creates settings areas

	var newElement1 = $(document.createElement('h2')).attr('id', 'dmlNewCornerToPolygonContainer').attr('class', 'modal-title');
	newElement1.after().html("<div class='input-group'><span class='input-group-addon' id='dmlLineCorner1'>Lat</span><input id='dmlShapeCornerLat' type='text' class='form-control StngElement' aria-describedby='dmlLineCorner1'></div><div class='input-group'><span class='input-group-addon' id='dmlLineCorner2'>Lng</span><input id='dmlShapeCornerLng' type='text' class='form-control StngElement' aria-describedby='dmlLineCorner2'></div><br />");
	newElement1.appendTo("#EssSettingsModalBody");

	var myPanelPolygonList;

	if (myPolygonList.length == 0) {
		myPanelPolygonList = "<div>Hiện tại không có khu vực đang được đánh dấu, để tạo khu vực đánh dấu, bạn cần ít nhất 3 góc đánh dấu</div>";
	} else {
		for (var i = 0; i < myPolygonList.length; i++) {
			if (i == 0) {
				myPanelPolygonList = "<li class='list-group-item' style='color: " + PutHashtags(myPolygonList[i].PolygonBorderColor) + "'><div onclick='CreateNewMarker(" + myLat + ", " + myLng + ", " + myPolygonList[i].PolygonID + ", 2);' title='Select this polygon' class='btn btn-primary btn-xs fontawesome-map-marker'></div> Polygon #" + myPolygonList[i].PolygonID + " </li>";
			} else {
				myPanelPolygonList += "<li class='list-group-item' style='color: " + PutHashtags(myPolygonList[i].PolygonBorderColor) + "'><div onclick='CreateNewMarker(" + myLat + ", " + myLng + ", " + myPolygonList[i].PolygonID + ", 2);' title='Select this polygon' class='btn btn-primary btn-xs fontawesome-map-marker'></div> Polygon #" + myPolygonList[i].PolygonID + " </li>";
			}
		}
	}

	var newElement2 = $(document.createElement('ul')).attr('id', 'myPolygonListUl').attr('class', 'list-group StngElement');
	newElement2.after().html(myPanelPolygonList);
	newElement2.appendTo("#EssSettingsModalBody");

	$("#dmlShapeCornerLat").val(myLat);
	$("#dmlShapeCornerLng").val(myLng);

}
function FillPolygonSettingsPanel(myPolygonID, myPolygonBorderColor, myPolygonFillColor, myPolygonDescription) {
	// Clears content of panel
	$("#EssSettingsModalBody").html("");
	$("#dmlPnlSettingsTitle").html("Thiết lập thông tin khu vực");
	$("#BtnSettingsSave").val("Lưu thiết lập khu vực");
	$("#BtnReset").val("Xóa khu vực").show();
	$("#mySettings").modal("toggle");
	var newElement1 = $(document.createElement('h2')).attr('id', 'dmlPolygonSettingsCover').attr('class', 'modal-title');
	newElement1.after().html("<div class='input-group'><span class='input-group-addon' id='dmlPolygonSettingsID'>Polygon ID</span><label id='dmlPolygonSettingsIdValue' class='form-control StngElement' aria-describedby='dmlPolygonSettingsID'>" + myPolygonID + "</div><div class='input-group'><span class='input-group-addon' id='dmlPolygonBorderColor'>Border Color</span><input id='dmlPolygonBorderColorValue' type='color' class='form-control StngElement' aria-describedby='dmlPolygonBorderColor'></input></div><div class='input-group'><span class='input-group-addon' id='dmlPolygonFillColor'>Fill Color</span><input id='dmlPolygonFillColorValue' type='color' class='form-control StngElement' aria-describedby='dmlPolygonFillColor'></input></div><div class='input-group'><span class='input-group-addon' id='dmlPolygonDescription'>Description</span><input id='dmlPolygonDescriptionValue' type='text' class='form-control StngElement' aria-describedby='dmlPolygonDescription'></input></div><br />");
	newElement1.appendTo("#EssSettingsModalBody");
	$("#dmlPolygonBorderColorValue").val(myPolygonBorderColor);
	$("#dmlPolygonFillColorValue").val(myPolygonFillColor);
	$("#dmlPolygonDescriptionValue").val(myPolygonDescription);
}
function FillMarkerSettings(myMarkerId) {
	$("#dmlSelectedIconMarkerId").html(myMarkerId);

	$("#EssSettingsModalBody").html("");
	$("#dmlPnlSettingsTitle").html("Icon Update Panel");
	$("#BtnSettingsSave").val("Change Icon");
	$("#BtnReset").hide();

	//Creates two texboxes for text
	var newElement1 = $(document.createElement('h2')).attr('id', 'dmlMarkerDescription').attr('class', 'modal-title');
	newElement1.after().html("<div id='dmlIconList' style='width: 100%; height: 150px; overflow-y : scroll;'></div><div id='dmlMySelectediconID' style='display:none;'></div><div id='dmlMySelectediconText' style='font-size: 14px;'></div>");
	newElement1.appendTo("#EssSettingsModalBody");

	//var myiconTempList;
	for (var i = 1; i < 112; i++) {
		$('#dmlIconList').append("<img onclick='dmlSelectOneicon(" + i + ");' src='" + dmlServer + "/dmlmap/icons/" + i + ".png' title='" + i + "' style='float:left;' />");
	}
	$("#mySettings").modal("toggle");


}
function dmlSelectOneicon(myId) {
	var mySelectionText = "<img src='" + dmlServer + "/dmlmap/icons/" + myId + ".png' /> You selected this icon.";
	$("#dmlMySelectediconText").html(mySelectionText);
	$("#dmlMySelectediconID").html(myId);
}
function dmlChangeMapType(myStyleNu) {
	$("#dmlSelectedStyleHolder").html(myStyleNu);
	$("#dmlSelectedStyleThmb").html("<div class='input-group'><img src='" + dmlServer + "/dmlmap/styles/thmbs/" + myStyleNu + ".png' /></div>");
	myArr[0].CntField5 = myStyleNu;
}

// **** MARKER FUNCTIONS
// Adds a marker to the map and push to the array.
function addMarker(location) {
	//1) Firstly clears all temporary markers
	deleteMarkers();
	//2) Adds a new marker to the map
	var newMarker = new google.maps.Marker({
		position: location,
		map: map
	});
	//3)Push new marker to the array
	markers.push(newMarker);
	//4) Adds info window for newMarker if user loggedin
	if ($("#myMap1Edit").html() == 1) {
		var newinfowindow = new google.maps.InfoWindow({});
		google.maps.event.addListener(newMarker, 'click', (function (newMarker) {
			return function () {
				newinfowindow.setContent('<div onclick="CenterMap(' + location.lat() + ', ' + location.lng() + ');" class="btn btn-success fontawesome-screenshot buttonhover" style="margin-left:2px;"></div><div id="Map1AddMarkerBtn" onclick="CreateNewMarker(' + location.lat() + ', ' + location.lng() + ', 1, 1);" class="btn btn-primary fontawesome-map-marker" style="margin-left:2px;"></div><div id="dmlMapLinesPanel" onclick="FillLinesPanel(' + location.lat() + ', ' + location.lng() + ');" data-target="#mySettings" data-toggle="modal" class="btn btn-primary fontawesome-minus" style="margin-left:2px;"></div><div id="dmlPolygonsPanel" onclick="FillPolygonesPanel(' + location.lat() + ', ' + location.lng() + ');" data-target="#mySettings" data-toggle="modal" class="btn btn-primary fa fa-square-o" style="margin-left:2px;"></div><div id="dmlClearTempMarker" onclick="deleteMarkers();" class="btn btn-danger fontawesome-trash" style="margin-left:2px;"></div>');
				newinfowindow.open(map, newMarker);
			}
		})(newMarker));
        new google.maps.event.trigger( newMarker, 'click' );
	}
}
function CenterMap(myLat, myLng) {
    //1) Updates database
    var myCntID = myArr[0].CntID;
    var myField1 = "CntField1";
    var myDeger1 = myLat;
    var myField2 = "CntField2";
    var myDeger2 = myLng;
    var mySaveString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=2&CntID=" + myCntID + "&myField1=" + myField1 + "&myDeger1=" + myDeger1 + "&myField2=" + myField2 + "&myDeger2=" + myDeger2 + " ";
    //2) calls AJAX method to update database
    var savecenter = {};
    savecenter.url = mySaveString;
    savecenter.type = "POST";
    savecenter.data = {};
    savecenter.processData = false;
    savecenter.success = function (result) {
        //3) Update map array myArr center coordinates
        myArr[0].CntField1 = myLat;
        myArr[0].CntField2 = myLng;
        //4) Centers map
        map.setCenter({ lat: parseFloat(myLat), lng: parseFloat(myLng) });
        //5) Ckears marker
        deleteMarkers();
    };
    savecenter.error = function (err) { alert(err.statusText); };
    $.ajax(savecenter);
    event.preventDefault();
}
function CreateNewMarker(myLat, myLng, myShapeID, myMarkerType) {
	//1) Adds new marker record to the database
	var myUrl = $(location).attr('href');
	var myiconUrl;
	var myCornerType;
	var myString;
	if (myMarkerType == 1) {
		//Adds marker icon
		myiconUrl = "0";
		myCornerType = ".";
		myString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=ins&CntID=1&p2=" + myUrl + "&p3=" + myLat + "&p4=" + myLng + "&p5=Place Name&p6=Place Description&p7=" + myCornerType + "&p8=" + myiconUrl + "&p9=.&p10=.&p11=.";
	} else if (myMarkerType == 2) {
		var myNewLat;
		var myNewLng;
		for (var i = 0; i < myArr.length; i++) {
			if (myArr[i].CntID == myShapeID) {
				myNewLat = myArr[i].CntField1 + "_" + myLat;
				myNewLng = myArr[i].CntField2 + "_" + myLng;
			}
		}
		myString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=2&CntID=" + myShapeID + "&myField1=CntField1&myDeger1=" + myNewLat + "&myField2=CntField2&myDeger2=" + myNewLng + " ";
	}

	// 2) Calls AJAX method to update database
	var addMarker = {};
	addMarker.url = myString;
	addMarker.type = "POST";
	addMarker.data = {};
	addMarker.processData = false;
	addMarker.success = function (result) {
		ClearAllDbMarkers();
		var myLocation = $(location).attr('href');
		CallHandler(myLocation);
		//5) Clears marker
		deleteMarkers();
		if (myMarkerType != 1) {
			$("#mySettings").modal("toggle");
		}
	};
	addMarker.error = function (err) { alert(err.statusText); };
	$.ajax(addMarker);
	event.preventDefault();
}
function CreateNewShape(myLat, myLng, myMarkerType) {
	//1) Adds marker icon
	var myUrl = $(location).attr('href')
	var myString;
	if (myMarkerType == 1) {
		//Creates new line
		myString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=ins&CntID=1&p2=" + myUrl + "&p3=" + myLat + "&p4=" + myLng + "&p5=.&p6=.&p7=L&p8=L&p9=.&p10=.&p11=hashtagFE2E2E";
	} else if (myMarkerType == 2) {
		//Creates new polygon
		myString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=ins&CntID=1&p2=" + myUrl + "&p3=" + myLat + "&p4=" + myLng + "&p5=Polygon description&p6=.&p7=P&p8=P&p9=hashtag2E2EFE&p10=.&p11=hashtagFE2E2E";
	}

	//2) Calls AJAX method to update database
	var addMarker = {};
	addMarker.url = myString;
	addMarker.type = "POST";
	addMarker.data = {};
	addMarker.processData = false;
	addMarker.success = function (result) {
		ClearAllDbMarkers();
		var myLocation = $(location).attr('href');
		CallHandler(myLocation);
		//5) Clears marker
		deleteMarkers();
		$("#mySettings").modal("toggle");
	};
	addMarker.error = function (err) { alert(err.statusText); };
	$.ajax(addMarker);
	event.preventDefault();
}
function SaveSettingsPanel() {
	var myMapID = myArr[0].CntID;
	var myMapApi = $("#dmlMapApi").val();
	var myMapHeight = $("#dmlMapHeight").val();
	var myMapType = myArr[0].CntField5;
	var myMapZoom = $("#dmlMapZoom").val();

	DbStatus = 0; // Map will be reloaded

	var myMapSaveSettings = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=4&CntID=" + myMapID + "&myField1=CntField3&myDeger1=" + myMapApi + "&myField2=CntField4&myDeger2=" + myMapHeight + "&myField3=CntField5&myDeger3=" + myMapType + "&myField4=CntField8&myDeger4=" + myMapZoom + " ";
	CallSaveHandler(myMapSaveSettings, 1);
}


// ****MAP CONTENT FUNCTIONS
function setMapOnAll(map) {
	// Sets the map on all markers in the array.
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}
function clearMarkers() {
	// Removes the markers from the map, but keeps them in the array.
	setMapOnAll(null);
}
function showMarkers() {
	// Shows any markers currently in the array.
	setMapOnAll(map);
}
function deleteMarkers() {
	// Deletes all markers in the array by removing references to them.
	clearMarkers();
	markers = [];
}


// Changes map type
function Map1ChangeType(myValue) {

	if (myValue == 1) {
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
	}
	else if (myValue == 2) {
		map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	}
	else if (myValue == 3) {
		map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
	}
	//UPDATING SETTING PARAMETERS
	myArr[0].CntField5 = myValue;
}

// ****DATABASE AJAX FUNCTIONS
function CallSaveHandler(mySaveString, myModalToggle) {
	var choice = {};
	choice.url = mySaveString;
	choice.type = "POST";
	choice.data = {};
	choice.processData = false;
	choice.success = function (result) {
		if (myModalToggle == 1) {
			$("#mySettings").modal("toggle");
		}
		ClearAllDbMarkers();
		var myLocation = $(location).attr('href');
		CallHandler(myLocation);
		deleteMarkers();
	};
	choice.error = function (err) { alert(err.statusText); };
	$.ajax(choice);
	event.preventDefault();
}


// onclick='CreateNewMarker(" + myLat + ", " + myLng + ", " + myLineList[i].LineID + ", 2);'
function SaveSettings() {
	var mySaveType = $("#BtnSettingsSave").val();
	if (mySaveType == "Save Settings") {
		SaveSettingsPanel();
	} else if (mySaveType == "Đánh dấu mới") {
		var myLat = $("#dmlShapeCornerLat").val();
		var myLng = $("#dmlShapeCornerLng").val();
		CreateNewShape(myLat, myLng, 1);
	} else if (mySaveType == "Khu vực mới") {
		var myLat = $("#dmlShapeCornerLat").val();
		var myLng = $("#dmlShapeCornerLng").val();
		CreateNewShape(myLat, myLng, 2);
	} else if (mySaveType == "Lưu thiết lập") {
		var myLineID = $("#dmlLineSettingsIdValue").html();
		var myLineColor = $("#dmlLineSettingsColorValue").val();
		var myColorSaveString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=1&CntID=" + myLineID + "&myField1=CntField9&myDeger1=" + ClearHashtags(myLineColor) + " ";
		CallSaveHandler(myColorSaveString, 1);
	} else if (mySaveType == "Lưu thiết lập khu vực") {
		var myPolygonID = $("#dmlPolygonSettingsIdValue").html();
		var myPolBorderColor = $("#dmlPolygonBorderColorValue").val();
		var myPolFillColor = $("#dmlPolygonFillColorValue").val();
		var myPolDescription = $("#dmlPolygonDescriptionValue").val();
		var myPolSaveSettingsString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=3&CntID=" + myPolygonID + "&myField1=CntField9&myDeger1=" + ClearHashtags(myPolBorderColor) + "&myField2=CntField7&myDeger2=" + ClearHashtags(myPolFillColor) + "&myField3=CntField3&myDeger3=" + myPolDescription + " ";
		CallSaveHandler(myPolSaveSettingsString, 1);
	} else if (mySaveType == "Save Text") {
		var myID = $("#dmlEditMarkerId").html();
		var myTitle = $("#dmlMarkerTitleValue").val();
		var myDesc = $("#dmlMarkerDescValue").val();
		var myColorSaveString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=2&CntID=" + myID + "&myField1=CntField3&myDeger1=" + myTitle + "&myField2=CntField4&myDeger2=" + myDesc + "  ";
		CallSaveHandler(myColorSaveString, 1);
	} else if (mySaveType == "Change Icon") {
		var myNewIconMarkerId = $("#dmlSelectedIconMarkerId").html();
		var mySelectedicon = $("#dmlMySelectediconID").html();
		var myiconSaveString = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=1&CntID=" + myNewIconMarkerId + "&myField1=CntField6&myDeger1=" + mySelectedicon + " ";
		CallSaveHandler(myiconSaveString, 1);
	}
}

function ClearHashtags(myText) {
	// Clears HASHTAGs before saving to database
	myText = myText.replace("#", "hashtag");
	return myText;
}
function DeleteDbMarker(myMarkerID) {
	var r = confirm("Do you want to delete this marker?");
	if (r == true) {
		myDeleteStr = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=del1&CntID=" + myMarkerID + " ";
		CallSaveHandler(myDeleteStr, 0);

	}
}
function ResetControl() {
	var myButtonText = $("#BtnReset").val();
	var myDecisionText;
	var myResetStr;

	if (myButtonText == "Reset Map") {
		// Resets the control by deleting all data from database
		myDecisionText = "Do you want to reset control?";
		var myUrl = $(location).attr('href');
		myResetStr = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=res&CntUsrCtrlID=1&url=" + myUrl + " ";
	} else if (myButtonText == "Xóa đường") {
		// Deletes one record from the database based on the ID number
		var myLineID = $("#dmlLineSettingsIdValue").text();
		myDecisionText = "Bạn có chắc muốn xóa đường đánh dấu không?";
		myResetStr = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=del1&CntID=" + myLineID + " ";
	} else if (myButtonText == "Xóa khu vực") {
		// Deletes one record from the database based on the ID number
		var myPolygonID = $("#dmlPolygonSettingsIdValue").text();
		myDecisionText = "Bạn có chắc muốn xóa khu vực đánh dấu không?";
		myResetStr = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=del1&CntID=" + myPolygonID + " ";
	}

	var r = confirm(myDecisionText);
	if (r == true) {
		CallSaveHandler(myResetStr, 1);
	}
}

//******INSERT STARTS*******
function dmlCreateMap() {
	var myApi = $("#dmlTxtApiKey").val();
	var myUrl = $(location).attr('href');
	var choice = {};
	choice.url = dmlServer + "/dmlmap/dmlmapfunctions.php?SaveType=cmap&api=" + myApi + "&url=" + myUrl;
	choice.type = "POST";
	choice.data = {};
	choice.processData = false;
	choice.success = function (result) {
		document.getElementById("dmlApiKeyError").innerHTML = "<h3>" + result + "</h3><p>Hãy ấn nút sau để kích hoạt bản đồ</p><br /><div id='dmlBtnActivateMap' onclick='FncDmlActivateMap();' class='btn btn-success'>Kích hoạt bản đồ</div>";
		$("#dmlApiEnterPanel").hide();
	};
	choice.error = function (err) { alert(err.statusText + "KK"); };
	$.ajax(choice);
	event.preventDefault();
}

//******ACTIVATE MAPS STARTS*******
function FncDmlActivateMap() {
	location.reload();
}

//*****LOAD CSS AND JAVASCRIPT*****

function LoadScriptStyle(){
	var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + myApi + "&callback=dmlLoadMap";
	script.id = "dmlMapApi";
	//script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);

	//ORIGINAL
	var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + myApi + "&callback=dmlLoadMap";
	script.id = "dmlMapApi";
	//script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);

	var newElement1 = $(document.createElement('h5')).attr('id', 'ModalTitle1').attr('class', 'modal-title');
	newElement1.after().html("<div class='input-group'><span class='input-group-addon' id='basic-addon1'>API code (pure code)</span><input id='dmlMapApi' type='text' class='form-control StngElement' aria-describedby='basic-addon1'></div>");
	newElement1.appendTo("#EssSettingsModalBody");
}