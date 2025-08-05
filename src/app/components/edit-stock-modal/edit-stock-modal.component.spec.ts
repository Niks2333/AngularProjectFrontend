import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockModalComponent } from './edit-stock-modal.component';

describe('EditStockModalComponent', () => {
  let component: EditStockModalComponent;
  let fixture: ComponentFixture<EditStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
