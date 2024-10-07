import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ProductsService {
    private readonly _products = signal<Product[]>([]);
    private readonly http = inject(HttpClient);
    private readonly path = "http://localhost:8080/products";
    
    public readonly products = this._products.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path).pipe(
            tap((products) => {
                this._products.set(products);
            }),
            catchError((error) => {
                console.error('Error fetching products from API, falling back to local file:', error);
                return this.http.get<Product[]>("assets/products.json").pipe(
                    tap((products) => this._products.set(products)),
                    catchError((jsonError) => {
                        console.error('Error fetching products from local JSON file:', jsonError);
                        return of([]);
                    })
                );
            })
        );
    }

    public create(product: Product): Observable<Product | null> {
        return this.http.post<Product>(this.path, product).pipe(
            tap((createdProduct) => this._products.update(products => [createdProduct, ...products])),
            catchError((error) => {
                console.error('Error creating product:', error);
                return of(null); 
            })
        );
    }

    public update(product: Product): Observable<Product | null> {
        return this.http.patch<Product>(`${this.path}/${product.id}`, product).pipe(
            tap((updatedProduct) => this._products.update(products => {
                return products.map(p => p.id === product.id ? updatedProduct : p);
            })),
            catchError((error) => {
                console.error('Error updating product:', error);
                return of(null); 
            })
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            tap(() => this._products.update(products => 
                products.filter(product => product.id !== productId)
            )),
            catchError((error) => {
                console.error('Error deleting product:', error);
                return of(false); 
            })
        );
    }
}
