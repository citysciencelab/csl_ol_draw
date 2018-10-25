import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StraightMenuComponent } from './straight-menu.component';

describe('StraightMenuComponent', () => {
  let component: StraightMenuComponent;
  let fixture: ComponentFixture<StraightMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StraightMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StraightMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
