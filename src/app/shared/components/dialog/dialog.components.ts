import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dialog',
  imports: [NgIf],
  templateUrl: './dialog.components.html',
  styleUrls: ['./dialog.components.css'],
})
export class DialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() showCloseButton: boolean = true;

  @Output() closeDialog = new EventEmitter<void>();

  onClose(): void {
    this.closeDialog.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.closeDialog.emit();
    }
  }
}
