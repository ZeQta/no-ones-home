export class PhoneUI {
  constructor() {
    this.root = document.getElementById('phone-overlay');
    this.msgList = document.getElementById('phone-messages');
    this.btnClose = document.getElementById('phone-close');
    this._closeCb = () => {};
    this.btnClose.addEventListener('click', () => this.close());
  }

  onClose(cb) { this._closeCb = cb; }

  showMessage({ from, text, timestamp }) {
    this.msgList.innerHTML = '';
    const bubble = document.createElement('div');
    bubble.className = 'bubble from-mom';
    bubble.textContent = text;
    const time = document.createElement('div');
    time.className = 'timestamp';
    time.textContent = timestamp;
    this.msgList.appendChild(bubble);
    this.msgList.appendChild(time);
    this.show();
  }

  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }

  toggle() { if (this.root.classList.contains('hidden')) this.show(); else this.close(); }

  close() { this.hide(); this._closeCb(); }
}

