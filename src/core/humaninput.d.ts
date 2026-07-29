declare module "humaninput/dist/humaninput-1.1.15-full" {
  interface HumanInputOptions {
    visualFeedback?: boolean;
  }
  class HumanInput {
    constructor(target: EventTarget, options?: HumanInputOptions);
    on(event: string, handler: (e: Event) => void): void;
    off(event: string, handler?: (e: Event) => void): void;
    pause(): void;
    resume(): void;
  }
  export default HumanInput;
}
