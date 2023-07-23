import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatedSectionComponent } from './dated-section.component';

describe('DatedSectionComponent', () => {
  let component: DatedSectionComponent;
  let fixture: ComponentFixture<DatedSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatedSectionComponent]
    });
    fixture = TestBed.createComponent(DatedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
