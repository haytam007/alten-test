import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  email: string = '';
  message: string = '';
  successMessage: boolean = false;

  onSubmit(contactForm: any) {
    if (contactForm.invalid) {
      contactForm.controls.emailInput.markAsTouched();
      contactForm.controls.messageInput.markAsTouched();
      return;
    }

    // Afficher un message de succès
    this.successMessage = true;

    // Réinitialiser le formulaire
    this.email = '';
    this.message = '';

    contactForm.resetForm();
  }
}
