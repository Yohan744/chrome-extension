import gsap from 'gsap';

let isAnimating: boolean = false;

const switchBetweenSections = (direction: 'forward' | 'backward') => {
  const mainWrapper = document.querySelector('#main-wrapper') as HTMLElement;
  const addWrapper = document.querySelector('#add-wrapper') as HTMLElement;

  const show = direction === 'forward' ? addWrapper : mainWrapper;
  const leave = direction === 'forward' ? mainWrapper : addWrapper;

  if (isAnimating) return;
  isAnimating = true;

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      tl.kill();
    }
  });

  tl.fromTo(
    leave,
    {
      opacity: 1,
      pointerEvents: 'all'
    },
    {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.75,
      ease: 'power3.out'
    }
  );

  tl.fromTo(
    show,
    {
      opacity: 0,
      pointerEvents: 'none'
    },
    {
      opacity: 1,
      pointerEvents: 'all',
      duration: 0.75,
      ease: 'power3.out'
    }
  );
};

export default switchBetweenSections;
