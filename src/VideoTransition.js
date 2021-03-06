import vertTransition from '@/glsl/transition.vert';
import fragTransition from '@/glsl/transition.frag';

import { Curtains } from 'curtainsjs';

export default class VideoTransition {
  constructor (planeElement) {
    this.curtains = new Curtains({ container: 'canvas' });
    this.pixelRatio = window.devicePixelRatio || 1.0;
    this.planeElement = planeElement;

    this.mouseLastPosition = { x: 0, y: 0 };
    this.mousePosition = { x: 0, y: 0 };

    this.activeTexture = false;
    this.cliccked = false;

    this.transitionTimer = 0;
    this.loadedVideos = 0;
    this.mouseDelta = 0;
    this.offsetTop = 0;

    this.plane = this.curtains.addPlane(this.planeElement, {
      fragmentShader: fragTransition,
      vertexShader: vertTransition,

      heightSegments: 20,
      widthSegments: 20,

      uniforms: {
        minRadius: {
          value: this.planeElement.clientWidth / 30,
          name: 'minRadius',
          type: '1f'
        },

        maxRadius: {
          value: this.planeElement.clientWidth / 5,
          name: 'maxRadius',
          type: '1f'
        },

        transitionTimer: {
          name: 'transitionTimer',
          type: '1f',
          value: 0
        },

        mousePosition: {
          name: 'mousePosition',
          value: [0, 0],
          type: '2f'
        },

        planeCoords: {
          name: 'planeCoords',
          value: [0, 0],
          type: '2f'
        },

        resolution: {
          name: 'resolution',
          value: [0, 0],
          type: '2f'
        },

        strength: {
          name: 'strength',
          type: '1f',
          value: 0
        },

        ratio: {
          name: 'ratio',
          type: '1f',
          value: 0
        },

        time: {
          name: 'time',
          type: '1f',
          value: 0
        }
      }
    }).onReady(this.onPlaneReady.bind(this)).onRender(this.onPlaneRender.bind(this));

    planeElement.children[1].addEventListener('canplay', this.onCanPlay.bind(this));
    planeElement.children[1].addEventListener('canplay', this.onCanPlay.bind(this));
  }

  onPlaneReady () {
    this.planeElement.addEventListener('mousedown', this.toggleActiveTexture.bind(this));
    this.planeElement.addEventListener('mouseup', this.toggleActiveTexture.bind(this));

    this.planeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.planeElement.addEventListener('mouseout', this.onMouseOut.bind(this));

    this.plane.setPerspective(35);
  }

  onPlaneRender () {
    this.transitionTimer = this.activeTexture ? Math.min(90, this.transitionTimer + 1) : Math.max(0, this.transitionTimer - 1);
    this.plane.uniforms.transitionTimer.value = this.transitionTimer;

    this.mouseDelta = Math.max(0, this.mouseDelta * (this.cliccked ? 0.975 : 1.0));
    this.plane.uniforms.strength.value = this.mouseDelta;
    this.plane.uniforms.time.value++;
  }

  onCanPlay (event) {
    if (event.type === 'canplay' && ++this.loadedVideos === 2) {
      this.plane.playVideos();
    }
  }

  toggleActiveTexture (event) {
    const coordinates = this.plane.mouseToPlaneCoords(event.clientX, event.clientY);
    const delta = Math.max(Math.random() * 3, 1.5);

    this.plane.uniforms.planeCoords.value = [coordinates.x, coordinates.y];
    this.activeTexture = !this.activeTexture;

    this.mouseLastPosition.x = this.mousePosition.x;
    this.mouseLastPosition.y = this.mousePosition.y;

    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;

    this.onMouseMove(event);
    this.cliccked = true;

    if (delta >= this.mouseDelta) {
      this.plane.uniforms.time.value = 0;
      this.mouseDelta = delta;
    }
  }

  onMouseMove (event) {
    const clientY = this.planeElement.clientHeight - event.clientY + this.offsetTop;
    this.plane.uniforms.mousePosition.value = [event.clientX, clientY];

    if (this.activeTexture) {
      const coordinates = this.plane.mouseToPlaneCoords(event.clientX, event.clientY);
      this.plane.uniforms.planeCoords.value = [coordinates.x, coordinates.y];

      this.mouseLastPosition.x = this.mousePosition.x;
      this.mouseLastPosition.y = this.mousePosition.y;

      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;

      this.cliccked = false;

      if (this.mouseLastPosition.x && this.mouseLastPosition.y) {
        const delta = Math.sqrt(
          Math.pow(event.clientX - this.mouseLastPosition.x, 2) +
          Math.pow(event.clientY - this.mouseLastPosition.y, 2)
        ) / 200;

        if (delta > this.mouseDelta) {
          this.plane.uniforms.time.value = 0;
          this.mouseDelta = delta;
        }
      }
    }
  }

  onMouseOut () {
    if (this.plane) {
      this.plane.uniforms.transitionTimer.value = 0;
      this.plane.uniforms.strength.value = 0;
      this.plane.uniforms.time.value = 0;
    }

    this.mouseLastPosition = { x: 0, y: 0 };
    this.mousePosition = { x: 0, y: 0 };

    this.activeTexture = false;
    this.cliccked = false;

    this.transitionTimer = 0;
    this.loadedVideos = 0;
    this.mouseDelta = 0;
    this.offsetTop = 0;
  }

  onResize () {
    let height = window.innerHeight;
    let width = window.innerWidth;

    if (width > height) {
      height = width / 16 * 9;
    } else {
      width = height / 9 * 16;
    }

    this.plane.uniforms.minRadius.value = this.planeElement.clientWidth / 30;
    this.plane.uniforms.maxRadius.value = this.planeElement.clientWidth / 5;

    const clientHeight = this.pixelRatio * this.planeElement.clientHeight;
    const clientWidth = this.pixelRatio * this.planeElement.clientWidth;

    this.plane.uniforms.resolution.value = [clientWidth, clientHeight];
    this.plane.uniforms.ratio.value = clientWidth / clientHeight;

    this.offsetTop = (window.innerHeight - height);
    this.planeElement.style.height = `${height}px`;
    this.planeElement.style.width = `${width}px`;

    this.plane.planeResize();
  }
}
