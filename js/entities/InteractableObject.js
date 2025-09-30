/**
 * InteractableObject - Base class for interactable game objects
 */

export class InteractableObject {
    constructor(mesh, name, interactionType = 'examine') {
        this.mesh = mesh;
        this.name = name;
        this.interactionType = interactionType; // 'examine', 'toggle', 'open', 'pickup'
        this.isInteractable = true;
        this.state = 'default';
        
        // Set user data for raycasting
        this.mesh.userData.interactable = true;
        this.mesh.userData.name = name;
        this.mesh.userData.type = interactionType;
        this.mesh.userData.object = this;
    }

    interact() {
        if (!this.isInteractable) return false;
        
        console.log(`Interacting with ${this.name}`);
        
        switch(this.interactionType) {
            case 'toggle':
                return this.toggle();
            case 'open':
                return this.open();
            case 'examine':
                return this.examine();
            case 'pickup':
                return this.pickup();
            default:
                return false;
        }
    }

    toggle() {
        // Override in subclasses
        return false;
    }

    open() {
        // Override in subclasses
        return false;
    }

    examine() {
        // Override in subclasses
        return false;
    }

    pickup() {
        // Override in subclasses
        return false;
    }

    setInteractable(value) {
        this.isInteractable = value;
    }

    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

    getMesh() {
        return this.mesh;
    }

    getName() {
        return this.name;
    }
}

export default InteractableObject;