import { Component, EventEmitter, Input, Output } from '@angular/core';

export type Todos = {
  [date in string]: {
    text: string;
    done: 'NotDone' | 'InAnimation' | 'Done';
  }[];
};

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  @Input() done = false;
  @Input() shown = true;
  @Input() todos: Todos = {};
  @Output() check = new EventEmitter<{ date: string; i: number }>();
  @Output() edit = new EventEmitter<{ date: string; i: number }>();

  formatDate(date: string) {
    return date.split(', ')[0];
  }

  handleCheck(date: string, i: number) {
    this.check.emit({ date, i });
  }

  handleEdit(date: string, i: number) {
    this.edit.emit({ date, i });
  }
}
