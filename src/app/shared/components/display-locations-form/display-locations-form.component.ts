import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Location} from '../../models/api-models/location';
import {FormControl, FormGroup, NgForm} from '@angular/forms';

@Component({
  selector: 'app-display-locations-form',
  templateUrl: './display-locations-form.component.html',
  styleUrls: ['./display-locations-form.component.css', '../../styles/forms.css']
})
export class DisplayLocationsFormComponent implements OnInit, AfterViewInit {
  @ViewChild('locationsForm', {static: false}) locationsForm: NgForm;

  @Input() title: string;

  private LOCATION: Location;
  @Input()
  set location(val: Location) {
    this.locationChange.emit(val);
    this.LOCATION = val;
  }
  get location(): Location {
    return this.LOCATION;
  }
  @Output() locationChange: EventEmitter<Location> = new EventEmitter<Location>();

  @Input() valuesChanged: boolean;
  @Output() valuesChangedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() enteringLocationsIsEnabled = true;

  floatLabel = 'always';


  constructor() { }

  ngOnInit() {
  }



  listenForDirtyChanges(fc: NgForm) {
    fc.valueChanges.subscribe(value => {
      if (fc.dirty || fc.touched) {
        console.log('dirty or touched');
        this.valuesChangedChange.emit(true);
      }
    });

  }

  markAsCleanAndUntouched() {
    if (this.locationsForm != null) {
      this.locationsForm.form.markAsPristine();
      this.locationsForm.form.markAsUntouched();
    }
  }

  ngAfterViewInit(): void {
    this.listenForDirtyChanges(this.locationsForm);
  }
}
