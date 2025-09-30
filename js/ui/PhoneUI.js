/**
 * PhoneUI - Manages in-game phone interface
 */

export class PhoneUI {
    constructor() {
        this.phoneElement = document.getElementById('phone-ui');
        this.messagesContainer = document.getElementById('phone-messages');
        this.closeBtn = document.getElementById('phone-close');
        this.isOpen = false;
        this.onCloseCallback = null;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });
        
        // Also close with ESC or P key
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && (e.key === 'Escape' || e.key === 'p' || e.key === 'P')) {
                this.close();
            }
        });
    }

    open() {
        this.phoneElement.classList.remove('hidden');
        this.isOpen = true;
        
        // Play phone open sound
        window.dispatchEvent(new CustomEvent('playSound', { 
            detail: { sound: 'phoneOpen' } 
        }));
    }

    close() {
        this.phoneElement.classList.add('hidden');
        this.isOpen = false;
        
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    addMessage(text, timestamp = '6:32 PM') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-bubble';
        messageDiv.textContent = text;
        
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'message-timestamp';
        timestampDiv.textContent = timestamp;
        
        const wrapper = document.createElement('div');
        wrapper.appendChild(messageDiv);
        wrapper.appendChild(timestampDiv);
        
        this.messagesContainer.appendChild(wrapper);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    clearMessages() {
        this.messagesContainer.innerHTML = '';
    }

    setOnClose(callback) {
        this.onCloseCallback = callback;
    }

    playNotificationSound() {
        // Play notification sound
        window.dispatchEvent(new CustomEvent('playSound', { 
            detail: { sound: 'phoneNotification' } 
        }));
    }
}

export default PhoneUI;