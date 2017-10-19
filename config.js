var config = {
    MY_KEY : 'AIzaSyCyXy8VcB_X4GUSeG4Cx3vYRPivhcJByNs'
}

var map;

function initMap() {

    


    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -10.1835544, lng: -48.3337677},
        zoom: 4,
        mapTypeId: 'hybrid',
        disableDefaultUI: 'true'
    });

    var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true
    };

    var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    polylineOptions: { editable: true },
    markerOptions: { draggable: true },
    rectangleOptions: polyOptions,
    circleOptions: polyOptions,
    polygonOptions: polyOptions,
    map: map,

    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1
    },
  });

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
    if (e.type != google.maps.drawing.OverlayType.MARKER) {
      // Switch back to non-drawing mode after drawing a shape.
      drawingManager.setDrawingMode(null);

      // Add an event listener that selects the newly-drawn shape when the user
      // mouses down on it.
      var newShape = e.overlay;
      newShape.type = e.type;
      google.maps.event.addListener(newShape, 'click', function() {
        setSelection(newShape);
      });
      var area = google.maps.geometry.spherical.computeArea(newShape.getPath());
      document.getElementById("area").innerHTML = "Area =" + area;
      setSelection(newShape);
    }
  });

  google.maps.event.addListener(drawingManager, 'drawingmode_changed', deleteSelectedShape);
  google.maps.event.addListener(map, 'click', clearSelection);
  google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);

  drawingManager.setMap(map);
}

function setSelection(shape) {
  clearSelection();
  selectedShape = shape;
  shape.setEditable(true);
  selectColor(shape.get('fillColor') || shape.get('strokeColor'));
  google.maps.event.addListener(shape.getPath(), 'set_at', calcar);
  google.maps.event.addListener(shape.getPath(), 'insert_at', calcar);
}