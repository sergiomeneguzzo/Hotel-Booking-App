import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { urlValidator } from '../../validators/url-validator';

@Component({
  selector: 'app-edit-picture',
  templateUrl: './edit-picture.component.html',
  styleUrl: './edit-picture.component.scss',
})
export class EditPictureComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditPictureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentPicture: string },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      newPictureUrl: [
        data.currentPicture,
        [Validators.required, urlValidator()],
      ],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.newPictureUrl);
    }
  }
}
