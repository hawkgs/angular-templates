import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Bypasses the built-in HTML sanitization.
 * Used for rendering HTML from a source.
 *
 * Script tags are stripped in order to prevent XSS.
 */
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
