import { Component, EventEmitter, Input, Output } from '@angular/core';

export type Todos = {
  [date in string]: {
    text: string;
    done: 'InInitAnimation' | 'NotDone' | 'InDoneAnimation' | 'Done';
  }[];
};

type InitStage = 'Uninitialized' | 'Initialized' | 'PostInit';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  @Input() done = false;
  _shown = true;
  @Input() initialAnim = true;
  initStage: InitStage = 'Uninitialized';
  @Input() todos: Todos = {};
  @Output() edit = new EventEmitter<{ date: string; i: number }>();

  @Input()
  set shown(newVal: boolean) {
    if (this.initStage === 'Uninitialized') {
      this.initStage = 'Initialized';
    } else if (this.initStage === 'Initialized') {
      this.initStage = 'PostInit';
    }
    this._shown = newVal;
  }

  get shown() {
    return this._shown;
  }

  formatDate(date: string) {
    return date.split(', ')[0];
  }

  dateShowsTodo(date: string) {
    return !!this.todos[date].find(
      (todo) => (!this.done && todo.done !== 'Done') || (this.done && todo.done === 'Done')
    );
  }

  // This is bad practice because it is an expensive calculation that runs every
  // re-render to determine whether or not to show placeholder text
  allDone() {
    for (let date in this.todos) {
      if (this.todos[date].find((todo) => todo.done !== 'Done')) {
        return false;
      }
    }
    return true;
  }

  // This is bad practice because it is an expensive calculation that runs every
  // re-render to determine whether or not to show placeholder text
  noneDone() {
    for (let date in this.todos) {
      if (this.todos[date].find((todo) => todo.done === 'Done')) {
        return false;
      }
    }
    return true;
  }

  handleCheck(date: string, i: number) {
    this.todos[date][i].done = 'InDoneAnimation';
    setTimeout(() => {
      this.todos[date][i].done = 'Done';
    }, 500);
  }

  handleEdit(date: string, i: number) {
    this.edit.emit({ date, i });
  }
}
