import {Injectable, OnDestroy} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionHandlerService implements OnDestroy{

  constructor() { }

  ngOnDestroy(): void {
  }
}
