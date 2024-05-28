import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-photo-capture',
  templateUrl: './photo-capture.component.html',
  styleUrl: './photo-capture.component.scss'
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
