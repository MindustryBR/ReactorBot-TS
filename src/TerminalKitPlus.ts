import { terminal as t } from "terminal-kit";

export class MultiProgressBar {
  bars: {
    title: string;
    progress: number;
  }[];
  displaying: boolean = false;
  onComplete: (()=>void) | null = null; 

  constructor() {
    this.bars = [];
  }

  addBar(title: string) {
    const bar = {
      title,
      progress: 0,
    };
    this.bars.push(bar);
    return bar;
  }

  update(title: string, progress: number) {
    const bar = this.bars.find((b) => b.title === title);
    if (bar) {
      bar.progress = progress;
    }
    if (this.displaying) this.display();

    if( this.bars.every(b => b.progress >= 1) && this.onComplete) {
      this.onComplete();
    }
  }

  display() {
    if (!this.displaying) {
      this.displaying = true;
    } else {
      t.move(0, -this.bars.length);
      // t.eraseDisplayBelow();
    }
    this.bars.forEach((bar) => {
      t.eraseLine();
      t(`${bar.title}:\t`);
      const progressBarWidth = 30;
      const filledWidth = Math.round(bar.progress * progressBarWidth);
      const emptyWidth = progressBarWidth - filledWidth;
      if(bar.progress >= 1) bar.progress = 1;
      if(bar.progress < 0) bar.progress = 0;
      if(bar.progress < 1) {
        t.yellow(true);
      } else {
        t.green(true);
      }
      t("[" + "=".repeat(filledWidth) + " ".repeat(emptyWidth) + `]\t${(bar.progress * 100).toFixed(2)}%\r\n`);
      t.white(true);
      // t.move(0, 1);
    });
  }

  forceComplete() {
    this.bars.forEach((bar) => {
      bar.progress = 1;
    });
    this.display();
    t.moveTo(0, this.bars.length + 1);
  }
}