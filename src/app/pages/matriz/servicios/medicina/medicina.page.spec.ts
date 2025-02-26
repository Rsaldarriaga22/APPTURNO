import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicinaPage } from './medicina.page';

describe('MedicinaPage', () => {
  let component: MedicinaPage;
  let fixture: ComponentFixture<MedicinaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
