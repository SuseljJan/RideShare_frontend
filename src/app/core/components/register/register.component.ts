import {Component, OnInit} from '@angular/core';
import {RegisterUser} from '../../../shared/models/api-models/register-user';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {Token} from '../../../shared/models/api-models/token';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: RegisterUser = new RegisterUser('', '', '', '');

  constructor(
    private apiAccess: ApiAccessService,
    private auth: AuthService,
  ) {
  }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.user);
  }

}
