import { Component, inject } from '@angular/core';
import { CtxMenuService } from '../ctx-menu.service';
import { CtxMenuComponent } from '../ctx-menu/ctx-menu.component';

@Component({
  selector: 'ngx-ctx-menu-outlet',
  standalone: true,
  imports: [CtxMenuComponent],
  templateUrl: './ctx-menu-outlet.component.html',
  styleUrl: './ctx-menu-outlet.component.scss',
})
export class CtxMenuOutletComponent {
  ctxMenu = inject(CtxMenuService);
}
