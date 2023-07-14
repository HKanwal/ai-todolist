import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Todos } from './todo-list/todo-list.component';

function getToday() {
  const today = new Date();
  const [month, date, year] = today.toDateString().split(' ').slice(1);
  return `${month} ${date}, ${year}`;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-todolist';
  // 'done' prop controls visibility of todo-item
  todos: Todos = { [getToday()]: [{ text: 'Create a new TODO!', done: 'NotDone' }] };
  // Starts `null` to ensure fade-in animation doesn't play on first load.
  // Never goes back to `null` after being assigned as a boolean.
  showDone: null | boolean = null;
  modalShown = false;
  modalText = new FormControl('', [Validators.required]);
  editing: null | { date: string; i: number } = null;

  formatDate(date: string) {
    return date.split(', ')[0];
  }

  handleCreateClick() {
    this.modalText.setValue('');
    this.modalText.markAsUntouched();
    this.modalShown = true;
  }

  handleModalClose() {
    this.modalShown = false;
    this.editing = null;
  }

  handleToggleChange(change: MatSlideToggleChange) {
    this.showDone = change.checked;
  }

  handleCheck(date: string, i: number) {
    setTimeout(() => {
      this.todos[date][i].done = 'Done';
    }, 500);
  }

  handleModalInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.modalText.setValue(target.value);
  }

  handleSaveClick() {
    if (this.modalText.invalid) {
      return;
    }

    if (this.editing !== null) {
      this.todos[this.editing.date][this.editing.i].text = this.modalText.value ?? '';
      this.editing = null;
    } else {
      if (!this.todos[getToday()]) this.todos[getToday()] = [];
      this.todos[getToday()].push({ text: this.modalText.value ?? '', done: 'NotDone' });
    }

    this.modalShown = false;
    this.modalText.setValue('');
  }

  handleEdit(date: string, i: number) {
    this.editing = { date, i };
    this.modalText.setValue(this.todos[date][i].text);
    this.modalShown = true;
  }
}
