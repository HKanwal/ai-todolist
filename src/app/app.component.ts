import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-todolist';
  modalShown = false;

  showModal() {
    this.modalShown = true;
  }

  hideModal() {
    this.modalShown = false;
  }
}
