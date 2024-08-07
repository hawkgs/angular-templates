import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '@ngx-templates/shared/button';
import { IconComponent } from '@ngx-templates/shared/icon';
import { ToastsService } from '@ngx-templates/shared/toasts';
import { WINDOW } from '@ngx-templates/shared/services';

import { GeminiService } from '../../../gemini/gemini.service';
import { SelectionManager } from '../selection-manager.service';

type EnhancerState = 'standby' | 'user-prompt' | 'loading' | 'ready';

const SELECTION_MARGIN = 10;
const VIEWPORT_PADDING = 24; // 12 on each side

@Component({
  selector: 'ate-ai-enhancer-menu',
  standalone: true,
  imports: [ButtonComponent, IconComponent, ReactiveFormsModule],
  templateUrl: './ai-enhancer-menu.component.html',
  styleUrl: './ai-enhancer-menu.component.scss',
})
export class AiEnhancerMenuComponent implements OnDestroy, AfterViewInit {
  private _selection = inject(SelectionManager);
  private _formBuilder = inject(FormBuilder);
  private _gemini = inject(GeminiService);
  private _toasts = inject(ToastsService);
  private _elRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _win = inject(WINDOW);

  promptInput = viewChild<ElementRef>('promptInput');

  enhance = output<void>();

  userPromptForm = this._formBuilder.group({
    prompt: ['', [Validators.required, Validators.minLength(3)]],
  });

  position = input.required<{ x: number; y: number }>();
  state = signal<EnhancerState>('standby');
  output = signal<string>('');

  constructor() {
    effect(() => {
      if (this.state() === 'user-prompt') {
        // Focus the prompt input when rendered
        this.promptInput()?.nativeElement.focus();
      }
    });
  }

  ngAfterViewInit() {
    const observer = new ResizeObserver((entries) => {
      const entry = entries.pop();
      if (entry) {
        this._updateElementPos();
      }
    });

    observer.observe(this._elRef.nativeElement);
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

  private _updateElementPos() {
    const p = this.position();
    const el = this._elRef.nativeElement;

    const width = this._elRef.nativeElement.offsetWidth;
    const maxX =
      this._win.innerWidth - width - SELECTION_MARGIN - VIEWPORT_PADDING;

    p.x = Math.min(p.x, maxX);

    this._renderer.setStyle(el, 'top', p.y + SELECTION_MARGIN + 'px');
    this._renderer.setStyle(el, 'left', p.x + SELECTION_MARGIN + 'px');
  }
}
