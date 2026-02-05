'use client';

import { MarketplaceFilters as Filters } from '../page';

interface MarketplaceFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function MarketplaceFilters({
  filters,
  onFiltersChange,
}: MarketplaceFiltersProps) {
  const updateFilter = (key: keyof Filters, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Filters</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              updateFilter('sortBy', e.target.value as Filters['sortBy'])
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="discount">Highest Discount</option>
            <option value="amount">Highest Amount</option>
            <option value="duration">Shortest Duration</option>
            <option value="creditScore">Best Credit Score</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Min Credit Score
          </label>
          <input
            type="number"
            min="0"
            max="850"
            step="10"
            value={filters.minCreditScore}
            onChange={(e) =>
              updateFilter('minCreditScore', parseInt(e.target.value) || 0)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Max Duration (days)
          </label>
          <input
            type="number"
            min="0"
            step="30"
            placeholder="Any"
            value={filters.maxDuration ?? ''}
            onChange={(e) =>
              updateFilter(
                'maxDuration',
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showDefaultedOnly"
            checked={filters.showDefaultedOnly}
            onChange={(e) =>
              updateFilter('showDefaultedOnly', e.target.checked)
            }
            className="mr-2 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label
            htmlFor="showDefaultedOnly"
            className="text-sm text-gray-700"
          >
            Show only defaulted vaults
          </label>
        </div>

        <button
          onClick={() =>
            onFiltersChange({
              sortBy: 'discount',
              showDefaultedOnly: false,
              minCreditScore: 0,
              maxDuration: null,
            })
          }
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
