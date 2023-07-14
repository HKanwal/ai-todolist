import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent {
  @Input() text = 'Write your TODO here!';
  @Input() _done = false;
  @Input() initAnimation = false;
  @Output() editClick = new EventEmitter();
  @Output() check = new EventEmitter();
  checked = false;

  @Input()
  set done(newVal: boolean) {
    this._done = newVal;

    if (newVal) {
      this.checked = true;
    }
  }

  get done() {
    return this._done;
  }

  handleEditClick() {
    this.editClick.emit();
  }

  handleCheckboxChange(change: { checked: boolean }) {
    if (change.checked) {
      this.check.emit();
    }

    this.checked = change.checked;
  }
}
