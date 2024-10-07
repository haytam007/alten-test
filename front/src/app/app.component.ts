import {
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from './products/data-access/cart.service';
import { Product } from './products/data-access/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule],
})
export class AppComponent implements OnInit {
  cart: Product[] = [];
  private readonly cartService = inject(CartService);
  title = "ALTEN SHOP";

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.cart = this.cartService.getCart(); 
  }
  public get cartItemCount(): number {
    return this.cartService.getCart().length;
  }
}
