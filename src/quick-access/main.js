class QuickAccess extends HTMLElement {
    static styles = `
    <style>
        :host {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 120px));
            gap: 20px;
            padding: 20px;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            justify-content: center;
        }
        
        .access-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 15px;
            border-radius: 12px;
            background: var(--card-bg);
            box-shadow: var(--card-shadow);
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .access-card:hover {
            transform: translateY(-5px);
        }
        
        .access-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 10px;
            border-radius: 50%;
            background: var(--icon-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }
        
        .access-icon img {
            width: 24px;
            height: 24px;
            object-fit: contain;
            image-rendering: -webkit-optimize-contrast;
            background: transparent;
            mix-blend-mode: multiply;
            /* 强制去除白色背景 */
            filter: brightness(1.1) drop-shadow(0 0 0 var(--icon-bg));
        }
        
        /* For dark mode compatibility */
        @media (prefers-color-scheme: dark) {
            .access-icon img {
                mix-blend-mode: normal;
                filter: brightness(0.8);
            }
        }
        
        .access-name {
            font-size: 0.9rem;
            color: var(--text-color);
            text-align: center;
            word-break: break-word;
            margin-bottom: 5px;
        }

        .access-actions {
            position: absolute;
            top: 5px;
            right: 5px;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .access-card:hover .access-actions {
            opacity: 1;
        }

        .menu-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            color: var(--text-color);
            opacity: 0.7;
            transition: all 0.2s;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .menu-btn:hover {
            opacity: 1;
            background: rgba(0,0,0,0.1);
        }

        .menu-dropdown {
            position: absolute;
            right: 0;
            top: 100%;
            background: var(--card-bg);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 8px;
            z-index: 10;
            display: none;
        }

        .menu-dropdown.show {
            display: block;
        }

        .menu-item {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 0.9rem;
            color: var(--text-color);
            white-space: nowrap;
            text-align: left;
        }

        .menu-item:hover {
            background: rgba(0,0,0,0.1);
        }

        .menu-dropdown {
            min-width: 100px;
        }

        .dialog {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .dialog-content {
            background: var(--card-bg);
            padding: 30px;
            border-radius: 20px;
            width: 400px;
            box-shadow: var(--card-shadow);
            position: relative;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .dialog-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color, #ddd);
            border-radius: 8px;
            background: var(--icon-bg);
            color: var(--text-color);
            font-size: 0.95rem;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary-color, #4CAF50);
        }

        .dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }

        .dialog-btn {
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            /* Shared button styles */
            &-cancel {
                background: var(--card-bg);
                color: var(--text-color);
                border: 1px solid rgba(0,0,0,0.1);
            }
            &-save {
                background: var(--primary-color, #4CAF50);
                color: white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
        }

        .save-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .dialog-content h3 {
            margin: 0 0 20px;
            text-align: center;
            color: var(--text-color);
        }

        .dialog-content {
            background: var(--card-bg);
            padding: 30px;
            border-radius: 12px;
            width: 400px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: relative;
            border: 1px solid rgba(0,0,0,0.08);
        }

        .dialog-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 12px;
            pointer-events: none;
            box-shadow: inset 1px 1px 2px rgba(0,0,0,0.05);
        }

        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 25px;
            align-items: flex-start;
        }

        .form-group {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
        }

        .form-group label {
            color: var(--text-color);
            font-size: 0.95rem;
            white-space: nowrap;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: var(--icon-bg);
            color: var(--text-color);
            box-sizing: border-box;
            font-size: 0.95rem;
            min-width: 200px;
        }

        .dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }

        .dialog-buttons button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .dialog-buttons button {
            padding: 8px 20px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
        }

        #save-btn, #confirm-btn {
            background: var(--primary-color, #4CAF50);
            color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        #save-btn:hover, #confirm-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        #cancel-btn {
            background: var(--card-bg);
            color: var(--text-color);
            border: 1px solid rgba(0,0,0,0.1);
            margin-right: 10px;
        }

        .danger {
            background: var(--danger-color, #f44336) !important;
        }

        .dialog-content p {
            color: var(--text-color);
            margin-bottom: 25px;
            text-align: center;
        }
        
        .add-card {
            background: var(--add-card-bg);
            color: var(--add-card-color);
        }
    </style>
    `;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.entries = [];
        this._eventListeners = new Map();
    }

    disconnectedCallback() {
        // Clean up event listeners
        this._eventListeners.forEach((handler, element) => {
            element.removeEventListener(handler.event, handler.callback);
        });
        this._eventListeners.clear();
    }

    connectedCallback() {
        this.loadEntries();
        this.render();
    }

    loadEntries() {
        try {
            const saved = localStorage.getItem('quickAccessEntries');
            if (saved) {
                const parsed = JSON.parse(saved);
                // 确保每个条目都有favicon
                this.entries = parsed.map(entry => {
                    if (!entry.favicon) {
                        return {...entry, favicon: ''}; // 渲染时会自动获取
                    }
                    return entry;
                });
            } else {
                this.entries = [...QuickAccess.DEFAULT_ENTRIES];
            }
        } catch (e) {
            console.error('Failed to load entries:', e);
            this.entries = [...QuickAccess.DEFAULT_ENTRIES];
        }
    }

    saveEntries() {
        try {
            // 添加数据验证
            if (!Array.isArray(this.entries)) {
                throw new Error('Entries must be an array');
            }
            const serialized = JSON.stringify(this.entries);
            if (serialized.length > 5000) { // 5KB限制
                throw new Error('Data too large for localStorage');
            }
            localStorage.setItem('quickAccessEntries', serialized);
        } catch (e) {
            console.error('Failed to save entries:', e);
            // 回退到内存存储
            this._fallbackStorage = [...this.entries];
        }
    }

    // 添加在类顶部
    static DEFAULT_ENTRIES = Object.freeze([]);

    async getFavicon(url) {
        try {
            // Ensure URL is properly formatted
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            const parsedUrl = new URL(url);
            const domain = parsedUrl.hostname;
            
            // Try Chrome's favicon API first
            if (chrome?.runtime?.id) {
                const faviconUrl = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`;
                // Verify the favicon exists
                const response = await fetch(faviconUrl, {method: 'HEAD'});
                if (response.ok) return faviconUrl;
            }
            
            // Fallback to Google's service with higher resolution
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            
        } catch (e) {
            console.warn('Failed to get favicon for:', url, e);
            // Use a cleaner default link icon
            return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzEiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY2NiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxIiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
        }
    }

    async render() {
        // 添加渲染开始事件
        this.dispatchEvent(new CustomEvent('quickaccess-render-start', {
            bubbles: true,
            composed: true
        }));

        // 确保entries存在且是数组
        if (!Array.isArray(this.entries)) {
            this.entries = [...QuickAccess.DEFAULT_ENTRIES];
        }

        let cardsHtml = '';
        if (this.entries.length > 0) {
            const cards = await Promise.all(this.entries.map(async (entry, index) => {
                return `
                    <div class="access-card" data-url="${entry.url}" data-index="${index}">
                        <div class="access-icon">
                            <img src="${entry.favicon || await this.getFavicon(entry.url)}" width="24" height="24" />
                        </div>
                        <div class="access-name">${entry.name}</div>
                        <div class="access-actions">
                            <button class="menu-btn">⋯</button>
                            <div class="menu-dropdown">
                                <div class="menu-item edit-btn">Edit</div>
                                <div class="menu-item delete-btn">Delete</div>
                            </div>
                        </div>
                    </div>
                `;
            }));
            cardsHtml = cards.join('');
        }

        this.shadowRoot.innerHTML = `
            ${QuickAccess.styles}
            ${cardsHtml}
            <div class="access-card add-card" id="add-card">
                <div class="access-icon">+</div>
                <div class="access-name">Add Quick Link</div>
            </div>
        `;

        this.shadowRoot.querySelectorAll('.access-card').forEach(card => {
            if (card.id !== 'add-card') {
                // Open site on card click
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.access-actions')) {
                        window.location.href = card.dataset.url;
                    }
                });

                // Menu button
                const menuBtn = card.querySelector('.menu-btn');
                const menuDropdown = card.querySelector('.menu-dropdown');
                
                menuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close any other open menus
                    document.querySelectorAll('.menu-dropdown.show').forEach(d => {
                        if (d !== menuDropdown) d.classList.remove('show');
                    });
                    menuDropdown.classList.toggle('show');
                });

                // Edit button
                card.querySelector('.edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    menuDropdown.classList.remove('show');
                    this.editEntry(parseInt(card.dataset.index));
                });

                // Delete button
                card.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    menuDropdown.classList.remove('show');
                    this.deleteEntry(parseInt(card.dataset.index));
                });

                // Close menu when clicking outside
                const clickHandler = (e) => {
                    if (!card.contains(e.target)) {
                        menuDropdown.classList.remove('show');
                        document.removeEventListener('click', clickHandler);
                    }
                };
                const handler = clickHandler.bind(this);
                document.addEventListener('click', handler);
                
                // Store reference for cleanup
                card._clickHandler = handler;
            }
        });

        const addCard = this.shadowRoot.getElementById('add-card');
        if (addCard) {
            addCard.addEventListener('click', () => {
                this.showEntryDialog();
            });
        }
    }

    showEntryDialog(entry = null) {
        // Reuse existing dialog if possible
        const existingDialog = this.shadowRoot.querySelector('.dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const dialog = document.createElement('div');
        dialog.className = 'dialog';

        const dialogContent = document.createElement('div');
        dialogContent.className = 'dialog-content';

        const title = document.createElement('h3');
        title.textContent = `${entry ? 'Edit' : 'Add'} Quick Access`;

        const form = document.createElement('form');
        form.className = 'dialog-form';

        // Name field
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        nameLabel.htmlFor = 'entry-name';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'entry-name';
        nameInput.value = entry?.name || '';
        nameInput.className = 'form-input';

        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);

        // URL field
        const urlGroup = document.createElement('div');
        urlGroup.className = 'form-group';
        
        const urlLabel = document.createElement('label');
        urlLabel.textContent = 'URL:';
        urlLabel.htmlFor = 'entry-url';
        
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.id = 'entry-url';
        urlInput.value = entry?.url || '';
        urlInput.className = 'form-input';

        urlGroup.appendChild(urlLabel);
        urlGroup.appendChild(urlInput);

        form.appendChild(nameGroup);
        form.appendChild(urlGroup);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'dialog-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'dialog-btn cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.type = 'button';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'dialog-btn save-btn';
        saveBtn.textContent = 'Save';
        saveBtn.type = 'submit';

        buttonGroup.appendChild(cancelBtn);
        buttonGroup.appendChild(saveBtn);

        form.appendChild(buttonGroup);
        dialogContent.appendChild(title);
        dialogContent.appendChild(form);
        dialog.appendChild(dialogContent);
        this.shadowRoot.appendChild(dialog);

        // Focus on name input when dialog opens
        nameInput.focus();

        // Handle Enter key to submit
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        };
        nameInput.addEventListener('keydown', handleKeyDown);
        urlInput.addEventListener('keydown', handleKeyDown);

        cancelBtn.addEventListener('click', () => {
            this.shadowRoot.removeChild(dialog);
        });

        saveBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const url = urlInput.value.trim();
            
            if (name && url) {
                // 先保存条目，稍后获取favicon
                const newEntry = { name, url, favicon: '' };
                if (entry) {
                    // Update existing entry
                    this.entries[entry.index] = newEntry;
                } else {
                    // Add new entry
                    this.entries.push(newEntry);
                }
                this.saveEntries();
                this.render();
                this.shadowRoot.removeChild(dialog);
                
                // 异步获取favicon并更新
                this.getFavicon(url).then(favicon => {
                    if (entry) {
                        this.entries[entry.index].favicon = favicon;
                    } else {
                        this.entries[this.entries.length - 1].favicon = favicon;
                    }
                    this.saveEntries();
                    this.render();
                });
            } else {
                // Show error if fields are empty
                if (!name) nameInput.style.borderColor = 'var(--danger-color, #f44336)';
                if (!url) urlInput.style.borderColor = 'var(--danger-color, #f44336)';
            }
        });

        // Close dialog when clicking outside
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.shadowRoot.removeChild(dialog);
            }
        });
    }

    addNewEntry() {
        this.showEntryDialog();
    }

    editEntry(index) {
        this.showEntryDialog({...this.entries[index], index});
    }

    deleteEntry(index) {
        // Close any existing dialog first
        const existingDialog = document.querySelector('.quick-access-dialog');
        if (existingDialog) {
            document.body.removeChild(existingDialog);
        }

        const dialog = document.createElement('div');
        dialog.className = 'dialog';

        const dialogContent = document.createElement('div');
        dialogContent.className = 'dialog-content';

        const title = document.createElement('h3');
        title.textContent = 'Confirm Delete';

        const message = document.createElement('p');
        message.textContent = 'Are you sure you want to delete this entry?';

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'dialog-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'dialog-btn cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.type = 'button';

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'dialog-btn danger';
        confirmBtn.textContent = 'Delete';
        confirmBtn.type = 'button';

        buttonGroup.appendChild(cancelBtn);
        buttonGroup.appendChild(confirmBtn);

        dialogContent.appendChild(title);
        dialogContent.appendChild(message);
        dialogContent.appendChild(buttonGroup);
        dialog.appendChild(dialogContent);
        this.shadowRoot.appendChild(dialog);

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        confirmBtn.addEventListener('click', () => {
            this.entries.splice(index, 1);
            this.saveEntries();
            this.render();
            document.body.removeChild(dialog);
        });

        // Close dialog when clicking outside
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }
}

// 确保组件只注册一次
if (!customElements.get('quick-access')) {
    customElements.define('quick-access', QuickAccess);
}
