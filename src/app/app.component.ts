import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-todolist';
  todos = [{ text: 'Create a new TODO!', editing: false }];

  handleCreateClick() {
    this.todos.forEach((todo) => {
      if (todo.editing) {
        todo.editing = false;
      }
    });
    this.todos.push({ text: 'New TODO', editing: true });
  }

  handleTodoBeginEditing(i: number) {
    this.todos[i].editing = true;
  }

  handleTodoTextChange(i: number, newText: string) {
    this.todos[i].text = newText;
    this.todos[i].editing = false;
  }
}
