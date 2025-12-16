import gsap from 'gsap';
import { useGlobalEvents } from '~/composables/GlobalEvents';
import { ICustomEvents } from '~/constants/ICustomEvents';

let isAnimating: boolean = false;
const events = useGlobalEvents();

const switchBetweenSections = (show: 'main' | 'add' | 'settings', onComplete?: () => void) => {
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
    onStart: () => {
      events.trigger(ICustomEvents.switchSectionStart, show as string);
    },
    onComplete: () => {
      isAnimating = false;
      sectionToHide.classList.remove('active');
      sectionToShow.classList.add('active');
      tl.kill();
      if (onComplete) onComplete();
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
      duration: 0.7,
      ease: 'power1.out'
    },
    0
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
      duration: 0.95,
      ease: 'power1.out'
    },
    0.65
  );
};

export default switchBetweenSections;
