import ComponentBase from "./componentBase";

class AnimeModule {
  constructor(private instance: ComponentBase) {}
  setAnimateSyncParam(params: { duration: number; sleepTime: number }): void {
    if (this.instance.workMode !== 2 && this.instance.workMode !== 0) {
      window.wiscomWebSocket.sendAnimateParam(this.instance.code, this.instance.resourceId, {
        duration: params.duration,
        sleepTime: params.sleepTime,
      });
    }
  }

  animateSyncCallback(callback: Function) {
    if (this.instance.workMode !== 2 && this.instance.workMode !== 0) {
      window.wiscomWebSocket.animateSync(this.instance.code, this.instance.resourceId, callback);
    }
  }

  stopAnimate() {
    window.wiscomWebSocket.animateStop(this.instance.code, this.instance.resourceId, () => {});
  }
}

export default AnimeModule;
