'use client';

import { useEffect } from 'react';
import { type Address, isAddress } from 'viem';
import { useLocalEnsAddress, useLocalEnsName } from '@/app/hooks/useLocalENS';
import { useDebounce } from '@/app/hooks/useDebounce';

interface AddressInputProps {
  value: string;
  onChange: (value: string, resolvedAddress?: Address) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  className?: string;
}

/**
 * Address/ENS input component with auto-resolution
 * - Accepts both ENS names and addresses
 * - Debounces resolution to avoid excessive calls
 * - Shows visual feedback for resolved names
 * - Returns both input value and resolved address to parent
 */
export function AddressInput({
  value,
  onChange,
  placeholder = '0x... or name.eth',
  disabled = false,
  required = false,
  label,
  className = '',
}: AddressInputProps) {
  const debouncedValue = useDebounce(value, 300);

  // Forward resolution: ENS name → address
  const { data: ensAddress } = useLocalEnsAddress({
    name: debouncedValue && !isAddress(debouncedValue) ? debouncedValue : undefined,
  });

  // Reverse resolution: address → ENS name
  const { data: ensName } = useLocalEnsName({
    address: debouncedValue && isAddress(debouncedValue) ? (debouncedValue as Address) : undefined,
  });

  // Determine the resolved address
  const resolvedAddress: Address | undefined = ensAddress || (isAddress(value) ? (value as Address) : undefined);

  // Notify parent of resolved address when it changes
  useEffect(() => {
    onChange(value, resolvedAddress);
  }, [resolvedAddress]);

  const showEnsResolution = ensAddress && !isAddress(value);
  const showReverseResolution = ensName && isAddress(value);

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value, resolvedAddress)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
        disabled={disabled}
        required={required}
      />
      {/* Show ENS → address when ENS name is entered */}
      {showEnsResolution && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-green-600">
          <span>✓</span>
          <span>{value}</span>
          <span className="text-gray-400">→</span>
          <span className="font-mono">
            {ensAddress.slice(0, 6)}...{ensAddress.slice(-4)}
          </span>
        </div>
      )}
      {/* Show ENS name when address is entered */}
      {showReverseResolution && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-green-600">
          <span>✓</span>
          <span>{ensName}</span>
          <span className="text-gray-400">→</span>
          <span className="font-mono">
            {value.slice(0, 6)}...{value.slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
}
