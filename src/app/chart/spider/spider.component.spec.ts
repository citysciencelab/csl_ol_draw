import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {} from 'jasmine';
import {SpiderComponent} from "./spider.component";

describe('SpiderComponent', () => {
  let component: SpiderComponent;
  let fixture: ComponentFixture<SpiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
