/**
 * BudgetPlanner Component - Enhanced Version
 * Manages budget tracking, cost calculations, and cart item management
 * Provides visual feedback on budget utilization and project timeline
 * Enhanced with improved UI/UX, animations, and additional features
 */

import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, AlertCircle, X, Palette, Layers, Square, Download, Share2, Calendar, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RenovationSuggestion } from '@/data/renovationSuggestions';
import { Progress } from '@/components/ui/progress';

/** Material costs interface */
export interface MaterialCosts {
  walls: number;
  flooring: number;
  tiles: number;
  total: number;
}

/** Props interface for BudgetPlanner component */
interface BudgetPlannerProps {
  budget: number;
  cartItems: RenovationSuggestion[];
  onRemoveItem: (id: string) => void;
  materialCosts?: MaterialCosts;
}

/** Enhanced BudgetPlanner component for managing renovation budget and timeline */
export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ budget, cartItems, onRemoveItem, materialCosts }) => {
  const [showDetails, setShowDetails] = useState(true);

  // Calculate total cost of all selected items
  const renovationCost = useMemo(() => cartItems.reduce((sum, item) => sum + item.cost, 0), [cartItems]);
  // Add material costs to total
  const materialTotal = materialCosts?.total || 0;
  const totalCost = renovationCost + materialTotal;
  // Calculate total project timeline (longest individual item time)
  const totalTime = useMemo(() => Math.max(...cartItems.map(item => item.time), 0), [cartItems]);
  // Check if total cost is within budget
  const isWithinBudget = totalCost <= budget;
  const remainingBudget = budget - totalCost;
  // Calculate budget utilization percentage
  const budgetUtilization = budget > 0 ? (totalCost / budget) * 100 : 0;
  // Count items by impact level for summary display
  const impactCounts = useMemo(() =>
    cartItems.reduce((acc, item) => {
      acc[item.impact] = (acc[item.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>), [cartItems]
  );
  // Calculate average cost per day
  const avgCostPerDay = totalTime > 0 ? totalCost / totalTime : 0;

  // Export budget summary as text
  const exportBudgetSummary = () => {
    const summary = `
Budget Summary - ${new Date().toLocaleDateString()}
======================================
Total Budget: ₹${budget.toLocaleString()}
Total Cost: ₹${totalCost.toLocaleString()}
Remaining: ₹${remainingBudget.toLocaleString()}
Status: ${isWithinBudget ? 'Within Budget' : 'Over Budget'}
Timeline: ${totalTime} days

Cost Breakdown:
- Renovations: ₹${renovationCost.toLocaleString()} (${cartItems.length} items)
${materialCosts ? `- Wall Paint: ₹${materialCosts.walls.toLocaleString()}
- Flooring: ₹${materialCosts.flooring.toLocaleString()}
- Tiles: ₹${materialCosts.tiles.toLocaleString()}` : ''}

Selected Items:
${cartItems.map((item, i) => `${i + 1}. ${item.suggestion} - ₹${item.cost.toLocaleString()} (${item.time}d)`).join('\n')}
======================================`
      .trim();

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share budget summary
  const shareBudgetSummary = async () => {
    const summary = `My Fixfy Budget Plan: ₹${totalCost.toLocaleString()} for ${cartItems.length} renovations (${totalTime} days). ${isWithinBudget ? 'Within budget!' : 'Need to adjust budget.'} #Fixfy #HomeRenovation`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Renovation Budget',
          text: summary,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(summary);
      alert('Budget summary copied to clipboard!');
    }
  };

  // Show empty state when no items are selected and no materials chosen
  if (cartItems.length === 0 && !materialCosts) {
    return (
      <Card className="shadow-soft border-2 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Budget Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground space-y-3">
            <PieChart className="w-16 h-16 mx-auto opacity-50" />
            <p className="font-medium">Start Planning Your Budget</p>
            <p className="text-sm">Add renovation suggestions or customize materials to see your budget breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show budget planner with selected items
  return (
    <Card className="shadow-soft border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Budget Planner
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareBudgetSummary}
              className="h-8"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportBudgetSummary}
              className="h-8"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget and Timeline Overview */}
        <div className="grid grid-cols-2 gap-4">
          {/* Budget status and total cost */}
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              {isWithinBudget ? (
                <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 animate-bounce" />
              )}
              <span className="font-medium text-sm">
                {isWithinBudget ? 'Within Budget' : 'Over Budget'}
              </span>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ₹{totalCost.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              of ₹{budget.toLocaleString()} budget
            </p>
            {isWithinBudget && (
              <p className="text-xs text-green-600 font-medium">
                ₹{remainingBudget.toLocaleString()} remaining
              </p>
            )}
          </div>
          {/* Project timeline */}
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary-foreground" />
              <span className="font-medium text-sm">Timeline</span>
            </div>
            <p className="text-3xl font-bold text-secondary-foreground">
              {totalTime} {totalTime === 1 ? 'day' : 'days'}
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated completion
            </p>
            {avgCostPerDay > 0 && (
              <p className="text-xs text-muted-foreground">
                ₹{avgCostPerDay.toLocaleString()} per day
              </p>
            )}
          </div>
        </div>

        {/* Budget utilization progress bar */}
        <div className="space-y-3 p-4 rounded-lg bg-muted/30">
          <div className="flex justify-between text-sm font-medium">
            <span>Budget Usage</span>
            <span className={isWithinBudget ? 'text-green-600' : 'text-red-600'}>
              {budgetUtilization.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(budgetUtilization, 100)}
            className={`h-3 ${isWithinBudget ? '' : 'bg-red-100'}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹0</span>
            <span>₹{budget.toLocaleString()}</span>
          </div>
          {!isWithinBudget && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">
                ₹{(totalCost - budget).toLocaleString()} over budget - Consider removing some items
              </span>
            </div>
          )}
        </div>

        {/* Cost Breakdown with toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cost Breakdown
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-7 text-xs"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          {showDetails && (
            <div className="space-y-2 text-sm">
              {cartItems.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg border border-blue-600 hover:shadow-sm transition-shadow">
                  <span className="font-medium flex items-center gap-2 text-white">
                    <TrendingUp className="w-4 h-4 text-white" />
                    Renovations ({cartItems.length} items)
                  </span>
                  <span className="font-bold text-white">₹{renovationCost.toLocaleString()}</span>
                </div>
              )}
              {materialCosts && materialCosts.total > 0 && (
                <>
                  {materialCosts.walls > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200 hover:shadow-sm transition-shadow">
                      <span className="font-medium flex items-center gap-2">
                        <Palette className="w-4 h-4 text-purple-600" />
                        Wall Paint
                      </span>
                      <span className="font-bold text-purple-700">₹{materialCosts.walls.toLocaleString()}</span>
                    </div>
                  )}
                  {materialCosts.flooring > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200 hover:shadow-sm transition-shadow">
                      <span className="font-medium flex items-center gap-2">
                        <Layers className="w-4 h-4 text-green-600" />
                        Flooring
                      </span>
                      <span className="font-bold text-green-700">₹{materialCosts.flooring.toLocaleString()}</span>
                    </div>
                  )}
                  {materialCosts.tiles > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200 hover:shadow-sm transition-shadow">
                      <span className="font-medium flex items-center gap-2">
                        <Square className="w-4 h-4 text-orange-600" />
                        Tiles
                      </span>
                      <span className="font-bold text-orange-700">₹{materialCosts.tiles.toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Impact level summary */}
        {cartItems.length > 0 && Object.keys(impactCounts).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Impact Summary</h4>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(impactCounts).map(([impact, count]) => (
                <Badge
                  key={impact}
                  variant={impact === 'High' ? 'default' : 'outline'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 ${
                    impact === 'High' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    impact === 'Medium' ? 'border-yellow-400 text-yellow-700' :
                    'border-gray-400 text-gray-700'
                  }`}
                >
                  {impact === 'High' && <TrendingUp className="w-3.5 h-3.5" />}
                  {impact === 'Medium' && <TrendingDown className="w-3.5 h-3.5" />}
                  {impact === 'Low' && <Clock className="w-3.5 h-3.5" />}
                  <span className="font-medium">{count} {impact} Impact</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Selected renovation items list */}
        {cartItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Selected Renovations ({cartItems.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-muted hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                  style={{ animation: `slideIn 0.3s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                      <p className="font-semibold truncate">{item.suggestion}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-muted-foreground text-xs">{item.room}</p>
                      <Badge variant="outline" className="text-xs h-5">
                        {item.impact} Impact
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{item.cost.toLocaleString()}</p>
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}d
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.suggestion}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center p-2 rounded bg-muted/30">
            <p className="text-xs text-muted-foreground">Avg. Cost</p>
            <p className="font-bold text-sm">₹{cartItems.length > 0 ? Math.round(renovationCost / cartItems.length).toLocaleString() : 0}</p>
          </div>
          <div className="text-center p-2 rounded bg-muted/30">
            <p className="text-xs text-muted-foreground">Total Items</p>
            <p className="font-bold text-sm">{cartItems.length + (materialCosts && materialCosts.total > 0 ? 1 : 0)}</p>
          </div>
          <div className="text-center p-2 rounded bg-muted/30">
            <p className="text-xs text-muted-foreground">Daily Cost</p>
            <p className="font-bold text-sm">₹{avgCostPerDay > 0 ? Math.round(avgCostPerDay).toLocaleString() : 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
