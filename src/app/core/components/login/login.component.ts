import { Component, OnInit } from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {LoginUser} from '../../../shared/models/api-models/login-user';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: LoginUser = new LoginUser('', '');

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.user);
  }
}
