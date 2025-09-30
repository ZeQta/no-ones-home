/**
 * MenuUI - Manages main menu visibility and transitions
 */

export class MenuUI {
    constructor() {
        this.menuElement = document.getElementById('main-menu');
    }

    show() {
        this.menuElement.classList.remove('hidden');
        this.menuElement.style.display = 'flex';
    }

    hide() {
        this.menuElement.style.display = 'none';
        this.menuElement.classList.add('hidden');
    }
}

export default MenuUI;