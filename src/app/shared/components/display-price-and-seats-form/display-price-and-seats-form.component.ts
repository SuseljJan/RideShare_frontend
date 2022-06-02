import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Time} from '@angular/common';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-display-price-and-seats-form',
  templateUrl: './display-price-and-seats-form.component.html',
  styleUrls: ['./display-price-and-seats-form.component.css', '../../styles/forms.css']
})
export class DisplayPriceAndSeatsFormComponent implements OnInit {

  @Input() numberOfSeatsMax = 100;

  @Input() title: string;

  private PRICE: number;
  @Input()
  set price(val: number) {
    this.priceChange.emit(val);
    this.PRICE = val;
  }
  get price(): number {
    return this.PRICE;
  }
  @Output() priceChange: EventEmitter<number> = new EventEmitter<number>();


  private NUMBER_OF_SEATS: number;
  @Input()
  set numberOfSeats(val: number) {
    this.numberOfSeatsChange.emit(val);
    this.NUMBER_OF_SEATS = val;
  }
  get numberOfSeats(): number {
    return this.NUMBER_OF_SEATS;
  }
  @Output() numberOfSeatsChange: EventEmitter<number> = new EventEmitter<number>();


  @Input() displayNegotiability = false;

  private PRICE_IS_NEGOTIABLE = true;
  @Input()
  set priceIsNegotiable(val: boolean) {
    this.priceIsNegotiableChange.emit(val);
    this.PRICE_IS_NEGOTIABLE = val;
  }
  get priceIsNegotiable(): boolean {
    return this.PRICE_IS_NEGOTIABLE;
  }
  @Output() priceIsNegotiableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private NUMBER_OF_SEATS_IS_NEGOTIABLE = true;
  @Input()
  set numberOfSeatsIsNegotiable(val: boolean) {
    this.numberOfSeatsIsNegotiableChange.emit(val);
    this.NUMBER_OF_SEATS_IS_NEGOTIABLE = val;
  }
  get numberOfSeatsIsNegotiable(): boolean {
    return this.NUMBER_OF_SEATS_IS_NEGOTIABLE;
  }
  @Output() numberOfSeatsIsNegotiableChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  @Input() priceIsEnabled = true;
  @Input() numberOfSeatsIsEnabled = true;


  @ViewChild('priceAndSeatsForm', {static: false}) priceAndSeatsForm: NgForm;

  floatLabel = 'always';


  constructor() { }

  ngOnInit() {
  }

}
