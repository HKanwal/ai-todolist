import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { DatedTodos } from './todo-list/todo-list.component';
import { apiUrl } from 'src/constants';

function getToday() {
  const today = new Date();
  const [month, date, year] = today.toDateString().split(' ').slice(1);
  return `${month} ${date}, ${year}`;
}

type ChatDatum = {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: {
    index: number;
    delta:
      | {
          role: 'assistant';
          content: string;
        }
      | {};
    finish_reason: null | 'stop';
  }[];
};

type AiChoices = 'Ungenerated' | 'Choice0' | 'Choice1' | 'Choice2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ai-todolist';
  todos: DatedTodos = { [getToday()]: [{ text: 'Create a new TODO!', done: 'NotDone' }] };
  screenTransition: 'Init' | 'ToDone' | 'ToTodo' = 'Init';
  modalShown = false;
  modalText = new FormControl('', [Validators.required]);
  editing: 'NotEditing' | { date: string; i: number } = 'NotEditing';

  typeTimer: null | NodeJS.Timer = null;
  textBuffer: string[] = [];

  choices = ['', '', ''];
  dispChoice: AiChoices = 'Ungenerated';
  lastReqBody: string[] = [];

  loading = false;

  constructor(private http: HttpClient) {
    const localTodos = localStorage.getItem('todos');
    const localChoices = localStorage.getItem('choices');

    if (localTodos !== null) {
      this.todos = JSON.parse(localTodos);
    }

    if (localChoices !== null) {
      this.choices = JSON.parse(localChoices);
      this.dispChoice = 'Choice2';
      this.lastReqBody = this.getThreeLatest();
    }
  }

  saveTodosLocally() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
    localStorage.removeItem('choices');
  }

  saveChoicesLocally() {
    localStorage.setItem('choices', JSON.stringify(this.choices));
  }

  typeText(text: string) {
    this.textBuffer.push(...text.split(''));

    if (this.typeTimer !== null) {
      return;
    }

    this.typeTimer = setInterval(() => {
      const char = this.textBuffer.shift();
      if (char !== undefined) {
        this.modalText.setValue(this.modalText.value + char);
      } else {
        clearInterval(this.typeTimer!);
        this.typeTimer = null;
      }
    }, 80);
  }

  handleCheck() {
    this.saveTodosLocally();
  }

  handleCreateClick() {
    this.modalText.setValue('');
    this.modalText.markAsUntouched();
    this.modalShown = true;
  }

  handleModalClose() {
    this.modalShown = false;
    this.editing = 'NotEditing';
    this.loading = false;
    this.modalText.setErrors({ serverError: false });
    this.modalText.setValue('');

    this.textBuffer = [];
    if (this.typeTimer !== null) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
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
    this.saveTodosLocally();

    this.modalShown = false;
    this.modalText.setValue('');
    this.modalText.setErrors({ serverError: false });
    this.textBuffer = [];
    if (this.typeTimer !== null) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
  }

  handleEdit(date: string, i: number) {
    this.editing = { date, i };
    this.modalText.setValue(this.todos[date][i].text);
    this.modalShown = true;
  }

  getThreeLatest() {
    const threeLatestDates: string[] = [];
    const threeLatest: DatedTodos[string] = [];

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

    return threeLatest.map((todo) => todo.text);
  }

  handleRoboBtnClick() {
    const latestThree = this.getThreeLatest();

    this.modalText.setValue('');
    this.modalText.markAsUntouched();
    this.modalShown = true;

    if (
      this.dispChoice !== 'Ungenerated' &&
      this.lastReqBody.length > 0 &&
      latestThree[0] === this.lastReqBody[0] &&
      latestThree[1] === this.lastReqBody[1] &&
      latestThree[2] === this.lastReqBody[2]
    ) {
      switch (this.dispChoice) {
        case 'Choice0':
          this.typeText(this.choices[1]);
          this.dispChoice = 'Choice1';
          break;

        case 'Choice1':
          this.typeText(this.choices[2]);
          this.dispChoice = 'Choice2';
          break;

        case 'Choice2':
          this.typeText(this.choices[0]);
          this.dispChoice = 'Choice0';
          break;

        default:
          console.error('THIS SHOULD NEVER RUN');
          console.log(this.dispChoice);
      }

      return;
    }

    this.lastReqBody = latestThree;
    const reqBody = { todos: latestThree };
    this.loading = true;

    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        this.loading = false;
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        this.choices = ['', '', ''];
        let choiceBeingRead = 0;

        const streamReader: () => void = () => {
          return reader!.read().then(({ done, value }) => {
            if (done) {
              this.saveChoicesLocally();
              return;
            }

            // Convert Uint8Array to string using TextDecoder
            const chunks = decoder.decode(value).split('\n');
            const datums: ChatDatum[] = [];
            chunks.forEach((chunk) => {
              if (chunk.length > 0) {
                if (!chunk.includes('[DONE]')) {
                  datums.push(JSON.parse(chunk.split('data: ')[1]));
                }
              }
            });
            const deltas = datums.map((datum) => {
              if ('content' in datum.choices[0].delta) {
                return datum.choices[0].delta.content;
              } else {
                return '';
              }
            });
            for (let delta of deltas) {
              if (delta.includes('\n')) {
                this.choices[choiceBeingRead] += delta.split('\n')[0];
                choiceBeingRead++;
                this.choices[choiceBeingRead] += delta.split('\n')[1];
              } else {
                this.choices[choiceBeingRead] += delta;
              }

              if (choiceBeingRead === 0) {
                this.typeText(delta);
                this.dispChoice = 'Choice0';
              }
            }

            // Continue reading the stream
            return streamReader();
          });
        };

        return streamReader();
      })
      .catch((e) => {
        this.loading = false;
        this.modalText.markAsTouched();
        this.modalText.setErrors({ serverError: true });
        console.error(e);
      });
  }
}
