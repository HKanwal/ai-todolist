import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { Todos } from './todo-list/todo-list.component';
import { apiUrl } from 'src/constants';

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
  todos: Todos = { [getToday()]: [{ text: 'Create a new TODO!', done: 'NotDone' }] };
  screenTransition: 'Init' | 'ToDone' | 'ToTodo' = 'Init';
  modalShown = false;
  modalText = new FormControl('', [Validators.required]);
  editing: 'NotEditing' | { date: string; i: number } = 'NotEditing';

  constructor(private http: HttpClient) {
    console.log('App initiated! CD Works! Attempt 2');
  }

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

  handleRoboBtnClick() {
    const threeLatestDates: string[] = [];
    const threeLatest: Todos[string] = [];

    for (let date in this.todos) {
      threeLatestDates.push(date);
      if (threeLatestDates.length > 3) threeLatestDates.shift();
    }

    for (let date of threeLatestDates.reverse()) {
      for (let i = this.todos[date].length - 1; i >= 0; i--) {
        threeLatest.push(this.todos[date][i]);
        if (threeLatest.length === 3) break;
      }
      if (threeLatest.length === 3) break;
    }

    const reqBody = { todos: threeLatest.map((todo) => todo.text) };
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      const streamReader: () => void = () => {
        return reader!.read().then(({ done, value }) => {
          if (done) {
            console.log('Stream has ended');
            return;
          }

          // Convert Uint8Array to string using TextDecoder
          const chunk = decoder.decode(value);

          // Handle the streamed chunk of data
          const splitChunk = chunk.split('data: ')[1];
          if (splitChunk === '[DONE]') return;
          const parsed = JSON.parse(splitChunk);
          this.modalText.setValue(this.modalText.value + parsed.choices[0].text);
          console.log(chunk);
          console.log(splitChunk);
          console.log(parsed.choices[0]['finish_reason']);
          if (parsed.choices[0]['finish_reason'] === 'stop') return;

          // Continue reading the stream
          return streamReader();
        });
      };

      return streamReader();
    });

    this.modalText.setValue('');
    this.modalText.markAsUntouched();
    this.modalShown = true;
  }
}
