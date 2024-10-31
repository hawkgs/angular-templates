import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ec-skeleton-product-item',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-product-item.component.html',
  styleUrl: './skeleton-product-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonProductItemComponent {}
