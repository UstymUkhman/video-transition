export default class VideoTransition {
  constructor () {
    this.planeElement = document.getElementById('plane');
    this.pixelRatio = window.devicePixelRatio || 1.0;

    this.secondVideoReady = false;
    this.firstVideoReady = false;

    this.activeTexture = false;
    this.transitionTimer = 0;

    this.plane = new Curtains('webgl').addPlane(this.planeElement, {
      fragmentShader: require('./glsl/transition.frag'),
      vertexShader: require('./glsl/transition.vert'),

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

        resolution: {
          name: 'resolution',
          value: [0, 0],
          type: '2f'
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
    this.activeTexture = !this.activeTexture
  }

  onMouseMove (event) {
    this.plane.uniforms.mousePosition.value = [event.clientX, this.planeElement.clientHeight + 120 - event.clientY];
  }

  onPlaneRender () {
    this.transitionTimer = this.activeTexture ? Math.min(90, this.transitionTimer + 1) : Math.max(0, this.transitionTimer - 1);
    this.plane.uniforms.transitionTimer.value = this.transitionTimer;
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

    this.plane.uniforms.resolution.value = [
      this.pixelRatio * this.planeElement.clientWidth,
      this.pixelRatio * this.planeElement.clientHeight
    ];
  }
}
