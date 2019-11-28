import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appActive]'
})
export class ActiveDirective {
  @HostBinding('class.active') isActive = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isActive = this.elRef.nativeElement.contains(event.target) ? !this.isActive : false;
  }

  constructor(private elRef: ElementRef) {}
}