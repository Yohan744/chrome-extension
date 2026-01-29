import mitt from 'mitt';

const emitter = mitt();

export function useGlobalEvents() {
  return {
    trigger: emitter.emit,
    on: emitter.on,
    off: emitter.off
  };
}
