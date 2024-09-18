import { Component } from '@angular/core';
import { AutocompleteProductSearchComponent } from '../autocomplete-product-search/autocomplete-product-search.component';

@Component({
  selector: 'ec-search-section',
  standalone: true,
  imports: [AutocompleteProductSearchComponent],
  templateUrl: './search-section.component.html',
  styleUrl: './search-section.component.scss',
})
export class SearchSectionComponent {}
