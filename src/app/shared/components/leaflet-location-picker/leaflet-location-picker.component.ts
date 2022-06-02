import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {icon, latLng, LatLngExpression, LatLngLiteral, Map, Marker, marker, tileLayer} from 'leaflet';
import '../../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import {LocationCoordinates} from '../../models/angular-models/location-coordinates';
import {MatSlideToggle} from '@angular/material';


@Component({
  selector: 'app-leaflet-location-picker',
  templateUrl: './leaflet-location-picker.component.html',
  styleUrls: ['./leaflet-location-picker.component.css']
})
export class LeafletLocationPickerComponent implements OnInit, AfterViewInit {

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  @ViewChild('locationsToggle', {static: false}) locationsToggle: MatSlideToggle;

  @Input() startLocationPickerIsEnabled = true;
  @Input() endLocationPickerIsEnabled = true;

  @Input() center: LatLngLiteral;
  @Input() numberOfMarkers = 2;

  @Input() startLocationToPreload: LatLngExpression = null;
  @Input() endLocationToPreload: LatLngExpression = null;

  toggleForStartIsEnabled = true;
  toggleForEndIsEnabled = true;
  toggleLocationIsEnd = false;

  afterViewInitCallbacks: (() => void) [] = [];

  map: Map;
  startLocation: Marker; // markers on: https://github.com/pointhi/leaflet-color-markers
  endLocation: Marker;
  singleMarker: Marker;

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  });
  options = {
    layers: [ this.streetMaps ],
    zoom: 15,
    center: latLng(this.center || [51.505, -0.09])
  };

  @Output() locationSetOrChange = new EventEmitter<LocationCoordinates>();
  @Output() deleteLocation = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.toggleForStartIsEnabled = this.startLocationPickerIsEnabled;
    this.toggleForEndIsEnabled = this.endLocationPickerIsEnabled;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.map.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, positionError => {
        console.log(positionError);
      });
    }
  }



  updateToggle(startWasMarked: boolean) {
    if (startWasMarked) {
      this.toggleForStartIsEnabled = false;
    } else {
      this.toggleForEndIsEnabled = false;
    }

    this.toggleLocationIsEnd = !this.toggleForStartIsEnabled && !this.toggleForEndIsEnabled ? false : startWasMarked;
    // debugger;
    if (this.locationsToggle != null) {
      this.locationsToggle.checked = this.toggleLocationIsEnd;
    } else {
      this.afterViewInitCallbacks.push(() => {
        this.locationsToggle.checked = this.toggleLocationIsEnd;
      });
    }

    this.cdr.detectChanges();
  }



  ngAfterViewInit(): void {
    this.afterViewInitCallbacks.forEach(callback => {
      callback();
    });

    this.cdr.detectChanges();
  }

  createMarker(latLngCoords: LatLngExpression, iconUrlpath: string, content: string): Marker{
    return marker(latLngCoords, {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: iconUrlpath,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      }), draggable: true
    }).bindTooltip(content, {permanent: true, direction: 'right'});
  }

  loadStartMarker(coords: LatLngExpression) {
    if (coords != null) {
      this.updateToggle(true);

      const newMarker = this.createMarker(
        coords,
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        'START')
        .addTo(this.map);

      newMarker.on('dragend', (event) => {
        this.startLocation = event.target;
        this.locationSetOrChange.emit(new LocationCoordinates(true, event.target._latlng.lat, event.target._latlng.lng));
      });

      this.startLocation = newMarker;

      this.locationSetOrChange.emit(
        new LocationCoordinates(true, coords[0], coords[1])
      );
    }
  }

  loadEndMarker(coords: LatLngExpression) {
    if (coords != null) {
      this.updateToggle(false);

      const newMarker = this.createMarker(
        coords,
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        'END')
        .addTo(this.map);

      newMarker.on('dragend', (event) => {
        this.endLocation = event.target;
        this.locationSetOrChange.emit(new LocationCoordinates(false, event.target._latlng.lat, event.target._latlng.lng));
      });

      this.endLocation = newMarker;

      this.locationSetOrChange.emit(
        new LocationCoordinates(false, coords[0], coords[1])
      );
    }
  }


  onMapReady(map: Map) {
    this.map = map;

    this.loadStartMarker(this.startLocationToPreload);
    this.loadEndMarker(this.endLocationToPreload);


    this.map.on('click', (e: any) => {
      if (this.numberOfMarkers === 2) {
        const addMarker = this.toggleForStartIsEnabled || this.toggleForEndIsEnabled;
        const addMarkerAsStart = !this.locationsToggle.checked;

        if (addMarker) {
          if (addMarkerAsStart){
            this.loadStartMarker([e.latlng.lat, e.latlng.lng]);
          } else {
            this.loadEndMarker([e.latlng.lat, e.latlng.lng]);
          }
        }


      } else if (this.numberOfMarkers === 1) {
        const addMarker: boolean = !this.singleMarker;

        if (addMarker) {
          const newMarker = this.createMarker(
            [e.latlng.lat, e.latlng.lng],
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            'LOCATION'
          ).addTo(this.map);

          newMarker.on('dragend', (event) => {
            this.singleMarker = event.target;

            this.locationSetOrChange.emit(
              new LocationCoordinates(null, event.target._latlng.lat, event.target._latlng.lng)
            );
          });

          this.singleMarker = newMarker;
          this.locationSetOrChange.emit(new LocationCoordinates(null, e.latlng.lat, e.latlng.lng));
        }
      }

    });

  }

  startLocationIsMarked(): boolean {
    return this.startLocation != null;
  }

  endLocationIsMarked(): boolean {
    return this.endLocation != null;
  }

  removeStartLocation() {
    if (this.startLocation != null){
      this.map.removeLayer(this.startLocation);
      this.startLocation = null;

      this.toggleForStartIsEnabled = true;
      this.toggleLocationIsEnd = false;
    }
  }
  removeEndLocation() {
    if (this.endLocation != null) {
      this.map.removeLayer(this.endLocation);
      this.endLocation = null;

      this.toggleForEndIsEnabled = true;
      this.toggleLocationIsEnd = true;
    }
  }

  removeAllMarkers() {
    if (this.endLocation != null){
      this.removeEndLocation();
    }
    if (this.startLocation != null){
            this.removeStartLocation();
    }
    if (this.singleMarker != null){
      this.map.removeLayer(this.singleMarker);
      this.singleMarker = null;
    }
  }

  removeMarker() {
    if (this.singleMarker != null) {
      this.map.removeLayer(this.singleMarker);
      this.singleMarker = null;
    }
  }

}
