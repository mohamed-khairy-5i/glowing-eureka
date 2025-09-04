// IdeaFlux - Advanced Interactive JavaScript
class IdeaFlux {
    constructor() {
        this.currentTool = 'select';
        this.canvas = null;
        this.connections = [];
        this.elements = [];
        this.dragElement = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.isDrawingConnection = false;
        this.connectionStart = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupNavigation();
        this.setupDemo();
        this.setupTemplates();
        this.setupModals();
        this.setupForms();
    }
    
    setupEventListeners() {
        // Scroll effect for navbar
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Global click handler
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    handleGlobalClick(e) {
        // Close modals when clicking outside
        if (e.target.classList.contains('modal')) {
            this.closeModal(e.target.id.replace('-modal', ''));
        }
    }
    
    handleKeydown(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    this.saveCanvas();
                    break;
                case 'n':
                    e.preventDefault();
                    this.startFreeCanvas();
                    break;
            }
        }
        
        // ESC to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }
    
    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.feature-card, .template-card, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupNavigation() {
        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            threshold: 0.3
        };
        
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => navObserver.observe(section));
    }
    
    setupDemo() {
        const canvasArea = document.getElementById('canvas-area');
        const toolButtons = document.querySelectorAll('.tool-btn');
        
        if (!canvasArea) return;
        
        // Tool selection
        toolButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                toolButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                this.updateCursor();
            });
        });
        
        // Canvas interactions
        canvasArea.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
        canvasArea.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
        canvasArea.addEventListener('mouseup', this.handleCanvasMouseUp.bind(this));
        
        // Make demo notes draggable
        this.setupDraggableElements();
    }
    
    setupDraggableElements() {
        const demoNotes = document.querySelectorAll('.demo-note');
        
        demoNotes.forEach(note => {
            note.addEventListener('mousedown', (e) => {
                if (this.currentTool !== 'select') return;
                
                this.isDragging = true;
                this.dragElement = note;
                
                const rect = note.getBoundingClientRect();
                const canvasRect = document.getElementById('canvas-area').getBoundingClientRect();
                
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                
                note.style.cursor = 'grabbing';
                note.style.zIndex = '1000';
                
                e.preventDefault();
            });
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging || !this.dragElement) return;
            
            const canvasRect = document.getElementById('canvas-area').getBoundingClientRect();
            const x = e.clientX - canvasRect.left - this.dragOffset.x;
            const y = e.clientY - canvasRect.top - this.dragOffset.y;
            
            this.dragElement.style.left = Math.max(0, Math.min(x, canvasRect.width - this.dragElement.offsetWidth)) + 'px';
            this.dragElement.style.top = Math.max(0, Math.min(y, canvasRect.height - this.dragElement.offsetHeight)) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging && this.dragElement) {
                this.dragElement.style.cursor = 'move';
                this.dragElement.style.zIndex = '1';
                this.isDragging = false;
                this.dragElement = null;
            }
        });
    }
    
    handleCanvasMouseDown(e) {
        const canvasRect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        
        switch(this.currentTool) {
            case 'note':
                this.addNote(x, y, 'ملاحظة جديدة');
                break;
            case 'idea':
                this.addIdea(x, y, 'فكرة جديدة');
                break;
            case 'connection':
                this.startConnection(x, y);
                break;
            case 'ai':
                this.showAIHelper(x, y);
                break;
        }
    }
    
    handleCanvasMouseMove(e) {
        // Handle connection drawing
        if (this.isDrawingConnection && this.connectionStart) {
            // Update temporary connection line
        }
    }
    
    handleCanvasMouseUp(e) {
        if (this.isDrawingConnection) {
            const canvasRect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            this.endConnection(x, y);
        }
    }
    
    addNote(x, y, text) {
        const canvasArea = document.getElementById('canvas-area');
        const note = document.createElement('div');
        note.className = 'demo-note';
        note.style.left = x + 'px';
        note.style.top = y + 'px';
        note.innerHTML = `
            <i class="fas fa-sticky-note"></i>
            <span>${text}</span>
        `;
        
        // Add edit functionality
        note.addEventListener('dblclick', () => {
            const span = note.querySelector('span');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.style.background = 'transparent';
            input.style.border = 'none';
            input.style.color = 'inherit';
            input.style.font = 'inherit';
            
            span.replaceWith(input);
            input.focus();
            
            const saveEdit = () => {
                const newSpan = document.createElement('span');
                newSpan.textContent = input.value;
                input.replaceWith(newSpan);
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });
        });
        
        canvasArea.appendChild(note);
        this.makeElementDraggable(note);
        this.showToast('تمت إضافة ملاحظة جديدة');
    }
    
    addIdea(x, y, text) {
        const canvasArea = document.getElementById('canvas-area');
        const idea = document.createElement('div');
        idea.className = 'demo-note';
        idea.style.left = x + 'px';
        idea.style.top = y + 'px';
        idea.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        idea.innerHTML = `
            <i class="fas fa-lightbulb"></i>
            <span>${text}</span>
        `;
        
        canvasArea.appendChild(idea);
        this.makeElementDraggable(idea);
        this.showToast('تمت إضافة فكرة جديدة');
    }
    
    makeElementDraggable(element) {
        element.addEventListener('mousedown', (e) => {
            if (this.currentTool !== 'select') return;
            
            this.isDragging = true;
            this.dragElement = element;
            
            const rect = element.getBoundingClientRect();
            const canvasRect = document.getElementById('canvas-area').getBoundingClientRect();
            
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            element.style.cursor = 'grabbing';
            element.style.zIndex = '1000';
            
            e.preventDefault();
        });
    }
    
    startConnection(x, y) {
        this.isDrawingConnection = true;
        this.connectionStart = { x, y };
        this.showToast('انقر على عنصر آخر لإنشاء رابط');
    }
    
    endConnection(x, y) {
        if (this.connectionStart) {
            this.createConnection(this.connectionStart, { x, y });
            this.isDrawingConnection = false;
            this.connectionStart = null;
        }
    }
    
    createConnection(start, end) {
        const svg = document.querySelector('.connections-svg');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        line.setAttribute('x1', start.x);
        line.setAttribute('y1', start.y);
        line.setAttribute('x2', end.x);
        line.setAttribute('y2', end.y);
        line.setAttribute('stroke', '#4F46E5');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        
        svg.appendChild(line);
        this.showToast('تم إنشاء رابط جديد');
    }
    
    showAIHelper(x, y) {
        const aiSuggestions = [
            'اقتراح: أضف مصادر مرجعية',
            'اقتراح: نظم الأفكار حسب الأولوية',
            'اقتراح: أضف ملخص للموضوع',
            'اقتراح: أنشئ خريطة مفاهيم'
        ];
        
        const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
        
        const aiHelper = document.createElement('div');
        aiHelper.className = 'ai-helper';
        aiHelper.style.position = 'absolute';
        aiHelper.style.left = x + 'px';
        aiHelper.style.top = y + 'px';
        aiHelper.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        aiHelper.style.color = 'white';
        aiHelper.style.padding = '1rem';
        aiHelper.style.borderRadius = '0.5rem';
        aiHelper.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        aiHelper.style.maxWidth = '200px';
        aiHelper.style.zIndex = '1001';
        aiHelper.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <i class="fas fa-robot"></i>
                <strong>مساعد ذكي</strong>
            </div>
            <p style="margin: 0; font-size: 0.9rem;">${randomSuggestion}</p>
            <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                <button onclick="ideaFlux.acceptAISuggestion()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.8rem;">قبول</button>
                <button onclick="ideaFlux.dismissAI()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.8rem;">إغلاق</button>
            </div>
        `;
        
        document.getElementById('canvas-area').appendChild(aiHelper);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if (aiHelper.parentNode) {
                aiHelper.remove();
            }
        }, 5000);
    }
    
    acceptAISuggestion() {
        const aiHelpers = document.querySelectorAll('.ai-helper');
        aiHelpers.forEach(helper => helper.remove());
        this.showToast('تم تطبيق اقتراح المساعد الذكي');
    }
    
    dismissAI() {
        const aiHelpers = document.querySelectorAll('.ai-helper');
        aiHelpers.forEach(helper => helper.remove());
    }
    
    updateCursor() {
        const canvasArea = document.getElementById('canvas-area');
        if (!canvasArea) return;
        
        const cursors = {
            select: 'default',
            note: 'crosshair',
            idea: 'crosshair',
            connection: 'crosshair',
            ai: 'help'
        };
        
        canvasArea.style.cursor = cursors[this.currentTool] || 'default';
    }
    
    setupTemplates() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const templateCards = document.querySelectorAll('.template-card');
        
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                
                // Filter templates
                templateCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Template card interactions
        templateCards.forEach(card => {
            const useButton = card.querySelector('.btn');
            if (useButton) {
                useButton.addEventListener('click', () => {
                    this.useTemplate(card.dataset.category);
                });
            }
        });
    }
    
    useTemplate(category) {
        this.showToast(`جاري تحميل قالب ${category}...`);
        
        // Simulate template loading
        setTimeout(() => {
            this.showToast('تم تحميل القالب بنجاح!');
            // In a real app, this would open the canvas with the template
            this.startFreeCanvas();
        }, 1500);
    }
    
    setupModals() {
        // Close button functionality
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    const modalId = modal.id.replace('-modal', '');
                    this.closeModal(modalId);
                }
            });
        });
    }
    
    setupForms() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
        
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }
        
        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleSignupSubmit.bind(this));
        }
    }
    
    handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        this.showToast('جاري إرسال الرسالة...');
        
        // Simulate form submission
        setTimeout(() => {
            this.showToast('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.');
            e.target.reset();
        }, 2000);
    }
    
    handleLoginSubmit(e) {
        e.preventDefault();
        
        this.showToast('جاري تسجيل الدخول...');
        
        // Simulate login
        setTimeout(() => {
            this.closeModal('login');
            this.showToast('مرحباً بك! تم تسجيل الدخول بنجاح.');
            this.startFreeCanvas();
        }, 2000);
    }
    
    handleSignupSubmit(e) {
        e.preventDefault();
        
        this.showToast('جاري إنشاء الحساب...');
        
        // Simulate signup
        setTimeout(() => {
            this.closeModal('signup');
            this.showToast('تم إنشاء حسابك بنجاح! مرحباً بك في IdeaFlux.');
            this.startFreeCanvas();
        }, 2000);
    }
    
    // Public methods for global access
    openModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    switchModal(fromModalId, toModalId) {
        this.closeModal(fromModalId);
        setTimeout(() => this.openModal(toModalId), 100);
    }
    
    startFreeCanvas() {
        this.showToast('جاري تحميل قماش IdeaFlux...');
        
        // Simulate canvas loading
        setTimeout(() => {
            this.showToast('مرحباً بك في IdeaFlux! ابدأ بإضافة أفكارك.');
            
            // In a real app, this would redirect to the canvas application
            // For demo purposes, we'll just show a success message
            setTimeout(() => {
                this.showToast('استخدم الأدوات في الأعلى لإضافة عناصر جديدة!');
            }, 2000);
        }, 1500);
    }
    
    showDemo() {
        this.openModal('demo');
    }
    
    startInteractiveDemo() {
        this.closeModal('demo');
        
        // Scroll to demo section
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight demo after scroll
            setTimeout(() => {
                demoSection.style.background = 'rgba(99, 102, 241, 0.1)';
                this.showToast('جرب الأدوات أدناه لاستكشاف IdeaFlux!');
                
                setTimeout(() => {
                    demoSection.style.background = '';
                }, 3000);
            }, 1000);
        }
    }
    
    saveCanvas() {
        this.showToast('تم حفظ عملك تلقائياً ✓');
    }
    
    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 2001;
            max-width: 300px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        
        if (type === 'success') {
            toast.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else if (type === 'error') {
            toast.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        } else if (type === 'warning') {
            toast.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        }
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        });
    }
    
    getToastIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize the application
const ideaFlux = new IdeaFlux();

// Global functions for HTML onclick handlers
function openModal(modalId) {
    ideaFlux.openModal(modalId);
}

function closeModal(modalId) {
    ideaFlux.closeModal(modalId);
}

function switchModal(fromModalId, toModalId) {
    ideaFlux.switchModal(fromModalId, toModalId);
}

function startFreeCanvas() {
    ideaFlux.startFreeCanvas();
}

function showDemo() {
    ideaFlux.showDemo();
}

function startInteractiveDemo() {
    ideaFlux.startInteractiveDemo();
}

// Add CSS animations for toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .toast:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.3) !important;
        transition: all 0.3s ease;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Easter eggs and advanced features
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    if (!window.konamiSequence) window.konamiSequence = [];
    
    window.konamiSequence.push(e.keyCode);
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence.shift();
    }
    
    if (window.konamiSequence.join(',') === konamiCode.join(',')) {
        ideaFlux.showToast('🎉 تم تفعيل الوضع السري! جميع الميزات المتقدمة متاحة الآن.', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
        window.konamiSequence = [];
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ IdeaFlux loaded in ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('⚠️ Slow loading detected. Consider optimizing resources.');
        }
    });
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

console.log('🧠 IdeaFlux initialized successfully!');