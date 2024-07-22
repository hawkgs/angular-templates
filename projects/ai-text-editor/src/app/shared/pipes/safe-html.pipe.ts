import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);

  transform(html: string) {
    const sanitized = this._sanitizeHtml(html);
    return this._sanitizer.bypassSecurityTrustHtml(sanitized);
  }

  private _sanitizeHtml(html: string) {
    return html.replace(/<script>|<\/script>/gm, '');
  }
}
