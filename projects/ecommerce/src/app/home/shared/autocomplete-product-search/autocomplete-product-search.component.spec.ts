import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteProductSearchComponent } from './autocomplete-product-search.component';

describe('AutocompleteProductSearchComponent', () => {
  let component: AutocompleteProductSearchComponent;
  let fixture: ComponentFixture<AutocompleteProductSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteProductSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
