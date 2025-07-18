import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViagemDetail } from './viagem-detail';

describe('ViagemDetail', () => {
  let component: ViagemDetail;
  let fixture: ComponentFixture<ViagemDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViagemDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViagemDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
