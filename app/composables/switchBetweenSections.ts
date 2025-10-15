import gsap from 'gsap';

let isAnimating: boolean = false;

const switchBetweenSections = (show: 'main' | 'add' | 'settings') => {
  if (isAnimating) return;

  const mainWrapper = document.querySelector('#main-wrapper') as HTMLElement;
  const addWrapper = document.querySelector('#add-wrapper') as HTMLElement;
  const settingsWrapper = document.querySelector('#settings-wrapper') as HTMLElement;

  const sectionToHide = [mainWrapper, addWrapper, settingsWrapper].find(wrapper =>
    wrapper.classList.contains('active')
  );

  const sectionToShow = {
    main: mainWrapper,
    add: addWrapper,
    settings: settingsWrapper
  }[show];

  if (
    !mainWrapper ||
    !addWrapper ||
    !settingsWrapper ||
    !sectionToHide ||
    !sectionToShow ||
    sectionToHide === sectionToShow
  )
    return;

  isAnimating = true;

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      sectionToHide.classList.remove('active');
      sectionToShow.classList.add('active');
      tl.kill();
    }
  });

  tl.fromTo(
    sectionToHide,
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
    sectionToShow,
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
