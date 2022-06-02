import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';

@Component({
  selector: 'app-google-maps-location-picker',
  templateUrl: './google-maps-location-picker.component.html',
  styleUrls: ['./google-maps-location-picker.component.css']
})
export class GoogleMapsLocationPickerComponent implements OnInit {

  zoom: number = 8;
  lat: number = 51.673858;
  lng: number = 7.815982;

  constructor(
    private contextMenuService: ContextMenuService,
  ) { }

  ngOnInit() {
  }


  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event) {
    alert('d');
    console.log($event);
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: any, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  deleteMarker(m){
    console.log("delete",m);
  }

  markers: any[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ]








 /* @ViewChild(ContextMenuComponent, {static: false}) public basicMenu: ContextMenuComponent;

  showContextMenu(caurrentLatLng  ) {
    var projection;
    var contextmenuDir;
    projection = this.map.getProjection();
    $('.contextmenu').remove();
    contextmenuDir = document.createElement("div");
    contextmenuDir.className  = 'contextmenu';
    contextmenuDir.innerHTML = '<a id="menu1"><div class="context">menu item 1<\/div><\/a>'
      + '<a id="menu2"><div class="context">menu item 2<\/div><\/a>';

    $(map.getDiv()).append(contextmenuDir);

    setMenuXY(caurrentLatLng);

    contextmenuDir.style.visibility = "visible";
  }


  public onContextMenu(event): void {
    console.log(1);
    console.log(event);

    this.contextMenuService.show.next({
      anchorElement: event.ya.target,
      contextMenu: this.basicMenu,
      event:  event.ya,
      item: 'dummyItem', // Not important for me but is required parameter
    });
    event.ya.preventDefault();
    event.ya.stopPropagation();
  }*/
  pickStartLocation() {
    console.log('start');
  }

  pickEndLocation(){
    console.log('end');
  }
}
