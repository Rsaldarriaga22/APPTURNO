import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoUsuarioPage } from './tipo-usuario.page';

describe('TipoUsuarioPage', () => {
  let component: TipoUsuarioPage;
  let fixture: ComponentFixture<TipoUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
