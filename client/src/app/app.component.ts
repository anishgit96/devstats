import { Component, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from './components/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient]
})
export class AppComponent {
  title = 'app';
}
