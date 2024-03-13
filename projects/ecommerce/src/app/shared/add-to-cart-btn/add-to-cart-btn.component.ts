import { Component, OnInit, inject, input } from '@angular/core';
import { Product } from '../../../models';
import { CartService } from '../../data-access/cart.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'ec-add-to-cart-btn',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-to-cart-btn.component.html',
  styleUrl: './add-to-cart-btn.component.scss',
})
export class AddToCartBtnComponent implements OnInit {
  private _cart = inject(CartService);
  private _formBuilder = inject(FormBuilder);

  product = input.required<Product>();

  form = this._formBuilder.group({
    quantity: [1, [Validators.min(1)]],
  });

  ngOnInit() {
    this.form.controls.quantity.addValidators(
      Validators.max(this.product().availableQuantity),
    );
  }

  addToCart() {
    const quantity = this.form.value.quantity || 1;
    this._cart.addToCart(this.product(), quantity);
  }
}
