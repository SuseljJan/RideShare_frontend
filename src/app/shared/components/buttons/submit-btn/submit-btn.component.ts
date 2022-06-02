import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-submit-btn',
  templateUrl: './submit-btn.component.html',
  styleUrls: ['./submit-btn.component.css']
})
export class SubmitBtnComponent implements OnInit {
  @Input() value;

  constructor() { }

  ngOnInit() {
  }

}
