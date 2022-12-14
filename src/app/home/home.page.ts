import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ToggleCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('timer', { static: false }) timer: ElementRef;
  shortMode = true;
  longMode = false;
  focusMode = false;
  timerValue: string;
  lightMode = true;
  clockProcess: any;
  constructor(private renderer: Renderer2) {}
  ngAfterViewInit(): void {
    this.fillInitTimer();
  }

  public changeMode(mode: string) {
    this.shortMode = false;
    this.longMode = false;
    this.focusMode = false;
    if (mode === 'short') {
      this.longMode = true;
    }
    if (mode === 'long') {
      this.focusMode = true;
    }
    if (mode === 'focus') {
      this.shortMode = true;
    }
    this.setTimerAccordingMode();
  }

  public onToggleColorTheme(event: ToggleCustomEvent) {
    const toogleActivated = event.detail.checked;
    if (toogleActivated) {
      this.renderer.setAttribute(document.body, 'color-theme', 'dark');
      this.lightMode = false;
    }
    if (!toogleActivated) {
      this.renderer.setAttribute(document.body, 'color-theme', 'light');
      this.lightMode = true;
    }
  }

  public fillInitTimer() {
    const text = this.renderer.createText('0500');
    this.renderer.appendChild(this.timer.nativeElement, text);
  }

  public startTimer() {
    const runningTimer = () => {
      const currentTimer = this.timer.nativeElement.innerHTML;
      const currentMinutes: string = currentTimer.substring(0, 2);
      const currentSeconds: string = currentTimer.substring(2, 4);
      if (currentMinutes === '00' && currentSeconds === '00') {
        this.stopWhenTimeIsOver(this.clockProcess);
      }
      const { minutes, seconds } = this.treatmentLeadingNumbers(
        currentMinutes,
        currentSeconds
      );
      const clock = `${minutes}${seconds}`;
      this.renderClock(clock);
    };
    this.clockProcess = setInterval(runningTimer, 1000);
  }

  public stopClock() {
    clearInterval(this.clockProcess);
    this.setTimerAccordingMode();
    this.registryHistoryWhenStopped();
  }

  private stopWhenTimeIsOver(timeoutProcess: any) {
    this.beep();
    clearInterval(timeoutProcess);
  }

  private setTimerAccordingMode() {
    const modeSelected = [
      this.shortMode,
      this.longMode,
      this.focusMode,
    ].indexOf(true);
    const timeMode = ['0500', '1500', '2500'];
    this.renderClock(timeMode[modeSelected]);
  }

  private treatmentLeadingNumbers(
    currentMinutes: string,
    currentSeconds: string
  ) {
    let minutes = (
      currentSeconds === '00'
        ? Number(currentMinutes) - 1
        : Number(currentMinutes)
    ).toString();
    let seconds = (
      currentSeconds !== '00'
        ? Number(currentSeconds) - 1
        : Number(currentSeconds) + 59
    ).toString();
    if (minutes.length < 2) {
      minutes = minutes.toString().padStart(2, '0');
    }
    if (seconds.length < 2) {
      seconds = seconds.toString().padStart(2, '0');
    }
    return { minutes, seconds };
  }

  private renderClock(clock: string) {
    const time = this.renderer.createText(clock);
    this.renderer.setProperty(this.timer.nativeElement, 'innerText', time.data);
  }

  private beep() {
    const sound = new Audio(
      'http://freesoundeffect.net/sites/default/files/dong-2-sound-effect-39724732.mp3'
    );

    sound.play();
  }

  private registryHistoryWhenStopped() {
    const stoppedActionHistory = {
      action: 'Quebra de ciclo',
      date: new Date(),
    };
    localStorage.setItem('action', JSON.stringify(stoppedActionHistory));
  }
}
