import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragViewMenuComponent } from './drag-view-menu.component';

describe('DragViewMenuComponent', () => {
  let component: DragViewMenuComponent;
  let fixture: ComponentFixture<DragViewMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragViewMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragViewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
