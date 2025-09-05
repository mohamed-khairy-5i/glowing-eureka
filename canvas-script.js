// IdeaFlux Canvas - Advanced Interactive Workspace

class IdeaFluxCanvas {
    constructor() {
        this.elements = new Map();
        this.connections = new Map();
        this.selectedElements = new Set();
        this.currentTool = 'select';
        this.isDrawingConnection = false;
        this.connectionStart = null;
        this.isDragging = false;
        this.dragStartPos = { x: 0, y: 0 };
        this.canvasOffset = { x: 0, y: 0 };
        this.zoomLevel = 1;
        this.isSelecting = false;
        this.selectionStart = { x: 0, y: 0 };
        this.elementIdCounter = 0;
        this.connectionIdCounter = 0;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        this.googleAIKey = 'AIzaSyByEXNDlu9kNaxJWxm7mxxe5vmAqe98DpE';
        
        this.init();
    }
    
    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.initializeCanvas();
        this.startAutoSave();
        this.hideLoadingScreen();
    }
    
    initializeElements() {
        this.canvasContainer = document.getElementById('canvas-container');
        this.canvasElements = document.getElementById('canvas-elements');
        this.connectionsLayer = document.getElementById('connections-layer');
        this.selectionBox = document.getElementById('selection-box');
        this.contextMenu = document.getElementById('context-menu');
        this.propertiesPanel = document.getElementById('properties-panel');
        this.propertiesContent = document.getElementById('properties-content');
        this.sidebar = document.getElementById('sidebar');
        this.fab = document.getElementById('fab');
        this.fabMenu = document.getElementById('fab-menu');
        this.toastContainer = document.getElementById('toast-container');
        this.projectTitle = document.getElementById('project-title');
        this.lastSaved = document.getElementById('last-saved');
        this.zoomLevel = document.getElementById('zoom-level');
        this.collaborators = document.getElementById('collaborators');
    }
    
    setupEventListeners() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTool(btn.dataset.tool);
            });
        });
        
        // Canvas interactions
        this.canvasContainer.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
        this.canvasContainer.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
        this.canvasContainer.addEventListener('mouseup', this.handleCanvasMouseUp.bind(this));
        this.canvasContainer.addEventListener('wheel', this.handleCanvasWheel.bind(this), { passive: false });
        this.canvasContainer.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        
        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out').addEventListener('click', () => this.zoomOut());
        document.getElementById('fit-to-screen').addEventListener('click', () => this.fitToScreen());
        
        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', this.toggleSidebar.bind(this));
        
        // Properties panel
        document.getElementById('close-properties').addEventListener('click', this.hidePropertiesPanel.bind(this));
        
        // FAB
        document.getElementById('fab-main').addEventListener('click', this.toggleFAB.bind(this));
        document.querySelectorAll('.fab-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tool = item.dataset.tool;
                if (tool === 'ai') {
                    this.openAIAssistant();
                } else {
                    this.setTool(tool);
                }
                this.hideFAB();
            });
        });
        
        // AI Assistant
        document.querySelectorAll('.ai-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleAIAction(btn.id);
            });
        });
        
        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadTemplate(btn.dataset.template);
            });
        });
        
        // Share button
        document.getElementById('share-btn').addEventListener('click', () => {
            this.openShareModal();
        });
        
        // Modal controls
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });
        
        // AI Chat
        document.getElementById('ai-send-btn').addEventListener('click', this.sendAIMessage.bind(this));
        document.getElementById('ai-input-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAIMessage();
            }
        });
        
        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleAISuggestion(btn.textContent);
            });
        });
        
        // Project title
        this.projectTitle.addEventListener('blur', this.saveProject.bind(this));
        this.projectTitle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        });
        
        // Global click handler
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't handle shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
                return;
            }
            
            const ctrl = e.ctrlKey || e.metaKey;
            
            switch (e.key) {
                case 'Delete':
                case 'Backspace':
                    this.deleteSelectedElements();
                    e.preventDefault();
                    break;
                case 'Escape':
                    this.clearSelection();
                    this.hideContextMenu();
                    this.closeAllModals();
                    break;
                case 'a':
                    if (ctrl) {
                        this.selectAll();
                        e.preventDefault();
                    }
                    break;
                case 's':
                    if (ctrl) {
                        this.saveProject();
                        e.preventDefault();
                    }
                    break;
                case 'z':
                    if (ctrl && !e.shiftKey) {
                        this.undo();
                        e.preventDefault();
                    } else if (ctrl && e.shiftKey) {
                        this.redo();
                        e.preventDefault();
                    }
                    break;
                case 'c':
                    if (ctrl) {
                        this.copySelectedElements();
                        e.preventDefault();
                    }
                    break;
                case 'v':
                    if (ctrl) {
                        this.pasteElements();
                        e.preventDefault();
                    }
                    break;
                case 'd':
                    if (ctrl) {
                        this.duplicateSelectedElements();
                        e.preventDefault();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                    if (!ctrl) {
                        const tools = ['select', 'note', 'idea', 'image', 'document', 'link', 'arrow', 'shape'];
                        const toolIndex = parseInt(e.key) - 1;
                        if (tools[toolIndex]) {
                            this.setTool(tools[toolIndex]);
                            e.preventDefault();
                        }
                    }
                    break;
                case 'Enter':
                    if (this.selectedElements.size === 1) {
                        const element = this.elements.get([...this.selectedElements][0]);
                        if (element) {
                            this.startEditingElement(element);
                            e.preventDefault();
                        }
                    }
                    break;
                case ' ':
                    this.setTool('select');
                    e.preventDefault();
                    break;
            }
        });
    }
    
    initializeCanvas() {
        // Initialize with a welcome note
        setTimeout(() => {
            this.createElement('note', { x: 200, y: 150 }, {
                content: 'مرحباً بك في IdeaFlux!\n\nابدأ بإضافة أفكارك وملاحظاتك هنا. استخدم الأدوات من الشريط الجانبي أو اضغط على الأرقام 1-8 للتبديل السريع بين الأدوات.'
            });
            
            this.createElement('idea', { x: 450, y: 200 }, {
                content: 'فكرة رائعة!\n\nيمكنك ربط الأفكار ببعضها البعض باستخدام أداة السهم.'
            });
            
            // Create a connection between them
            const elements = Array.from(this.elements.values());
            if (elements.length >= 2) {
                this.createConnection(elements[0].id, elements[1].id);
            }
        }, 1000);
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                app.classList.remove('hidden');
            }, 500);
        }, 2000);
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll(`[data-tool="${tool}"]`).forEach(btn => {
            btn.classList.add('active');
        });
        
        // Update cursor
        this.updateCanvasCursor();
        
        this.showToast('تم تغيير الأداة', `تم تفعيل أداة: ${this.getToolName(tool)}`, 'info');
    }
    
    getToolName(tool) {
        const names = {
            select: 'الاختيار',
            note: 'الملاحظة',
            idea: 'الفكرة',
            image: 'الصورة',
            document: 'المستند',
            link: 'الرابط',
            arrow: 'السهم',
            shape: 'الشكل'
        };
        return names[tool] || tool;
    }
    
    updateCanvasCursor() {
        const cursors = {
            select: 'default',
            note: 'crosshair',
            idea: 'crosshair',
            image: 'crosshair',
            document: 'crosshair',
            link: 'crosshair',
            arrow: 'crosshair',
            shape: 'crosshair'
        };
        
        this.canvasContainer.style.cursor = cursors[this.currentTool] || 'default';
    }
    
    handleCanvasMouseDown(e) {
        e.preventDefault();
        
        const canvasRect = this.canvasContainer.getBoundingClientRect();
        const x = (e.clientX - canvasRect.left - this.canvasOffset.x) / this.zoomLevel;
        const y = (e.clientY - canvasRect.top - this.canvasOffset.y) / this.zoomLevel;
        
        // Check if clicking on an element
        const clickedElement = this.getElementAtPosition(x, y);
        
        if (e.button === 0) { // Left click
            if (this.currentTool === 'select') {
                if (clickedElement) {
                    this.handleElementClick(clickedElement, e);
                } else {
                    this.startSelection(x, y, e);
                }
            } else if (this.currentTool === 'arrow') {
                if (clickedElement) {
                    this.startConnection(clickedElement);
                }
            } else {
                // Create new element
                this.createElementAtPosition(x, y);
            }
        }
        
        this.hideContextMenu();
    }
    
    handleCanvasMouseMove(e) {
        const canvasRect = this.canvasContainer.getBoundingClientRect();
        const x = (e.clientX - canvasRect.left - this.canvasOffset.x) / this.zoomLevel;
        const y = (e.clientY - canvasRect.top - this.canvasOffset.y) / this.zoomLevel;
        
        if (this.isDragging && this.selectedElements.size > 0) {
            this.dragSelectedElements(x, y);
        } else if (this.isSelecting) {
            this.updateSelectionBox(x, y);
        } else if (this.isDrawingConnection) {
            this.updateConnectionPreview(x, y);
        }
        
        // Update hover effects
        this.updateElementHover(x, y);
    }
    
    handleCanvasMouseUp(e) {
        const canvasRect = this.canvasContainer.getBoundingClientRect();
        const x = (e.clientX - canvasRect.left - this.canvasOffset.x) / this.zoomLevel;
        const y = (e.clientY - canvasRect.top - this.canvasOffset.y) / this.zoomLevel;
        
        if (this.isDragging) {
            this.endElementDrag();
        } else if (this.isSelecting) {
            this.endSelection();
        } else if (this.isDrawingConnection) {
            const targetElement = this.getElementAtPosition(x, y);
            if (targetElement && targetElement.id !== this.connectionStart) {
                this.createConnection(this.connectionStart, targetElement.id);
            }
            this.endConnection();
        }
        
        this.isDragging = false;
        this.isSelecting = false;
    }
    
    handleCanvasWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5, this.zoomLevel * delta));
        
        if (newZoom !== this.zoomLevel) {
            const canvasRect = this.canvasContainer.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;
            
            this.setZoom(newZoom, mouseX, mouseY);
        }
    }
    
    handleContextMenu(e) {
        e.preventDefault();
        
        const canvasRect = this.canvasContainer.getBoundingClientRect();
        const x = (e.clientX - canvasRect.left - this.canvasOffset.x) / this.zoomLevel;
        const y = (e.clientY - canvasRect.top - this.canvasOffset.y) / this.zoomLevel;
        
        const element = this.getElementAtPosition(x, y);
        
        if (element && !this.selectedElements.has(element.id)) {
            this.clearSelection();
            this.selectElement(element.id);
        }
        
        this.showContextMenu(e.clientX, e.clientY);
    }
    
    createElement(type, position, data = {}) {
        const id = `element_${++this.elementIdCounter}`;
        const element = {
            id,
            type,
            position: { ...position },
            data: {
                content: data.content || this.getDefaultContent(type),
                width: data.width || 200,
                height: data.height || 120,
                ...data
            },
            connections: {
                incoming: new Set(),
                outgoing: new Set()
            }
        };
        
        this.elements.set(id, element);
        this.renderElement(element);
        this.addToHistory('create', { element: { ...element } });
        
        return element;
    }
    
    createElementAtPosition(x, y) {
        const element = this.createElement(this.currentTool, { x, y });
        
        // Auto-select and start editing
        this.clearSelection();
        this.selectElement(element.id);
        
        setTimeout(() => {
            this.startEditingElement(element);
        }, 100);
        
        return element;
    }
    
    renderElement(element) {
        const elementDiv = document.createElement('div');
        elementDiv.className = `canvas-element element-${element.type}`;
        elementDiv.id = `element-${element.id}`;
        elementDiv.style.left = `${element.position.x}px`;
        elementDiv.style.top = `${element.position.y}px`;
        elementDiv.style.width = `${element.data.width}px`;
        elementDiv.style.minHeight = `${element.data.height}px`;
        
        // Element header
        const header = document.createElement('div');
        header.className = 'element-header';
        header.innerHTML = `
            <i class="${this.getElementIcon(element.type)}"></i>
            <span>${this.getElementTypeName(element.type)}</span>
        `;
        
        // Element content
        const content = document.createElement('div');
        content.className = 'element-content';
        content.contentEditable = false;
        content.textContent = element.data.content;
        
        elementDiv.appendChild(header);
        elementDiv.appendChild(content);
        
        // Event listeners
        elementDiv.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.handleElementMouseDown(element, e);
        });
        
        elementDiv.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.startEditingElement(element);
        });
        
        content.addEventListener('blur', () => {
            this.endEditingElement(element);
        });
        
        content.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                content.blur();
            }
        });
        
        this.canvasElements.appendChild(elementDiv);
    }
    
    getElementIcon(type) {
        const icons = {
            note: 'fas fa-sticky-note',
            idea: 'fas fa-lightbulb',
            document: 'fas fa-file-alt',
            image: 'fas fa-image',
            link: 'fas fa-link',
            shape: 'fas fa-shapes'
        };
        return icons[type] || 'fas fa-square';
    }
    
    getElementTypeName(type) {
        const names = {
            note: 'ملاحظة',
            idea: 'فكرة',
            document: 'مستند',
            image: 'صورة',
            link: 'رابط',
            shape: 'شكل'
        };
        return names[type] || type;
    }
    
    getDefaultContent(type) {
        const defaults = {
            note: 'ملاحظة جديدة...',
            idea: 'فكرة جديدة...',
            document: 'مستند جديد...',
            image: 'انقر لإضافة صورة',
            link: 'https://example.com',
            shape: 'شكل'
        };
        return defaults[type] || 'محتوى جديد';
    }
    
    startEditingElement(element) {
        const elementDiv = document.getElementById(`element-${element.id}`);
        const content = elementDiv.querySelector('.element-content');
        
        content.contentEditable = true;
        content.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(content);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        elementDiv.classList.add('editing');
        
        this.showToast('وضع التحرير', 'اضغط Enter للحفظ أو Escape للإلغاء', 'info');
    }
    
    endEditingElement(element) {
        const elementDiv = document.getElementById(`element-${element.id}`);
        const content = elementDiv.querySelector('.element-content');
        
        content.contentEditable = false;
        elementDiv.classList.remove('editing');
        
        const newContent = content.textContent;
        if (newContent !== element.data.content) {
            this.addToHistory('modify', {
                element: element.id,
                oldData: { content: element.data.content },
                newData: { content: newContent }
            });
            
            element.data.content = newContent;
            this.saveProject();
        }
    }
    
    selectElement(elementId) {
        this.selectedElements.add(elementId);
        const elementDiv = document.getElementById(`element-${elementId}`);
        if (elementDiv) {
            elementDiv.classList.add('selected');
        }
        this.updatePropertiesPanel();
    }
    
    deselectElement(elementId) {
        this.selectedElements.delete(elementId);
        const elementDiv = document.getElementById(`element-${elementId}`);
        if (elementDiv) {
            elementDiv.classList.remove('selected');
        }
        this.updatePropertiesPanel();
    }
    
    clearSelection() {
        this.selectedElements.forEach(id => {
            const elementDiv = document.getElementById(`element-${id}`);
            if (elementDiv) {
                elementDiv.classList.remove('selected');
            }
        });
        this.selectedElements.clear();
        this.updatePropertiesPanel();
    }
    
    deleteSelectedElements() {
        if (this.selectedElements.size === 0) return;
        
        const elementsToDelete = Array.from(this.selectedElements);
        
        elementsToDelete.forEach(elementId => {
            this.deleteElement(elementId);
        });
        
        this.clearSelection();
        this.showToast('تم الحذف', `تم حذف ${elementsToDelete.length} عنصر`, 'success');
    }
    
    deleteElement(elementId) {
        const element = this.elements.get(elementId);
        if (!element) return;
        
        // Delete connections
        element.connections.incoming.forEach(connectionId => {
            this.deleteConnection(connectionId);
        });
        element.connections.outgoing.forEach(connectionId => {
            this.deleteConnection(connectionId);
        });
        
        // Remove from DOM
        const elementDiv = document.getElementById(`element-${elementId}`);
        if (elementDiv) {
            elementDiv.remove();
        }
        
        // Remove from map
        this.elements.delete(elementId);
        
        this.addToHistory('delete', { element: { ...element } });
    }
    
    createConnection(fromId, toId) {
        if (fromId === toId) return;
        
        // Check if connection already exists
        const existingConnection = Array.from(this.connections.values())
            .find(conn => conn.from === fromId && conn.to === toId);
        
        if (existingConnection) return existingConnection;
        
        const id = `connection_${++this.connectionIdCounter}`;
        const connection = {
            id,
            from: fromId,
            to: toId,
            type: 'arrow'
        };
        
        this.connections.set(id, connection);
        
        // Update element connections
        const fromElement = this.elements.get(fromId);
        const toElement = this.elements.get(toId);
        
        if (fromElement) fromElement.connections.outgoing.add(id);
        if (toElement) toElement.connections.incoming.add(id);
        
        this.renderConnection(connection);
        this.addToHistory('connect', { connection: { ...connection } });
        
        this.showToast('تم الربط', 'تم إنشاء رابط جديد بنجاح', 'success');
        
        return connection;
    }
    
    renderConnection(connection) {
        const fromElement = this.elements.get(connection.from);
        const toElement = this.elements.get(connection.to);
        
        if (!fromElement || !toElement) return;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.id = `connection-${connection.id}`;
        line.setAttribute('class', 'connection-line');
        line.setAttribute('stroke', '#6366f1');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        
        this.updateConnectionPosition(connection);
        this.connectionsLayer.appendChild(line);
    }
    
    updateConnectionPosition(connection) {
        const line = document.getElementById(`connection-${connection.id}`);
        if (!line) return;
        
        const fromElement = this.elements.get(connection.from);
        const toElement = this.elements.get(connection.to);
        
        if (!fromElement || !toElement) return;
        
        const fromCenter = {
            x: fromElement.position.x + fromElement.data.width / 2,
            y: fromElement.position.y + fromElement.data.height / 2
        };
        
        const toCenter = {
            x: toElement.position.x + toElement.data.width / 2,
            y: toElement.position.y + toElement.data.height / 2
        };
        
        line.setAttribute('x1', fromCenter.x);
        line.setAttribute('y1', fromCenter.y);
        line.setAttribute('x2', toCenter.x);
        line.setAttribute('y2', toCenter.y);
    }
    
    deleteConnection(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection) return;
        
        // Update element connections
        const fromElement = this.elements.get(connection.from);
        const toElement = this.elements.get(connection.to);
        
        if (fromElement) fromElement.connections.outgoing.delete(connectionId);
        if (toElement) toElement.connections.incoming.delete(connectionId);
        
        // Remove from DOM
        const line = document.getElementById(`connection-${connectionId}`);
        if (line) line.remove();
        
        // Remove from map
        this.connections.delete(connectionId);
    }
    
    // AI Assistant Integration
    async handleAIAction(action) {
        switch (action) {
            case 'ai-suggestions':
                this.openAIAssistant();
                break;
            case 'ai-organize':
                await this.organizeWithAI();
                break;
            case 'ai-summarize':
                await this.summarizeWithAI();
                break;
            case 'ai-generate':
                await this.generateIdeasWithAI();
                break;
        }
    }
    
    openAIAssistant() {
        const modal = document.getElementById('ai-modal');
        this.showModal(modal);
    }
    
    async sendAIMessage() {
        const input = document.getElementById('ai-input-field');
        const message = input.value.trim();
        
        if (!message) return;
        
        input.value = '';
        this.addAIChatMessage('user', message);
        
        try {
            const response = await this.callGoogleAI(message);
            this.addAIChatMessage('ai', response);
        } catch (error) {
            console.error('AI Error:', error);
            this.addAIChatMessage('ai', 'عذراً، حدث خطأ في الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.');
        }
    }
    
    async callGoogleAI(message) {
        const context = this.getCanvasContext();
        
        const prompt = `
        أنت مساعد ذكي لمنصة IdeaFlux للتفكير البصري. 
        السياق الحالي: ${context}
        
        سؤال المستخدم: ${message}
        
        قدم إجابة مفيدة وعملية باللغة العربية.
        `;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.googleAIKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid AI response');
        }
    }
    
    getCanvasContext() {
        const elementsCount = this.elements.size;
        const connectionsCount = this.connections.size;
        const elementTypes = {};
        
        this.elements.forEach(element => {
            elementTypes[element.type] = (elementTypes[element.type] || 0) + 1;
        });
        
        return `القماش يحتوي على ${elementsCount} عنصر و ${connectionsCount} رابط. العناصر: ${JSON.stringify(elementTypes)}`;
    }
    
    addAIChatMessage(sender, message) {
        const chatContainer = document.getElementById('ai-chat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <i class="fas fa-robot"></i>
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content user-message">
                    <p>${message}</p>
                </div>
            `;
            messageDiv.style.flexDirection = 'row-reverse';
        }
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    async handleAISuggestion(suggestion) {
        const input = document.getElementById('ai-input-field');
        input.value = suggestion;
        await this.sendAIMessage();
    }
    
    // Template loading
    loadTemplate(templateType) {
        this.clearCanvas();
        
        const templates = {
            research: this.loadResearchTemplate.bind(this),
            brainstorm: this.loadBrainstormTemplate.bind(this),
            project: this.loadProjectTemplate.bind(this),
            'mind-map': this.loadMindMapTemplate.bind(this)
        };
        
        if (templates[templateType]) {
            templates[templateType]();
            this.showToast('تم التحميل', `تم تحميل قالب ${templateType} بنجاح`, 'success');
        }
    }
    
    loadResearchTemplate() {
        const center = { x: 400, y: 300 };
        
        const mainTopic = this.createElement('idea', { x: center.x - 100, y: center.y - 60 }, {
            content: 'موضوع البحث الرئيسي'
        });
        
        const literature = this.createElement('document', { x: center.x - 250, y: center.y - 150 }, {
            content: 'مراجعة الأدبيات'
        });
        
        const methodology = this.createElement('note', { x: center.x + 100, y: center.y - 150 }, {
            content: 'المنهجية'
        });
        
        const results = this.createElement('document', { x: center.x - 250, y: center.y + 50 }, {
            content: 'النتائج'
        });
        
        const conclusion = this.createElement('idea', { x: center.x + 100, y: center.y + 50 }, {
            content: 'الخلاصة'
        });
        
        // Create connections
        this.createConnection(mainTopic.id, literature.id);
        this.createConnection(mainTopic.id, methodology.id);
        this.createConnection(mainTopic.id, results.id);
        this.createConnection(mainTopic.id, conclusion.id);
    }
    
    loadBrainstormTemplate() {
        const center = { x: 400, y: 250 };
        
        const centralIdea = this.createElement('idea', { x: center.x - 100, y: center.y }, {
            content: 'الفكرة المحورية'
        });
        
        const angles = [0, 60, 120, 180, 240, 300];
        const radius = 200;
        
        angles.forEach((angle, index) => {
            const radian = (angle * Math.PI) / 180;
            const x = center.x + Math.cos(radian) * radius - 100;
            const y = center.y + Math.sin(radian) * radius;
            
            const idea = this.createElement('note', { x, y }, {
                content: `فكرة فرعية ${index + 1}`
            });
            
            this.createConnection(centralIdea.id, idea.id);
        });
    }
    
    loadProjectTemplate() {
        const phases = [
            { name: 'التخطيط', x: 100, y: 150 },
            { name: 'التنفيذ', x: 300, y: 150 },
            { name: 'المراقبة', x: 500, y: 150 },
            { name: 'الإنجاز', x: 700, y: 150 }
        ];
        
        let previousElement = null;
        
        phases.forEach(phase => {
            const element = this.createElement('document', phase, {
                content: phase.name
            });
            
            if (previousElement) {
                this.createConnection(previousElement.id, element.id);
            }
            
            previousElement = element;
        });
    }
    
    loadMindMapTemplate() {
        this.loadBrainstormTemplate(); // Similar structure
    }
    
    clearCanvas() {
        this.elements.clear();
        this.connections.clear();
        this.canvasElements.innerHTML = '';
        this.connectionsLayer.innerHTML = this.connectionsLayer.querySelector('defs').outerHTML;
        this.clearSelection();
        this.elementIdCounter = 0;
        this.connectionIdCounter = 0;
    }
    
    // Utility methods
    getElementAtPosition(x, y) {
        for (const element of this.elements.values()) {
            if (x >= element.position.x && 
                x <= element.position.x + element.data.width &&
                y >= element.position.y && 
                y <= element.position.y + element.data.height) {
                return element;
            }
        }
        return null;
    }
    
    showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle'
        };
        
        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('active');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
        
        toast.addEventListener('click', () => {
            toast.classList.remove('active');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });
    }
    
    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal);
        });
    }
    
    showContextMenu(x, y) {
        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
        this.contextMenu.classList.add('active');
    }
    
    hideContextMenu() {
        this.contextMenu.classList.remove('active');
    }
    
    toggleSidebar() {
        document.getElementById('app').classList.toggle('sidebar-collapsed');
    }
    
    toggleFAB() {
        this.fab.classList.toggle('active');
    }
    
    hideFAB() {
        this.fab.classList.remove('active');
    }
    
    updatePropertiesPanel() {
        if (this.selectedElements.size === 0) {
            this.propertiesContent.innerHTML = `
                <div class="no-selection">
                    <i class="fas fa-mouse-pointer"></i>
                    <p>اختر عنصراً لعرض خصائصه</p>
                </div>
            `;
        } else if (this.selectedElements.size === 1) {
            const elementId = [...this.selectedElements][0];
            const element = this.elements.get(elementId);
            
            this.propertiesContent.innerHTML = `
                <div class="property-group">
                    <h4>معلومات العنصر</h4>
                    <div class="property-item">
                        <label>النوع:</label>
                        <span>${this.getElementTypeName(element.type)}</span>
                    </div>
                    <div class="property-item">
                        <label>الموقع:</label>
                        <span>x: ${Math.round(element.position.x)}, y: ${Math.round(element.position.y)}</span>
                    </div>
                    <div class="property-item">
                        <label>الحجم:</label>
                        <span>${element.data.width} × ${element.data.height}</span>
                    </div>
                </div>
                <div class="property-group">
                    <h4>الاتصالات</h4>
                    <div class="property-item">
                        <label>اتصالات واردة:</label>
                        <span>${element.connections.incoming.size}</span>
                    </div>
                    <div class="property-item">
                        <label>اتصالات صادرة:</label>
                        <span>${element.connections.outgoing.size}</span>
                    </div>
                </div>
            `;
        } else {
            this.propertiesContent.innerHTML = `
                <div class="property-group">
                    <h4>عناصر متعددة</h4>
                    <div class="property-item">
                        <label>العدد المحدد:</label>
                        <span>${this.selectedElements.size} عنصر</span>
                    </div>
                </div>
            `;
        }
    }
    
    hidePropertiesPanel() {
        document.getElementById('app').classList.toggle('properties-hidden');
    }
    
    // Auto-save functionality
    startAutoSave() {
        setInterval(() => {
            this.saveProject();
        }, 30000); // Save every 30 seconds
    }
    
    saveProject() {
        const projectData = {
            title: this.projectTitle.value,
            elements: Object.fromEntries(this.elements),
            connections: Object.fromEntries(this.connections),
            canvasOffset: this.canvasOffset,
            zoomLevel: this.zoomLevel,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('ideaflux_project', JSON.stringify(projectData));
        this.updateLastSavedTime();
    }
    
    loadProject() {
        const saved = localStorage.getItem('ideaflux_project');
        if (saved) {
            try {
                const projectData = JSON.parse(saved);
                
                // Load elements
                this.elements.clear();
                Object.entries(projectData.elements || {}).forEach(([id, element]) => {
                    this.elements.set(id, element);
                    this.renderElement(element);
                });
                
                // Load connections
                this.connections.clear();
                Object.entries(projectData.connections || {}).forEach(([id, connection]) => {
                    this.connections.set(id, connection);
                    this.renderConnection(connection);
                });
                
                // Restore view
                this.canvasOffset = projectData.canvasOffset || { x: 0, y: 0 };
                this.setZoom(projectData.zoomLevel || 1);
                
                if (projectData.title) {
                    this.projectTitle.value = projectData.title;
                }
                
                this.updateLastSavedTime();
                
            } catch (error) {
                console.error('Error loading project:', error);
            }
        }
    }
    
    updateLastSavedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        this.lastSaved.textContent = `تم الحفظ في ${timeString}`;
    }
    
    // Zoom and pan
    setZoom(newZoom, centerX = null, centerY = null) {
        this.zoomLevel = Math.max(0.1, Math.min(5, newZoom));
        
        if (centerX !== null && centerY !== null) {
            // Zoom towards a specific point
            const oldZoom = parseFloat(this.canvasElements.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || '1');
            const zoomRatio = this.zoomLevel / oldZoom;
            
            this.canvasOffset.x = centerX - (centerX - this.canvasOffset.x) * zoomRatio;
            this.canvasOffset.y = centerY - (centerY - this.canvasOffset.y) * zoomRatio;
        }
        
        this.canvasElements.style.transform = `translate(${this.canvasOffset.x}px, ${this.canvasOffset.y}px) scale(${this.zoomLevel})`;
        this.connectionsLayer.style.transform = `translate(${this.canvasOffset.x}px, ${this.canvasOffset.y}px) scale(${this.zoomLevel})`;
        
        this.zoomLevelSpan = document.getElementById('zoom-level');
        if (this.zoomLevelSpan) {
            this.zoomLevelSpan.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }
    
    zoomIn() {
        this.setZoom(this.zoomLevel * 1.2);
    }
    
    zoomOut() {
        this.setZoom(this.zoomLevel / 1.2);
    }
    
    fitToScreen() {
        if (this.elements.size === 0) return;
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        this.elements.forEach(element => {
            minX = Math.min(minX, element.position.x);
            minY = Math.min(minY, element.position.y);
            maxX = Math.max(maxX, element.position.x + element.data.width);
            maxY = Math.max(maxY, element.position.y + element.data.height);
        });
        
        const padding = 50;
        const contentWidth = maxX - minX + padding * 2;
        const contentHeight = maxY - minY + padding * 2;
        
        const containerRect = this.canvasContainer.getBoundingClientRect();
        const scaleX = containerRect.width / contentWidth;
        const scaleY = containerRect.height / contentHeight;
        const newZoom = Math.min(scaleX, scaleY, 1);
        
        this.canvasOffset.x = (containerRect.width - contentWidth * newZoom) / 2 + (padding - minX) * newZoom;
        this.canvasOffset.y = (containerRect.height - contentHeight * newZoom) / 2 + (padding - minY) * newZoom;
        
        this.setZoom(newZoom);
    }
    
    // History management
    addToHistory(action, data) {
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new action
        this.history.push({ action, data, timestamp: Date.now() });
        
        // Keep history size manageable
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }
    
    undo() {
        if (this.historyIndex >= 0) {
            const historyItem = this.history[this.historyIndex];
            this.applyHistoryAction(historyItem, true);
            this.historyIndex--;
            
            this.showToast('تراجع', 'تم التراجع عن العملية الأخيرة', 'info');
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const historyItem = this.history[this.historyIndex];
            this.applyHistoryAction(historyItem, false);
            
            this.showToast('إعادة', 'تم إعادة العملية', 'info');
        }
    }
    
    applyHistoryAction(historyItem, isUndo) {
        const { action, data } = historyItem;
        
        switch (action) {
            case 'create':
                if (isUndo) {
                    this.deleteElement(data.element.id);
                } else {
                    this.elements.set(data.element.id, data.element);
                    this.renderElement(data.element);
                }
                break;
            case 'delete':
                if (isUndo) {
                    this.elements.set(data.element.id, data.element);
                    this.renderElement(data.element);
                } else {
                    this.deleteElement(data.element.id);
                }
                break;
            case 'modify':
                const element = this.elements.get(data.element);
                if (element) {
                    const targetData = isUndo ? data.oldData : data.newData;
                    Object.assign(element.data, targetData);
                    
                    const elementDiv = document.getElementById(`element-${element.id}`);
                    const content = elementDiv?.querySelector('.element-content');
                    if (content) {
                        content.textContent = element.data.content;
                    }
                }
                break;
        }
    }
    
    // Global click handler
    handleGlobalClick(e) {
        // Close context menu if clicking outside
        if (!this.contextMenu.contains(e.target)) {
            this.hideContextMenu();
        }
        
        // Close FAB if clicking outside
        if (!this.fab.contains(e.target)) {
            this.hideFAB();
        }
    }
    
    // Handle window resize
    handleResize() {
        // Update canvas dimensions or other responsive elements if needed
        this.fitToScreen();
    }
    
    // Share functionality
    openShareModal() {
        const modal = document.getElementById('share-modal');
        this.showModal(modal);
    }
}

// Initialize the canvas when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ideaFluxCanvas = new IdeaFluxCanvas();
    
    // Load saved project
    setTimeout(() => {
        window.ideaFluxCanvas.loadProject();
    }, 500);
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.ideaFluxCanvas) {
        window.ideaFluxCanvas.saveProject();
    }
});

console.log('🚀 IdeaFlux Canvas initialized successfully!');