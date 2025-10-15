import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { createFileToBase64 } from '@core/utils/convert-file-to-base64';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'file-upload',
  imports: [FileUploadModule, ButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input({ required: true }) control: FormControl;
  @Input() base64: boolean = false;
  @Input() title: string = 'Dashboard.Uploader';
  @Input() showTitle: boolean = true;
  @Input() chooseLabel: string = 'Dashboard.ChooseFile';
  uploadNewLogo: boolean = false;
  iconValue: any;

  setFileForm(file: FileSelectEvent) {
    if (!file) {
      this.control.setValue(null);
      return;
    }

    if (this.base64) {
      createFileToBase64(file.files[0]).then((base64) => {
        this.control.setValue(base64);
      });
    } else {
      this.control.setValue(file.files[0]);
    }
  }
}
