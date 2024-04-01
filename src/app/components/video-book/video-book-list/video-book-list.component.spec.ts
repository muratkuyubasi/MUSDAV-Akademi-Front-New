import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBookListComponent } from './video-book-list.component';

describe('VideoBookListComponent', () => {
  let component: VideoBookListComponent;
  let fixture: ComponentFixture<VideoBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoBookListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
