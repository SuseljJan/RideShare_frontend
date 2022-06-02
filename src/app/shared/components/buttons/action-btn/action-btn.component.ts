import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-action-btn',
  templateUrl: './action-btn.component.html',
  styleUrls: ['./action-btn.component.css']
})
export class ActionBtnComponent implements OnInit {
  @Input() routerLink: string;
  @Input() value: string;

  constructor() { }

  ngOnInit() {
  }

}
