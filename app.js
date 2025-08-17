// Expense Tracker Application
class ExpenseTracker {
    constructor() {
        this.expenses = [];
        this.budget = 1500; // Default budget
        this.categories = [
            "Food & Dining",
            "Transportation", 
            "Shopping",
            "Entertainment",
            "Bills & Utilities",
            "Healthcare",
            "Travel",
            "Other"
        ];
        this.categoryColors = {
            "Food & Dining": "#FF6B6B",
            "Transportation": "#4ECDC4", 
            "Shopping": "#45B7D1",
            "Entertainment": "#96CEB4",
            "Bills & Utilities": "#FFEAA7",
            "Healthcare": "#DDA0DD",
            "Travel": "#98D8C8",
            "Other": "#ADB5BD"
        };
        this.categoryIcons = {
            "Food & Dining": "🍽️",
            "Transportation": "🚗",
            "Shopping": "🛒",
            "Entertainment": "🎬",
            "Bills & Utilities": "💡",
            "Healthcare": "🏥",
            "Travel": "✈️",
            "Other": "📦"
        };
        
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.populateSelects();
        this.setDefaultDate();
        this.updateDashboard();
        this.showSection('dashboard');
        this.initTheme();
    }

    // Initialize theme
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Data Management
    loadData() {
        const savedExpenses = localStorage.getItem('expenses');
        const savedBudget = localStorage.getItem('budget');
        
        if (savedExpenses) {
            this.expenses = JSON.parse(savedExpenses);
        } else {
            // Load sample data if no saved data
            this.expenses = [
                {
                    id: "1",
                    amount: 25.50,
                    category: "Food & Dining",
                    description: "Lunch at local cafe",
                    date: "2025-08-15",
                    createdAt: "2025-08-15T12:30:00Z"
                },
                {
                    id: "2", 
                    amount: 45.00,
                    category: "Transportation",
                    description: "Gas for car",
                    date: "2025-08-14",
                    createdAt: "2025-08-14T08:15:00Z"
                },
                {
                    id: "3",
                    amount: 120.00,
                    category: "Shopping",
                    description: "Grocery shopping",
                    date: "2025-08-13",
                    createdAt: "2025-08-13T18:45:00Z"
                },
                {
                    id: "4",
                    amount: 15.99,
                    category: "Entertainment",
                    description: "Movie ticket",
                    date: "2025-08-12",
                    createdAt: "2025-08-12T20:00:00Z"
                },
                {
                    id: "5",
                    amount: 85.00,
                    category: "Bills & Utilities",
                    description: "Internet bill",
                    date: "2025-08-10",
                    createdAt: "2025-08-10T10:30:00Z"
                }
            ];
            this.saveExpenses();
        }
        
        if (savedBudget) {
            this.budget = parseFloat(savedBudget);
        }
    }

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    saveBudget() {
        localStorage.setItem('budget', this.budget.toString());
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav__item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', this.toggleTheme.bind(this));

        // Forms
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', this.handleExpenseSubmit.bind(this));
        }

        const budgetForm = document.getElementById('budgetForm');
        if (budgetForm) {
            budgetForm.addEventListener('submit', this.handleBudgetSubmit.bind(this));
        }

        const editForm = document.getElementById('editExpenseForm');
        if (editForm) {
            editForm.addEventListener('submit', this.handleEditSubmit.bind(this));
        }

        // Buttons
        const cancelBtn = document.getElementById('cancelExpense');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.showSection('dashboard'));
        }

        const addAnotherBtn = document.getElementById('addAnother');
        if (addAnotherBtn) {
            addAnotherBtn.addEventListener('click', this.resetExpenseForm.bind(this));
        }

        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', this.clearFilters.bind(this));
        }

        // Modal
        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', this.closeModal.bind(this));
        }

        const cancelEditBtn = document.getElementById('cancelEdit');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', this.closeModal.bind(this));
        }

        const saveEditBtn = document.getElementById('saveEdit');
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', this.handleEditSubmit.bind(this));
        }

        // Filters
        const searchInput = document.getElementById('searchExpenses');
        if (searchInput) {
            searchInput.addEventListener('input', this.filterExpenses.bind(this));
        }

        const categoryFilter = document.getElementById('filterCategory');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', this.filterExpenses.bind(this));
        }

        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', this.filterExpenses.bind(this));
        }

        // Click outside modal to close
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'editModal') {
                    this.closeModal();
                }
            });
        }
    }

    // Navigation
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section--active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('section--active');
        }

        // Update navigation
        document.querySelectorAll('.nav__item').forEach(item => {
            item.classList.remove('nav__item--active');
            if (item.dataset.section === sectionName) {
                item.classList.add('nav__item--active');
            }
        });

        // Update content based on section
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'add-expense':
                this.resetExpenseForm();
                break;
            case 'expenses':
                this.displayExpenses();
                break;
            case 'budget':
                this.updateBudgetSection();
                break;
            case 'categories':
                this.displayCategories();
                break;
        }
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    // Populate Select Elements
    populateSelects() {
        const selects = ['category', 'filterCategory', 'editCategory'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;

            if (selectId === 'filterCategory') {
                select.innerHTML = '<option value="">All categories</option>';
            } else {
                select.innerHTML = '<option value="">Select category</option>';
            }
            
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        });
    }

    // Set Default Date
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = today;
        }
    }

    // Expense Management
    handleExpenseSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const expense = {
            id: Date.now().toString(),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            description: formData.get('description') || '',
            date: formData.get('date'),
            createdAt: new Date().toISOString()
        };

        this.expenses.push(expense);
        this.saveExpenses();
        
        // Show success message
        const successMsg = document.getElementById('successMessage');
        if (successMsg) {
            successMsg.classList.remove('hidden');
        }

        e.target.reset();
        this.setDefaultDate();
        
        // Update dashboard
        this.updateDashboard();
        
        setTimeout(() => {
            if (successMsg) {
                successMsg.classList.add('hidden');
            }
        }, 3000);
    }

    handleEditSubmit(e) {
        e.preventDefault();
        
        const expenseId = document.getElementById('editExpenseId').value;
        const expenseIndex = this.expenses.findIndex(exp => exp.id === expenseId);
        
        if (expenseIndex !== -1) {
            this.expenses[expenseIndex] = {
                ...this.expenses[expenseIndex],
                amount: parseFloat(document.getElementById('editAmount').value),
                category: document.getElementById('editCategory').value,
                description: document.getElementById('editDescription').value,
                date: document.getElementById('editDate').value
            };
            
            this.saveExpenses();
            this.closeModal();
            this.displayExpenses();
            this.updateDashboard();
        }
    }

    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (expense) {
            document.getElementById('editExpenseId').value = expense.id;
            document.getElementById('editAmount').value = expense.amount;
            document.getElementById('editCategory').value = expense.category;
            document.getElementById('editDescription').value = expense.description;
            document.getElementById('editDate').value = expense.date;
            
            const modal = document.getElementById('editModal');
            if (modal) {
                modal.classList.remove('hidden');
            }
        }
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(exp => exp.id !== id);
            this.saveExpenses();
            this.displayExpenses();
            this.updateDashboard();
        }
    }

    closeModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    resetExpenseForm() {
        const form = document.getElementById('expenseForm');
        if (form) {
            form.reset();
        }
        this.setDefaultDate();
        
        const successMsg = document.getElementById('successMessage');
        if (successMsg) {
            successMsg.classList.add('hidden');
        }
    }

    // Budget Management
    handleBudgetSubmit(e) {
        e.preventDefault();
        
        const budgetAmount = parseFloat(document.getElementById('monthlyBudget').value);
        if (budgetAmount > 0) {
            this.budget = budgetAmount;
            this.saveBudget();
            this.updateDashboard();
            this.updateBudgetSection();
            
            // Show success feedback
            alert('Budget updated successfully!');
        }
    }

    updateBudgetSection() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = this.expenses
            .filter(exp => {
                const expenseDate = new Date(exp.date);
                return expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

        const budgetInput = document.getElementById('monthlyBudget');
        if (budgetInput) {
            budgetInput.value = this.budget;
        }

        const budgetAmount = document.getElementById('budgetAmount');
        if (budgetAmount) {
            budgetAmount.textContent = this.formatCurrency(this.budget);
        }

        const spentAmount = document.getElementById('spentAmount');
        if (spentAmount) {
            spentAmount.textContent = this.formatCurrency(monthlyExpenses);
        }

        const remainingAmount = document.getElementById('remainingAmount');
        if (remainingAmount) {
            remainingAmount.textContent = this.formatCurrency(this.budget - monthlyExpenses);
        }
    }

    // Dashboard Updates
    updateDashboard() {
        this.updateStats();
        this.updateBudgetProgress();
        this.displayRecentTransactions();
        this.displayCategoryBreakdown();
    }

    updateStats() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const currentWeek = this.getWeekStart(now);

        // Total expenses
        const totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        // This month expenses
        const monthlyExpenses = this.expenses
            .filter(exp => {
                const expenseDate = new Date(exp.date);
                return expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

        // This week expenses
        const weeklyExpenses = this.expenses
            .filter(exp => {
                const expenseDate = new Date(exp.date);
                return expenseDate >= currentWeek;
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

        // Budget remaining
        const budgetRemaining = this.budget - monthlyExpenses;

        // Update DOM elements
        const elements = [
            { id: 'totalExpenses', value: totalExpenses },
            { id: 'totalExpensesMonth', value: monthlyExpenses },
            { id: 'totalExpensesWeek', value: weeklyExpenses },
            { id: 'budgetRemaining', value: budgetRemaining }
        ];

        elements.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.formatCurrency(value);
            }
        });
    }

    updateBudgetProgress() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = this.expenses
            .filter(exp => {
                const expenseDate = new Date(exp.date);
                return expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

        const percentage = Math.min((monthlyExpenses / this.budget) * 100, 100);
        const budgetFill = document.getElementById('budgetFill');
        
        if (budgetFill) {
            budgetFill.style.width = `${percentage}%`;
            
            if (percentage >= 90) {
                budgetFill.classList.add('warning');
            } else {
                budgetFill.classList.remove('warning');
            }
        }

        const budgetSpent = document.getElementById('budgetSpent');
        if (budgetSpent) {
            budgetSpent.textContent = this.formatCurrency(monthlyExpenses);
        }

        const budgetTotal = document.getElementById('budgetTotal');
        if (budgetTotal) {
            budgetTotal.textContent = this.formatCurrency(this.budget);
        }

        const budgetPercentage = document.getElementById('budgetPercentage');
        if (budgetPercentage) {
            budgetPercentage.textContent = `${Math.round(percentage)}%`;
        }
    }

    displayRecentTransactions() {
        const recentExpenses = [...this.expenses]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const container = document.getElementById('recentTransactions');
        if (!container) return;
        
        if (recentExpenses.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-16);">No transactions yet</p>';
            return;
        }

        container.innerHTML = recentExpenses.map(expense => `
            <div class="expense-item">
                <div class="expense-item__main">
                    <div class="expense-item__category" style="background-color: ${this.categoryColors[expense.category]}20; color: ${this.categoryColors[expense.category]};">
                        ${this.categoryIcons[expense.category]}
                    </div>
                    <div class="expense-item__details">
                        <div class="expense-item__description">${expense.description || expense.category}</div>
                        <div class="expense-item__meta">${this.formatDate(expense.date)} • ${expense.category}</div>
                    </div>
                </div>
                <div class="expense-item__amount">${this.formatCurrency(expense.amount)}</div>
            </div>
        `).join('');
    }

    displayCategoryBreakdown() {
        const categoryTotals = {};
        
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const container = document.getElementById('categoryBreakdown');
        if (!container) return;

        const sortedCategories = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6);

        if (sortedCategories.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-16);">No expenses yet</p>';
            return;
        }

        container.innerHTML = sortedCategories.map(([category, amount]) => `
            <div class="category-breakdown-item">
                <div class="category-breakdown-item__info">
                    <div class="category-breakdown-item__color" style="background-color: ${this.categoryColors[category]};"></div>
                    <span class="category-breakdown-item__name">${category}</span>
                </div>
                <span class="category-breakdown-item__amount">${this.formatCurrency(amount)}</span>
            </div>
        `).join('');
    }

    // Expense Filtering and Display
    displayExpenses(filteredExpenses = null) {
        const expensesToShow = filteredExpenses || this.expenses;
        const container = document.getElementById('expensesList');
        const noDataElement = document.getElementById('noExpenses');

        if (!container || !noDataElement) return;

        if (expensesToShow.length === 0) {
            container.classList.add('hidden');
            noDataElement.classList.remove('hidden');
            return;
        }

        container.classList.remove('hidden');
        noDataElement.classList.add('hidden');

        container.innerHTML = expensesToShow.map(expense => `
            <div class="expense-item">
                <div class="expense-item__main">
                    <div class="expense-item__category" style="background-color: ${this.categoryColors[expense.category]}20; color: ${this.categoryColors[expense.category]};">
                        ${this.categoryIcons[expense.category]}
                    </div>
                    <div class="expense-item__details">
                        <div class="expense-item__description">${expense.description || expense.category}</div>
                        <div class="expense-item__meta">${this.formatDate(expense.date)} • ${expense.category}</div>
                    </div>
                </div>
                <div class="expense-item__amount">${this.formatCurrency(expense.amount)}</div>
                <div class="expense-item__actions">
                    <button class="btn btn--sm btn--outline" onclick="app.editExpense('${expense.id}')">Edit</button>
                    <button class="btn btn--sm btn--outline" onclick="app.deleteExpense('${expense.id}')" style="color: var(--color-error); border-color: var(--color-error);">Delete</button>
                </div>
            </div>
        `).join('');
    }

    filterExpenses() {
        const searchInput = document.getElementById('searchExpenses');
        const categoryFilter = document.getElementById('filterCategory');
        const sortBy = document.getElementById('sortBy');

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryValue = categoryFilter ? categoryFilter.value : '';
        const sortValue = sortBy ? sortBy.value : 'date-desc';

        let filtered = [...this.expenses];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(expense => 
                expense.description.toLowerCase().includes(searchTerm) ||
                expense.category.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (categoryValue) {
            filtered = filtered.filter(expense => expense.category === categoryValue);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortValue) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'amount-asc':
                    return a.amount - b.amount;
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        this.displayExpenses(filtered);
    }

    clearFilters() {
        const searchInput = document.getElementById('searchExpenses');
        const categoryFilter = document.getElementById('filterCategory');
        const sortBy = document.getElementById('sortBy');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (sortBy) sortBy.value = 'date-desc';

        this.displayExpenses();
    }

    // Categories Display
    displayCategories() {
        const categoryStats = {};
        
        this.categories.forEach(category => {
            const categoryExpenses = this.expenses.filter(exp => exp.category === category);
            categoryStats[category] = {
                total: categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0),
                count: categoryExpenses.length
            };
        });

        const container = document.getElementById('categoriesGrid');
        if (!container) return;
        
        container.innerHTML = this.categories.map(category => {
            const stats = categoryStats[category];
            return `
                <div class="category-card">
                    <div class="category-card__icon" style="background-color: ${this.categoryColors[category]}20; color: ${this.categoryColors[category]};">
                        ${this.categoryIcons[category]}
                    </div>
                    <div class="category-card__content">
                        <div class="category-card__name">${category}</div>
                        <div class="category-card__amount">${this.formatCurrency(stats.total)}</div>
                        <div class="category-card__count">${stats.count} transaction${stats.count !== 1 ? 's' : ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }
}

// Global functions for HTML onclick handlers
function showSection(section) {
    if (window.app) {
        window.app.showSection(section);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new ExpenseTracker();
});