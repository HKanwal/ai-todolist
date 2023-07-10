import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent {
  @Input() text = 'Write your TODO here!';
  @Output() onBeginEditing = new EventEmitter();
  @Output() onTextChange = new EventEmitter<string>();
  value: null | string = null;

  @Input()
  set editing(newState: boolean) {
    this.value = newState ? this.text : null;
  }

  get editing() {
    return this.value !== null;
  }

  handleEditClick() {
    this.onBeginEditing.emit();
  }

  handleInput(newText: string) {
    this.value = newText;
  }

  handleSubmit() {
    if (this.value === null) {
      return;
    }

    const trimmed = this.value.trim();
    this.onTextChange.emit(trimmed.length > 0 ? trimmed.trim() : this.text);
  }
}
