class MyClock extends HTMLElement {
    static styles = `
        <style>
            :host {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                contain: content; /* Improves performance by limiting scope of reflows */
            }

            #clock {
                font-size: clamp(3rem, 10vw, 8rem); /* Responsive font sizing */
                font-weight: 700;
                letter-spacing: 0.05em;
                font-family: "Open Sans", system-ui, sans-serif;
                color: var(--text-color);
                will-change: contents; /* Hint browser about animation */
            }
        </style>
    `;
    
    get template() {
        return `${MyClock.styles}<div id="clock" aria-live="polite"></div>`;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = this.template;
        this.init();
    }

    init() {
        const clockElement = this.shadowRoot.getElementById("clock");
        let lastTime = "";
        let frameId = null;
        
        const updateTime = (timestamp) => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            
            // Only update DOM if time actually changed
            if (timeString !== lastTime) {
                clockElement.textContent = timeString;
                lastTime = timeString;
            }
            
            // Use requestAnimationFrame for smoother updates
            frameId = requestAnimationFrame(updateTime);
        };
        
        // Start the clock
        frameId = requestAnimationFrame(updateTime);
        
        // Clean up on disconnect
        this.disconnectedCallback = () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }
}

customElements.define("my-clock", MyClock);
