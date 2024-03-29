import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { IconComponent } from '../../../shared/icon/icon.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SearchInputComponent } from '../../../shared/search-input/search-input.component';

@Component({
  selector: 'ec-product-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconComponent,
    ButtonComponent,
    SearchInputComponent,
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent {
  @Output() search = new EventEmitter<string>();
  private _formBuilder = inject(FormBuilder);

  searchForm = this._formBuilder.group({
    searchString: [''],
  });

  onProductSearch(e: Event) {
    e.preventDefault();
    const searchString = this.searchForm.value.searchString || '';

    this.search.emit(searchString);
  }
}
