import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaInput } from './media-input';

describe('MediaInput', () => {
  let component: MediaInput;
  let fixture: ComponentFixture<MediaInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
