import {Component, EventEmitter, Output} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-photo-capture',
  templateUrl: './photo-capture.component.html',
  styleUrl: './photo-capture.component.scss',
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
  ],
})
export class PhotoCaptureComponent {
  @Output() photoUploaded = new EventEmitter<File>();

  uploadPhoto(files: FileList | null) {
    if (!files || !files.length) {
      return;
    }
    this.photoUploaded.emit(files[0]);
  }
}
