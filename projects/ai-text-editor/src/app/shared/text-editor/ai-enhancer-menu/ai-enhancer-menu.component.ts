import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '@ngx-templates/shared/button';
import { IconComponent } from '@ngx-templates/shared/icon';
import { ToastsService } from '@ngx-templates/shared/toasts';

import { GeminiService } from '../../../gemini/gemini.service';
import { SelectionManager } from '../selection-manager.service';

type EnhancerState = 'standby' | 'user-prompt' | 'loading' | 'ready';

@Component({
  selector: 'ate-ai-enhancer-menu',
  standalone: true,
  imports: [ButtonComponent, IconComponent, ReactiveFormsModule],
  templateUrl: './ai-enhancer-menu.component.html',
  styleUrl: './ai-enhancer-menu.component.scss',
})
export class AiEnhancerMenuComponent implements OnDestroy {
  private _selection = inject(SelectionManager);
  private _formBuilder = inject(FormBuilder);
  private _gemini = inject(GeminiService);
  private _toasts = inject(ToastsService);

  promptInput = viewChild<ElementRef>('promptInput');

  enhance = output<void>();

  userPromptForm = this._formBuilder.group({
    prompt: ['', [Validators.required, Validators.minLength(3)]],
  });

  state = signal<EnhancerState>('standby');
  output = signal<string>('');

  constructor() {
    effect(() => {
      if (this.state() === 'user-prompt') {
        this.promptInput()?.nativeElement.focus();
      }
    });
  }

  ngOnDestroy() {
    // In case we have memoized the selection but
    // the enhancer is closed/destroyed for some reason.
    this._selection.unmemoize();
  }

  async formalize() {
    this.state.set('loading');

    const text = this._selection.text();
    const output = await this._gemini.generate(
      'Formalize the following text',
      text,
    );

    this.output.set(output);
    this.state.set('ready');
  }

  async expand() {
    this.state.set('loading');

    const text = this._selection.text();
    const output = await this._gemini.generate(
      'Expand the following text',
      text,
    );

    this.output.set(output);
    this.state.set('ready');
  }

  activateUserPrompt() {
    this.state.set('user-prompt');
    this._selection.memoize();
  }

  async executeUserPrompt() {
    this.state.set('loading');

    const prompt = this.userPromptForm.get('prompt')?.value as string;
    const text = this._selection.text();
    const output = await this._gemini.generate(prompt, text);

    this.output.set(output);
    this.state.set('ready');
  }

  replaceSelection() {
    this._selection.updateText(this.output());
    this._selection.deselect();
    this._selection.unmemoize();

    this.output.set('');
    this.state.set('standby');
    this.enhance.emit();

    this._toasts.create('Selection replaced!', { ttl: 3000 });
  }
}
