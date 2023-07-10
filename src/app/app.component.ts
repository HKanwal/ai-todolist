import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-todolist';
  todos = ['Create a new TODO!'];

  handleCreateClick() {
    this.todos.push('New TODO');
  }
}
