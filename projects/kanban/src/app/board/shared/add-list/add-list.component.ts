import {
  Component,
  effect,
  ElementRef,
  inject,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'kb-add-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss',
})
export class AddListComponent {
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    name: ['', Validators.required],
  });

  listCreator = signal<boolean>(false);
  nameInput = viewChild<ElementRef>('nameInput');

  listCreate = output<string>();

  constructor() {
    effect(() => {
      if (this.listCreator() && this.nameInput()) {
        this.nameInput()!.nativeElement.focus();
      }
    });
  }

  addList() {
    this.listCreator.set(false);

    const name = this.form.value.name as string;
    this.listCreate.emit(name);
  }
}
