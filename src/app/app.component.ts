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
  screenTransition: 'Init' | 'ToDone' | 'ToTodo' = 'Init';
  modalShown = false;
  modalText = new FormControl('', [Validators.required]);
  editing: 'NotEditing' | { date: string; i: number } = 'NotEditing';

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
    this.editing = 'NotEditing';
  }

  handleToggleChange(change: MatSlideToggleChange) {
    this.screenTransition = change.checked ? 'ToDone' : 'ToTodo';
  }

  handleModalInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.modalText.setValue(target.value);
  }

  handleSaveClick() {
    if (this.modalText.invalid) {
      return;
    }

    if (this.editing !== 'NotEditing') {
      this.todos[this.editing.date][this.editing.i].text = this.modalText.value ?? '';
      this.editing = 'NotEditing';
    } else {
      if (!this.todos[getToday()]) this.todos[getToday()] = [];
      this.todos[getToday()].push({ text: this.modalText.value ?? '', done: 'InInitAnimation' });
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
