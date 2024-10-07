import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { CartService } from 'app/products/data-access/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, CommonModule, FormsModule, InputTextModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public readonly products = this.productsService.products;
  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  public rowsPerPage = 5;
  public currentPage = 0;
  public filterText: string = '';
  private readonly filteredProductsSignal = signal<Product[]>([]);

  ngOnInit() {
    this.productsService.get().subscribe(() => {
      this.applyFilter(); 
    });
  }

  public filteredProducts(): Product[] {
    return this.filteredProductsSignal();
  }

  public applyFilter(): void {
    const filter = this.filterText.toLowerCase();
    this.filteredProductsSignal.set(
      this.products().filter(product => 
        product.name.toLowerCase().includes(filter) ||
        product.category.toLowerCase().includes(filter) ||
        product.description.toLowerCase().includes(filter)
      )
    );
  }

  public paginate(event: any) {
    this.currentPage = event.page;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set({ ...emptyProduct });
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set({ ...product });
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe(() => {
      this.applyFilter(); 
    });
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe((createdProduct) => {
        if (createdProduct) {
          this.applyFilter(); 
        }
      });
    } else {
      this.productsService.update(product).subscribe((updatedProduct) => {
        if (updatedProduct) {
          this.applyFilter(); 
        }
      });
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
