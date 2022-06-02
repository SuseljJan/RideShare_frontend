import {AfterViewInit, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subject} from 'rxjs';
import {LoggedInStatusService} from '../services/logged-in-status.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[authOnly]'
})
export class AuthenticatedOnlyDirective implements  OnInit, OnDestroy {


  constructor(
    private auth: AuthService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private loggedInStatus: LoggedInStatusService,
  ) {
  }

  ngOnInit(): void {
      if (this.auth.isAuthenticated()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }


      this.loggedInStatus.isLoggedInEmitter.subscribe(data => {
        if (data) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });

  }

  ngOnDestroy(): void {

  }


}
