import VideoTransition from '@/VideoTransition';

const plane = document.getElementById('plane');
const start = document.getElementById('start');

start.addEventListener('click', () => {
  start.classList.add('disabled');
  plane.classList.add('visible');

  const transition = new VideoTransition(plane);
  window.addEventListener('resize', transition.onResize.bind(transition));
});
