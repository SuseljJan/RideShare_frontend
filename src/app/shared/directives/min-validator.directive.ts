import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators} from '@angular/forms';

@Directive({
  selector: '[min]',
   providers: [{ provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true }]
})
export class MinValidatorDirective implements Validator {

  @Input('min') min: number;
  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.min(this.min)(control);
  }

}
