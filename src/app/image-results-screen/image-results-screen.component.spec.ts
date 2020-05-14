import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageResultsScreenComponent } from './image-results-screen.component';

describe('ImageResultsScreenComponent', () => {
  let component: ImageResultsScreenComponent;
  let fixture: ComponentFixture<ImageResultsScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageResultsScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageResultsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
