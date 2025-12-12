import { Component } from '@angular/core';
import { LoginComponent } from "../login-component/login-component";

@Component({
  selector: 'app-public-layout',
  imports: [LoginComponent],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {

}
