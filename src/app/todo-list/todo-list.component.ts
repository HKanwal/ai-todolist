import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todos } from '../dated-section/dated-section.component';
import { KeyValue } from '@angular/common';

export type DatedTodos = {
  [date in string]: Todos;
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
  @Input() todos: DatedTodos = {};
  @Output() check = new EventEmitter();
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

  // This is bad practice because it is an expensive calculation that runs every
  // re-render to determine whether or not to show placeholder text
  allDone() {
    for (let date in this.todos) {
      if (this.todos[date].find((todo) => todo.done !== 'Done' && todo.done !== 'Hidden')) {
        return false;
      }
    }
    return true;
  }

  // This is bad practice because it is an expensive calculation that runs every
  // re-render to determine whether or not to show placeholder text
  noneDone() {
    for (let date in this.todos) {
      if (this.todos[date].find((todo) => todo.done === 'Done' || todo.done === 'Hidden')) {
        return false;
      }
    }
    return true;
  }

  orderByDate(a: KeyValue<string, Todos>, b: KeyValue<string, Todos>) {
    const dateA = new Date(Date.parse(a.key));
    const dateB = new Date(Date.parse(b.key));
    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  }

  handleCheck() {
    this.check.emit();
  }

  handleEdit(date: string, i: number) {
    this.edit.emit({ date, i });
  }
}
