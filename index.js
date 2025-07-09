
import { createClient } from '@supabase/supabase-js';

// --- SETUP ---
const SUPABASE_URL = 'https://snqlviehipbgswztrwhw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucWx2aWVoaXBiZ3N3enRyd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTU5MzIsImV4cCI6MjA2NzQ3MTkzMn0.n8aaWZfg81hD9Fr26pFQcR33brpdzMpUMkkna61V2nI';
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM ELEMENTS ---
// Login Elements
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');


// App Elements
const loader = document.getElementById('loader-container');
const dashboardContentContainer = document.querySelector('.max-w-7xl.mx-auto');
const monthFilter = document.getElementById('month-filter');
const yearFilter = document.getElementById('year-filter');
const actionsContainer = document.getElementById('dashboard-actions');

// --- EDIT MODE ELEMENTS ---
const editIncomeButton = document.getElementById('edit-income-button');
const saveIncomeButton = document.getElementById('save-income-button');
const cancelIncomeButton = document.getElementById('cancel-income-button');
const incomeSaveCancelButtons = document.getElementById('income-save-cancel-buttons');

const editCategoriesButton = document.getElementById('edit-categories-button');
const saveCategoriesButton = document.getElementById('save-categories-button');
const cancelCategoriesButton = document.getElementById('cancel-categories-button');
const categorySaveCancelButtons = document.getElementById('category-save-cancel-buttons');

// --- VIEW SWITCHING ELEMENTS ---
const dashboardView = document.getElementById('dashboard-view');
const statisticsView = document.getElementById('statistics-view');
const simulatorView = document.getElementById('simulator-view');
const navDashboardButton = document.getElementById('nav-dashboard');
const navStatisticsButton = document.getElementById('nav-statistics');
const navSimulatorButton = document.getElementById('nav-simulator');

// --- SIMULATOR ELEMENTS ---
const calculateFutureValueButton = document.getElementById('calculate-future-value');
const calculateRequiredDepositButton = document.getElementById('calculate-required-deposit');

// --- STATISTICS & GOAL MODAL ELEMENTS ---
const goalsListContainer = document.getElementById('goals-list');
const monthlyEvolutionChartCanvas = document.getElementById('monthly-evolution-chart');
const addGoalButton = document.getElementById('add-goal-button');
const addGoalModal = document.getElementById('add-goal-modal');
const addGoalFormModal = document.getElementById('add-goal-form-modal');
const closeGoalModalButton = document.getElementById('close-goal-modal');
const cancelGoalModalButton = document.getElementById('cancel-goal-modal');


// --- STATE & GLOBAL DATA ---
let loggedInUser = null;
let isIncomeEditing = false;
let isCategoryEditing = false;
let currentIncomeData = [];
let allIncomeSources = [];
let allExpenseCategories = [];
let currentSpendingByCategory = [];
let currentBudgetId = null;
let currentTotalIncome = 0;
let lastRenderedStatsYear = null;
let activeView = 'dashboard';
let monthlyEvolutionChart = null;
const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];


// --- UTILITY FUNCTIONS ---
const formatCurrency = (value) => {
  if (typeof value !== 'number') value = 0;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const showLoader = (show) => {
  if (!loader || !dashboardContentContainer) return;
  loader.classList.toggle('hidden', !show);
  if (appContainer && !appContainer.classList.contains('hidden')) {
    dashboardContentContainer.classList.toggle('hidden', show);
  }
};

// --- RENDER FUNCTIONS ---
function renderErrorState(message) {
   dashboardContentContainer.innerHTML = `<div class="bg-red-900 border border-red-700 text-red-200 p-6 rounded-xl text-center max-w-3xl mx-auto mt-8">
      <h2 class="font-bold text-lg mb-2">Ocorreu um Erro Inesperado</h2>
      <p class="font-mono text-sm bg-slate-900 p-2 rounded">${message}</p>
      <p class="mt-4 text-red-300 text-sm">Se o erro persistir, pode ser necessário ajustar a base de dados. Tente atualizar a página ou selecionar outro período.</p>
    </div>`;
   showLoader(false);
}

function renderIncome(entries) {
  const incomeCardMid = document.getElementById('income-card-mid');
  const incomeCardEnd = document.getElementById('income-card-end');
  const gridContainer = incomeCardMid.parentElement;

  const createIncomeCardHTML = (title, entries, cardType) => {
    const total = entries.reduce((acc, e) => acc + Number(e.amount), 0);
    let listItems = entries.map(e => {
        let entryContent;
        if (isIncomeEditing) {
            entryContent = `
                <div class="flex items-center gap-2 flex-grow">
                   <button class="remove-income-item text-brand-red hover:text-red-400 transition-colors p-1 rounded-full">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                   </button>
                   <span class="text-brand-text-secondary">${e.income_sources?.name || 'Fonte desconhecida'}</span>
                </div>
                <input 
                  type="number" 
                  class="income-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-28 text-right"
                  value="${Number(e.amount).toFixed(2)}"
                  step="0.01"
               />
            `;
        } else {
            entryContent = `
                <span class="text-brand-text-secondary">${e.income_sources?.name || 'Fonte desconhecida'}</span>
                <span class="text-brand-text-primary font-medium">${formatCurrency(Number(e.amount))}</span>
            `;
        }
        
        return `<div class="flex justify-between items-center text-sm income-row" data-id="${e.id}">${entryContent}</div>`;
    }).join('');

    const addIncomeButtonHTML = isIncomeEditing ? `
      <div class="mt-3">
        <button class="add-income-item text-sm font-semibold text-brand-accent hover:text-blue-400 transition-colors flex items-center gap-1" data-card-type="${cardType}">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
           Adicionar Receita
        </button>
      </div>
    ` : '';
    
    let dayLabel = '';
    if (title === 'Meio do Mês') {
        dayLabel = `<span class="text-xs text-brand-green font-semibold">15º dia</span>`;
    } else if (title === 'Fim do Mês') {
        dayLabel = `<span class="text-xs text-brand-green font-semibold">30º dia</span>`;
    }

    return `
      <div class="flex justify-between items-baseline mb-4">
        <h3 class="font-semibold text-brand-text-primary">${title}</h3>
        ${dayLabel}
      </div>
      <div class="space-y-3 flex-grow income-list-container">${listItems}</div>
      ${addIncomeButtonHTML}
      <div class="border-t border-slate-700 mt-4 pt-3 flex justify-between font-bold">
        <span class="text-brand-text-primary">Total</span>
        <span class="text-brand-green">${formatCurrency(total)}</span>
      </div>
    `;
  };
  
  incomeCardEnd.classList.remove('hidden');
  gridContainer.classList.remove('lg:grid-cols-3');
  gridContainer.classList.add('lg:grid-cols-4', 'md:grid-cols-2');

  if (loggedInUser && loggedInUser.username === 'gilson') {
    incomeCardEnd.classList.add('hidden');
    gridContainer.classList.remove('lg:grid-cols-4', 'md:grid-cols-2');
    gridContainer.classList.add('lg:grid-cols-3');

    const allEntries = entries;
    incomeCardMid.innerHTML = createIncomeCardHTML('Mês', allEntries, 'full');

  } else {
    const midMonthEntries = entries.filter(e => new Date(e.received_at + 'T00:00:00').getDate() <= 15);
    const endMonthEntries = entries.filter(e => new Date(e.received_at + 'T00:00:00').getDate() > 15);
    
    incomeCardMid.innerHTML = createIncomeCardHTML('Meio do Mês', midMonthEntries, 'mid');
    incomeCardEnd.innerHTML = createIncomeCardHTML('Fim do Mês', endMonthEntries, 'end');
  }
}

function renderMainCards(totalIncome, remainingBalance) {
    document.getElementById('total-liquid').textContent = formatCurrency(totalIncome);
    document.getElementById('saldo-restante').textContent = formatCurrency(remainingBalance);
}

function renderCategoryCards(spendingByCategory) {
    const container = document.getElementById('category-cards-container');

    const categoryEmojis = {
      'Gastos Essenciais': '💡',
      'Gastos Não Essenciais': '🍕',
      'Investimentos': '🐖',
      'Torrar': '😎',
      'default': '💸'
    };

    container.innerHTML = spendingByCategory.map(cat => {
        const diff = cat.planned - cat.real;
        const overBudget = diff < 0;
        const onBudget = Math.abs(diff) < 0.01;
        const progress = cat.planned > 0 ? (cat.real / cat.planned) * 100 : (cat.real > 0 ? 100 : 0);
        
        let statusText, statusColorClass, progressText;
        if (onBudget) {
          statusText = 'No Orçamento';
          statusColorClass = 'bg-orange-500/20 text-brand-orange';
          progressText = `Exatamente no planejado (0% de variação)`;
        } else if (overBudget) {
            statusText = 'Acima do Orçamento';
            statusColorClass = 'bg-red-500/20 text-brand-red';
            const percentageOver = cat.planned > 0 ? Math.round(Math.abs(diff)/cat.planned * 100) : 100;
            progressText = `Gastou ${formatCurrency(Math.abs(diff))} a mais (${percentageOver}% acima)`;
        } else {
            statusText = 'Abaixo do Orçamento';
            statusColorClass = 'bg-green-500/20 text-brand-green';
            const percentageUnder = cat.planned > 0 ? Math.round(diff/cat.planned * 100) : 0;
            progressText = `Economizou ${formatCurrency(diff)} (${percentageUnder}% abaixo)`;
        }

        const emoji = categoryEmojis[cat.name] || categoryEmojis.default;
        
        let percentageHTML, plannedAmountHTML, gastoRealHTML;

        if (isCategoryEditing) {
            percentageHTML = `
                <div class="flex items-center">
                    <input
                        type="number"
                        class="category-percentage-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-20 text-right font-bold"
                        value="${cat.percentageOfTotalPlanned.toFixed(0)}"
                        step="1"
                        min="0"
                        max="100"
                    />
                    <span class="ml-1 font-bold">%</span>
                </div>
            `;
            plannedAmountHTML = `
                <input
                    type="number"
                    class="category-planned-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-32 text-right font-bold"
                    value="${Number(cat.planned).toFixed(2)}"
                    step="0.01"
                />`;
            gastoRealHTML = `
                <input
                    type="number"
                    class="category-real-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-32 text-right font-bold"
                    value="${Number(cat.real).toFixed(2)}"
                    step="0.01"
                />`;
        } else {
            percentageHTML = `<span class="font-bold">${cat.percentageOfTotalPlanned.toFixed(0)}%</span>`;
            plannedAmountHTML = `<span class="font-bold">${formatCurrency(cat.planned)}</span>`;
            gastoRealHTML = `<span class="font-bold">${formatCurrency(cat.real)}</span>`;
        }

        const categoryHeaderHTML = isCategoryEditing
          ? `<div class="flex items-center gap-2">
               <button class="remove-category-item text-brand-red hover:text-red-400 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
               <h3 class="font-semibold text-brand-text-primary flex items-center gap-2">${emoji} ${cat.name}</h3>
             </div>`
          : `<h3 class="font-semibold text-brand-text-primary flex items-center gap-2">${emoji} ${cat.name}</h3>`;

        return `
            <div class="bg-brand-card p-6 rounded-xl category-card" data-id="${cat.id}" data-category-id="${cat.category_id}">
              <div class="flex justify-between items-start mb-4">
                ${categoryHeaderHTML}
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${statusColorClass}">${statusText}</span>
              </div>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center"><span class="text-brand-text-secondary">Porcentagem</span>${percentageHTML}</div>
                <div class="flex justify-between items-center"><span class="text-brand-text-secondary">Planejado</span>${plannedAmountHTML}</div>
                <div class="flex justify-between items-center"><span class="text-brand-text-secondary">Gasto Real</span>${gastoRealHTML}</div>
              </div>
              <div class="mt-4">
                <div class="bg-slate-700 rounded-full h-2 w-full">
                    <div class="${overBudget ? 'bg-brand-red' : 'bg-brand-green'} rounded-full h-2" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
                <p class="text-xs text-brand-text-secondary mt-2">${progressText}</p>
              </div>
            </div>
        `;
    }).join('');

    if (isCategoryEditing) {
      const addCategoryButtonContainer = document.createElement('div');
      addCategoryButtonContainer.className = "add-category-button-container";
      addCategoryButtonContainer.innerHTML = `
        <button class="add-category-item text-lg font-semibold text-brand-accent hover:text-blue-400 transition-colors flex items-center gap-2 p-6 border-2 border-dashed border-slate-600 rounded-xl w-full justify-center hover:bg-slate-800">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
           Adicionar Categoria
        </button>
      `;
      container.appendChild(addCategoryButtonContainer);
    }
}


function renderVisualizations(spendingByCategory, totalPlanned) {
    const categoryColors = ['#3b82f6', '#8b5cf6', '#f97316', '#14b8a6', '#ef4444', '#ec4899'];
    const pieChart = document.getElementById('pie-chart');
    const pieLegend = document.getElementById('pie-chart-legend');
    let gradientString = 'conic-gradient(';
    let currentPercentage = 0;
    pieLegend.innerHTML = '';
    
    spendingByCategory.forEach((cat, index) => {
        const color = categoryColors[index % categoryColors.length];
        const percentage = cat.percentageOfTotalPlanned;
        if(percentage > 0) {
           gradientString += `${color} ${currentPercentage}% ${currentPercentage + percentage}%, `;
           currentPercentage += percentage;
        }
        pieLegend.innerHTML += `
            <li class="flex items-center text-sm text-brand-text-secondary">
                <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${color};"></span>
                ${cat.name} (${percentage.toFixed(0)}%)
            </li>
        `;
    });
    if (currentPercentage < 100) {
        gradientString += `#1e293b ${currentPercentage}% 100%`;
    } else {
        gradientString = gradientString.slice(0, -2);
    }
    gradientString += ')';
    pieChart.style.background = gradientString;
    
    const yAxis = document.getElementById('bar-chart-y-axis');
    const barsContainer = document.getElementById('bar-chart-bars');
    const maxVal = Math.max(...spendingByCategory.map(c => c.planned), ...spendingByCategory.map(c => c.real));
    const topLimit = maxVal > 0 ? Math.ceil(maxVal / 1000) * 1000 : 1000; // set a min top limit
    
    yAxis.innerHTML = [topLimit, topLimit*0.75, topLimit*0.5, topLimit*0.25, 0]
        .map(val => `<span>${formatCurrency(val).replace(',00', '')}</span>`).join('');
    
    barsContainer.innerHTML = spendingByCategory.map(cat => {
      const plannedHeight = topLimit > 0 ? (cat.planned / topLimit) * 100 : 0;
      const realHeight = topLimit > 0 ? (cat.real / topLimit) * 100 : 0;
      return `
        <div class="flex flex-col items-center flex-1 gap-1 h-full">
           <div class="flex items-end w-full gap-1 justify-center flex-grow">
             <div class="w-1/3 bg-brand-accent rounded-t-sm" style="height: ${plannedHeight}%" title="Planejado: ${formatCurrency(cat.planned)}"></div>
             <div class="w-1/3 bg-brand-green rounded-t-sm" style="height: ${realHeight}%" title="Real: ${formatCurrency(cat.real)}"></div>
           </div>
           <span class="text-xs text-brand-text-secondary text-center">${cat.name}</span>
        </div>
      `;
    }).join('');
}

function renderSummary(totalPlanned, totalSpent, variation) {
    document.getElementById('summary-planned').textContent = formatCurrency(totalPlanned);
    document.getElementById('summary-spent').textContent = formatCurrency(totalSpent);
    document.getElementById('summary-variation').textContent = formatCurrency(variation);
    
    const variationPercentage = totalPlanned > 0 ? ((Math.abs(variation) / totalPlanned) * 100).toFixed(2) : 0;
    let variationText = '';
    const variationValueElem = document.getElementById('summary-variation');
    const variationTextElem = document.getElementById('summary-variation-text');
    
    variationValueElem.classList.remove('text-brand-red', 'text-brand-green');

    if (variation > 0.01) {
        variationText = `${variationPercentage}% abaixo do orçamento`;
        variationValueElem.classList.add('text-brand-green');
    } else if (variation < -0.01) {
        variationText = `${variationPercentage}% acima do orçamento`;
        variationValueElem.classList.add('text-brand-red');
    } else {
        variationText = 'Exatamente no orçamento';
    }
    variationTextElem.textContent = variationText;
}


async function handleCopyFromPrevious(sourceBudgetId) {
    showLoader(true);
    try {
        const { error } = await db.rpc('copy_budget_data', {
            p_source_budget_id: sourceBudgetId,
            p_target_budget_id: currentBudgetId
        });
        if (error) throw error;
        
        await fetchAndRenderDashboard(currentBudgetId);
        
        const selectedYear = parseInt(yearFilter.value, 10);
        await fetchAndRenderStatistics(selectedYear);

    } catch(error) {
        console.error("Failed to copy from previous month:", error);
        renderErrorState(`Erro ao copiar dados: ${error.message}`);
    } finally {
        showLoader(false);
    }
}


async function renderDashboardActions(isBudgetEmpty) {
    actionsContainer.innerHTML = ''; 

    if (!isBudgetEmpty) return;

    const selectedMonth = parseInt(monthFilter.value, 10);
    const selectedYear = parseInt(yearFilter.value, 10);
    
    const previousMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    const prevMonth = previousMonthDate.getMonth() + 1;
    const prevYear = previousMonthDate.getFullYear();

    const { data: prevBudget, error } = await db.from('financial_budgets').select('id', { count: 'exact' })
        .eq('user_id', loggedInUser.id)
        .eq('month', prevMonth)
        .eq('year', prevYear)
        .limit(1)
        .single();
    
    if (prevBudget && !error) {
        actionsContainer.innerHTML = `
            <div class="flex justify-center">
                <button id="copy-previous-month-button" class="bg-brand-accent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Copiar dados do mês anterior
                </button>
            </div>
        `;
        document.getElementById('copy-previous-month-button').addEventListener('click', () => handleCopyFromPrevious(prevBudget.id));
    }
}


// --- DATA LOGIC ---

async function fetchAndRenderDashboard(budgetId) {
  currentBudgetId = budgetId;
  try {
    if (!budgetId) {
      throw new Error("ID do Orçamento não fornecido. Não é possível renderizar o dashboard.");
    }
    
    const { data: incomeEntriesData, error: incomeError } = await db.from('financial_income_entries').select('*, income_sources:financial_income_sources(name)').eq('budget_id', budgetId);
    if (incomeError) throw new Error(`Erro ao buscar receitas: ${incomeError.message}`);
    
    const { data: incomeSources, error: sourcesError } = await db.from('financial_income_sources').select('*').eq('user_id', loggedInUser.id);
    if(sourcesError) throw new Error(`Erro ao buscar fontes de receita: ${sourcesError.message}`);
    allIncomeSources = incomeSources;

    const { data: expenseCategories, error: expenseCatError } = await db.from('financial_expense_categories').select('*').eq('user_id', loggedInUser.id);
    if (expenseCatError) throw new Error(`Erro ao buscar categorias de despesa: ${expenseCatError.message}`);
    allExpenseCategories = expenseCategories;
    
    const { data: budgetItemsData, error: budgetItemsError } = await db.from('financial_budget_items').select('*, expense_categories:financial_expense_categories(*)').eq('budget_id', budgetId);
    if (budgetItemsError) throw new Error(`Erro ao buscar itens do orçamento: ${budgetItemsError.message}`);
    
    const { data: transactionsData, error: transactionsError } = await db.from('financial_transactions').select('*').eq('budget_id', budgetId);
    if (transactionsError) throw new Error(`Erro ao buscar transações: ${transactionsError.message}`);

    const totalIncome = incomeEntriesData.reduce((acc, entry) => acc + Number(entry.amount), 0);
    currentTotalIncome = totalIncome;
    const totalSpent = transactionsData.reduce((acc, tx) => acc + Number(tx.amount), 0);
    const totalPlanned = budgetItemsData.reduce((acc, item) => acc + Number(item.planned_amount), 0);
    const remainingBalance = totalIncome - totalSpent;
    const variation = totalPlanned - totalSpent;

    const spendingByCategory = budgetItemsData.map(item => {
        const realSpent = transactionsData
            .filter(tx => tx.category_id === item.category_id)
            .reduce((acc, tx) => acc + Number(tx.amount), 0);
        return {
            id: item.id,
            budget_id: item.budget_id,
            category_id: item.category_id,
            name: item.expense_categories?.name || 'Categoria Desconhecida',
            type: item.expense_categories?.type || 'desconhecido',
            planned: Number(item.planned_amount),
            real: realSpent,
            percentageOfTotalPlanned: totalPlanned > 0 ? (Number(item.planned_amount) / totalPlanned) * 100 : 0,
        };
    });
    
    currentIncomeData = JSON.parse(JSON.stringify(incomeEntriesData));
    currentSpendingByCategory = JSON.parse(JSON.stringify(spendingByCategory));

    renderIncome(incomeEntriesData);
    renderMainCards(totalIncome, remainingBalance);
    renderCategoryCards(spendingByCategory);
    renderVisualizations(spendingByCategory, totalPlanned);
    renderSummary(totalPlanned, totalSpent, variation);
    
    const isBudgetEmpty = totalIncome === 0 && totalPlanned === 0;
    await renderDashboardActions(isBudgetEmpty);

  } catch (error) {
    throw error;
  }
}

// --- STATISTICS RENDER FUNCTIONS ---
function renderMonthlyEvolutionChart(monthlyData) {
    const ctx = monthlyEvolutionChartCanvas.getContext('2d');
    const labels = MONTH_NAMES;
    
    const datasets = [
        {
            label: 'Receita',
            data: monthlyData.map(d => d.income),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.3,
        },
        {
            label: 'Gasto Real',
            data: monthlyData.map(d => d.spending),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.3,
        },
        {
            label: 'Investimentos',
            data: monthlyData.map(d => d.investment),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.3,
        },
    ];

    if (monthlyEvolutionChart) {
        monthlyEvolutionChart.data.labels = labels;
        monthlyEvolutionChart.data.datasets = datasets;
        monthlyEvolutionChart.update();
    } else {
        monthlyEvolutionChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#94a3b8', callback: (value) => formatCurrency(value) },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    }
                }
            }
        });
    }
}

function renderHighlightMonths(monthlyData, year) {
    const container = document.getElementById('highlight-months-container');
    if (!monthlyData || monthlyData.length === 0) {
        container.innerHTML = `<p class="text-brand-text-secondary col-span-full">Não há dados suficientes para exibir os meses destaque.</p>`;
        return;
    }

    let highestSavings = { month: -1, value: -Infinity };
    let lowestSavings = { month: -1, value: Infinity };

    monthlyData.forEach((data, index) => {
        if(data.income > 0 || data.spending > 0) {
            const savings = data.income - data.spending;
            if (savings > highestSavings.value) {
                highestSavings = { month: index, value: savings };
            }
            if (savings < lowestSavings.value) {
                lowestSavings = { month: index, value: savings };
            }
        }
    });

    const createCardHTML = (title, emoji, monthIndex, value, isPositive) => {
        if (monthIndex === -1 || value === -Infinity || value === Infinity) return '<div class="bg-brand-card p-6 rounded-xl"><p class="text-brand-text-secondary">'+title+'</p><p class="text-lg font-bold mt-1">N/A</p></div>';
        const monthName = MONTH_NAMES[monthIndex];
        return `
            <div class="bg-brand-card p-6 rounded-xl">
                <p class="text-brand-text-secondary flex items-center gap-2">${emoji} ${title}</p>
                <p class="text-xl font-bold mt-1">${monthName} ${year}</p>
                <p class="text-lg font-bold ${isPositive ? 'text-brand-green' : 'text-brand-red'}">${isPositive ? '+' : ''}${formatCurrency(value)}</p>
            </div>`;
    };

    container.innerHTML = createCardHTML('Maior Economia', '💰', highestSavings.month, highestSavings.value, true)
                        + createCardHTML('Maior Gasto', '🔥', lowestSavings.month, lowestSavings.value, false);
}

function renderGoals(goals, annualData) {
    if (!goalsListContainer) return;
    goalsListContainer.innerHTML = '';
    
    if (goals.length === 0) {
        goalsListContainer.innerHTML = `<p class="text-brand-text-secondary text-center italic py-8">Nenhuma meta definida ainda.</p>`;
        return;
    }

    goals.forEach(goal => {
        let currentAmount = 0;
        if (goal.goal_type === 'save_total') {
            currentAmount = annualData.totalAnnualSavings;
        } else if (goal.goal_type === 'invest_total') {
            currentAmount = annualData.totalAnnualInvestment;
        }

        const progress = goal.target_amount > 0 ? (currentAmount / goal.target_amount) * 100 : 0;
        const isCompleted = progress >= 100;

        const goalElement = document.createElement('div');
        goalElement.className = `border-l-4 ${isCompleted ? 'border-brand-green' : 'border-brand-accent'} pl-4 py-2`;
        goalElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold text-brand-text-primary">${goal.description} ${isCompleted ? '✅' : ''}</p>
                    <p class="text-sm text-brand-text-secondary">
                        Meta: ${formatCurrency(goal.target_amount)} &bull; Progresso: ${formatCurrency(currentAmount)}
                    </p>
                </div>
                <button class="delete-goal-button text-brand-red hover:text-red-400 p-1" data-id="${goal.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
            <div class="mt-2 bg-slate-700 rounded-full h-2.5 w-full">
                <div class="bg-brand-green rounded-full h-2.5" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <p class="text-right text-xs text-brand-text-secondary mt-1">${progress.toFixed(1)}%</p>
        `;
        goalsListContainer.appendChild(goalElement);
    });
}

function renderBehavioralStats(monthlyData, allTransactionsForYear, allBudgetItemsForYear) {
    const container = document.getElementById('behavioral-stats-container');
    const monthsWithData = monthlyData.filter(d => d.income > 0 || d.spending > 0).length;

    if (monthsWithData === 0) {
        container.innerHTML = `<p class="text-brand-text-secondary col-span-full">Não há dados suficientes para os insights.</p>`;
        return;
    }

    const totalSpending = monthlyData.reduce((sum, d) => sum + d.spending, 0);
    const totalInvestment = monthlyData.reduce((sum, d) => sum + d.investment, 0);
    const monthsInBlue = monthlyData.filter(d => d.income > d.spending).length;
    
    const categoryOverspends = {};
    allBudgetItemsForYear.forEach(item => {
        const realSpending = allTransactionsForYear
            .filter(tx => tx.budget_id === item.budget_id && tx.category_id === item.category_id)
            .reduce((sum, tx) => sum + tx.amount, 0);
        if (realSpending > item.planned_amount && item.planned_amount > 0) {
            const categoryName = item.expense_categories.name;
            categoryOverspends[categoryName] = (categoryOverspends[categoryName] || 0) + 1;
        }
    });
    
    const topOverspenders = Object.entries(categoryOverspends).sort((a, b) => b[1] - a[1]).slice(0, 2).map(entry => entry[0]).join(', ') || 'Nenhuma';

    const stats = [
        { label: 'Média de gasto mensal', value: formatCurrency(totalSpending / monthsWithData) },
        { label: 'Média de investimento', value: formatCurrency(totalInvestment / monthsWithData) },
        { label: '% de meses no azul', value: `${((monthsInBlue / monthsWithData) * 100).toFixed(0)}%` },
        { label: 'Categorias que mais extrapolam', value: topOverspenders },
    ];

    container.innerHTML = stats.map(stat => `
        <div class="bg-brand-background p-4 rounded-lg">
            <p class="text-sm text-brand-text-secondary">${stat.label}</p>
            <p class="text-lg font-bold text-brand-text-primary">${stat.value}</p>
        </div>
    `).join('');
}

function renderFinancialScore(currentMonthData) {
    const container = document.getElementById('financial-score-container');
    if (!currentMonthData) {
      container.innerHTML = `<p class="text-brand-text-secondary">Selecione um mês no dashboard para ver a pontuação.</p>`;
      return;
    }
    
    let score = 0;
    let message = '';

    const { totalIncome, totalPlanned, totalSpent, spendingByCategory } = currentMonthData;

    if(totalSpent <= totalPlanned) { score += 10; }
    const investmentCategory = spendingByCategory.find(c => c.name === 'Investimentos');
    if(investmentCategory && investmentCategory.real >= investmentCategory.planned && investmentCategory.planned > 0) { score += 15; }
    const funCategory = spendingByCategory.find(c => c.name === 'Torrar');
    if(funCategory && funCategory.real > funCategory.planned) { score -= 5; }
    if(totalIncome - totalSpent > 0) { score += 20; }
    
    if (score >= 40) message = '🏆 Você está mandando muito bem!';
    else if (score >= 20) message = '👍 Bom trabalho! Continue assim.';
    else if (score >= 0) message = '🤔 Há espaço para melhorar.';
    else message = '🚨 Atenção! Seus hábitos precisam de ajuste.';

    container.innerHTML = `
        <p class="text-lg font-semibold text-brand-text-secondary">Pontuação do Mês</p>
        <p class="text-6xl font-bold my-2" style="color: ${score >= 20 ? '#22c55e' : (score >= 0 ? '#f97316' : '#ef4444')}">${score}</p>
        <p class="text-sm text-brand-text-secondary">${message}</p>
    `;
}

function renderFutureProjection(monthlyData) {
    const container = document.getElementById('future-projection-container');
    const currentMonthIndex = new Date().getMonth();
    const monthsWithData = monthlyData.filter((d, i) => (d.income > 0 || d.spending > 0) && i <= currentMonthIndex);
    
    if(monthsWithData.length === 0) {
        container.innerHTML = '';
        return;
    }

    const totalSavingsSoFar = monthsWithData.reduce((sum, d) => sum + (d.income - d.spending), 0);
    const averageMonthlySavings = totalSavingsSoFar / monthsWithData.length;
    const monthsRemaining = 11 - currentMonthIndex;
    
    const projectedEndBalance = totalSavingsSoFar + (averageMonthlySavings * monthsRemaining);

    container.innerHTML = `
        <div class="bg-brand-card p-6 rounded-xl">
            <p class="text-brand-text-secondary flex items-center gap-2">🔮 Projeção para o Fim do Ano</p>
            <p class="text-sm mt-2">Se continuar nesse ritmo, seu saldo acumulado no ano será de:</p>
            <p class="text-2xl font-bold text-brand-accent mt-1">${formatCurrency(projectedEndBalance)}</p>
        </div>
    `;
}

function renderYearOverYearComparison(currentYearData, lastYearData, month) {
    const container = document.getElementById('yoy-comparison-container');
    const monthName = MONTH_NAMES[month];

    const formatDiff = (current, last) => {
        if (last === 0 && current > 0) return `<span class="text-xs text-brand-green">(+${formatCurrency(current)})</span>`;
        if (last === 0) return '';
        const diff = current - last;
        const diffPercent = (diff / last) * 100;
        const color = diff >= 0 ? 'text-brand-green' : 'text-brand-red';
        return `<span class="text-xs ${color}">(${diff > 0 ? '+' : ''}${diffPercent.toFixed(0)}%)</span>`;
    };

    container.innerHTML = `
        <table class="w-full text-sm text-left">
            <thead class="text-xs text-brand-text-secondary uppercase">
                <tr>
                    <th scope="col" class="px-6 py-3">Métrica</th>
                    <th scope="col" class="px-6 py-3 text-right">${monthName} ${lastYearData.year}</th>
                    <th scope="col" class="px-6 py-3 text-right">${monthName} ${currentYearData.year}</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-b border-slate-700">
                    <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-brand-text-primary">Receita</th>
                    <td class="px-6 py-4 text-right">${formatCurrency(lastYearData.income)}</td>
                    <td class="px-6 py-4 text-right">${formatCurrency(currentYearData.income)} ${formatDiff(currentYearData.income, lastYearData.income)}</td>
                </tr>
                <tr class="border-b border-slate-700">
                    <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-brand-text-primary">Gasto Real</th>
                    <td class="px-6 py-4 text-right">${formatCurrency(lastYearData.spending)}</td>
                    <td class="px-6 py-4 text-right">${formatCurrency(currentYearData.spending)} ${formatDiff(currentYearData.spending, lastYearData.spending)}</td>
                </tr>
                <tr>
                    <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-brand-text-primary">Investimento</th>
                    <td class="px-6 py-4 text-right">${formatCurrency(lastYearData.investment)}</td>
                    <td class="px-6 py-4 text-right">${formatCurrency(currentYearData.investment)} ${formatDiff(currentYearData.investment, lastYearData.investment)}</td>
                </tr>
            </tbody>
        </table>
    `;
}

// --- STATISTICS DATA LOGIC ---
async function fetchAndRenderStatistics(year) {
    if (lastRenderedStatsYear === year) return;
    
    statisticsView.classList.add('animate-pulse');
    
    try {
        const fetchYearData = async (targetYear) => {
            const { data: budgets, error: budgetsError } = await db.from('financial_budgets').select('id, month, year').eq('user_id', loggedInUser.id).eq('year', targetYear);
            if (budgetsError) throw budgetsError;
            if (budgets.length === 0) return { monthlyData: Array.from({ length: 12 }, () => ({ income: 0, spending: 0, investment: 0, year: targetYear })), allTransactions: [], allBudgetItems: [] };

            const budgetIds = budgets.map(b => b.id);
            const budgetIdToMonthMap = new Map(budgets.map(b => [b.id, b.month]));
            const investmentCategory = allExpenseCategories.find(c => c.name === 'Investimentos');

            const [{ data: allIncome, error: incomeErr }, { data: allTransactions, error: txErr }, { data: allBudgetItems, error: itemsErr }] = await Promise.all([
                db.from('financial_income_entries').select('amount, budget_id').in('budget_id', budgetIds),
                db.from('financial_transactions').select('amount, category_id, budget_id').in('budget_id', budgetIds),
                db.from('financial_budget_items').select('*, expense_categories:financial_expense_categories(name)').in('budget_id', budgetIds),
            ]);

            if (incomeErr || txErr || itemsErr) throw (incomeErr || txErr || itemsErr);

            const monthlyData = Array.from({ length: 12 }, () => ({ income: 0, spending: 0, investment: 0, year: targetYear }));
            allIncome.forEach(entry => {
                const month = budgetIdToMonthMap.get(entry.budget_id);
                if (month) monthlyData[month - 1].income += Number(entry.amount);
            });
            allTransactions.forEach(tx => {
                const month = budgetIdToMonthMap.get(tx.budget_id);
                if (month) {
                    monthlyData[month - 1].spending += Number(tx.amount);
                    if (investmentCategory && tx.category_id === investmentCategory.id) {
                        monthlyData[month - 1].investment += Number(tx.amount);
                    }
                }
            });
            return { monthlyData, allTransactions, allBudgetItems };
        };

        if (allExpenseCategories.length === 0) {
            const { data, error } = await db.from('financial_expense_categories').select('*').eq('user_id', loggedInUser.id);
            if (error) throw error;
            allExpenseCategories = data;
        }

        const [{monthlyData: currentYearMonthlyData, allTransactions: allTransactionsForCurrentYear, allBudgetItems: allBudgetItemsForCurrentYear}, 
               {monthlyData: lastYearMonthlyData},
               {data: goals, error: goalsError}] = await Promise.all([
            fetchYearData(year),
            fetchYearData(year - 1),
            db.from('financial_goals').select('*').eq('user_id', loggedInUser.id)
        ]);
        
        if (goalsError) throw goalsError;
        
        const totalAnnualInvestment = currentYearMonthlyData.reduce((sum, data) => sum + data.investment, 0);
        const totalAnnualIncome = currentYearMonthlyData.reduce((sum, data) => sum + data.income, 0);
        const totalAnnualSpending = currentYearMonthlyData.reduce((sum, data) => sum + data.spending, 0);
        const annualData = {
            totalAnnualInvestment,
            totalAnnualSavings: totalAnnualIncome - totalAnnualSpending,
        };
        
        renderBehavioralStats(currentYearMonthlyData, allTransactionsForCurrentYear, allBudgetItemsForCurrentYear);
        renderFinancialScore(currentBudgetId ? { totalIncome: currentTotalIncome, totalPlanned: currentSpendingByCategory.reduce((s,c)=>s+c.planned,0), totalSpent: currentSpendingByCategory.reduce((s,c)=>s+c.real,0), spendingByCategory: currentSpendingByCategory } : null);
        renderMonthlyEvolutionChart(currentYearMonthlyData);
        renderHighlightMonths(currentYearMonthlyData, year);
        renderFutureProjection(currentYearMonthlyData);
        const currentDashboardMonth = parseInt(monthFilter.value, 10) - 1;
        renderYearOverYearComparison(currentYearMonthlyData[currentDashboardMonth], lastYearMonthlyData[currentDashboardMonth], currentDashboardMonth);
        renderGoals(goals, annualData);

        lastRenderedStatsYear = year;
    } catch (error) {
        console.error("Failed to fetch statistics:", error);
        statisticsView.innerHTML = `<div class="col-span-full text-red-400 bg-brand-card p-4 rounded-xl">Falha ao carregar as estatísticas: ${error.message}</div>`;
    } finally {
        statisticsView.classList.remove('animate-pulse');
    }
}


// --- VIEW SWITCHING LOGIC ---
function switchView(viewName) {
    if (viewName === activeView) return;
    activeView = viewName;

    dashboardView.classList.toggle('hidden', viewName !== 'dashboard');
    statisticsView.classList.toggle('hidden', viewName !== 'statistics');
    simulatorView.classList.toggle('hidden', viewName !== 'simulator');
    
    document.getElementById('month-filter').classList.toggle('invisible', viewName !== 'dashboard');
    
    navDashboardButton.classList.toggle('active', viewName === 'dashboard');
    navDashboardButton.classList.toggle('text-brand-text-secondary', viewName !== 'dashboard');

    navStatisticsButton.classList.toggle('active', viewName === 'statistics');
    navStatisticsButton.classList.toggle('text-brand-text-secondary', viewName !== 'statistics');

    navSimulatorButton.classList.toggle('active', viewName === 'simulator');
    navSimulatorButton.classList.toggle('text-brand-text-secondary', viewName !== 'simulator');
    
    if (viewName === 'statistics') {
        const selectedYear = parseInt(yearFilter.value, 10);
        fetchAndRenderStatistics(selectedYear);
    }
}


// --- EDIT MODE LOGIC ---

function toggleIncomeEditMode(editing) {
    isIncomeEditing = editing;
    editIncomeButton.classList.toggle('hidden', editing);
    incomeSaveCancelButtons.classList.toggle('hidden', !editing);
    renderIncome(currentIncomeData); 
}

function toggleCategoriesEditMode(editing) {
    isCategoryEditing = editing;
    editCategoriesButton.classList.toggle('hidden', editing);
    categorySaveCancelButtons.classList.toggle('hidden', !editing);
    renderCategoryCards(currentSpendingByCategory);
}

async function saveIncomeChanges() {
    showLoader(true);
    try {
        if (!currentBudgetId) throw new Error("ID do Orçamento não foi encontrado. Por favor, recarregue a página.");

        const sourceNameToIdMap = new Map(allIncomeSources.map(s => [s.name.toLowerCase(), s.id]));

        const entriesFromDom = [];
        document.querySelectorAll('.income-row').forEach(row => {
            const id = row.dataset.id ? parseInt(row.dataset.id, 10) : null;
            const isNew = row.classList.contains('new-income-row');
            
            const amountInput = row.querySelector('.income-amount-input, .income-input');
            const amount = parseFloat(amountInput.value) || 0;
            
            let sourceName = '';
            let sourceId = null;

            if (isNew) {
                const sourceNameInput = row.querySelector('.income-source-input');
                sourceName = sourceNameInput.value.trim();
            } else {
                const originalEntry = currentIncomeData.find(d => d.id === id);
                if (originalEntry) {
                    sourceId = originalEntry.source_id;
                }
            }
            
            if (sourceName || sourceId) {
                 entriesFromDom.push({
                    id: id,
                    isNew: isNew,
                    sourceName: sourceName,
                    sourceId: sourceId,
                    amount: amount,
                    isMidMonth: row.closest('#income-card-mid') !== null,
                });
            }
        });

        const sourcesToCreate = [...new Set(
            entriesFromDom
                .filter(e => e.isNew && e.sourceName && !sourceNameToIdMap.has(e.sourceName.toLowerCase()))
                .map(e => e.sourceName)
        )];
        
        if (sourcesToCreate.length > 0) {
            const newSourceRecords = sourcesToCreate.map(name => ({ name, user_id: loggedInUser.id }));
            const { data: createdSources, error } = await db.from('financial_income_sources').insert(newSourceRecords).select();
            if (error) throw new Error(`Erro ao criar nova(s) fonte(s) de receita: ${error.message}`);
            
            createdSources.forEach(s => {
                sourceNameToIdMap.set(s.name.toLowerCase(), s.id);
                allIncomeSources.push(s);
            });
        }
        
        const toInsert = [];
        const toUpdate = [];
        const currentIdsInDom = new Set(entriesFromDom.map(e => e.id).filter(Boolean));
        
        const selectedYear = parseInt(yearFilter.value, 10);
        const selectedMonth = parseInt(monthFilter.value, 10);

        for (const entry of entriesFromDom) {
            const day = entry.isMidMonth ? 15 : 28;
            const received_at = new Date(selectedYear, selectedMonth - 1, day).toISOString().split('T')[0];

            if (entry.isNew) {
                const finalSourceId = sourceNameToIdMap.get(entry.sourceName.toLowerCase());
                if (finalSourceId) {
                    toInsert.push({ budget_id: currentBudgetId, source_id: finalSourceId, amount: entry.amount, received_at });
                }
            } else {
                const originalEntry = currentIncomeData.find(d => d.id === entry.id);
                if (originalEntry && Math.abs(originalEntry.amount - entry.amount) > 0.001) {
                     toUpdate.push({
                        id: entry.id,
                        amount: entry.amount,
                        // Add required fields for robust upsert, in case it needs to INSERT
                        budget_id: currentBudgetId,
                        source_id: originalEntry.source_id,
                        received_at: originalEntry.received_at,
                     });
                }
            }
        }
        
        const originalIds = new Set(currentIncomeData.map(d => d.id));
        const deletedIds = [...originalIds].filter(id => !currentIdsInDom.has(id));
        
        const promises = [];
        if (deletedIds.length > 0) promises.push(db.from('financial_income_entries').delete().in('id', deletedIds));
        if (toUpdate.length > 0) promises.push(db.from('financial_income_entries').upsert(toUpdate));
        if (toInsert.length > 0) promises.push(db.from('financial_income_entries').insert(toInsert));

        const results = await Promise.all(promises);
        results.forEach(res => { if(res.error) throw res.error });
        
        toggleIncomeEditMode(false);
        await fetchAndRenderDashboard(currentBudgetId);
    } catch (error) {
        console.error("Failed to save income changes:", error);
        renderErrorState(`Erro ao salvar receitas: ${error.message}`);
    } finally {
        showLoader(false);
    }
}


async function saveCategoryChanges() {
    showLoader(true);
    try {
        if (!currentBudgetId) throw new Error("ID do Orçamento não foi encontrado.");

        const { data: existingCategories, error: fetchError } = await db.from('financial_expense_categories').select('id, name').eq('user_id', loggedInUser.id);
        if (fetchError) throw new Error(`Erro ao buscar categorias existentes: ${fetchError.message}`);
        const categoryNameToIdMap = new Map(existingCategories.map(c => [c.name.toLowerCase(), c.id]));

        const itemsFromDom = [];
        document.querySelectorAll('.category-card').forEach(card => {
            const id = card.dataset.id ? parseInt(card.dataset.id, 10) : null;
            const isNew = card.classList.contains('new-category-card');
            const plannedAmount = parseFloat(card.querySelector('.category-planned-input').value) || 0;
            const realAmount = parseFloat(card.querySelector('.category-real-input').value) || 0;
            let categoryName;
            let categoryId = card.dataset.categoryId ? parseInt(card.dataset.categoryId, 10) : null;

            if (isNew) {
                categoryName = card.querySelector('.category-name-input').value.trim();
            } else {
                categoryName = card.querySelector('h3').textContent.trim().split(' ').slice(1).join(' ');
            }
            itemsFromDom.push({ id, isNew, plannedAmount, realAmount, categoryName, categoryId });
        });

        const newCategoryNames = [...new Set(
            itemsFromDom
                .filter(item => item.isNew && item.categoryName && !categoryNameToIdMap.has(item.categoryName.toLowerCase()))
                .map(item => item.categoryName)
        )];

        if (newCategoryNames.length > 0) {
            const newCategoryRecords = newCategoryNames.map(name => ({ name, user_id: loggedInUser.id, type: 'nao-essencial' }));
            const { data: createdCategories, error } = await db.from('financial_expense_categories').insert(newCategoryRecords).select();
            if (error) throw new Error(`Erro ao criar nova(s) categoria(s): ${error.message}`);
            createdCategories.forEach(c => categoryNameToIdMap.set(c.name.toLowerCase(), c.id));
        }
        
        const itemsToUpsert = [];
        const transactionsToCreate = [];
        const categoryIdsInDom = new Set();
        
        for (const item of itemsFromDom) {
            const categoryId = item.isNew
                ? categoryNameToIdMap.get(item.categoryName.toLowerCase())
                : item.categoryId;
            
            if (categoryId) {
                categoryIdsInDom.add(categoryId);
                itemsToUpsert.push({
                    id: item.isNew ? undefined : item.id,
                    budget_id: currentBudgetId,
                    category_id: categoryId,
                    planned_amount: item.plannedAmount,
                });
                if (item.realAmount > 0) {
                     transactionsToCreate.push({
                         budget_id: currentBudgetId,
                         category_id: categoryId,
                         amount: item.realAmount,
                         description: 'Ajuste de Gasto Real'
                     });
                }
            }
        }
        
        const originalCategoryIds = new Set(currentSpendingByCategory.map(cat => cat.category_id));
        const deletedCategoryIds = [...originalCategoryIds].filter(id => !categoryIdsInDom.has(id));
        
        const categoriesToClearTransactions = [...new Set([...deletedCategoryIds, ...itemsToUpsert.map(i => i.category_id)])];
        if (categoriesToClearTransactions.length > 0) {
            const { error } = await db.from('financial_transactions').delete().eq('budget_id', currentBudgetId).in('category_id', categoriesToClearTransactions);
            if(error) throw error;
        }

        if (deletedCategoryIds.length > 0) {
             const { error } = await db.from('financial_budget_items').delete().eq('budget_id', currentBudgetId).in('category_id', deletedCategoryIds);
             if(error) throw error;
        }
        
        if (itemsToUpsert.length > 0) {
             const { error } = await db.from('financial_budget_items').upsert(itemsToUpsert, { onConflict: 'budget_id, category_id', ignoreDuplicates: false });
             if(error) throw error;
        }

        if (transactionsToCreate.length > 0) {
            const { error } = await db.from('financial_transactions').insert(transactionsToCreate);
            if(error) throw error;
        }
        
        toggleCategoriesEditMode(false);
        await fetchAndRenderDashboard(currentBudgetId);
        lastRenderedStatsYear = null; // Force refresh
        await fetchAndRenderStatistics(parseInt(yearFilter.value, 10));

    } catch (error) {
        console.error("Failed to save category changes:", error);
        renderErrorState(`Erro ao salvar orçamento: ${error.message || error}`);
    } finally {
        showLoader(false);
    }
}


function handleIncomeEditEvents(e) {
    if (!isIncomeEditing) return;

    const removeBtn = e.target.closest('.remove-income-item');
    if (removeBtn) {
        removeBtn.closest('.income-row').remove();
        return; 
    }
    
    const addBtn = e.target.closest('.add-income-item');
    if (addBtn) {
        const newRow = document.createElement('div');
        newRow.className = 'flex justify-between items-center text-sm income-row new-income-row gap-2';
        newRow.innerHTML = `
           <div class="flex items-center gap-2 flex-grow">
               <button class="remove-income-item text-brand-red hover:text-red-400 transition-colors p-1 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
               <input 
                  type="text" 
                  class="income-source-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-full"
                  placeholder="Nome da Receita"
               />
            </div>
            <input 
              type="number" 
              class="income-amount-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-28 text-right"
              value="0.00"
              step="0.01"
           />
        `;
        const container = addBtn.closest('.bg-brand-card').querySelector('.income-list-container');
        container.appendChild(newRow);
        newRow.querySelector('.income-source-input').focus();
    }
}

function handleCategoryEditEvents(e) {
    if (!isCategoryEditing) return;

    const removeBtn = e.target.closest('.remove-category-item');
    if (removeBtn) {
        removeBtn.closest('.category-card').remove();
        return;
    }
    
    const addBtn = e.target.closest('.add-category-item');
    if (addBtn) {
        const newCard = document.createElement('div');
        newCard.className = 'bg-brand-card p-6 rounded-xl category-card new-category-card';
        newCard.dataset.categoryId = ''; 
        newCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-2 flex-grow">
                    <button class="remove-category-item text-brand-red hover:text-red-400 p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    <input type="text" class="category-name-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-full font-semibold" placeholder="Nome da Categoria">
                </div>
            </div>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center"><span class="text-brand-text-secondary">Porcentagem</span>
                    <div class="flex items-center">
                        <input type="number" class="category-percentage-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-20 text-right font-bold" value="0" step="1" min="0" max="100">
                        <span class="ml-1 font-bold">%</span>
                    </div>
                </div>
                <div class="flex justify-between items-center"><span class="text-brand-text-secondary">Planejado</span>
                    <input type="number" class="category-planned-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-32 text-right font-bold" value="0.00" step="0.01">
                </div>
                <div class="flex justify-between items-center"><span class="text-brand-text-secondary">Gasto Real</span>
                     <input type="number" class="category-real-input bg-slate-700 border border-slate-600 text-brand-text-primary rounded-md px-2 py-1 w-32 text-right font-bold" value="0.00" step="0.01">
                </div>
            </div>
            <div class="mt-4">
                <div class="bg-slate-700 rounded-full h-2 w-full"><div class="bg-brand-green rounded-full h-2" style="width: 0%"></div></div>
                <p class="text-xs text-brand-text-secondary mt-2">Nova categoria. Salve para ver a análise.</p>
            </div>
        `;
        const container = document.getElementById('category-cards-container');
        const addButtonContainer = container.querySelector('.add-category-button-container');
        if(addButtonContainer) {
            container.insertBefore(newCard, addButtonContainer);
        } else {
            container.appendChild(newCard);
        }
        newCard.querySelector('.category-name-input').focus();
    }
}

// --- SIMULATOR LOGIC ---
function handleCalculateFutureValue() {
    const monthlyDeposit = parseFloat(document.getElementById('monthly-deposit').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
    const timePeriod = parseInt(document.getElementById('time-period').value, 10) || 0;

    let futureValue = 0;
    if (interestRate === 0) {
        futureValue = monthlyDeposit * timePeriod;
    } else {
        const i = interestRate / 100;
        futureValue = monthlyDeposit * ((((1 + i) ** timePeriod) - 1) / i);
    }
    
    const resultElement = document.getElementById('future-value-result');
    resultElement.querySelector('p:last-child').textContent = formatCurrency(futureValue);
}

function handleCalculateRequiredDeposit() {
    const goalAmount = parseFloat(document.getElementById('goal-amount').value) || 0;
    const interestRate = parseFloat(document.getElementById('goal-interest-rate').value) || 0;
    const timePeriod = parseInt(document.getElementById('goal-time-period').value, 10) || 0;

    let requiredDeposit = 0;
    if (timePeriod > 0) {
        if (interestRate === 0) {
            requiredDeposit = goalAmount / timePeriod;
        } else {
            const i = interestRate / 100;
            requiredDeposit = goalAmount * (i / (((1 + i) ** timePeriod) - 1));
        }
    }

    const resultElement = document.getElementById('required-deposit-result');
    resultElement.querySelector('p:last-child').textContent = formatCurrency(requiredDeposit);
}

// --- GOAL CRUD & MODAL LOGIC ---
function openGoalModal() {
    addGoalModal.classList.remove('hidden');
}

function closeGoalModal() {
    addGoalModal.classList.add('hidden');
    addGoalFormModal.reset();
}

async function handleAddGoal(e) {
    e.preventDefault();
    const description = document.getElementById('goal-description-modal').value.trim();
    const goal_type = document.getElementById('goal-type-modal').value;
    const target_amount = parseFloat(document.getElementById('goal-target-amount-modal').value);
    const target_date = document.getElementById('goal-target-date-modal').value;

    if (!description || !target_amount || !target_date) {
        alert('Por favor, preencha todos os campos da meta.');
        return;
    }

    try {
        const { error } = await db.from('financial_goals').insert({
            description,
            goal_type,
            target_amount,
            target_date,
            user_id: loggedInUser.id,
        });
        if (error) throw error;
        closeGoalModal();
        await fetchAndRenderStatistics(parseInt(yearFilter.value, 10));
    } catch(error) {
        console.error("Error adding goal:", error);
        alert(`Não foi possível adicionar a meta: ${error.message}`);
    }
}

async function handleDeleteGoal(e) {
    const deleteButton = e.target.closest('.delete-goal-button');
    if (!deleteButton) return;

    const goalId = deleteButton.dataset.id;
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;

    try {
        const { error } = await db.from('financial_goals').delete().eq('id', goalId).eq('user_id', loggedInUser.id);
        if (error) throw error;
        await fetchAndRenderStatistics(parseInt(yearFilter.value, 10));
    } catch(error) {
        console.error("Error deleting goal:", error);
        alert(`Não foi possível excluir a meta: ${error.message}`);
    }
}


// --- INITIALIZATION & FILTER LOGIC ---
function populateFilters() {
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const currentMonth = new Date().getMonth();
  monthFilter.innerHTML = months.map((month, index) => `<option value="${index + 1}" ${index === currentMonth ? 'selected' : ''}>${month}</option>`).join('');

  const currentYear = new Date().getFullYear();
  let yearOptions = '';
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    yearOptions += `<option value="${i}" ${i === currentYear ? 'selected' : ''}>${i}</option>`;
  }
  yearFilter.innerHTML = yearOptions;
}

async function createBlankBudgetForPeriod(month, year) {
  const { data: budget, error: budgetError } = await db.from('financial_budgets').insert({
      month,
      year,
      user_id: loggedInUser.id,
  }).select().single();
  if (budgetError) throw new Error(`Erro ao criar novo orçamento: ${budgetError.message}`);

  const { data: categories, error: catError } = await db.from('financial_expense_categories').select('id').eq('user_id', loggedInUser.id);
  if (catError) throw new Error(`Erro ao buscar categorias para novo orçamento: ${catError.message}`);

  if (categories && categories.length > 0) {
    const newBudgetItems = categories.map(cat => ({
      budget_id: budget.id,
      category_id: cat.id,
      planned_amount: 0,
    }));
    const { error: itemsError } = await db.from('financial_budget_items').insert(newBudgetItems);
    if (itemsError) throw itemsError;
  }
  
  return budget.id;
}

async function findOrCreateBudgetForPeriod(month, year) {
  const { data, error } = await db.from('financial_budgets').select('id')
      .eq('user_id', loggedInUser.id)
      .eq('month', month)
      .eq('year', year)
      .limit(1)
      .single();

  if (error && error.code !== 'PGRST116') { 
      throw new Error(`Falha ao verificar orçamento existente: ${error.message}`);
  }
  
  if (data) {
      return data.id;
  }
  
  return await createBlankBudgetForPeriod(month, year);
}

async function handleFilterChange() {
    showLoader(true);
    try {
        const selectedYear = parseInt(yearFilter.value, 10);
        if (activeView === 'dashboard') {
            const selectedMonth = parseInt(monthFilter.value, 10);
            const budgetId = await findOrCreateBudgetForPeriod(selectedMonth, selectedYear);
            await fetchAndRenderDashboard(budgetId);
        }
        
        lastRenderedStatsYear = null; 
        if (activeView === 'statistics') {
            await fetchAndRenderStatistics(selectedYear);
        }
    } catch (error) {
        console.error("Failed to load data for selected period:", error);
        renderErrorState(error.message);
    } finally {
        showLoader(false);
    }
}

async function initializeDashboard() {
    try {
        populateFilters();
        await handleFilterChange();
    } catch (error) {
        console.error("Dashboard initialization failed:", error);
        renderErrorState(error.message);
    } finally {
        showLoader(false);
    }
}

function startApp() {
    initializeDashboard();

    // --- MAIN EVENT LISTENERS ---
    monthFilter.addEventListener('change', handleFilterChange);
    yearFilter.addEventListener('change', handleFilterChange);

    // --- VIEW SWITCHING LISTENERS ---
    navDashboardButton.addEventListener('click', () => switchView('dashboard'));
    navStatisticsButton.addEventListener('click', () => switchView('statistics'));
    navSimulatorButton.addEventListener('click', () => switchView('simulator'));
    
    // Edit Income
    document.getElementById('income-section-wrapper').addEventListener('click', handleIncomeEditEvents);
    editIncomeButton.addEventListener('click', () => toggleIncomeEditMode(true));
    cancelIncomeButton.addEventListener('click', () => {
        toggleIncomeEditMode(false);
        fetchAndRenderDashboard(currentBudgetId);
    });
    saveIncomeButton.addEventListener('click', saveIncomeChanges);
    
    // Edit Categories
    const categorySection = document.getElementById('category-section-wrapper');
    categorySection.addEventListener('click', (e) => {
        if (isCategoryEditing) handleCategoryEditEvents(e);
    });
    
    categorySection.addEventListener('input', (e) => {
        if (!isCategoryEditing) return;
        const card = e.target.closest('.category-card');
        if (!card) return;
        if (e.target.matches('.category-planned-input')) {
            const plannedValue = parseFloat(e.target.value) || 0;
            const percInput = card.querySelector('.category-percentage-input');
            if (percInput && currentTotalIncome > 0) {
                percInput.value = ((plannedValue / currentTotalIncome) * 100).toFixed(0);
            } else if (percInput) {
                percInput.value = '0';
            }
        } else if (e.target.matches('.category-percentage-input')) {
            const percentageValue = parseFloat(e.target.value) || 0;
            const plannedInput = card.querySelector('.category-planned-input');
            if (plannedInput) {
                plannedInput.value = (currentTotalIncome * (percentageValue / 100)).toFixed(2);
            }
        }
    });

    editCategoriesButton.addEventListener('click', () => toggleCategoriesEditMode(true));
    cancelCategoriesButton.addEventListener('click', () => {
        toggleCategoriesEditMode(false);
        fetchAndRenderDashboard(currentBudgetId);
    });
    saveCategoriesButton.addEventListener('click', saveCategoryChanges);

    // --- SIMULATOR EVENT LISTENERS ---
    calculateFutureValueButton.addEventListener('click', handleCalculateFutureValue);
    calculateRequiredDepositButton.addEventListener('click', handleCalculateRequiredDeposit);
    
    // --- STATISTICS & GOAL MODAL EVENT LISTENERS ---
    addGoalButton.addEventListener('click', openGoalModal);
    closeGoalModalButton.addEventListener('click', closeGoalModal);
    cancelGoalModalButton.addEventListener('click', closeGoalModal);
    addGoalFormModal.addEventListener('submit', handleAddGoal);
    goalsListContainer.addEventListener('click', handleDeleteGoal);
}

async function handleLogin(e) {
    e.preventDefault();
    loginError.classList.add('hidden');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        loginError.textContent = 'Usuário e senha são obrigatórios.';
        loginError.classList.remove('hidden');
        return;
    }

    try {
        const { data: user, error } = await db
            .from('financial_users')
            .select('*')
            .eq('username', username)
            .eq('password', password) // In a real app, the password must be hashed!
            .single();

        // Case 1: Supabase returns a "clean" error (e.g., user not found)
        if (error) {
            if (error.code === 'PGRST116') { // "Not Found" because .single() failed
                loginError.textContent = 'Usuário ou senha inválidos.';
                loginError.classList.remove('hidden');
                return;
            }
            // For other known DB errors, throw them to be handled by the catch block
            throw error;
        } 
        
        // Case 2: Successful login
        if (user) {
            loggedInUser = user;
            document.getElementById('user-greeting').textContent = `Bem-vindo(a), ${user.username}!`;
            loginView.classList.add('hidden');
            appContainer.classList.remove('hidden');
            startApp();
        } else {
            // This case is a fallback, usually covered by error.code PGRST116
            loginError.textContent = 'Usuário ou senha inválidos.';
            loginError.classList.remove('hidden');
        }

    } catch (err) {
        // Case 3: A runtime error occurred (network, config, unexpected DB error)
        console.error('Login error object:', err);
        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';

        if (err && typeof err === 'object') {
            // Most specific errors first
            if (err.code === '42P01') { // undefined_table
                errorMessage = 'Erro de Configuração: A tabela de usuários (`financial_users`) não foi encontrada. Por favor, execute o script SQL mais recente para criar as tabelas.';
            } 
            // Handle network errors (often show up as "Failed to fetch")
            else if (typeof err.message === 'string' && err.message.toLowerCase().includes('failed to fetch')) {
                errorMessage = 'Erro de Conexão: Não foi possível se comunicar com o banco de dados. Verifique sua conexão com a internet e as configurações do Supabase (URL/Chave).';
            }
            // Generic handler for other PostgREST errors that have a message
            else if (typeof err.message === 'string' && err.message) {
                errorMessage = `Erro no Servidor: ${err.message}`;
            } 
            // Fallback for errors that might only have a details
            else if (typeof err.details === 'string' && err.details) {
                errorMessage = `Detalhes do Erro: ${err.details}`;
            }
        } else if (typeof err === 'string' && err) {
            errorMessage = err;
        }

        loginError.textContent = errorMessage;
        loginError.classList.remove('hidden');
    }
}


function handleLogout() {
    loggedInUser = null;
    appContainer.classList.add('hidden');
    loginView.classList.remove('hidden');
    loginForm.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    if(loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    if(logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});
