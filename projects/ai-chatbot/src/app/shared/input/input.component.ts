import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  output,
  Renderer2,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '@ngx-templates/shared/icon';

@Component({
  selector: 'acb-input',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements AfterViewInit {
  private _renderer = inject(Renderer2);
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    prompt: ['', [Validators.required, Validators.pattern(/\S+/)]],
  });

  textarea = viewChild.required<ElementRef>('textarea');
  send = output<string>();

  ngAfterViewInit() {
    this.textarea().nativeElement.focus();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterPress(e: Event) {
    e.preventDefault();

    this.sendPrompt();
  }

  sendPrompt() {
    const prompt = this.form.value.prompt!;
    this.send.emit(prompt);
    this.form.reset();
  }

  setHeight() {
    const element = this.textarea().nativeElement;

    this._renderer.setStyle(element, 'height', null);
    this._renderer.setStyle(
      element,
      'height',
      element.scrollHeight + 2.5 + 'px',
    );
  }
}
