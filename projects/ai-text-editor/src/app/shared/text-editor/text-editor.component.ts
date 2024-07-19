import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'ate-text-editor',
  standalone: true,
  imports: [],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements AfterViewInit {
  editor = viewChild.required<ElementRef>('editor');

  ngAfterViewInit() {
    setTimeout(() => {
      this.editor().nativeElement.focus();
    });
  }
}
