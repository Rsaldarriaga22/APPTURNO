import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMatrizPage } from './home-matriz.page';

describe('HomeMatrizPage', () => {
  let component: HomeMatrizPage;
  let fixture: ComponentFixture<HomeMatrizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMatrizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
