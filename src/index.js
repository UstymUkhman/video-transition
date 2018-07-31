export default class VideoTransition {
  constructor () {
    this.planeElement = document.getElementById('plane');
    this.pixelRatio = window.devicePixelRatio || 1.0;

    this.mouseLastPosition = { x: 0, y: 0 };
    this.mousePosition = { x: 0, y: 0 };

    this.secondVideoReady = false;
    this.firstVideoReady = false;

    this.activeTexture = false;
    this.cliccked = false;

    this.transitionTimer = 0;
    this.mouseDelta = 0;

    this.plane = new Curtains('webgl').addPlane(this.planeElement, {
      fragmentShader: require('./glsl/transition.frag'),
      vertexShader: require('./glsl/transition.vert'),

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
          value: 0,
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
    });

    this.plane.onReady(this.onPlaneReady.bind(this)).onRender(this.onPlaneRender.bind(this));
    document.getElementById('video-1').addEventListener('canplay', this.onReady.bind(this));
    document.getElementById('video-2').addEventListener('canplay', this.onReady.bind(this));
  }

  onPlaneReady () {
    this.onResize();
    this.plane.setPerspective(35);

    this.planeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.planeElement.addEventListener('mouseup', this.toggleActiveTexture.bind(this));
    this.planeElement.addEventListener('mousedown', this.toggleActiveTexture.bind(this));
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
    this.plane.uniforms.mousePosition.value = [event.clientX, this.planeElement.clientHeight - event.clientY - 120];

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

  onPlaneRender () {
    this.transitionTimer = this.activeTexture ? Math.min(90, this.transitionTimer + 1) : Math.max(0, this.transitionTimer - 1);
    this.plane.uniforms.transitionTimer.value = this.transitionTimer;

    this.mouseDelta = Math.max(0, this.mouseDelta * (this.cliccked ? 0.975 : 1.0));
    this.plane.uniforms.strength.value = this.mouseDelta;
    this.plane.uniforms.time.value++;
  }

  onReady (event) {
    if (event.type === 'canplay') {
      if (event.target.id.includes('1')) {
        this.firstVideoReady = true;
      } else if (event.target.id.includes('2')) {
        this.secondVideoReady = true;
      }
    }

    if (this.firstVideoReady && this.secondVideoReady) {
      this.plane.playVideos();
    }
  }

  onResize () {
    this.plane.uniforms.minRadius.value = this.planeElement.clientWidth / 30;
    this.plane.uniforms.maxRadius.value = this.planeElement.clientWidth / 5;

    const height = this.pixelRatio * this.planeElement.clientHeight;
    const width = this.pixelRatio * this.planeElement.clientWidth;

    this.plane.uniforms.resolution.value = [width, height];
    this.plane.uniforms.ratio.value = width / height;
  }
}
