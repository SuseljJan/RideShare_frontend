import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';
import {MatButton} from '@angular/material';
import {MdbBtnDirective, WavesDirective} from 'angular-bootstrap-md';

@Directive({
  selector: '[appTestdirect]'
})
export class TestdirectDirective implements OnInit {

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    ) { }

  ngOnInit(): void {
    console.log(1);
    console.log(this.element);
    console.log(this.element.nativeElement);
    const smt = new MdbBtnDirective(this.element.nativeElement, this.renderer);
    const smtelse = new WavesDirective(this.element.nativeElement);
    smt.ngOnInit();

  }

}
