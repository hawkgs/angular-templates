import { Component, inject } from '@angular/core';
import { SelectionManager } from '../selection-manager.service';

@Component({
  selector: 'ate-ai-enhancer-menu',
  standalone: true,
  imports: [],
  templateUrl: './ai-enhancer-menu.component.html',
  styleUrl: './ai-enhancer-menu.component.scss',
})
export class AiEnhancerMenuComponent {
  private _selection = inject(SelectionManager);

  test() {
    const text = this._selection.text().toUpperCase();
    this._selection.updateText(text);
  }
}
