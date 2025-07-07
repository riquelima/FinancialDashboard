
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ExpenseCategory } from "@shared/schema";
import type { ChartConfig } from '@/components/ui/chart';

interface VisualAnalysisProps {
  categories: ExpenseCategory[];
}

export default function VisualAnalysis({ categories }: VisualAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare pie chart data
  const pieData = categories.map(category => {
    let label = '';
    switch (category.categoryType) {
      case 'essential':
        label = 'Essenciais';
        break;
      case 'investments':
        label = 'Investimentos';
        break;
      case 'non_essential':
        label = 'Não Essenciais';
        break;
      case 'leisure':
        label = 'Torrar';
        break;
    }
    return {
      name: label,
      value: category.percentage,
      categoryType: category.categoryType,
    };
  });

  // Prepare bar chart data
  const barData = categories.map(category => {
    let label = '';
    switch (category.categoryType) {
      case 'essential':
        label = 'Essenciais';
        break;
      case 'investments':
        label = 'Investimentos';
        break;
      case 'non_essential':
        label = 'Não Essenciais';
        break;
      case 'leisure':
        label = 'Torrar';
        break;
    }
    return {
      name: label,
      planejado: parseFloat(category.plannedAmount),
      real: parseFloat(category.actualAmount),
    };
  });

  const pieColors = {
    essential: '#3B82F6',    // Blue
    investments: '#10B981',  // Green
    non_essential: '#F59E0B', // Amber
    leisure: '#8B5CF6',      // Purple
  };

  const chartConfig: ChartConfig = {
    essential: {
      label: "Essenciais",
      color: pieColors.essential,
    },
    investments: {
      label: "Investimentos", 
      color: pieColors.investments,
    },
    non_essential: {
      label: "Não Essenciais",
      color: pieColors.non_essential,
    },
    leisure: {
      label: "Torrar",
      color: pieColors.leisure,
    },
    planejado: {
      label: "Planejado",
      color: "#3B82F6",
    },
    real: {
      label: "Real",
      color: "#10B981",
    },
  };

  const getLegendData = () => [
    { name: 'Essenciais (70%)', color: pieColors.essential },
    { name: 'Investimentos (17%)', color: pieColors.investments },
    { name: 'Não Essenciais (8%)', color: pieColors.non_essential },
    { name: 'Torrar (5%)', color: pieColors.leisure },
  ];

  return (
    <section>
      <div className="section-header">
        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
        <h2 className="section-title">Análise Visual</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Planned Distribution */}
        <div className="financial-card">
          <h3 className="text-white font-semibold mb-4">Distribuição Planejada</h3>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={pieColors[entry.categoryType as keyof typeof pieColors]} 
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            {getLegendData().map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - Planned vs Real */}
        <div className="financial-card">
          <h3 className="text-white font-semibold mb-4">Planejado vs Real</h3>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                />
                <YAxis 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                  tickFormatter={formatCurrency}
                />
                <Bar dataKey="planejado" fill="var(--color-planejado)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="real" fill="var(--color-real)" radius={[2, 2, 0, 0]} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-300">Planejado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-300">Real</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
