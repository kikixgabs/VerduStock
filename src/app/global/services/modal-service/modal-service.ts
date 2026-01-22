import { inject, Injectable, Injector, signal } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import gsap from 'gsap';
import { Subject, Observable } from 'rxjs'; // Importamos RxJS

// Definimos la estructura de una instancia de modal
interface ModalInstance {
  overlayRef: OverlayRef;
  afterClosedSubject: Subject<any>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  overlay = inject(Overlay);
  injector = inject(Injector);

  // Guardamos las instancias completas (ref + subject)
  private modalInstances: ModalInstance[] = [];

  isOpen = signal(false);
  data = signal<any>(null);

  // Eliminamos el 'async' de la firma para devolver el objeto inmediatamente
  open(component: any, data?: any) {
    this.data.set(data ?? null);

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    overlayRef.backdropClick().subscribe(() => this.close());

    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: 'MODAL_DATA', useValue: data ?? null }],
    });

    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    // Creamos un subject específico para este modal
    const afterClosedSubject = new Subject<any>();

    this.modalInstances.push({ overlayRef, afterClosedSubject });
    this.isOpen.set(true);

    // Devolvemos un objeto que tiene la función afterClosed
    return {
      afterClosed: () => afterClosedSubject.asObservable()
    };
  }

  async close(result?: any) {
    const instance = this.modalInstances.pop();
    if (!instance) {
      this.isOpen.set(false);
      return;
    }

    const { overlayRef, afterClosedSubject } = instance;
    const element = overlayRef.overlayElement.querySelector('div');

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
    this.isOpen.set(this.modalInstances.length > 0);

    // Notificamos que se cerró y enviamos el resultado (si lo hay)
    afterClosedSubject.next(result);
    afterClosedSubject.complete();
  }
}