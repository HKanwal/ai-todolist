import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-todolist';
  todos = ['Create a new TODO!'];
  done: string[] = [];
  // Starts `null` to ensure fade-in animation doesn't play on first load.
  // Never goes back to `null` after being assigned as a boolean.
  showDone: null | boolean = null;
  modalShown = false;
  modalText = new FormControl('', [Validators.required]);
  editing: null | number = null;

  handleCreateClick() {
    this.modalText.setValue('');
    this.modalText.markAsUntouched();
    this.modalShown = true;
  }

  handleModalClose() {
    this.modalShown = false;
  }

  handleToggleChange(change: MatSlideToggleChange) {
    this.showDone = change.checked;
  }

  handleCheckboxCheck(i: number) {
    this.done.push(this.todos[i]);
    setTimeout(() => {
      this.todos.splice(i, 1);
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
      this.todos[this.editing] = this.modalText.value ?? '';
    } else {
      this.todos.push(this.modalText.value ?? '');
    }

    this.modalShown = false;
    this.modalText.setValue('');
  }

  handleBeginEditing(i: number) {
    this.editing = i;
    this.modalText.setValue(this.todos[i]);
    this.modalShown = true;
  }
}
