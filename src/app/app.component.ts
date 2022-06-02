import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DriveWithMe-Frontend';

  constructor(
    public translate: TranslateService,
  ) {
    translate.addLangs(['en', 'sl']);
    translate.setDefaultLang('en');

    if (window.location.hostname === 'deli-prevoz.si') {
      translate.use('sl');
    } else {
      translate.use('en');
    }


    // translate.use('sl');

  }
}
