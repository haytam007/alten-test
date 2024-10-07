import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];

  // Retourne les produits dans le panier
  getCart(): Product[] {
    return this.cart;
  }

 // Ajoute un produit au panier
 addToCart(product: Product): void {
    const existingProduct = this.cart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }
 // Supprime un produit du panier
 removeFromCart(productId: number): void {
    this.cart = this.cart.filter(p => p.id !== productId);
  }

  // Vide le panier
  clearCart(): void {
    this.cart = [];
  }
}
