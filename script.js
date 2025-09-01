// ThoughtFlow - Interactive Canvas Application
class ThoughtFlowApp {
    constructor() {
        this.canvas = null;
        this.isDrawingMode = false;
        this.currentTool = 'select';
        this.blocks = [];
        this.connections = [];
        this.aiAssistant = new AIAssistant();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeLucideIcons();
        this.setupIntersectionObserver();
        this.createDemoCanvas();
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLogin());
        document.getElementById('signupBtn')?.addEventListener('click', () => this.showSignup());
        document.getElementById('startFreeBtn')?.addEventListener('click', () => this.openApp());
        document.getElementById('watchDemoBtn')?.addEventListener('click', () => this.watchDemo());
        
        // Modal close
        document.querySelector('.close-modal')?.addEventListener('click', () => this.closeModal());
        
        // Canvas tools
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTool(e.target.closest('.tool-btn')));
        });
        
        // AI Assistant
        document.getElementById('aiAssistBtn')?.addEventListener('click', () => this.toggleAI());
        
        // Template buttons
        document.querySelectorAll('.template-card button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.target.closest('.template-card').querySelector('h3').textContent;
                this.useTemplate(template);
            });
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
        
        // Escape key to close modal
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe sections for animations
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    createDemoCanvas() {
        const demoCanvas = document.getElementById('demoCanvas');
        if (!demoCanvas) return;
        
        // Initialize Fabric.js canvas for demo
        const fabricCanvas = new fabric.Canvas(demoCanvas, {
            backgroundColor: '#f9fafb',
            selection: true,
            preserveObjectStacking: true
        });
        
        // Add demo objects
        this.addDemoObjects(fabricCanvas);
        
        // Make canvas responsive
        this.makeCanvasResponsive(fabricCanvas);
    }
    
    addDemoObjects(canvas) {
        // Add some demo text boxes
        const textBox1 = new fabric.Textbox('مرحباً بك في ThoughtFlow', {
            left: 100,
            top: 100,
            width: 200,
            fontSize: 18,
            fill: '#1f2937',
            fontFamily: 'Cairo',
            backgroundColor: '#ffffff',
            padding: 15,
            borderRadius: 10,
            shadow: 'rgba(0,0,0,0.1) 0px 4px 12px'
        });
        
        const textBox2 = new fabric.Textbox('اربط أفكارك بصرياً', {
            left: 350,
            top: 200,
            width: 180,
            fontSize: 16,
            fill: '#667eea',
            fontFamily: 'Cairo',
            backgroundColor: '#f0f4ff',
            padding: 12,
            borderRadius: 8
        });
        
        const textBox3 = new fabric.Textbox('تعلم بطريقة تفاعلية', {
            left: 150,
            top: 350,
            width: 160,
            fontSize: 16,
            fill: '#059669',
            fontFamily: 'Cairo',
            backgroundColor: '#ecfdf5',
            padding: 12,
            borderRadius: 8
        });
        
        canvas.add(textBox1, textBox2, textBox3);
        
        // Add connecting lines
        setTimeout(() => {
            const line1 = new fabric.Line([200, 150, 350, 220], {
                stroke: '#667eea',
                strokeWidth: 3,
                selectable: false,
                evented: false
            });
            
            const line2 = new fabric.Line([250, 250, 220, 350], {
                stroke: '#8b5cf6',
                strokeWidth: 3,
                selectable: false,
                evented: false
            });
            
            canvas.add(line1, line2);
            canvas.sendToBack(line1);
            canvas.sendToBack(line2);
        }, 1000);
    }
    
    makeCanvasResponsive(canvas) {
        const container = canvas.wrapperEl.parentElement;
        
        const resizeCanvas = () => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            canvas.setDimensions({
                width: containerWidth,
                height: containerHeight
            });
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }
    
    selectTool(toolBtn) {
        // Remove active class from all tools
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected tool
        toolBtn.classList.add('active');
        
        // Set current tool
        this.currentTool = toolBtn.dataset.tool || toolBtn.id;
        
        // Handle tool-specific logic
        this.handleToolSelection(this.currentTool);
    }
    
    handleToolSelection(tool) {
        switch(tool) {
            case 'select':
                this.setCursor('default');
                break;
            case 'text':
                this.setCursor('text');
                break;
            case 'note':
                this.setCursor('copy');
                break;
            case 'image':
                this.setCursor('crosshair');
                break;
            case 'link':
                this.setCursor('pointer');
                break;
            case 'aiAssistBtn':
                this.toggleAI();
                break;
        }
    }
    
    setCursor(cursor) {
        const canvas = document.getElementById('demoCanvas');
        if (canvas) {
            canvas.style.cursor = cursor;
        }
    }
    
    toggleAI() {
        // This would open the AI assistant panel
        console.log('Opening AI Assistant...');
        this.showNotification('مساعد AI متاح مجاناً لمساعدتك في التلخيص والتحليل!', 'success');
    }
    
    showLogin() {
        this.showNotification('تسجيل الدخول قريباً...', 'info');
    }
    
    showSignup() {
        this.openApp();
    }
    
    openApp() {
        const modal = document.getElementById('appModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Initialize main canvas app
            setTimeout(() => {
                this.initializeMainApp();
            }, 300);
        }
    }
    
    closeModal() {
        const modal = document.getElementById('appModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    initializeMainApp() {
        const appContainer = document.getElementById('appContainer');
        if (!appContainer) return;
        
        appContainer.innerHTML = `
            <div class="canvas-container">
                <canvas id="mainCanvas" class="main-canvas"></canvas>
                
                <div class="canvas-toolbar">
                    <button class="tool-btn active" data-tool="select">
                        <i data-lucide="mouse-pointer"></i>
                    </button>
                    <button class="tool-btn" data-tool="text">
                        <i data-lucide="type"></i>
                    </button>
                    <button class="tool-btn" data-tool="note">
                        <i data-lucide="sticky-note"></i>
                    </button>
                    <button class="tool-btn" data-tool="image">
                        <i data-lucide="image"></i>
                    </button>
                    <button class="tool-btn" data-tool="pdf">
                        <i data-lucide="file-text"></i>
                    </button>
                    <button class="tool-btn" data-tool="link">
                        <i data-lucide="link"></i>
                    </button>
                    <div class="toolbar-separator"></div>
                    <button class="tool-btn" id="mainAiAssistBtn">
                        <i data-lucide="bot"></i>
                        مساعد AI
                    </button>
                    <button class="tool-btn" id="templatesBtn">
                        <i data-lucide="layout-template"></i>
                        قوالب
                    </button>
                    <button class="tool-btn" id="shareBtn">
                        <i data-lucide="share-2"></i>
                        مشاركة
                    </button>
                </div>
                
                <div class="sidebar" id="mainSidebar">
                    <div class="sidebar-header">
                        <h3>مكتبة العناصر</h3>
                        <button class="close-sidebar">&times;</button>
                    </div>
                    <div class="sidebar-content">
                        <div class="block-library">
                            <div class="library-item" data-type="text">
                                <i data-lucide="type"></i>
                                <span>مربع نص</span>
                            </div>
                            <div class="library-item" data-type="note">
                                <i data-lucide="sticky-note"></i>
                                <span>ملاحظة سريعة</span>
                            </div>
                            <div class="library-item" data-type="image">
                                <i data-lucide="image"></i>
                                <span>صورة</span>
                            </div>
                            <div class="library-item" data-type="pdf">
                                <i data-lucide="file-text"></i>
                                <span>ملف PDF</span>
                            </div>
                            <div class="library-item" data-type="video">
                                <i data-lucide="video"></i>
                                <span>فيديو</span>
                            </div>
                            <div class="library-item" data-type="mind-map">
                                <i data-lucide="git-branch"></i>
                                <span>خريطة ذهنية</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ai-panel" id="mainAiPanel">
                    <h4>مساعد AI الذكي - مجاني</h4>
                    <div class="ai-input-group">
                        <textarea class="ai-input" placeholder="اسأل أي شيء... مثل: لخص هذا النص، اربط هذه الأفكار، اقترح تحسينات..."></textarea>
                        <button class="ai-send-btn">إرسال</button>
                    </div>
                    <div class="ai-response">
                        <p>مرحباً! أنا مساعدك الذكي المجاني. يمكنني مساعدتك في:</p>
                        <ul>
                            <li>تلخيص النصوص والمقالات</li>
                            <li>ربط الأفكار وإيجاد الروابط</li>
                            <li>اقتراح تنظيم أفضل للمحتوى</li>
                            <li>إنشاء خرائط ذهنية</li>
                            <li>تحليل البيانات والمعلومات</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Reinitialize Lucide icons
        this.initializeLucideIcons();
        
        // Setup main canvas
        this.setupMainCanvas();
        
        // Setup main app event listeners
        this.setupMainAppEventListeners();
    }
    
    setupMainCanvas() {
        const mainCanvas = document.getElementById('mainCanvas');
        if (!mainCanvas) return;
        
        // Initialize Fabric.js canvas
        this.canvas = new fabric.Canvas(mainCanvas, {
            backgroundColor: '#ffffff',
            selection: true,
            preserveObjectStacking: true,
            width: window.innerWidth * 2, // Make canvas larger than viewport
            height: window.innerHeight * 2
        });
        
        // Enable panning
        this.enableCanvasPanning();
        
        // Add welcome message
        this.addWelcomeContent();
        
        // Make canvas responsive
        this.makeMainCanvasResponsive();
    }
    
    enableCanvasPanning() {
        let isPanning = false;
        let lastPosX, lastPosY;
        
        this.canvas.on('mouse:down', (e) => {
            if (e.e.altKey || this.currentTool === 'pan') {
                isPanning = true;
                this.canvas.selection = false;
                lastPosX = e.e.clientX;
                lastPosY = e.e.clientY;
                this.canvas.defaultCursor = 'grabbing';
            }
        });
        
        this.canvas.on('mouse:move', (e) => {
            if (isPanning) {
                const vpt = this.canvas.viewportTransform;
                vpt[4] += e.e.clientX - lastPosX;
                vpt[5] += e.e.clientY - lastPosY;
                this.canvas.requestRenderAll();
                lastPosX = e.e.clientX;
                lastPosY = e.e.clientY;
            }
        });
        
        this.canvas.on('mouse:up', () => {
            if (isPanning) {
                isPanning = false;
                this.canvas.selection = true;
                this.canvas.defaultCursor = 'default';
            }
        });
        
        // Zoom with mouse wheel
        this.canvas.on('mouse:wheel', (opt) => {
            const delta = opt.e.deltaY;
            let zoom = this.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }
    
    addWelcomeContent() {
        const welcomeText = new fabric.Textbox('مرحباً بك في ThoughtFlow!\n\nابدأ بإضافة النصوص والصور والملفات\nاربط أفكارك بالأسهم والروابط\nاستخدم مساعد AI المجاني', {
            left: 100,
            top: 100,
            width: 300,
            fontSize: 18,
            fill: '#1f2937',
            fontFamily: 'Cairo',
            backgroundColor: '#f8fafc',
            padding: 20,
            borderRadius: 15,
            shadow: 'rgba(0,0,0,0.1) 0px 8px 30px'
        });
        
        const noteBox = new fabric.Textbox('💡 نصيحة: اضغط Alt + اسحب للتنقل في اللوحة', {
            left: 450,
            top: 150,
            width: 250,
            fontSize: 14,
            fill: '#667eea',
            fontFamily: 'Cairo',
            backgroundColor: '#eef2ff',
            padding: 15,
            borderRadius: 10
        });
        
        this.canvas.add(welcomeText, noteBox);
    }
    
    makeMainCanvasResponsive() {
        const container = this.canvas.wrapperEl.parentElement;
        
        const resizeCanvas = () => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            this.canvas.setDimensions({
                width: containerWidth,
                height: containerHeight
            });
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }
    
    setupMainAppEventListeners() {
        // Main toolbar tools
        document.querySelectorAll('#appContainer .tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target.closest('.tool-btn');
                this.handleMainToolSelection(button);
            });
        });
        
        // Sidebar toggle
        document.getElementById('templatesBtn')?.addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // AI panel toggle
        document.getElementById('mainAiAssistBtn')?.addEventListener('click', () => {
            this.toggleMainAI();
        });
        
        // Library items
        document.querySelectorAll('.library-item').forEach(item => {
            item.addEventListener('click', () => {
                this.addBlockToCanvas(item.dataset.type);
            });
        });
        
        // AI send button
        document.querySelector('.ai-send-btn')?.addEventListener('click', () => {
            this.sendAIMessage();
        });
        
        // AI input enter key
        document.querySelector('.ai-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.sendAIMessage();
            }
        });
        
        // Share button
        document.getElementById('shareBtn')?.addEventListener('click', () => {
            this.shareCanvas();
        });
        
        // Close sidebar
        document.querySelector('.close-sidebar')?.addEventListener('click', () => {
            this.closeSidebar();
        });
    }
    
    handleMainToolSelection(button) {
        if (!button) return;
        
        // Remove active class from all tools
        document.querySelectorAll('#appContainer .tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected tool
        button.classList.add('active');
        
        // Set current tool
        this.currentTool = button.dataset.tool || button.id;
        
        // Handle canvas cursor and mode
        switch(this.currentTool) {
            case 'select':
                this.canvas.defaultCursor = 'default';
                this.canvas.isDrawingMode = false;
                break;
            case 'text':
                this.canvas.defaultCursor = 'text';
                this.enableTextMode();
                break;
            case 'note':
                this.canvas.defaultCursor = 'copy';
                this.enableNoteMode();
                break;
            case 'image':
                this.canvas.defaultCursor = 'crosshair';
                this.enableImageMode();
                break;
            case 'link':
                this.canvas.defaultCursor = 'pointer';
                this.enableLinkMode();
                break;
        }
    }
    
    enableTextMode() {
        this.canvas.off('mouse:down', this.textModeHandler);
        this.textModeHandler = (e) => {
            if (this.currentTool === 'text') {
                const pointer = this.canvas.getPointer(e.e);
                this.addTextBox(pointer.x, pointer.y);
            }
        };
        this.canvas.on('mouse:down', this.textModeHandler);
    }
    
    enableNoteMode() {
        this.canvas.off('mouse:down', this.noteModeHandler);
        this.noteModeHandler = (e) => {
            if (this.currentTool === 'note') {
                const pointer = this.canvas.getPointer(e.e);
                this.addNoteBox(pointer.x, pointer.y);
            }
        };
        this.canvas.on('mouse:down', this.noteModeHandler);
    }
    
    enableImageMode() {
        // This would open a file picker or image URL input
        this.showNotification('قريباً: إضافة الصور', 'info');
    }
    
    enableLinkMode() {
        this.showNotification('انقر على عنصرين لربطهما', 'info');
    }
    
    addTextBox(x, y) {
        const textBox = new fabric.Textbox('انقر للكتابة...', {
            left: x,
            top: y,
            width: 200,
            fontSize: 16,
            fill: '#1f2937',
            fontFamily: 'Cairo',
            backgroundColor: '#ffffff',
            padding: 12,
            borderRadius: 8,
            shadow: 'rgba(0,0,0,0.1) 0px 4px 15px'
        });
        
        this.canvas.add(textBox);
        this.canvas.setActiveObject(textBox);
        textBox.enterEditing();
    }
    
    addNoteBox(x, y) {
        const colors = ['#fef3c7', '#dbeafe', '#ecfdf5', '#fce7f3', '#e0e7ff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const noteBox = new fabric.Textbox('ملاحظة سريعة...', {
            left: x,
            top: y,
            width: 180,
            fontSize: 14,
            fill: '#374151',
            fontFamily: 'Cairo',
            backgroundColor: randomColor,
            padding: 15,
            borderRadius: 10,
            shadow: 'rgba(0,0,0,0.1) 0px 2px 8px'
        });
        
        this.canvas.add(noteBox);
        this.canvas.setActiveObject(noteBox);
        noteBox.enterEditing();
    }
    
    addBlockToCanvas(blockType) {
        const centerX = this.canvas.getCenter().left;
        const centerY = this.canvas.getCenter().top;
        
        switch(blockType) {
            case 'text':
                this.addTextBox(centerX, centerY);
                break;
            case 'note':
                this.addNoteBox(centerX, centerY);
                break;
            case 'image':
                this.showNotification('قريباً: إضافة الصور', 'info');
                break;
            case 'pdf':
                this.showNotification('قريباً: إضافة ملفات PDF', 'info');
                break;
            case 'video':
                this.showNotification('قريباً: إضافة الفيديوهات', 'info');
                break;
            case 'mind-map':
                this.addMindMap(centerX, centerY);
                break;
        }
        
        this.closeSidebar();
    }
    
    addMindMap(x, y) {
        const centralNode = new fabric.Textbox('الموضوع الرئيسي', {
            left: x,
            top: y,
            width: 150,
            fontSize: 16,
            fill: 'white',
            fontFamily: 'Cairo',
            backgroundColor: '#667eea',
            padding: 15,
            borderRadius: 10,
            textAlign: 'center'
        });
        
        const nodes = [
            { text: 'فكرة 1', x: x - 200, y: y - 100 },
            { text: 'فكرة 2', x: x + 200, y: y - 100 },
            { text: 'فكرة 3', x: x, y: y + 150 }
        ];
        
        this.canvas.add(centralNode);
        
        nodes.forEach(node => {
            const nodeBox = new fabric.Textbox(node.text, {
                left: node.x,
                top: node.y,
                width: 120,
                fontSize: 14,
                fill: '#667eea',
                fontFamily: 'Cairo',
                backgroundColor: '#eef2ff',
                padding: 10,
                borderRadius: 8,
                textAlign: 'center'
            });
            
            const line = new fabric.Line([x + 75, y + 25, node.x + 60, node.y + 20], {
                stroke: '#667eea',
                strokeWidth: 2,
                selectable: false,
                evented: false
            });
            
            this.canvas.add(line, nodeBox);
        });
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('mainSidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }
    
    closeSidebar() {
        const sidebar = document.getElementById('mainSidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }
    
    toggleMainAI() {
        const aiPanel = document.getElementById('mainAiPanel');
        if (aiPanel) {
            aiPanel.classList.toggle('open');
            if (aiPanel.classList.contains('open')) {
                document.querySelector('.ai-response').classList.add('show');
            }
        }
    }
    
    sendAIMessage() {
        const input = document.querySelector('.ai-input');
        const response = document.querySelector('.ai-response');
        
        if (!input.value.trim()) return;
        
        // Simulate AI response
        const responses = [
            'ممتاز! يمكنني مساعدتك في تنظيم هذه الأفكار بصرياً.',
            'اقترح إنشاء خريطة ذهنية لربط هذه المفاهيم.',
            'هذا موضوع مثير للاهتمام! دعني أساعدك في تحليله.',
            'يمكنني تلخيص هذا المحتوى وإنشاء نقاط رئيسية.',
            'ممتاز! سأساعدك في إيجاد الروابط بين هذه العناصر.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        response.innerHTML = `
            <p><strong>مساعد AI:</strong> ${randomResponse}</p>
            <p><em>سؤالك:</em> "${input.value}"</p>
            <div style="margin-top: 12px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                💡 <strong>اقتراح:</strong> جرب إضافة مربع نص جديد أو ربط العناصر الموجودة بأسهم لتوضيح العلاقات.
            </div>
        `;
        response.classList.add('show');
        
        input.value = '';
    }
    
    shareCanvas() {
        // Simulate sharing functionality
        this.showNotification('تم نسخ رابط المشاركة! شارك مع فريقك للتعاون المباشر.', 'success');
    }
    
    useTemplate(templateName) {
        this.showNotification(`قريباً: قالب "${templateName}"`, 'info');
        this.openApp();
    }
    
    watchDemo() {
        this.showNotification('شاهد كيفية استخدام ThoughtFlow لتنظيم أفكارك بصرياً', 'info');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('style[data-notifications]')) {
            const style = document.createElement('style');
            style.setAttribute('data-notifications', '');
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { border-left: 4px solid #10b981; }
                .notification-info { border-left: 4px solid #3b82f6; }
                .notification-warning { border-left: 4px solid #f59e0b; }
                .notification-error { border-left: 4px solid #ef4444; }
                .notification-content {
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                .close-notification {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                .close-notification:hover {
                    background: #f3f4f6;
                    color: #374151;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        // Manual close
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// AI Assistant Class
class AIAssistant {
    constructor() {
        this.isActive = false;
    }
    
    activate() {
        this.isActive = true;
        console.log('AI Assistant activated');
    }
    
    deactivate() {
        this.isActive = false;
        console.log('AI Assistant deactivated');
    }
    
    processQuery(query) {
        // Simulate AI processing
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.generateResponse(query));
            }, 1000);
        });
    }
    
    generateResponse(query) {
        const responses = {
            'تلخيص': 'يمكنني تلخيص أي نص أو مقال تضيفه إلى اللوحة',
            'ربط': 'سأساعدك في إيجاد الروابط المنطقية بين أفكارك',
            'تنظيم': 'اقترح تنظيم المحتوى في مجموعات متصلة',
            'تحليل': 'يمكنني تحليل البيانات وإستخراج الأنماط المهمة'
        };
        
        for (let key in responses) {
            if (query.includes(key)) {
                return responses[key];
            }
        }
        
        return 'كيف يمكنني مساعدتك في تنظيم أفكارك؟';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.thoughtFlowApp = new ThoughtFlowApp();
});