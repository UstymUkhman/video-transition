export default class VideoTransition {
  constructor () {
    this.planeElement = document.getElementById('plane');
    this.pixelRatio = window.devicePixelRatio || 1.0;

    // this.mouseLastPosition = { x: 0, y: 0 };
    // this.mousePosition = { x: 0, y: 0 };
    // this.mouseDelta = 0;

    this.secondVideoReady = false;
    this.firstVideoReady = false;
    this.firstVideoReady = false;

    this.transitionTimer = 0;
    this.activeTexture = 1;

    this.plane = new Curtains('webgl').addPlane(this.planeElement, {
      fragmentShader: require('./glsl/transition.frag'),
      vertexShader: require('./glsl/transition.vert'),

      // heightSegments: 20,
      // widthSegments: 20,

      /* uniforms: {
        mouseMoveStrength: {
          name: 'movementStrength',
          type: '1f',
          value: 0
        },

        mousePosition: {
          name: 'mousePosition',
          type: '2f',
          value: [
            this.mousePosition.x,
            this.mousePosition.y
          ]
        },

        resolution: {
          name: 'resolution',
          type: '2f',
          value: [
            this.pixelRatio * this.planeElement.clientWidth,
            this.pixelRatio * this.planeElement.clientHeight
          ]
        },

        time: {
          name: 'time',
          type: '1f',
          value: 0
        }
      } */

      uniforms: {
        resolution: {
          name: 'resolution',
          type: '2f',
          value: [
            this.pixelRatio * this.planeElement.clientWidth,
            this.pixelRatio * this.planeElement.clientHeight
          ]
        },

        transitionTimer: {
          name: 'transitionTimer',
          type: '1f',
          value: 0,
        },
      }
    });

    this.plane.onReady(this.onPlaneReady.bind(this)).onRender(this.onPlaneRender.bind(this));

    document.getElementById('video-1').addEventListener('canplay', this.onReady.bind(this));
    document.getElementById('video-2').addEventListener('canplay', this.onReady.bind(this));
  }

  onPlaneReady () {
    // this.planeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    // this.plane.setPerspective(35);

    this.planeElement.addEventListener('click', this.onClick.bind(this));
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

  onPlaneRender () {
    // this.plane.uniforms.time.value++;
    // this.plane.uniforms.mouseMoveStrength.value = this.mouseDelta;
    // this.mouseDelta = Math.max(0, this.mouseDelta * 0.995);

    if(this.activeTexture === 1) {
      this.transitionTimer = Math.max(0, this.transitionTimer - 1);
    } else {
      this.transitionTimer = Math.min(90, this.transitionTimer + 1);
    }

    this.plane.uniforms.transitionTimer.value = this.transitionTimer;
  }

  /* onMouseMove (event) {
    this.mouseLastPosition.x = this.mousePosition.x;
    this.mouseLastPosition.y = this.mousePosition.y;

    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;

    const mouseCoords = this.plane.mouseToPlaneCoords(this.mousePosition.x, this.mousePosition.y);
    this.plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];

    if (this.mouseLastPosition.x && this.mouseLastPosition.y) {
      const delta = Math.min(4, Math.sqrt(
        Math.pow(this.mousePosition.x - this.mouseLastPosition.x, 2) +
        Math.pow(this.mousePosition.y - this.mouseLastPosition.y, 2)
      ) / 30);

      if (delta >= this.mouseDelta) {
        this.mouseDelta = delta;
        this.plane.uniforms.time.value = 0;
      }
    }
  } */

  onClick (event) {
    this.activeTexture = this.activeTexture === 1 ? 2 : 1;
  }

  onResize () {
    this.plane.uniforms.resolution.value = [
      this.pixelRatio * this.planeElement.clientWidth,
      this.pixelRatio * this.planeElement.clientHeight
    ];
  }
}
