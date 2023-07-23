import { Component, EventEmitter, Input, Output } from '@angular/core';

export type Todos = {
  text: string;
  done: 'InInitAnimation' | 'NotDone' | 'InDoneAnimation' | 'Done';
}[];

@Component({
  selector: 'app-dated-section',
  templateUrl: './dated-section.component.html',
  styleUrls: ['./dated-section.component.css'],
})
export class DatedSectionComponent {
  @Input() date: string = 'Jan 01, 1905';
  @Input() done = false;
  @Input() todos: Todos = [];
  @Output() check = new EventEmitter();
  @Output() edit = new EventEmitter<{ date: string; i: number }>();

  formatDate(date: string) {
    return date.split(', ')[0];
  }

  hasDispTodos() {
    return !!this.todos.find((todo) => {
      return (!this.done && todo.done !== 'Done') || (this.done && todo.done === 'Done');
    });
  }

  handleCheck(i: number) {
    this.todos[i].done = 'InDoneAnimation';
    setTimeout(() => {
      this.todos[i].done = 'Done';
      this.check.emit();
    }, 500);
  }

  handleEdit(i: number) {
    const date = this.date;
    this.edit.emit({ date, i });
  }
}
