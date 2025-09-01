// ThinkCanvas - Advanced Interactive Mind Mapping Platform
// Enhanced version of Scrintal with better features and performance

class ThinkCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.elements = [];
        this.connections = [];
        this.selectedElement = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentTool = 'select';
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
        this.isConnecting = false;
        this.connectionStart = null;
        this.aiAssistant = new AIAssistant();
        this.collaborationManager = new CollaborationManager();
        this.templateManager = new TemplateManager();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCanvas();
        this.initializeUI();
        this.setupIntersectionObserver();
        this.loadAutoSave();
    }

    setupEventListeners() {
        // Navigation scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Interactive demo canvas
        this.setupDemoCanvas();
        
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', this.handleToolSelect.bind(this));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navActions = document.querySelector('.nav-actions');
        const hamburger = document.querySelector('.hamburger');
        
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    setupDemoCanvas() {
        const canvasArea = document.getElementById('canvasArea');
        const canvasConnections = document.getElementById('canvasConnections');
        
        if (!canvasArea || !canvasConnections) return;

        // Make nodes draggable
        const nodes = canvasArea.querySelectorAll('.canvas-node');
        nodes.forEach(node => {
            this.makeNodeDraggable(node);
        });

        // Canvas interactions
        canvasArea.addEventListener('click', this.handleCanvasClick.bind(this));
        canvasArea.addEventListener('dblclick', this.handleCanvasDoubleClick.bind(this));
    }

    makeNodeDraggable(node) {
        let isDragging = false;
        let startPos = { x: 0, y: 0 };
        let nodePos = { x: 0, y: 0 };

        node.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos.x = e.clientX;
            startPos.y = e.clientY;
            
            const rect = node.getBoundingClientRect();
            const parentRect = node.parentElement.getBoundingClientRect();
            nodePos.x = rect.left - parentRect.left;
            nodePos.y = rect.top - parentRect.top;
            
            node.style.zIndex = '1000';
            node.classList.add('dragging');
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;
            
            const newX = Math.max(0, Math.min(nodePos.x + deltaX, node.parentElement.clientWidth - node.clientWidth));
            const newY = Math.max(0, Math.min(nodePos.y + deltaY, node.parentElement.clientHeight - node.clientHeight));
            
            node.style.left = newX + 'px';
            node.style.top = newY + 'px';
            
            this.updateConnections();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                node.style.zIndex = '';
                node.classList.remove('dragging');
                this.autoSave();
            }
        });

        // Touch events for mobile
        node.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            isDragging = true;
            startPos.x = touch.clientX;
            startPos.y = touch.clientY;
            
            const rect = node.getBoundingClientRect();
            const parentRect = node.parentElement.getBoundingClientRect();
            nodePos.x = rect.left - parentRect.left;
            nodePos.y = rect.top - parentRect.top;
            
            node.style.zIndex = '1000';
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startPos.x;
            const deltaY = touch.clientY - startPos.y;
            
            const newX = Math.max(0, Math.min(nodePos.x + deltaX, node.parentElement.clientWidth - node.clientWidth));
            const newY = Math.max(0, Math.min(nodePos.y + deltaY, node.parentElement.clientHeight - node.clientHeight));
            
            node.style.left = newX + 'px';
            node.style.top = newY + 'px';
            
            this.updateConnections();
            e.preventDefault();
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                node.style.zIndex = '';
                this.autoSave();
            }
        });
    }

    handleToolSelect(e) {
        const tool = e.currentTarget.dataset.tool;
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        // Update cursor
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.className = `canvas-area tool-${tool}`;
        }
    }

    handleCanvasClick(e) {
        if (e.target.classList.contains('canvas-area')) {
            this.createNewElement(e);
        }
    }

    handleCanvasDoubleClick(e) {
        if (e.target.classList.contains('canvas-node')) {
            this.editElement(e.target);
        }
    }

    createNewElement(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let elementHtml = '';
        const id = 'node-' + Date.now();
        
        switch (this.currentTool) {
            case 'note':
                elementHtml = this.createNoteElement(id, x, y);
                break;
            case 'image':
                elementHtml = this.createImageElement(id, x, y);
                break;
            case 'ai':
                elementHtml = this.createAIElement(id, x, y);
                break;
        }
        
        if (elementHtml) {
            e.currentTarget.insertAdjacentHTML('beforeend', elementHtml);
            const newElement = document.getElementById(id);
            this.makeNodeDraggable(newElement);
            newElement.classList.add('fade-in');
            this.autoSave();
        }
    }

    createNoteElement(id, x, y) {
        return `
            <div class="canvas-node" id="${id}" style="top: ${y}px; left: ${x}px;" data-type="note">
                <div class="node-header">
                    <i class="fas fa-sticky-note"></i>
                    <span>ملاحظة جديدة</span>
                    <button class="node-delete" onclick="thinkCanvas.deleteElement('${id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="node-content" contenteditable="true" placeholder="اكتب ملاحظتك هنا...">
                    انقر للتحرير...
                </div>
            </div>
        `;
    }

    createImageElement(id, x, y) {
        return `
            <div class="canvas-node" id="${id}" style="top: ${y}px; left: ${x}px;" data-type="image">
                <div class="node-header">
                    <i class="fas fa-image"></i>
                    <span>صورة</span>
                    <button class="node-delete" onclick="thinkCanvas.deleteElement('${id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="node-content">
                    <div class="image-upload" onclick="thinkCanvas.uploadImage('${id}')">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>انقر لرفع صورة</span>
                    </div>
                </div>
            </div>
        `;
    }

    createAIElement(id, x, y) {
        return `
            <div class="canvas-node ai-node" id="${id}" style="top: ${y}px; left: ${x}px;" data-type="ai">
                <div class="node-header">
                    <i class="fas fa-robot"></i>
                    <span>مساعد ذكي</span>
                    <button class="node-delete" onclick="thinkCanvas.deleteElement('${id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="node-content">
                    <div class="ai-interface">
                        <input type="text" placeholder="اسأل المساعد الذكي..." onkeypress="thinkCanvas.handleAIInput(event, '${id}')">
                        <button onclick="thinkCanvas.askAI('${id}')">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="ai-response" id="ai-response-${id}">
                        مرحباً! كيف يمكنني مساعدتك اليوم؟
                    </div>
                </div>
            </div>
        `;
    }

    deleteElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('scale-out');
            setTimeout(() => {
                element.remove();
                this.updateConnections();
                this.autoSave();
            }, 300);
        }
    }

    editElement(element) {
        const content = element.querySelector('.node-content');
        if (content && content.contentEditable !== 'true') {
            content.contentEditable = true;
            content.focus();
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(content);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    uploadImage(id) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '8px';
                    
                    const element = document.getElementById(id);
                    const content = element.querySelector('.node-content');
                    content.innerHTML = '';
                    content.appendChild(img);
                    
                    this.autoSave();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    handleAIInput(event, id) {
        if (event.key === 'Enter') {
            this.askAI(id);
        }
    }

    async askAI(id) {
        const element = document.getElementById(id);
        const input = element.querySelector('input');
        const responseDiv = element.querySelector('.ai-response');
        const question = input.value.trim();
        
        if (!question) return;
        
        // Show loading
        responseDiv.innerHTML = '<div class="loading"></div> جاري التفكير...';
        
        try {
            // Simulate AI response (in real app, this would call actual AI API)
            const response = await this.aiAssistant.getResponse(question);
            
            setTimeout(() => {
                responseDiv.innerHTML = response;
                input.value = '';
                this.autoSave();
            }, 1000);
            
        } catch (error) {
            responseDiv.innerHTML = 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
        }
    }

    updateConnections() {
        const svg = document.getElementById('canvasConnections');
        if (!svg) return;
        
        // Clear existing connections
        svg.innerHTML = '';
        
        // Add sample connections for demo
        const nodes = document.querySelectorAll('.canvas-node');
        if (nodes.length >= 2) {
            const node1 = nodes[0];
            const node2 = nodes[1];
            
            const rect1 = node1.getBoundingClientRect();
            const rect2 = node2.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            
            const x1 = rect1.left - svgRect.left + rect1.width / 2;
            const y1 = rect1.top - svgRect.top + rect1.height / 2;
            const x2 = rect2.left - svgRect.left + rect2.width / 2;
            const y2 = rect2.top - svgRect.top + rect2.height / 2;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 50} ${x2} ${y2}`;
            
            path.setAttribute('d', d);
            path.setAttribute('stroke', '#4f46e5');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-dasharray', '5,5');
            
            // Add animation
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'stroke-dashoffset');
            animate.setAttribute('values', '0;10');
            animate.setAttribute('dur', '1s');
            animate.setAttribute('repeatCount', 'indefinite');
            
            path.appendChild(animate);
            svg.appendChild(path);
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S for save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveProject();
        }
        
        // Ctrl/Cmd + Z for undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            this.undo();
        }
        
        // Delete key for deleting selected element
        if (e.key === 'Delete' && this.selectedElement) {
            this.deleteElement(this.selectedElement.id);
        }
        
        // Escape key to deselect
        if (e.key === 'Escape') {
            this.deselectAll();
        }
    }

    handleResize() {
        // Update canvas dimensions and element positions
        this.updateConnections();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Observe feature cards
        document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
            observer.observe(card);
        });
    }

    initializeCanvas() {
        // Initialize main canvas for full application
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            canvasContainer.appendChild(this.canvas);
            this.resizeCanvas();
        }
    }

    initializeUI() {
        // Initialize UI components
        this.setupToolbar();
        this.setupPropertyPanel();
        this.setupLayerPanel();
    }

    setupToolbar() {
        // Advanced toolbar setup for full application
    }

    setupPropertyPanel() {
        // Properties panel for selected elements
    }

    setupLayerPanel() {
        // Layer management panel
    }

    autoSave() {
        // Auto-save functionality
        const data = this.exportData();
        localStorage.setItem('thinkcanvas-autosave', JSON.stringify(data));
    }

    loadAutoSave() {
        // Load auto-saved data
        const saved = localStorage.getItem('thinkcanvas-autosave');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.importData(data);
            } catch (e) {
                console.warn('Could not load auto-saved data:', e);
            }
        }
    }

    exportData() {
        // Export canvas data
        const nodes = Array.from(document.querySelectorAll('.canvas-node')).map(node => ({
            id: node.id,
            type: node.dataset.type,
            position: {
                x: parseInt(node.style.left),
                y: parseInt(node.style.top)
            },
            content: node.querySelector('.node-content').innerHTML,
            title: node.querySelector('.node-header span').textContent
        }));

        return {
            version: '1.0',
            timestamp: Date.now(),
            nodes: nodes,
            connections: this.connections,
            settings: {
                zoom: this.zoom,
                pan: this.pan
            }
        };
    }

    importData(data) {
        // Import canvas data
        if (!data || !data.nodes) return;
        
        const canvasArea = document.getElementById('canvasArea');
        if (!canvasArea) return;
        
        // Clear existing nodes
        canvasArea.querySelectorAll('.canvas-node').forEach(node => node.remove());
        
        // Import nodes
        data.nodes.forEach(nodeData => {
            const element = this.createElementFromData(nodeData);
            if (element) {
                canvasArea.appendChild(element);
                this.makeNodeDraggable(element);
            }
        });
        
        // Import connections
        this.connections = data.connections || [];
        this.updateConnections();
    }

    createElementFromData(nodeData) {
        const element = document.createElement('div');
        element.className = 'canvas-node fade-in';
        element.id = nodeData.id;
        element.dataset.type = nodeData.type;
        element.style.left = nodeData.position.x + 'px';
        element.style.top = nodeData.position.y + 'px';
        
        element.innerHTML = `
            <div class="node-header">
                <i class="fas fa-${this.getIconForType(nodeData.type)}"></i>
                <span>${nodeData.title}</span>
                <button class="node-delete" onclick="thinkCanvas.deleteElement('${nodeData.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="node-content">${nodeData.content}</div>
        `;
        
        return element;
    }

    getIconForType(type) {
        const icons = {
            note: 'sticky-note',
            image: 'image',
            pdf: 'file-pdf',
            video: 'video',
            ai: 'robot',
            text: 'align-left',
            link: 'link'
        };
        return icons[type] || 'square';
    }

    saveProject() {
        const data = this.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `thinkcanvas-project-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    undo() {
        // Undo functionality (simplified)
        console.log('Undo functionality would be implemented here');
    }

    deselectAll() {
        document.querySelectorAll('.canvas-node.selected').forEach(node => {
            node.classList.remove('selected');
        });
        this.selectedElement = null;
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
}

// AI Assistant Class
class AIAssistant {
    constructor() {
        this.responses = {
            'مرحبا': 'مرحباً بك في ThinkCanvas! كيف يمكنني مساعدتك اليوم؟',
            'ما هو': 'ThinkCanvas هي منصة للتفكير المرئي والخرائط الذهنية التفاعلية',
            'كيف': 'يمكنك البدء بإنشاء ملاحظة أو صورة وربطها بعناصر أخرى',
            'مساعدة': 'يمكنني مساعدتك في:\n• إنشاء خرائط ذهنية\n• تنظيم الأفكار\n• ربط المفاهيم\n• إنشاء مخططات تعليمية',
            'شكرا': 'العفو! أنا هنا دائماً لمساعدتك 😊'
        };
    }
    
    async getResponse(question) {
        // Simple keyword matching (in real app, this would use actual AI)
        const lowerQuestion = question.toLowerCase();
        
        for (const [keyword, response] of Object.entries(this.responses)) {
            if (lowerQuestion.includes(keyword)) {
                return response;
            }
        }
        
        // Generate creative response based on question
        if (lowerQuestion.includes('فكرة') || lowerQuestion.includes('إبداع')) {
            return 'إليك بعض الأفكار الإبداعية:\n• استخدم الألوان للتصنيف\n• ارسم روابط بين المفاهيم\n• أضف صور توضيحية\n• استخدم الأشكال المختلفة';
        }
        
        if (lowerQuestion.includes('تعلم') || lowerQuestion.includes('دراسة')) {
            return 'لتحسين التعلم:\n• قسم المعلومات لأجزاء صغيرة\n• استخدم الخرائط الذهنية\n• اربط المعلومات الجديدة بما تعرفه\n• راجع المحتوى بانتظام';
        }
        
        return 'سؤال رائع! يمكنني مساعدتك بشكل أفضل إذا كنت أكثر تحديداً. جرب أن تسأل عن الأفكار أو التعلم أو كيفية استخدام ThinkCanvas.';
    }
}

// Collaboration Manager Class
class CollaborationManager {
    constructor() {
        this.isConnected = false;
        this.users = [];
        this.cursors = new Map();
    }
    
    connect() {
        // WebSocket connection for real-time collaboration
        this.isConnected = true;
    }
    
    disconnect() {
        this.isConnected = false;
    }
    
    broadcastChange(change) {
        // Broadcast changes to other users
        if (this.isConnected) {
            // Send change via WebSocket
        }
    }
    
    handleRemoteChange(change) {
        // Handle changes from other users
    }
}

// Template Manager Class
class TemplateManager {
    constructor() {
        this.templates = [
            {
                id: 'mind-map',
                name: 'خريطة ذهنية أساسية',
                description: 'قالب خريطة ذهنية للعصف الذهني',
                category: 'تفكير'
            },
            {
                id: 'project-planning',
                name: 'تخطيط مشروع',
                description: 'قالب لتخطيط وإدارة المشاريع',
                category: 'عمل'
            },
            {
                id: 'study-notes',
                name: 'ملاحظات دراسية',
                description: 'قالب لتنظيم المواد الدراسية',
                category: 'تعليم'
            },
            {
                id: 'research-board',
                name: 'لوحة بحث',
                description: 'قالب لتنظيم البحوث والمصادر',
                category: 'بحث'
            }
        ];
    }
    
    getTemplates() {
        return this.templates;
    }
    
    loadTemplate(templateId) {
        // Load template data
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            // Load template structure
            return this.generateTemplateData(template);
        }
        return null;
    }
    
    generateTemplateData(template) {
        // Generate template structure based on type
        switch (template.id) {
            case 'mind-map':
                return this.createMindMapTemplate();
            case 'project-planning':
                return this.createProjectTemplate();
            case 'study-notes':
                return this.createStudyTemplate();
            case 'research-board':
                return this.createResearchTemplate();
            default:
                return null;
        }
    }
    
    createMindMapTemplate() {
        return {
            nodes: [
                {
                    id: 'central-idea',
                    type: 'note',
                    position: { x: 400, y: 200 },
                    content: 'الفكرة المركزية',
                    title: 'الفكرة الرئيسية'
                },
                {
                    id: 'branch-1',
                    type: 'note',
                    position: { x: 200, y: 100 },
                    content: 'فرع 1',
                    title: 'فرع'
                },
                {
                    id: 'branch-2',
                    type: 'note',
                    position: { x: 600, y: 100 },
                    content: 'فرع 2',
                    title: 'فرع'
                },
                {
                    id: 'branch-3',
                    type: 'note',
                    position: { x: 200, y: 300 },
                    content: 'فرع 3',
                    title: 'فرع'
                },
                {
                    id: 'branch-4',
                    type: 'note',
                    position: { x: 600, y: 300 },
                    content: 'فرع 4',
                    title: 'فرع'
                }
            ],
            connections: [
                { from: 'central-idea', to: 'branch-1' },
                { from: 'central-idea', to: 'branch-2' },
                { from: 'central-idea', to: 'branch-3' },
                { from: 'central-idea', to: 'branch-4' }
            ]
        };
    }
    
    createProjectTemplate() {
        return {
            nodes: [
                {
                    id: 'project-title',
                    type: 'note',
                    position: { x: 350, y: 50 },
                    content: 'عنوان المشروع',
                    title: 'المشروع'
                },
                {
                    id: 'objectives',
                    type: 'note',
                    position: { x: 150, y: 150 },
                    content: 'الأهداف',
                    title: 'الأهداف'
                },
                {
                    id: 'timeline',
                    type: 'note',
                    position: { x: 350, y: 150 },
                    content: 'الجدول الزمني',
                    title: 'التوقيت'
                },
                {
                    id: 'resources',
                    type: 'note',
                    position: { x: 550, y: 150 },
                    content: 'الموارد المطلوبة',
                    title: 'الموارد'
                },
                {
                    id: 'tasks',
                    type: 'note',
                    position: { x: 250, y: 250 },
                    content: 'المهام',
                    title: 'المهام'
                },
                {
                    id: 'team',
                    type: 'note',
                    position: { x: 450, y: 250 },
                    content: 'الفريق',
                    title: 'الفريق'
                }
            ],
            connections: [
                { from: 'project-title', to: 'objectives' },
                { from: 'project-title', to: 'timeline' },
                { from: 'project-title', to: 'resources' },
                { from: 'objectives', to: 'tasks' },
                { from: 'timeline', to: 'tasks' },
                { from: 'resources', to: 'team' }
            ]
        };
    }
    
    createStudyTemplate() {
        return {
            nodes: [
                {
                    id: 'subject',
                    type: 'note',
                    position: { x: 350, y: 50 },
                    content: 'المادة الدراسية',
                    title: 'المادة'
                },
                {
                    id: 'chapter-1',
                    type: 'note',
                    position: { x: 150, y: 150 },
                    content: 'الفصل الأول',
                    title: 'فصل'
                },
                {
                    id: 'chapter-2',
                    type: 'note',
                    position: { x: 350, y: 150 },
                    content: 'الفصل الثاني',
                    title: 'فصل'
                },
                {
                    id: 'chapter-3',
                    type: 'note',
                    position: { x: 550, y: 150 },
                    content: 'الفصل الثالث',
                    title: 'فصل'
                },
                {
                    id: 'notes-1',
                    type: 'note',
                    position: { x: 150, y: 250 },
                    content: 'ملاحظات هامة',
                    title: 'ملاحظات'
                },
                {
                    id: 'examples',
                    type: 'note',
                    position: { x: 350, y: 250 },
                    content: 'أمثلة وتمارين',
                    title: 'أمثلة'
                },
                {
                    id: 'summary',
                    type: 'note',
                    position: { x: 550, y: 250 },
                    content: 'ملخص',
                    title: 'ملخص'
                }
            ],
            connections: [
                { from: 'subject', to: 'chapter-1' },
                { from: 'subject', to: 'chapter-2' },
                { from: 'subject', to: 'chapter-3' },
                { from: 'chapter-1', to: 'notes-1' },
                { from: 'chapter-2', to: 'examples' },
                { from: 'chapter-3', to: 'summary' }
            ]
        };
    }
    
    createResearchTemplate() {
        return {
            nodes: [
                {
                    id: 'research-topic',
                    type: 'note',
                    position: { x: 350, y: 50 },
                    content: 'موضوع البحث',
                    title: 'البحث'
                },
                {
                    id: 'hypothesis',
                    type: 'note',
                    position: { x: 150, y: 150 },
                    content: 'الفرضية',
                    title: 'الفرضية'
                },
                {
                    id: 'methodology',
                    type: 'note',
                    position: { x: 550, y: 150 },
                    content: 'المنهجية',
                    title: 'المنهج'
                },
                {
                    id: 'sources',
                    type: 'note',
                    position: { x: 100, y: 250 },
                    content: 'المصادر',
                    title: 'المصادر'
                },
                {
                    id: 'data',
                    type: 'note',
                    position: { x: 300, y: 250 },
                    content: 'البيانات',
                    title: 'البيانات'
                },
                {
                    id: 'analysis',
                    type: 'note',
                    position: { x: 500, y: 250 },
                    content: 'التحليل',
                    title: 'التحليل'
                },
                {
                    id: 'conclusions',
                    type: 'note',
                    position: { x: 350, y: 350 },
                    content: 'النتائج والخلاصة',
                    title: 'النتائج'
                }
            ],
            connections: [
                { from: 'research-topic', to: 'hypothesis' },
                { from: 'research-topic', to: 'methodology' },
                { from: 'hypothesis', to: 'sources' },
                { from: 'methodology', to: 'data' },
                { from: 'data', to: 'analysis' },
                { from: 'sources', to: 'analysis' },
                { from: 'analysis', to: 'conclusions' }
            ]
        };
    }
}

// Global Functions
function startCanvas() {
    // Redirect to full canvas application
    alert('🚀 مرحباً بك في ThinkCanvas!\n\nهذا عرض توضيحي للواجهة الرئيسية.\nفي التطبيق الكامل، ستنتقل إلى واجهة اللوحة الشاملة مع جميع الأدوات المتقدمة.');
    
    // In real app, this would navigate to the full canvas interface
    // window.location.href = '/canvas';
}

function showDemo() {
    // Scroll to interactive demo
    const demoSection = document.querySelector('.interactive-demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Highlight the demo area
    const demoCanvas = document.getElementById('demoCanvas');
    if (demoCanvas) {
        demoCanvas.style.border = '3px solid #4f46e5';
        demoCanvas.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.3)';
        
        setTimeout(() => {
            demoCanvas.style.border = '1px solid var(--border)';
            demoCanvas.style.boxShadow = 'var(--shadow-lg)';
        }, 3000);
    }
}

function learnMore() {
    // Show more information modal or scroll to features
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize ThinkCanvas when DOM is loaded
let thinkCanvas;

document.addEventListener('DOMContentLoaded', () => {
    thinkCanvas = new ThinkCanvas();
    
    // Add some demo animations
    setTimeout(() => {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-up');
            }, index * 100);
        });
    }, 500);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .scale-out {
        animation: scaleOut 0.3s ease-in-out forwards;
    }
    
    @keyframes scaleOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    .dragging {
        transform: rotate(2deg);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        cursor: grabbing !important;
    }
    
    .node-delete {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
    }
    
    .canvas-node:hover .node-delete {
        opacity: 1;
    }
    
    .node-delete:hover {
        background: #dc2626;
        transform: scale(1.1);
    }
    
    .ai-interface {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
    }
    
    .ai-interface input {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--border);
        border-radius: 6px;
        font-family: var(--font-primary);
    }
    
    .ai-interface button {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        cursor: pointer;
    }
    
    .ai-response {
        background: var(--surface);
        padding: 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-line;
    }
    
    .image-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 20px;
        border: 2px dashed var(--border);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .image-upload:hover {
        border-color: var(--primary-color);
        background: var(--surface);
    }
    
    .image-upload i {
        font-size: 24px;
        color: var(--text-secondary);
    }
    
    .tool-select .canvas-area {
        cursor: default;
    }
    
    .tool-note .canvas-area {
        cursor: crosshair;
    }
    
    .tool-image .canvas-area {
        cursor: copy;
    }
    
    .tool-connect .canvas-area {
        cursor: pointer;
    }
    
    .tool-ai .canvas-area {
        cursor: help;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active,
        .nav-actions.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: var(--shadow-lg);
            gap: 16px;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
    }
`;

document.head.appendChild(style);