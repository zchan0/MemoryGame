export class Stopwatch {
    constructor(el) {
        this.timeValue = '';
        this.el = el;
    }

    start() {
        this.beginTime = new Date().getTime();
        this.intervalID = setInterval(this.update.bind(this), 1000);    // use bind(this) to change the context of setInterval, otherwise update cannot access this 
    }

    stop() {
        this.endTime = new Date().getTime();
        this.update();
        clearInterval(this.intervalID);
    }

    reset() {
        this.timeValue = '';
        this.el.textContent = '';
        if (this.intervalID) clearInterval(this.intervalID);
    }

    getDuration() {
        return this.timeValue;
    }

    update() {
        this.currentTime = new Date().getTime();
        this.timeValue = ''; // reset
        
        const duration = this.currentTime - this.beginTime; // calculate time elapsed
        const hh = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 0 ~ 23
        const mm = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)); // 0 ~ 59
        const ss = Math.floor((duration % (1000 * 60)) / 1000); // 0 ~ 59
        
        if (hh) this.timeValue = hh + ` hours `;
        if (mm) this.timeValue = mm + ` mins `;
        this.timeValue += (ss < 10 ? ('0' + ss) : ss) + ' secs';
        
        this.el.textContent = 'in ' + this.timeValue;
    }
}
