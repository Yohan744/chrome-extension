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
      duration: 0.6,
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
      duration: 1,
      ease: 'power1.out',
      onStart: () => {
        gsap.delayedCall(0.15, () => {
          events.trigger(ICustomEvents.switchSectionEnd, show as string);
        });
      }
    },
    0.5
  );
};

export default switchBetweenSections;
