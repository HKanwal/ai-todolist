import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.css'],
})
export class EditFieldComponent implements AfterViewInit {
  @ViewChild('editField') editField: ElementRef<HTMLInputElement> | undefined = undefined;
  @Input() value: string = 'Write your TODO here!';
  @Output() onInput = new EventEmitter<string>();
  @Output() onSubmit = new EventEmitter();

  ngAfterViewInit(): void {
    this.editField?.nativeElement.select();
  }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.onInput.emit(target.value);
  }

  handleSubmit() {
    this.onSubmit.emit();
  }
}
