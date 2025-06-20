// ===== ENHANCED DARK MODE FUNCTIONALITY =====
class DarkModeManager {
    constructor() {
        this.isDark = this.getStoredTheme();
        this.initializeDarkMode();
        this.bindEvents();
    }

    getStoredTheme() {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            return stored === 'true';
        }
        // Default to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    initializeDarkMode() {
        const html = document.documentElement;
        const icon = document.getElementById('darkModeIcon');
        const tooltipText = document.getElementById('tooltipText');
        
        if (this.isDark) {
            html.classList.add('dark');
            if (icon) {
                icon.className = 'fas fa-sun text-gray-700 dark:text-yellow-400 text-base transition-all duration-300 group-hover:scale-110';
            }
            if (tooltipText) {
                tooltipText.textContent = 'Light Mode';
            }
        } else {
            html.classList.remove('dark');
            if (icon) {
                icon.className = 'fas fa-moon text-gray-700 dark:text-yellow-400 text-base transition-all duration-300 group-hover:scale-110';
            }
            if (tooltipText) {
                tooltipText.textContent = 'Dark Mode';
            }
        }
        
        this.saveTheme();
    }

    toggle() {
        this.isDark = !this.isDark;
        this.initializeDarkMode();
        
        // Add transition effect
        const html = document.documentElement;
        html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Trigger animation
        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) {
            toggleBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                toggleBtn.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Show notification
        this.showThemeNotification();
    }

    saveTheme() {
        localStorage.setItem('darkMode', this.isDark.toString());
    }

    bindEvents() {
        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                this.isDark = e.matches;
                this.initializeDarkMode();
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    showThemeNotification() {
        const notification = document.createElement('div');
        const themeText = this.isDark ? 'Dark Mode' : 'Light Mode';
        const iconClass = this.isDark ? 'fa-moon' : 'fa-sun';
        
        notification.className = `fixed top-4 left-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            this.isDark 
                ? 'bg-gray-800 text-white border border-gray-600' 
                : 'bg-white text-gray-800 border border-gray-200'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${iconClass}"></i>
                <span class="text-sm font-medium">${themeText} Activated</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(-100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // Method to get current theme
    getCurrentTheme() {
        return this.isDark ? 'dark' : 'light';
    }

    // Method to set theme programmatically
    setTheme(theme) {
        this.isDark = theme === 'dark';
        this.initializeDarkMode();
    }
}

// ===== ENHANCED PAYMENT SYSTEM =====
class PaymentSystem {
    constructor() {
        console.log('Initializing Payment System...');
        
        this.transactions = this.loadTransactions();
        this.transactionIdCounter = this.transactions.length + 1;
        this.currentDiscount = 0;
        this.appliedPromoCode = '';
        this.currentTax = 0;
        this.debounceTimer = null;
        this.currentTransaction = null;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeApp();
        
        console.log('Payment System initialized successfully');
    }

    // ===== INITIALIZATION =====
    initializeElements() {
        try {
            // Form elements
            this.paymentForm = document.getElementById('paymentForm');
            this.productSelect = document.getElementById('productSelect');
            this.quantity = document.getElementById('quantity');
            this.customPrice = document.getElementById('customPrice');
            this.customPriceSection = document.getElementById('customPriceSection');
            
            // Promo elements
            this.promoCode = document.getElementById('promoCode');
            this.applyPromoBtn = document.getElementById('applyPromoBtn');
            this.promoMessage = document.getElementById('promoMessage');
            
            // Total elements
            this.subtotalEl = document.getElementById('subtotal');
            this.discountEl = document.getElementById('discount');
            this.discountRow = document.getElementById('discountRow');
            this.taxEl = document.getElementById('tax');
            this.totalAmountEl = document.getElementById('totalAmount');
            
            // Transaction elements
            this.transactionList = document.getElementById('transactionList');
            this.emptyState = document.getElementById('emptyState');
            this.searchInput = document.getElementById('searchTransactions');
            this.filterSelect = document.getElementById('filterPaymentMethod');
            
            // Statistics elements
            this.totalTransactionsEl = document.getElementById('totalTransactions');
            this.totalRevenueEl = document.getElementById('totalRevenue');
            this.avgTransactionEl = document.getElementById('avgTransaction');
            
            // Header statistics elements
            this.headerTotalTransactionsEl = document.getElementById('headerTotalTransactions');
            this.headerTotalRevenueEl = document.getElementById('headerTotalRevenue');
            
            // Buttons
            this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
            this.exportBtn = document.getElementById('exportBtn');
            this.submitBtn = document.getElementById('submitBtn');
            
            // Modal
            this.paymentModal = document.getElementById('paymentModal');
            this.paymentDetails = document.getElementById('paymentDetails');
            this.closeModalBtn = document.getElementById('closeModalBtn');
            this.downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
            
            // Loading
            this.loadingOverlay = document.getElementById('loadingOverlay');
            
            // Mobile menu elements
            this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
            this.mobileMenu = document.getElementById('mobileMenu');
            
            console.log('All elements initialized successfully');
        } catch (error) {
            console.error('Error initializing elements:', error);
        }
    }

    bindEvents() {
        try {
            // Form events
            if (this.paymentForm) {
                this.paymentForm.addEventListener('submit', (e) => {
                    console.log('Form submitted');
                    this.handleSubmit(e);
                });
            }
            
            if (this.productSelect) {
                this.productSelect.addEventListener('change', () => {
                    console.log('Product changed');
                    this.handleProductChange();
                });
            }
            
            if (this.quantity) {
                this.quantity.addEventListener('input', () => {
                    console.log('Quantity changed');
                    this.debouncedUpdateTotal();
                });
            }
            
            if (this.customPrice) {
                this.customPrice.addEventListener('input', () => {
                    console.log('Custom price changed');
                    this.debouncedUpdateTotal();
                });
            }
            
            // Payment method selection
            const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
            paymentMethods.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    console.log('Payment method changed:', e.target.value);
                    this.handlePaymentMethodChange(e);
                });
            });
            
            // Promo events
            if (this.applyPromoBtn) {
                this.applyPromoBtn.addEventListener('click', () => {
                    console.log('Apply promo clicked');
                    this.applyPromoCode();
                });
            }
            
            if (this.promoCode) {
                this.promoCode.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.applyPromoCode();
                    }
                });
            }
            
            // Search and filter
            if (this.searchInput) {
                this.searchInput.addEventListener('input', () => this.debouncedFilterTransactions());
            }
            
            if (this.filterSelect) {
                this.filterSelect.addEventListener('change', () => this.filterTransactions());
            }
            
            // Button events
            if (this.clearHistoryBtn) {
                this.clearHistoryBtn.addEventListener('click', () => this.clearAllHistory());
            }
            
            if (this.exportBtn) {
                this.exportBtn.addEventListener('click', () => this.exportTransactions());
            }
            
            if (this.closeModalBtn) {
                this.closeModalBtn.addEventListener('click', () => this.closeModal());
            }
            
            if (this.downloadReceiptBtn) {
                this.downloadReceiptBtn.addEventListener('click', () => this.downloadReceipt());
            }
            
            // Modal events
            if (this.paymentModal) {
                this.paymentModal.addEventListener('click', (e) => {
                    if (e.target === this.paymentModal) this.closeModal();
                });
            }
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.paymentModal && !this.paymentModal.classList.contains('hidden')) {
                    this.closeModal();
                }
            });

            console.log('All events bound successfully');
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }

    // ===== MOBILE MENU FUNCTIONALITY =====
    initializeMobileMenu() {
        if (this.mobileMenuToggle && this.mobileMenu) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.mobileMenuToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Close mobile menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    this.closeMobileMenu();
                }
            });

            // Handle mobile menu links
            const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    toggleMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.classList.toggle('hidden');
        }
    }

    closeMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.classList.add('hidden');
        }
    }

    // ===== HEADER STATISTICS =====
    initializeHeaderStats() {
        this.updateHeaderStats();
    }
    

    updateHeaderStats() {
        try {
            if (this.headerTotalTransactionsEl) {
                this.headerTotalTransactionsEl.textContent = this.transactions.length.toLocaleString('id-ID');
            }
            
            if (this.headerTotalRevenueEl) {
                const totalRev = this.transactions.reduce((sum, t) => sum + t.total, 0);
                this.headerTotalRevenueEl.textContent = this.formatCurrency(totalRev);
            }
        } catch (error) {
            console.error('Error updating header stats:', error);
        }
    }

    // ===== FORM SUBMISSION =====
    handleSubmit(e) {
        console.log('=== FORM SUBMISSION STARTED ===');
        e.preventDefault();
        
        try {
            const formData = new FormData(this.paymentForm);
            console.log('Form data collected:', {
                name: formData.get('customerName'),
                email: formData.get('customerEmail'),
                product: formData.get('product'),
                quantity: formData.get('quantity'),
                paymentMethod: formData.get('paymentMethod')
            });
            
            // Validation
            const errors = this.validateForm(formData);
            console.log('Validation errors:', errors);
            
            if (Object.keys(errors).length > 0) {
                console.log('Form has validation errors');
                this.showValidationErrors(errors);
                this.showNotification('Mohon perbaiki kesalahan pada form', 'error');
                return;
            }

            // Check total amount
            const total = this.calculateSubtotal() - this.currentDiscount + this.currentTax;
            console.log('Total amount:', total);
            
            if (total <= 0) {
                this.showNotification('Total pembayaran harus lebih dari 0', 'error');
                return;
            }

            // Process payment
            console.log('Processing payment...');
            this.processPaymentImmediate(formData);
            
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            this.showNotification('Terjadi kesalahan saat memproses form', 'error');
        }
    }

    // ===== PAYMENT PROCESSING =====
    processPaymentImmediate(formData) {
        try {
            console.log('=== PROCESSING PAYMENT ===');
            
            // Show loading
            this.showLoading();
            
            // Simulate processing delay for better UX
            setTimeout(() => {
                try {
                    // Create transaction
                    const transaction = this.createTransaction(formData);
                    console.log('Transaction created:', transaction);
                    
                    // Add to transactions array
                    this.transactions.unshift(transaction);
                    this.saveTransactions();
                    console.log('Transaction saved to storage');
                    
                    // Hide loading
                    this.hideLoading();
                    
                    // Show success modal
                    this.showPaymentModal(transaction);
                    
                    // Update UI
                    this.renderTransactions();
                    this.resetForm();
                    
                    // Show success notification
                    this.showNotification('Pembayaran berhasil diproses!', 'success');
                    
                    console.log('=== PAYMENT PROCESSED SUCCESSFULLY ===');
                } catch (error) {
                    console.error('Error in delayed processing:', error);
                    this.hideLoading();
                    this.showNotification('Terjadi kesalahan saat memproses pembayaran', 'error');
                }
            }, 1500); // 1.5 second delay for better UX
            
        } catch (error) {
            console.error('Error processing payment:', error);
            this.hideLoading();
            this.showNotification('Terjadi kesalahan saat memproses pembayaran', 'error');
        }
    }

    // ===== CREATE TRANSACTION =====
    createTransaction(formData) {
        const selectedOption = this.productSelect.options[this.productSelect.selectedIndex];
        const subtotal = this.calculateSubtotal();
        const afterDiscount = subtotal - this.currentDiscount;
        const tax = this.calculateTax(afterDiscount);
        const total = afterDiscount + tax;

        return {
            id: this.generateTransactionId(),
            customerName: this.sanitizeInput(formData.get('customerName')),
            customerEmail: this.sanitizeInput(formData.get('customerEmail')),
            product: this.productSelect.value === 'custom' ? 'Custom Package' : selectedOption.textContent,
            productValue: this.productSelect.value,
            quantity: parseInt(formData.get('quantity')),
            paymentMethod: formData.get('paymentMethod'),
            promoCode: this.appliedPromoCode,
            subtotal: subtotal,
            discount: this.currentDiscount,
            tax: tax,
            total: total,
            timestamp: new Date(),
            time: this.getCurrentTime(),
            status: 'success'
        };
    }

    // ===== FORM VALIDATION =====
    validateForm(formData) {
        const errors = {};
        
        // Name validation
        const name = formData.get('customerName');
        if (!name || name.trim().length < 2) {
            errors.customerName = 'Nama harus minimal 2 karakter';
        }
        
        // Email validation
        const email = formData.get('customerEmail');
        if (!email || !this.validateEmail(email)) {
            errors.customerEmail = 'Email tidak valid';
        }
        
        // Product validation
        if (!formData.get('product')) {
            errors.productSelect = 'Silakan pilih produk';
        }
        
        // Quantity validation
        const qty = parseInt(formData.get('quantity'));
        if (!qty || qty < 1 || qty > 99) {
            errors.quantity = 'Jumlah harus antara 1-99';
        }
        
        // Payment method validation
        if (!formData.get('paymentMethod')) {
            errors.paymentMethod = 'Silakan pilih metode pembayaran';
        }

        // Custom price validation
        if (formData.get('product') === 'custom') {
            const customPrice = parseInt(formData.get('customPrice'));
            if (!customPrice || customPrice < 1000) {
                errors.customPrice = 'Harga custom minimal Rp 1.000';
            }
        }
        
        return errors;
    }

    showValidationErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('[id$="Error"]').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
        
        // Show new errors
        Object.keys(errors).forEach(field => {
            this.showFieldError(field, errors[field]);
        });
    }

    // ===== SECURITY & VALIDATION =====
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                   .replace(/javascript:/gi, '')
                   .replace(/on\w+\s*=/gi, '');
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        
        if (field && errorEl) {
            field.classList.add('border-red-500', 'ring-red-500');
            field.classList.remove('border-gray-200', 'dark:border-gray-600');
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    hideFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        
        if (field && errorEl) {
            field.classList.remove('border-red-500', 'ring-red-500');
            field.classList.add('border-gray-200', 'dark:border-gray-600');
            errorEl.classList.add('hidden');
        }
    }

    // ===== DEBOUNCING FOR PERFORMANCE =====
    debouncedUpdateTotal() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.updateTotal(), 100);
    }

    debouncedFilterTransactions() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.filterTransactions(), 300);
    }

    // ===== CALCULATIONS =====
    calculateSubtotal() {
        try {
            if (this.productSelect.value === 'custom') {
                const customPrice = parseInt(this.customPrice.value) || 0;
                const qty = parseInt(this.quantity.value) || 1;
                return customPrice * qty;
            }
            
            const selectedOption = this.productSelect.options[this.productSelect.selectedIndex];
            if (!selectedOption || !selectedOption.dataset.price) return 0;
            
            const price = parseInt(selectedOption.dataset.price);
            const qty = parseInt(this.quantity.value) || 1;
            return price * qty;
        } catch (error) {
            console.error('Error calculating subtotal:', error);
            return 0;
        }
    }

    calculateTax(subtotal) {
        return Math.round(subtotal * 0.11); // 11% tax
    }

    calculateDiscount(subtotal, promoData) {
        if (!promoData) return 0;
        
        if (promoData.type === 'percentage') {
            return Math.round(subtotal * promoData.discount / 100);
        } else {
            return Math.min(promoData.discount, subtotal);
        }
    }

    updateTotal() {
        try {
            const subtotal = this.calculateSubtotal();
            const promoData = this.appliedPromoCode ? this.promoCodes[this.appliedPromoCode] : null;
            const discount = this.calculateDiscount(subtotal, promoData);
            const afterDiscount = subtotal - discount;
            const tax = this.calculateTax(afterDiscount);
            const total = afterDiscount + tax;

            if (this.subtotalEl) this.subtotalEl.textContent = this.formatCurrency(subtotal);
            if (this.taxEl) this.taxEl.textContent = this.formatCurrency(tax);
            
            if (discount > 0 && this.discountRow) {
                if (this.discountEl) this.discountEl.textContent = '-' + this.formatCurrency(discount);
                this.discountRow.classList.remove('hidden');
            } else if (this.discountRow) {
                this.discountRow.classList.add('hidden');
            }
            
            if (this.totalAmountEl) this.totalAmountEl.textContent = this.formatCurrency(total);
            this.currentDiscount = discount;
            this.currentTax = tax;
        } catch (error) {
            console.error('Error updating total:', error);
        }
    }

    // ===== PRODUCT HANDLING =====
    handleProductChange() {
        try {
            if (this.productSelect.value === 'custom') {
                this.customPriceSection.classList.remove('hidden');
                if (this.customPrice) this.customPrice.focus();
            } else {
                this.customPriceSection.classList.add('hidden');
            }
            this.updateTotal();
        } catch (error) {
            console.error('Error handling product change:', error);
        }
    }

    // ===== PAYMENT METHOD SELECTION =====
    handlePaymentMethodChange(e) {
        try {
            // Remove active state from all cards
            document.querySelectorAll('.payment-method-card').forEach(card => {
                card.classList.remove('border-blue-500', 'border-purple-500', 'border-orange-500', 'border-green-500');
                card.classList.add('border-gray-200', 'dark:border-gray-600');
                const dot = card.querySelector('.w-3');
                if (dot) dot.classList.add('hidden');
            });

            // Add active state to selected card
            const selectedCard = e.target.closest('.payment-method-card');
            if (selectedCard) {
                const method = e.target.value;
                const colorMap = {
                    'transfer': 'border-blue-500',
                    'ewallet': 'border-purple-500', 
                    'credit': 'border-orange-500',
                    'cash': 'border-green-500'
                };
                
                selectedCard.classList.remove('border-gray-200', 'dark:border-gray-600');
                selectedCard.classList.add(colorMap[method]);
                const dot = selectedCard.querySelector('.w-3');
                if (dot) dot.classList.remove('hidden');
            }
            
            this.hideFieldError('paymentMethod');
        } catch (error) {
            console.error('Error handling payment method change:', error);
        }
    }

    // ===== PROMO CODE SYSTEM =====
    get promoCodes() {
        return {
            "DISKON10": {
                type: "percentage",
                discount: 10,
                description: "Potongan 10% untuk semua produk"
            },
            "HEMAT50K": {
                type: "fixed",
                discount: 50000,
                description: "Diskon tetap sebesar Rp 50.000"
            },
            "STUDENT20": {
                type: "percentage",
                discount: 20,
                description: "Diskon 20% khusus pelajar"
            },
            "WELCOME15": {
                type: "percentage",
                discount: 15,
                description: "Selamat datang! Diskon 15%"
            },
            "SAVE100K": {
                type: "fixed",
                discount: 100000,
                description: "Hemat Rp 100.000 untuk pembelian di atas Rp 500.000"
            },
            "FLASH25": {
                type: "percentage",
                discount: 25,
                description: "Flash Sale! Diskon 25% terbatas"
            }
        };
    }

    applyPromoCode() {
        try {
            const code = this.sanitizeInput(this.promoCode.value.trim().toUpperCase());
            
            if (!code) {
                this.showPromoMessage('Masukkan kode promo terlebih dahulu', 'error');
                return;
            }

            if (!this.promoCodes[code]) {
                this.showPromoMessage('Kode promo tidak valid atau sudah kedaluwarsa', 'error');
                return;
            }

            // Special validation for minimum purchase amount
            if (code === 'SAVE100K' && this.calculateSubtotal() < 500000) {
                this.showPromoMessage('Kode SAVE100K hanya berlaku untuk pembelian minimal Rp 500.000', 'error');
                return;
            }

            this.appliedPromoCode = code;
            this.updateTotal();
            this.showPromoMessage(`Kode "${code}" berhasil diterapkan! ${this.promoCodes[code].description}`, 'success');
            
            this.promoCode.disabled = true;
            this.applyPromoBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Diterapkan';
            this.applyPromoBtn.disabled = true;
            this.applyPromoBtn.classList.remove('bg-gradient-to-r', 'from-green-500', 'to-green-600');
            this.applyPromoBtn.classList.add('bg-gray-400');
        } catch (error) {
            console.error('Error applying promo code:', error);
        }
    }

    showPromoMessage(message, type) {
        if (this.promoMessage) {
            this.promoMessage.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'} mr-1"></i>${message}`;
            this.promoMessage.classList.remove('hidden', 'text-red-500', 'text-green-600');
            this.promoMessage.classList.add(type === 'error' ? 'text-red-500' : 'text-green-600');
            
            if (type === 'error') {
                setTimeout(() => {
                    this.promoMessage.classList.add('hidden');
                }, 5000);
            }
        }
    }

    resetPromoCode() {
        this.appliedPromoCode = '';
        this.currentDiscount = 0;
        if (this.promoCode) {
            this.promoCode.value = '';
            this.promoCode.disabled = false;
        }
        if (this.applyPromoBtn) {
            this.applyPromoBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Terapkan';
            this.applyPromoBtn.disabled = false;
            this.applyPromoBtn.classList.remove('bg-gray-400');
            this.applyPromoBtn.classList.add('bg-gradient-to-r', 'from-green-500', 'to-green-600');
        }
        if (this.promoMessage) {
            this.promoMessage.classList.add('hidden');
        }
        this.updateTotal();
    }

    // ===== LOCAL STORAGE =====
    saveTransactions() {
        try {
            localStorage.setItem('paymentTransactions', JSON.stringify(this.transactions));
            console.log('Transactions saved to localStorage');
        } catch (error) {
            console.error('Failed to save transactions:', error);
        }
    }

    loadTransactions() {
        try {
            const stored = localStorage.getItem('paymentTransactions');
            const transactions = stored ? JSON.parse(stored) : [];
            console.log('Loaded transactions from localStorage:', transactions.length);
            return transactions;
        } catch (error) {
            console.error('Failed to load transactions:', error);
            return [];
        }
    }

    // ===== TRANSACTION RENDERING =====
    renderTransactions() {
        try {
            this.filteredTransactions = [...this.transactions];
            this.filterTransactions();
        } catch (error) {
            console.error('Error rendering transactions:', error);
        }
    }

    filterTransactions() {
        try {
            const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
            const methodFilter = this.filterSelect ? this.filterSelect.value : '';
            
            let filtered = this.transactions.filter(transaction => {
                const matchesSearch = !searchTerm || 
                    transaction.customerName.toLowerCase().includes(searchTerm) ||
                    transaction.product.toLowerCase().includes(searchTerm) ||
                    transaction.id.toLowerCase().includes(searchTerm);
                    
                const matchesMethod = !methodFilter || transaction.paymentMethod === methodFilter;
                
                return matchesSearch && matchesMethod;
            });

            this.renderFilteredTransactions(filtered);
        } catch (error) {
            console.error('Error filtering transactions:', error);
        }
    }

    renderFilteredTransactions(transactions) {
        try {
            // Clear existing transactions
            const existingTransactions = this.transactionList.querySelectorAll('[data-transaction-id]');
            existingTransactions.forEach(item => item.remove());

            if (transactions.length === 0) {
                if (this.emptyState) this.emptyState.style.display = 'block';
                if (this.clearHistoryBtn) this.clearHistoryBtn.classList.add('hidden');
                if (this.exportBtn) this.exportBtn.classList.add('hidden');
            } else {
                if (this.emptyState) this.emptyState.style.display = 'none';
                if (this.clearHistoryBtn) this.clearHistoryBtn.classList.remove('hidden');
                if (this.exportBtn) this.exportBtn.classList.remove('hidden');

                transactions.forEach((transaction, index) => {
                    const transactionElement = this.createTransactionElement(transaction);
                    if (transactionElement) {
                        const container = transactionElement.querySelector('div');
                        if (container) {
                            container.setAttribute('data-transaction-id', transaction.id);
                            // Add staggered animation
                            setTimeout(() => {
                                this.transactionList.appendChild(transactionElement);
                            }, index * 50);
                        }
                    }
                });
            }

            this.updateStatistics();
        } catch (error) {
            console.error('Error rendering filtered transactions:', error);
        }
    }

    createTransactionElement(transaction) {
        try {
            const template = document.getElementById('transactionTemplate');
            if (!template) return null;
            
            const clone = template.content.cloneNode(true);
            
            const customerEl = clone.querySelector('.transaction-customer');
            const productEl = clone.querySelector('.transaction-product');
            const idEl = clone.querySelector('.transaction-id');
            const amountEl = clone.querySelector('.transaction-amount');
            const timeEl = clone.querySelector('.transaction-time');
            const methodEl = clone.querySelector('.transaction-method');
            
            if (customerEl) customerEl.textContent = transaction.customerName;
            if (productEl) productEl.textContent = `${transaction.product} (${transaction.quantity}x)`;
            if (idEl) idEl.textContent = `ID: ${transaction.id}`;
            if (amountEl) amountEl.textContent = this.formatCurrency(transaction.total);
            if (timeEl) timeEl.textContent = transaction.time;
            
            if (methodEl) {
                methodEl.textContent = this.paymentMethodNames[transaction.paymentMethod];
                methodEl.className += ' ' + this.paymentMethodColors[transaction.paymentMethod];
            }
            
            return clone;
        } catch (error) {
            console.error('Error creating transaction element:', error);
            return null;
        }
    }

    // ===== STATISTICS =====
    updateStatistics() {
        try {
            const totalTrans = this.transactions.length;
            const totalRev = this.transactions.reduce((sum, t) => sum + t.total, 0);
            const avgTrans = totalTrans > 0 ? totalRev / totalTrans : 0;

            // Update main stats
            if (this.totalTransactionsEl) this.totalTransactionsEl.textContent = totalTrans.toLocaleString('id-ID');
            if (this.totalRevenueEl) this.totalRevenueEl.textContent = this.formatCurrency(totalRev);
            if (this.avgTransactionEl) this.avgTransactionEl.textContent = this.formatCurrency(avgTrans);
            
            // Update header stats
            this.updateHeaderStats();
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    // ===== MODAL FUNCTIONALITY =====
    showPaymentModal(transaction) {
        try {
            if (this.paymentDetails) {
                this.paymentDetails.innerHTML = `
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400"><i class="fas fa-hashtag mr-1"></i>ID Transaksi:</span>
                            <span class="font-bold text-blue-600 dark:text-blue-400">${transaction.id}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400"><i class="fas fa-user mr-1"></i>Nama:</span>
                            <span class="font-semibold text-gray-800 dark:text-white">${transaction.customerName}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400"><i class="fas fa-envelope mr-1"></i>Email:</span>
                            <span class="font-medium text-gray-800 dark:text-white">${transaction.customerEmail}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400"><i class="fas fa-box mr-1"></i>Produk:</span>
                            <span class="font-medium text-gray-800 dark:text-white">${transaction.product}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400"><i class="fas fa-hashtag mr-1"></i>Jumlah:</span>
                            <span class="font-medium text-gray-800 dark:text-white">${transaction.quantity} item</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400"><i class="fas fa-wallet mr-1"></i>Metode:</span>
                            <span class="font-medium text-gray-800 dark:text-white">${this.paymentMethodNames[transaction.paymentMethod]}</span>
                        </div>
                        <hr class="border-gray-300 dark:border-gray-600">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span class="font-medium text-gray-800 dark:text-white">${this.formatCurrency(transaction.subtotal)}</span>
                        </div>
                        ${transaction.discount > 0 ? `
                        <div class="flex justify-between text-green-600 dark:text-green-400">
                            <span><i class="fas fa-tags mr-1"></i>Diskon (${transaction.promoCode}):</span>
                            <span class="font-medium">-${this.formatCurrency(transaction.discount)}</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Pajak (11%):</span>
                            <span class="font-medium">${this.formatCurrency(transaction.tax)}</span>
                        </div>
                        <hr class="border-gray-300 dark:border-gray-600">
                        <div class="flex justify-between text-xl font-bold">
                            <span class="text-gray-800 dark:text-white">Total Bayar:</span>
                            <span class="text-green-600 dark:text-green-400">${this.formatCurrency(transaction.total)}</span>
                        </div>
                        <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                            <i class="fas fa-clock mr-1"></i>Transaksi pada: ${transaction.time}
                        </div>
                    </div>
                `;
            }
            
            if (this.paymentModal) {
                this.paymentModal.classList.remove('hidden');
                this.paymentModal.classList.add('flex');
            }
            
            this.currentTransaction = transaction;
        } catch (error) {
            console.error('Error showing payment modal:', error);
        }
    }

    closeModal() {
        try {
            if (this.paymentModal) {
                this.paymentModal.classList.add('hidden');
                this.paymentModal.classList.remove('flex');
            }
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }

    // ===== EXPORT FUNCTIONALITY =====
    exportTransactions() {
        try {
            if (this.transactions.length === 0) {
                this.showNotification('Tidak ada data untuk diekspor', 'error');
                return;
            }

            const csvContent = this.generateCSV();
            this.downloadCSV(csvContent, `riwayat-transaksi-${this.getCurrentDateString()}.csv`);
            this.showNotification('Data berhasil diekspor!', 'success');
        } catch (error) {
            console.error('Error exporting transactions:', error);
            this.showNotification('Gagal mengekspor data', 'error');
        }
    }

    generateCSV() {
        const headers = ['ID', 'Tanggal', 'Nama', 'Email', 'Produk', 'Jumlah', 'Metode', 'Subtotal', 'Diskon', 'Pajak', 'Total'];
        const rows = this.transactions.map(t => [
            t.id,
            t.time,
            t.customerName,
            t.customerEmail,
            t.product,
            t.quantity,
            this.paymentMethodNames[t.paymentMethod],
            t.subtotal,
            t.discount,
            t.tax,
            t.total
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ===== RECEIPT FUNCTIONALITY =====
    downloadReceipt() {
        try {
            if (!this.currentTransaction) return;
            
            const receipt = this.generateReceiptHTML(this.currentTransaction);
            this.downloadHTML(receipt, `struk-${this.currentTransaction.id}.html`);
            this.showNotification('Struk berhasil diunduh!', 'success');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            this.showNotification('Gagal mengunduh struk', 'error');
        }
    }

    generateReceiptHTML(transaction) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Struk Pembayaran - ${transaction.id}</title>
    <style>
        body { 
            font-family: 'Courier New', monospace; 
            max-width: 400px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f9f9f9;
        }
        .receipt {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            border-bottom: 2px dashed #333; 
            padding-bottom: 15px; 
            margin-bottom: 20px; 
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }
        .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        }
        .row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            font-size: 14px;
        }
        .row.bold {
            font-weight: bold;
        }
        .divider {
            border-top: 1px dashed #666;
            margin: 15px 0;
        }
        .total { 
            border-top: 2px solid #333; 
            padding-top: 15px; 
            margin-top: 15px; 
            font-weight: bold; 
            font-size: 16px;
        }
        .footer { 
            text-align: center; 
            margin-top: 25px; 
            font-size: 11px; 
            color: #666; 
            border-top: 1px dashed #ccc;
            padding-top: 15px;
        }
        .status {
            text-align: center;
            margin: 15px 0;
            padding: 8px;
            background: #e8f5e8;
            border: 1px solid #4caf50;
            border-radius: 4px;
            color: #2e7d32;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>PaymentPro</h1>
            <p>Sistem Pembayaran Professional</p>
            <p>www.paymentpro.id | support@paymentpro.id</p>
        </div>
        
        <div class="status">✓ PEMBAYARAN BERHASIL</div>
        
        <div class="row bold">
            <span>ID Transaksi:</span>
            <span>${transaction.id}</span>
        </div>
        <div class="row">
            <span>Tanggal:</span>
            <span>${transaction.time}</span>
        </div>
        <div class="row">
            <span>Nama:</span>
            <span>${transaction.customerName}</span>
        </div>
        <div class="row">
            <span>Email:</span>
            <span>${transaction.customerEmail}</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="row bold">
            <span>DETAIL PEMBELIAN</span>
            <span></span>
        </div>
        <div class="row">
            <span>Produk:</span>
            <span>${transaction.product}</span>
        </div>
        <div class="row">
            <span>Jumlah:</span>
            <span>${transaction.quantity} item</span>
        </div>
        <div class="row">
            <span>Metode Bayar:</span>
            <span>${this.paymentMethodNames[transaction.paymentMethod]}</span>
        </div>
        ${transaction.promoCode ? `
        <div class="row">
            <span>Kode Promo:</span>
            <span>${transaction.promoCode}</span>
        </div>
        ` : ''}
        
        <div class="divider"></div>
        
        <div class="row">
            <span>Subtotal:</span>
            <span>${this.formatCurrency(transaction.subtotal)}</span>
        </div>
        ${transaction.discount > 0 ? `
        <div class="row" style="color: #4caf50;">
            <span>Diskon:</span>
            <span>-${this.formatCurrency(transaction.discount)}</span>
        </div>
        ` : ''}
        <div class="row">
            <span>Pajak (11%):</span>
            <span>${this.formatCurrency(transaction.tax)}</span>
        </div>
        
        <div class="total">
            <div class="row bold" style="font-size: 18px;">
                <span>TOTAL BAYAR:</span>
                <span>${this.formatCurrency(transaction.total)}</span>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Terima kasih atas pembayaran Anda!</strong></p>
            <p>Struk ini adalah bukti pembayaran yang sah</p>
            <p>Digenerate otomatis pada ${new Date().toLocaleString('id-ID')}</p>
            <p>Simpan struk ini sebagai bukti transaksi</p>
        </div>
    </div>
</body>
</html>`;
    }

    downloadHTML(content, filename) {
        const blob = new Blob([content], { type: 'text/html' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ===== UTILITY FUNCTIONS =====
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    getCurrentDateString() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    generateTransactionId() {
        return 'TRX' + Date.now().toString().substr(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    get paymentMethodColors() {
        return {
            'transfer': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'ewallet': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            'credit': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            'cash': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        };
    }

    get paymentMethodNames() {
        return {
            'transfer': 'Transfer Bank',
            'ewallet': 'E-Wallet',
            'credit': 'Kartu Kredit',
            'cash': 'Bayar Tunai'
        };
    }

    // ===== UI HELPERS =====
    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('hidden');
            this.loadingOverlay.classList.add('flex');
        }
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Memproses...';
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('hidden');
            this.loadingOverlay.classList.remove('flex');
        }
        if (this.submitBtn) {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<span class="flex items-center justify-center"><i class="fas fa-lock mr-2"></i>Proses Pembayaran Aman</span>';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-triangle' : 'info-circle';
        
        // Check if dark mode is active
        const isDark = document.documentElement.classList.contains('dark');
        
        notification.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up transition-all duration-300 ${
            isDark ? 'border border-gray-600' : ''
        }`;
        notification.innerHTML = `<i class="fas fa-${icon} mr-2"></i>${message}`;
        
        const container = document.getElementById('notificationContainer');
        if (container) {
            container.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    clearAllHistory() {
        if (this.transactions.length === 0) return;
        
        if (confirm('⚠️ Apakah Anda yakin ingin menghapus SEMUA riwayat transaksi?\n\nTindakan ini tidak dapat dibatalkan!')) {
            this.transactions = [];
            this.saveTransactions();
            this.renderTransactions();
            this.showNotification('Semua riwayat berhasil dihapus', 'success');
        }
    }

    resetForm() {
        try {
            if (this.paymentForm) this.paymentForm.reset();
            this.resetPromoCode();
            if (this.customPriceSection) this.customPriceSection.classList.add('hidden');
            
            // Reset payment method cards
            document.querySelectorAll('.payment-method-card').forEach(card => {
                card.classList.remove('border-blue-500', 'border-purple-500', 'border-orange-500', 'border-green-500');
                card.classList.add('border-gray-200', 'dark:border-gray-600');
                const dot = card.querySelector('.w-3');
                if (dot) dot.classList.add('hidden');
            });
            
            // Clear validation errors
            ['customerName', 'customerEmail', 'productSelect', 'quantity', 'paymentMethod'].forEach(field => {
                this.hideFieldError(field);
            });
            
            this.updateTotal();
            
            // Focus pada input pertama
            const firstInput = document.getElementById('customerName');
            if (firstInput) firstInput.focus();
        } catch (error) {
            console.error('Error resetting form:', error);
        }
    }

    initializeApp() {
        try {
            this.initializeMobileMenu();
            this.initializeHeaderStats();
            this.updateTotal();
            this.renderTransactions();
            
            // Focus pada input pertama
            const firstInput = document.getElementById('customerName');
            if (firstInput) firstInput.focus();
            
            // Show welcome message
            setTimeout(() => {
                this.showNotification('Sistem Pembayaran siap digunakan!', 'success');
            }, 500);
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing systems...');
    try {
        // Initialize Dark Mode first
        new DarkModeManager();
        
        // Then initialize Payment System
        new PaymentSystem();
        
        console.log('All systems initialized successfully');
    } catch (error) {
        console.error('Failed to initialize systems:', error);
        
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Gagal memuat sistem. Silakan refresh halaman.';
        document.body.appendChild(notification);
    }
});
