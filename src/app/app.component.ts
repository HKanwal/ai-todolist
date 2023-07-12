import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-todolist';
  todos = [{ text: 'Create a new TODO!', editing: false }];
  done: string[] = [];
  // Starts `null` to ensure fade-in animation doesn't play on first load.
  // Never goes back to `null` after being assigned as a boolean.
  showDone: null | boolean = null;

  handleCreateClick() {
    this.todos.forEach((todo) => {
      if (todo.editing) {
        todo.editing = false;
      }
    });
    this.todos.push({ text: 'New TODO', editing: true });
  }

  handleTodoBeginEditing(i: number) {
    this.todos.forEach((todo) => {
      todo.editing = false;
    });
    this.todos[i].editing = true;
  }

  handleTodoTextChange(i: number, newText: string) {
    this.todos[i].text = newText;
    this.todos[i].editing = false;
  }

  handleToggleChange(change: MatSlideToggleChange) {
    this.showDone = change.checked;
  }

  handleCheckboxCheck(i: number) {
    this.done.push(this.todos[i].text);
    setTimeout(() => {
      this.todos.splice(i, 1);
    }, 500);
  }
}
