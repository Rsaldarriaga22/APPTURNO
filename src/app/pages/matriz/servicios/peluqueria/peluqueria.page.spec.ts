import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeluqueriaPage } from './peluqueria.page';

describe('PeluqueriaPage', () => {
  let component: PeluqueriaPage;
  let fixture: ComponentFixture<PeluqueriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PeluqueriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
