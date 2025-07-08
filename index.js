
import { createClient } from '@supabase/supabase-js';

// --- SETUP ---
const SUPABASE_URL = 'https://snqlviehipbgswztrwhw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucWx2aWVoaXBiZ3N3enRyd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTU5MzIsImV4cCI6MjA2NzQ3MTkzMn0.n8aaWZfg81hD9Fr26pFQcR33brpdzMpUMkkna61V2nI';
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// A static, unique ID for demonstration data. This bypasses the need for user authentication.
const DEMO_USER_ID = 'a7a3a8e4-1d3c-4d24-9a25-3e28a9b2b543'; 

// --- DOM ELEMENTS ---
const loader = document.getElementById('loader-container');
const dashboardContent = document.getElementById('dashboard-content');
const monthFilter = document.getElementById('month-filter');
const yearFilter = document.getElementById('year-filter');

// --- EDIT MODE ELEMENTS ---
const editIncomeButton = document.getElementById('edit-income-button');
const saveIncomeButton = document.getElementById('save-income-button');
const cancelIncomeButton = document.getElementById('cancel-income-button');
const incomeSaveCancelButtons = document.getElementById('income-save-cancel-buttons');

const editCategoriesButton = document.getElementById('edit-categories-button');
const saveCategoriesButton = document.getElementById('save-categories-button');
const cancelCategoriesButton = document.getElementById('cancel-categories-button');
const categorySaveCancelButtons = document.getElementById('category-save-cancel-buttons');


// --- EDIT STATE ---
let isIncomeEditing = false;
let isCategoryEditing = false;
let currentIncomeData = [];
let allIncomeSources = [];
let allExpenseCategories = [];
let currentSpendingByCategory = [];
let currentBudgetId = null; // Store the current budget ID
let currentTotalIncome = 0;


// --- UTILITY FUNCTIONS ---
const formatCurrency = (value) => {
  if (typeof value !== 'number') value = 0;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const showLoader = (show) => {
  loader.classList.toggle('hidden', !show);
  dashboardContent.classList.toggle('hidden', show);
};

// --- RENDER FUNCTIONS ---
function renderErrorState(message) {
   dashboardContent.innerHTML = `<div class="bg-red-900 border border-red-700 text-red-200 p-6 rounded-xl text-center max-w-3xl mx-auto">
      <h2 class="font-bold text-lg mb-2">Ocorreu um Erro Inesperado</h2>
      <p class="font-mono text-sm bg-slate-900 p-2 rounded">${message}</p>
      <p class="mt-4 text-red-300 text-sm">Se o erro persistir, pode ser necessário ajustar a base de dados. Tente atualizar a página ou selecionar outro período.</p>
    </div>`;
   showLoader(false);
}

function renderIncome(entries) {
  const midMonthEntries = entries.filter(e => new Date(e.received_at + 'T00:00:00').getDate() <= 15);
  const endMonthEntries = entries.filter(e => new Date(e.received_at + 'T00:00:00').getDate() > 15);

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

    return `
      <div class="flex justify-between items-baseline mb-4">
        <h3 class="font-semibold text-brand-text-primary">${title}</h3>
        <span class="text-xs text-brand-green font-semibold">${title === 'Meio do Mês' ? '15º dia' : '30º dia'}</span>
      </div>
      <div class="space-y-3 flex-grow income-list-container">${listItems}</div>
      ${addIncomeButtonHTML}
      <div class="border-t border-slate-700 mt-4 pt-3 flex justify-between font-bold">
        <span class="text-brand-text-primary">Total</span>
        <span class="text-brand-green">${formatCurrency(total)}</span>
      </div>
    `;
  };
  
  document.getElementById('income-card-mid').innerHTML = createIncomeCardHTML('Meio do Mês', midMonthEntries, 'mid');
  document.getElementById('income-card-end').innerHTML = createIncomeCardHTML('Fim do Mês', endMonthEntries, 'end');
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
      'Investimentos': '📈',
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


// --- DATA LOGIC ---

async function fetchAndRenderDashboard(budgetId) {
  console.log("Fetching and rendering dashboard for budget:", budgetId);
  currentBudgetId = budgetId;
  try {
    if (!budgetId) {
      throw new Error("ID do Orçamento não fornecido. Não é possível renderizar o dashboard.");
    }
    
    // Fetch all required data in simpler, separate queries to improve reliability
    const { data: incomeEntriesData, error: incomeError } = await db.from('income_entries').select('*').eq('budget_id', budgetId);
    if (incomeError) throw new Error(`Erro ao buscar receitas: ${incomeError.message}`);
    
    const { data: incomeSources, error: sourcesError } = await db.from('income_sources').select('*').eq('user_id', DEMO_USER_ID);
    if(sourcesError) throw new Error(`Erro ao buscar fontes de receita: ${sourcesError.message}`);
    allIncomeSources = incomeSources;

    const { data: expenseCategories, error: expenseCatError } = await db.from('expense_categories').select('*').eq('user_id', DEMO_USER_ID);
    if (expenseCatError) throw new Error(`Erro ao buscar categorias de despesa: ${expenseCatError.message}`);
    allExpenseCategories = expenseCategories;
    
    const incomeSourceMap = Object.fromEntries(incomeSources.map(s => [s.id, s]));
    
    const { data: budgetItemsData, error: budgetItemsError } = await db.from('budget_items').select('*, expense_categories(*)').eq('budget_id', budgetId);
    if (budgetItemsError) throw new Error(`Erro ao buscar itens do orçamento: ${budgetItemsError.message}`);
    
    const { data: transactionsData, error: transactionsError } = await db.from('transactions').select('*').eq('budget_id', budgetId);
    if (transactionsError) throw new Error(`Erro ao buscar transações: ${transactionsError.message}`);

    // Join data on the client side
    const fullIncomeData = incomeEntriesData.map(entry => ({
        ...entry,
        income_sources: incomeSourceMap[entry.source_id]
    }));
    
    const totalIncome = fullIncomeData.reduce((acc, entry) => acc + Number(entry.amount), 0);
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
    
    currentIncomeData = JSON.parse(JSON.stringify(fullIncomeData));
    currentSpendingByCategory = JSON.parse(JSON.stringify(spendingByCategory));

    renderIncome(fullIncomeData);
    renderMainCards(totalIncome, remainingBalance);
    renderCategoryCards(spendingByCategory);
    renderVisualizations(spendingByCategory, totalPlanned);
    renderSummary(totalPlanned, totalSpent, variation);
    
    console.log("Dashboard rendered successfully.");

  } catch (error) {
    throw error;
  }
}

// --- EDIT MODE LOGIC ---

function toggleIncomeEditMode(editing) {
    isIncomeEditing = editing;
    editIncomeButton.classList.toggle('hidden', editing);
    incomeSaveCancelButtons.classList.toggle('hidden', !editing);
    renderIncome(currentIncomeData); // Re-render the income section
}

function toggleCategoriesEditMode(editing) {
    isCategoryEditing = editing;
    editCategoriesButton.classList.toggle('hidden', editing);
    categorySaveCancelButtons.classList.toggle('hidden', !editing);
    renderCategoryCards(currentSpendingByCategory); // Re-render the category section
}

async function saveIncomeChanges() {
    showLoader(true);
    try {
        if (!currentBudgetId) throw new Error("ID do Orçamento não foi encontrado. Por favor, recarregue a página.");

        // Create a map for quick lookups of existing sources and add to it dynamically
        const sourceNameToIdMap = new Map(allIncomeSources.map(s => [s.name.toLowerCase(), s.id]));

        // --- Step 1: Collect all changes from the DOM ---
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
            
            // Allow saving if it's an existing entry OR a new entry with a name.
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

        // --- Step 2: Create any new income sources needed ---
        const sourcesToCreate = [...new Set(
            entriesFromDom
                .filter(e => e.isNew && e.sourceName && !sourceNameToIdMap.has(e.sourceName.toLowerCase()))
                .map(e => e.sourceName)
        )];
        
        if (sourcesToCreate.length > 0) {
            const newSourceRecords = sourcesToCreate.map(name => ({ name, user_id: DEMO_USER_ID }));
            const { data: createdSources, error } = await db.from('income_sources').insert(newSourceRecords).select();
            if (error) throw new Error(`Erro ao criar nova(s) fonte(s) de receita: ${error.message}`);
            
            createdSources.forEach(s => {
                sourceNameToIdMap.set(s.name.toLowerCase(), s.id);
                allIncomeSources.push(s);
            });
        }
        
        // --- Step 3: Prepare batch operations (insert, update, delete) ---
        const toInsert = [];
        const toUpdate = [];
        const currentIdsInDom = new Set();
        
        const now = new Date();
        for (const entry of entriesFromDom) {
            const received_at = (entry.isMidMonth
                ? new Date(now.getFullYear(), now.getMonth(), 15)
                : new Date(now.getFullYear(), now.getMonth(), 28)
            ).toISOString().split('T')[0];

            if (entry.isNew) {
                const finalSourceId = sourceNameToIdMap.get(entry.sourceName.toLowerCase());
                if (finalSourceId) {
                    toInsert.push({ budget_id: currentBudgetId, source_id: finalSourceId, amount: entry.amount, received_at });
                }
            } else {
                currentIdsInDom.add(entry.id);
                const originalEntry = currentIncomeData.find(d => d.id === entry.id);
                if (originalEntry && Math.abs(originalEntry.amount - entry.amount) > 0.001) {
                     toUpdate.push({
                        id: entry.id,
                        amount: entry.amount,
                        budget_id: originalEntry.budget_id,
                        source_id: originalEntry.source_id,
                        received_at: originalEntry.received_at
                     });
                }
            }
        }
        
        const deletedIds = [...originalIds].filter(id => !currentIdsInDom.has(id));
        
        // --- Step 4: Execute DB operations ---
        if (deletedIds.length > 0) {
            const { error } = await db.from('income_entries').delete().in('id', deletedIds);
            if (error) throw new Error(`Falha ao remover receitas: ${error.message}`);
        }
        if (toUpdate.length > 0) {
            const { error } = await db.from('income_entries').upsert(toUpdate);
            if (error) throw new Error(`Falha ao atualizar receitas: ${error.message}`);
        }
        if (toInsert.length > 0) {
            const { error } = await db.from('income_entries').insert(toInsert);
            if (error) throw new Error(`Falha ao adicionar novas receitas: ${error.message}`);
        }
        
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

        // Fetch the latest category list to ensure we have all IDs.
        const { data: existingCategories, error: fetchError } = await db.from('expense_categories').select('id, name').eq('user_id', DEMO_USER_ID);
        if (fetchError) throw new Error(`Erro ao buscar categorias existentes: ${fetchError.message}`);
        const categoryNameToIdMap = new Map(existingCategories.map(c => [c.name.toLowerCase(), c.id]));

        // --- 1. Collect all data and intentions from the DOM ---
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

        // --- 2. Create new categories if necessary (must happen before main save) ---
        const newCategoryNames = [...new Set(
            itemsFromDom
                .filter(item => item.isNew && item.categoryName && !categoryNameToIdMap.has(item.categoryName.toLowerCase()))
                .map(item => item.categoryName)
        )];

        if (newCategoryNames.length > 0) {
            const newCategoryRecords = newCategoryNames.map(name => ({ name, user_id: DEMO_USER_ID, type: 'nao-essencial' }));
            const { data: createdCategories, error } = await db.from('expense_categories').insert(newCategoryRecords).select();
            if (error) throw new Error(`Erro ao criar nova(s) categoria(s): ${error.message}`);
            createdCategories.forEach(c => categoryNameToIdMap.set(c.name.toLowerCase(), c.id));
        }
        
        const promises = [];

        // --- 3. Handle Deletions ---
        const categoryIdsInDom = new Set(itemsFromDom.map(item => item.categoryId).filter(Boolean));
        const categoriesToDelete = currentSpendingByCategory
            .filter(cat => !categoryIdsInDom.has(cat.category_id))
            .map(cat => cat.category_id);

        if (categoriesToDelete.length > 0) {
            for (const catId of categoriesToDelete) {
                promises.push(db.rpc('remove_category_from_budget', { p_budget_id: currentBudgetId, p_category_id: catId }));
            }
        }

        // --- 4. Handle Updates/Creations via a single atomic RPC call ---
        const budgetItemsPayload = itemsFromDom
            .map(item => {
                const categoryId = item.isNew
                    ? categoryNameToIdMap.get(item.categoryName.toLowerCase())
                    : item.categoryId;
                
                if (!categoryId) return null; // Skip if no valid category ID

                return {
                    category_id: categoryId,
                    planned_amount: item.plannedAmount,
                    real_amount: item.realAmount
                };
            })
            .filter(Boolean); // Remove nulls

        if (budgetItemsPayload.length > 0) {
            promises.push(db.rpc('save_all_budget_changes', {
                p_budget_id: currentBudgetId,
                p_items_to_update: budgetItemsPayload
            }));
        }

        // --- 5. Execute all database operations and check for errors ---
        const results = await Promise.all(promises);
        for (const res of results) {
            if (res.error) {
                // Throw the first error encountered
                throw new Error(`Database operation failed: ${res.error.message}`);
            }
        }

        // --- 6. Final success step: toggle mode and refresh UI ---
        toggleCategoriesEditMode(false);
        await fetchAndRenderDashboard(currentBudgetId);

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
        newCard.dataset.categoryId = ''; // No category ID yet
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
            container.appendChild(newCard); // Fallback
        }
        newCard.querySelector('.category-name-input').focus();
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
  console.log(`Creating new blank budget for ${month}/${year}`);
  // 1. Create budget entry
  const { data: budget, error: budgetError } = await db.from('budgets').insert({
      month,
      year,
      user_id: DEMO_USER_ID,
  }).select().single();
  if (budgetError) throw new Error(`Erro ao criar novo orçamento: ${budgetError.message}`);

  // 2. Get user's expense categories
  const { data: categories, error: catError } = await db.from('expense_categories').select('id').eq('user_id', DEMO_USER_ID);
  if (catError) throw new Error(`Erro ao buscar categorias para novo orçamento: ${catError.message}`);

  // 3. Create budget items with 0 planned amount
  if (categories && categories.length > 0) {
    const newBudgetItems = categories.map(cat => ({
      budget_id: budget.id,
      category_id: cat.id,
      planned_amount: 0,
    }));
    const { error: itemsError } = await db.from('budget_items').insert(newBudgetItems);
    if (itemsError) throw itemsError;
  }
  
  console.log(`Blank budget created successfully with id: ${budget.id}`);
  return budget.id;
}

async function findOrCreateBudgetForPeriod(month, year) {
  const { data, error } = await db.from('budgets').select('id')
      .eq('user_id', DEMO_USER_ID)
      .eq('month', month)
      .eq('year', year)
      .limit(1);

  if (error) throw new Error(`Falha ao verificar orçamento existente: ${error.message}`);
  
  if (data && data.length > 0) {
      console.log(`Found existing budget for ${month}/${year} with id: ${data[0].id}`);
      return data[0].id;
  } else {
      return await createBlankBudgetForPeriod(month, year);
  }
}

async function handleFilterChange() {
    showLoader(true);
    try {
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;
        const budgetId = await findOrCreateBudgetForPeriod(selectedMonth, selectedYear);
        await fetchAndRenderDashboard(budgetId);
    } catch (error) {
        console.error("Failed to load dashboard for selected period:", error);
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
        showLoader(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();

    monthFilter.addEventListener('change', handleFilterChange);
    yearFilter.addEventListener('change', handleFilterChange);
    
    // Add listeners for edit functionality
    document.getElementById('income-section-wrapper').addEventListener('click', handleIncomeEditEvents);
    editIncomeButton.addEventListener('click', () => toggleIncomeEditMode(true));
    cancelIncomeButton.addEventListener('click', () => {
        toggleIncomeEditMode(false);
        fetchAndRenderDashboard(currentBudgetId); // Discard changes by re-rendering
    });
    saveIncomeButton.addEventListener('click', saveIncomeChanges);
    
    // Combined listener for all category card interactions
    const categorySection = document.getElementById('category-section-wrapper');
    categorySection.addEventListener('click', (e) => {
        if (isCategoryEditing) {
            handleCategoryEditEvents(e);
        }
    });
    
    // Listener for live input changes in category edit mode
    categorySection.addEventListener('input', (e) => {
        if (!isCategoryEditing) return;

        const card = e.target.closest('.category-card');
        if (!card) return;

        if (e.target.matches('.category-planned-input')) {
            // User edits a PLANNED amount: update its percentage based on total income
            const plannedValue = parseFloat(e.target.value) || 0;
            const percInput = card.querySelector('.category-percentage-input');
            if (percInput && currentTotalIncome > 0) {
                const newPercentage = (plannedValue / currentTotalIncome) * 100;
                percInput.value = newPercentage.toFixed(0);
            } else if (percInput) {
                percInput.value = '0';
            }
        } else if (e.target.matches('.category-percentage-input')) {
            // User edits a PERCENTAGE: update its PLANNED amount based on total income
            const percentageValue = parseFloat(e.target.value) || 0;
            const plannedInput = card.querySelector('.category-planned-input');
            if (plannedInput) {
                const newPlannedValue = currentTotalIncome * (percentageValue / 100);
                plannedInput.value = newPlannedValue.toFixed(2);
            }
        }
    });

    editCategoriesButton.addEventListener('click', () => toggleCategoriesEditMode(true));
    cancelCategoriesButton.addEventListener('click', () => {
        toggleCategoriesEditMode(false);
        fetchAndRenderDashboard(currentBudgetId); // Discard changes by re-rendering
    });
    saveCategoriesButton.addEventListener('click', saveCategoryChanges);
});
