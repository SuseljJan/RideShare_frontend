import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators} from '@angular/forms';

@Directive({
  selector: '[max]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValidatorDirective, multi: true }]
})
export class MaxValidatorDirective implements Validator{

  @Input('max') max: number;
  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.max(this.max)(control);
  }

}
