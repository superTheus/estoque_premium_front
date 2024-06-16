import { Component, OnInit, Renderer2 } from '@angular/core';
import Viewer from 'viewerjs';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})

export class ImageViewerComponent implements OnInit {
  constructor(private renderer: Renderer2) { }

  viewer: any;
  imageSrc = '';

  ngOnInit() {
    const img = this.renderer.selectRootElement('#img-viewer');
    this.viewer = new Viewer(img, {
      inline: true,
    });
    this.viewer.zoomTo(1);
  }
}
