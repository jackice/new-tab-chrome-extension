class MyClock extends HTMLElement {
    static styles = `
<style>

:host {
  width: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

#clock {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: 10px;
    font-family: "Open Sans", Arial, sans-serif;
    color: var(--text-color);
  }

@media screen and (min-width: 900px) {
  #clock {
    font-size: 8rem;
  }
  }
</style>
`;
    get template() {
        return `
    ${MyClock.styles}
    <div id="clock"></div>
    `;
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
        let timeoutId = null;
        
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            
            // Only update DOM if time actually changed
            if (timeString !== lastTime) {
                clockElement.textContent = timeString;
                lastTime = timeString;
            }
            
            // Clear previous timeout and schedule next update
            if (timeoutId) clearTimeout(timeoutId);
            const delay = 1000 - now.getMilliseconds();
            timeoutId = setTimeout(updateTime, delay);
        };
        
        updateTime();
        
        // Clean up on disconnect
        this.disconnectCallback = () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }
}

customElements.define("my-clock", MyClock);
