import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioAcademicoForm } from './horario-academico-form';

describe('HorarioAcademicoForm', () => {
  let component: HorarioAcademicoForm;
  let fixture: ComponentFixture<HorarioAcademicoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioAcademicoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioAcademicoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
