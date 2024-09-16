import { Component } from '@angular/core';
import { SkeletonProductItemComponent } from '../../../shared/skeleton-product-item/skeleton-product-item.component';

// Used for the hydration demo
@Component({
  selector: 'ec-category-reel-skeleton',
  standalone: true,
  imports: [SkeletonProductItemComponent],
  templateUrl: './category-reel-skeleton.component.html',
  styleUrl: './category-reel-skeleton.component.scss',
})
export class CategoryReelSkeletonComponent {}
