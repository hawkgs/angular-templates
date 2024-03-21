import { Component, OnInit, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Product } from '../../../../../models';
import { CartService } from '../../../../data-access/cart.service';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ToastsService } from '../../../../shared/toast-feed/toasts.service';

type Availability = Product['availability'];

const AVAILABILITY_MAX_RESTRICTION: { [key in Availability]: number } = {
  ['normal']: 50,
  ['low']: 10,
  ['none']: 0,
};

@Component({
  selector: 'ec-add-to-cart-btn',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './add-to-cart-btn.component.html',
  styleUrl: './add-to-cart-btn.component.scss',
})
export class AddToCartBtnComponent implements OnInit {
  private _cart = inject(CartService);
  private _formBuilder = inject(FormBuilder);
  private _toasts = inject(ToastsService);

  AVAILABILITY_MAX_RESTRICTION = AVAILABILITY_MAX_RESTRICTION;

  product = input.required<Product>();
  isUnavailable = computed(() => this.product().availability === 'none');

  form = this._formBuilder.group({
    quantity: [1, [Validators.min(1)]],
  });

  ngOnInit() {
    const { availability } = this.product();
    const max = AVAILABILITY_MAX_RESTRICTION[availability];

    this.form.controls.quantity.addValidators(Validators.max(max));
  }

  addToCart() {
    const quantity = this.form.value.quantity || 1;
    this._cart.addToCart(this.product(), quantity);
    this._toasts.create(`${this.product().name} has been added to your cart!`);
  }
}
