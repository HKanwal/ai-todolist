import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';

function getYear() {
  const today = new Date();
  const [month, date, year] = today.toDateString().split(' ').slice(1);
  return year;
}

type DisplayState = 'FadingIn' | 'FadingOut' | 'Hidden';

export type Todos = {
  text: string;
  done: 'InInitAnimation' | 'NotDone' | 'InDoneAnimation' | 'Done';
}[];

@Component({
  selector: 'app-dated-section',
  templateUrl: './dated-section.component.html',
  styleUrls: ['./dated-section.component.css'],
})
export class DatedSectionComponent implements DoCheck {
  @Input() date: string = 'Jan 01, 1905';
  displayState: DisplayState = 'Hidden';
  @Input() done = false;
  @Input() todos: Todos = [];
  @Output() check = new EventEmitter();
  @Output() edit = new EventEmitter<{ date: string; i: number }>();

  ngDoCheck() {
    if (this.hasDispTodos()) {
      this.displayState = 'FadingIn';
    }
  }

  formatDate(date: string) {
    if (date.split(', ')[1] !== getYear()) {
      return date;
    } else {
      return date.split(', ')[0];
    }
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

      if (!this.hasDispTodos()) {
        this.displayState = 'FadingOut';
        setTimeout(() => {
          this.displayState = 'Hidden';
        }, 500);
      }
    }, 500);
  }

  handleEdit(i: number) {
    const date = this.date;
    this.edit.emit({ date, i });
  }
}
