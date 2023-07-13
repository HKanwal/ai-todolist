import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() shown = false;
  @Input() hideX = false;
  @Output() onClose = new EventEmitter<void>();

  handleCloseClick() {
    this.onClose.emit();
  }

  handleClick(e: MouseEvent) {
    if (e.target) {
      const target = e.target as Element;
      if (target.classList.contains('backdrop')) {
        this.onClose.emit();
      }
    }
  }
}
