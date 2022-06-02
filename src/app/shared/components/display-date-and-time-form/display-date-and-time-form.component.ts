import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {Location} from '../../models/api-models/location';
import {DatePipe, Time} from '@angular/common';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {ControlContainer, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-display-date-and-time-form',
  templateUrl: './display-date-and-time-form.component.html',
  styleUrls: ['./display-date-and-time-form.component.css', '../../styles/forms.css'],
  providers: [DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, FormGroupDirective,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},],
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class DisplayDateAndTimeFormComponent implements OnInit {

  @Input() title: string;

  private DATE: Date;
  @Input()
  set date(val: Date){
    this.dateChange.emit(val);
    this.DATE = val;
  }
  get date(): Date{
    return this.DATE;
  }
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  private TIME: Date;
  @Input()
  set time(val: Date) {
    this.timeChange.emit(val);
    this.TIME = val;
  }
  get time(): Date {
    return this.TIME;
  }
  @Output() timeChange: EventEmitter<Date> = new EventEmitter<Date>();


  @Input() displayNegotiability = false;

  private DATE_IS_NEGOTIABLE = false;
  @Input()
  set dateIsNegotiable(val: boolean) {
    this.dateIsNegotiableChange.emit(val);
    this.DATE_IS_NEGOTIABLE = val;
  }
  get dateIsNegotiable(): boolean{
    return this.DATE_IS_NEGOTIABLE;
  }
  @Output() dateIsNegotiableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private TIME_IS_NEGOTIABLE = false;
  @Input()
  set timeIsNegotiable(val: boolean) {
    this.timeIsNegotiableChange.emit(val);
    this.TIME_IS_NEGOTIABLE = val;
  }
  get timeIsNegotiable(): boolean{
    return this.TIME_IS_NEGOTIABLE;
  }
  @Output() timeIsNegotiableChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  @Input() dateIsEnabled = true;
  @Input() timeIsEnabled = true;


  @ViewChild('dateAndTimeForm', {static: false}) public dateAndTimeForm: NgForm;

  floatLabel = 'always';

  // dateForm = new FormControl();
  // public dateAndTimeForm: FormGroup;


  constructor(
    private myDatePipe: DatePipe,
    private parent: FormGroupDirective
  ) { }

  ngOnInit() {

    /*this.dateAndTimeForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
    });*/
  }

  /*onDateChange() {
    this.dateChange.emit(this.date);
  }
  onTimeChange() {
    this.timeChange.emit(this.time);
  }*/

}
