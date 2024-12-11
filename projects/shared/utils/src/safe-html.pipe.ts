import { isPlatformBrowser } from '@angular/common';
import { inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Bypasses the built-in HTML sanitization.
 * Used for rendering HTML from a source.
 *
 * Script tags are stripped in order to prevent XSS.
 */
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);
  private _platformId = inject(PLATFORM_ID);

  transform(html: string): SafeHtml {
    const sanitized = this._sanitizeHtml(html);
    return this._sanitizer.bypassSecurityTrustHtml(sanitized);
  }

  private _sanitizeHtml(html: string): string {
    if (!isPlatformBrowser(this._platformId)) {
      return '';
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const scriptTags = doc.querySelectorAll('script');
    scriptTags.forEach((s) => s.remove());

    return doc.body.innerHTML;
  }
}
