import { inject, Injectable, Injector, signal } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import gsap from 'gsap';

@Injectable({ providedIn: 'root' })
export class ModalService {
  overlay = inject(Overlay);
  injector = inject(Injector);
  overlayRefs: OverlayRef[] = [];

  isOpen = signal(false);
  data = signal<any>(null);

  async open(component: any, data?: any) {
    this.data.set(data ?? null);

    // Create a new overlay for every call, stacking them
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    // Clicking backdrop closes only the top-most modal
    overlayRef.backdropClick().subscribe(() => this.close());

    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: 'MODAL_DATA', useValue: data ?? null }],
    });

    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    this.overlayRefs.push(overlayRef);
    this.isOpen.set(true);
  }

  async close() {
    const overlayRef = this.overlayRefs.pop(); // Get top-most modal
    if (!overlayRef) {
      this.isOpen.set(false);
      return;
    }

    const element = overlayRef.overlayElement.querySelector('div'); // Generic selector

    if (element) {
      await gsap.to(element, {
        duration: 0.35,
        opacity: 0,
        y: 50,
        scale: 0.9,
        ease: 'power2.inOut'
      });
    }

    overlayRef.dispose();

    // Update state based on remaining modals
    this.isOpen.set(this.overlayRefs.length > 0);
  }
}
