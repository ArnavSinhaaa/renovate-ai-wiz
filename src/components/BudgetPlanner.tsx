/**
 * BudgetPlanner Component
 * Manages budget tracking, cost calculations, and cart item management
 * Provides visual feedback on budget utilization and project timeline
 */

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RenovationSuggestion } from '@/data/renovationSuggestions';

/**
 * Props interface for BudgetPlanner component
 * @interface BudgetPlannerProps
 */
interface BudgetPlannerProps {
  /** Total budget amount in rupees */
  budget: number;
  /** Array of selected renovation suggestions */
  cartItems: RenovationSuggestion[];
  /** Callback function to remove an item from cart */
  onRemoveItem: (id: string) => void;
}

/**
 * BudgetPlanner component for managing renovation budget and timeline
 * @param props - Component props
 * @returns JSX element containing the budget management interface
 */
export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ budget, cartItems, onRemoveItem }) => {
  // Calculate total cost of all selected items
  const totalCost = cartItems.reduce((sum, item) => sum + item.cost, 0);
  
  // Calculate total project timeline (longest individual item time)
  const totalTime = Math.max(...cartItems.map(item => item.time), 0);
  
  // Check if total cost is within budget
  const isWithinBudget = totalCost <= budget;
  
  // Calculate budget utilization percentage
  const budgetUtilization = budget > 0 ? (totalCost / budget) * 100 : 0;

  // Count items by impact level for summary display
  const impactCounts = cartItems.reduce((acc, item) => {
    acc[item.impact] = (acc[item.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Show empty state when no items are selected
  if (cartItems.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Budget Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Add renovation suggestions to see your budget breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show budget planner with selected items
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Budget Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget and Timeline Overview */}
        <div className="grid grid-cols-2 gap-4">
          {/* Budget status and total cost */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isWithinBudget ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">
                {isWithinBudget ? 'Within Budget' : 'Over Budget'}
              </span>
            </div>
            <p className="text-2xl font-bold">
              ₹{totalCost.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              of ₹{budget.toLocaleString()} budget
            </p>
          </div>

          {/* Project timeline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary-foreground" />
              <span className="font-medium">Timeline</span>
            </div>
            <p className="text-2xl font-bold">
              {totalTime} {totalTime === 1 ? 'day' : 'days'}
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated completion
            </p>
          </div>
        </div>

        {/* Budget utilization progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget Usage</span>
            <span>{budgetUtilization.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isWithinBudget ? 'bg-gradient-sage' : 'bg-gradient-warm'
              }`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
          {!isWithinBudget && (
            <p className="text-sm text-red-600">
              ₹{(totalCost - budget).toLocaleString()} over budget
            </p>
          )}
        </div>

        {/* Impact level summary */}
        <div className="space-y-3">
          <h4 className="font-medium">Impact Summary</h4>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(impactCounts).map(([impact, count]) => (
              <Badge 
                key={impact} 
                variant="outline"
                className="flex items-center gap-1"
              >
                {impact === 'High' && <TrendingUp className="w-3 h-3" />}
                {impact === 'Medium' && <TrendingDown className="w-3 h-3" />}
                {count} {impact} Impact
              </Badge>
            ))}
          </div>
        </div>

        {/* Selected renovation items list */}
        <div className="space-y-3">
          <h4 className="font-medium">Selected Renovations ({cartItems.length})</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded group hover:bg-muted transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.suggestion}</p>
                  <p className="text-muted-foreground text-xs">{item.room}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-medium">₹{item.cost.toLocaleString()}</p>
                    <p className="text-muted-foreground text-xs">{item.time}d</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};