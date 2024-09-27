import { Component, inject, input, Input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { Label } from '../../../../../../models';

@Component({
  selector: 'kb-label-form',
  standalone: true,
  imports: [ReactiveFormsModule, ColorPickerComponent],
  templateUrl: './label-form.component.html',
  styleUrl: './label-form.component.scss',
})
export class LabelFormComponent {
  private _formBuilder = inject(FormBuilder);
  form = this._formBuilder.group({
    name: ['', Validators.required],
    color: ['', Validators.required],
  });

  submitButtonName = input<string>('Create');
  formSubmit = output<Label>();

  private _id?: string;

  @Input()
  set label(v: Label) {
    this._id = v.id;
    this.form.controls.name.setValue(v.name);
    this.form.controls.color.setValue(v.color);
  }

  onSubmit() {
    const { name, color } = this.form.value;

    this.formSubmit.emit(
      new Label({
        id: this._id,
        name: name!,
        color: color!,
      }),
    );
  }
}
