import {Directive, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {LoggedInStatusService} from '../services/logged-in-status.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[nonAuthOnly]'
})
export class NonAuthenticatedOnlyDirective implements OnInit{

  constructor(
    private auth: AuthService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private loggedInStatus: LoggedInStatusService,
  ) { }

  ngOnInit(): void {
    let alreadyShown = false;

    if (!this.auth.isAuthenticated()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      alreadyShown = true;
    } else {
      this.viewContainer.clear();
      alreadyShown = false;
    }


    this.loggedInStatus.isLoggedInEmitter.subscribe(data => {
      if (!data) {
        if (!alreadyShown) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          alreadyShown = true;
        }
      } else {
        this.viewContainer.clear();
        alreadyShown = false;
      }
    });
  }

}
