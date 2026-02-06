'use client';

import { useState } from 'react';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from 'wagmi';
import { erc1155Abi, erc721Abi, isAddress, parseUnits } from 'viem';
import { marketplaceAddress, useWriteMarketplaceList } from '@/generated';

interface ListECTokenFormProps {
  onSuccess: () => void;
}

export function ListECTokenForm({ onSuccess }: ListECTokenFormProps) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenType, setTokenType] = useState<'ERC721' | 'ERC1155'>('ERC721');
  const [price, setPrice] = useState('');
  const [isListing, setIsListing] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { writeContractAsync: writeToken } = useWriteContract();
  const { writeContractAsync: listToken } = useWriteMarketplaceList();
  const marketplace = marketplaceAddress[chainId];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsListing(true);

    try {
      if (!isConnected || !address) {
        alert('Please connect your wallet first.');
        return;
      }
      if (!publicClient) {
        alert('Wallet client not ready.');
        return;
      }
      if (!marketplace) {
        alert('Marketplace is not available on this network.');
        return;
      }
      if (!isAddress(tokenAddress)) {
        alert('Invalid token address.');
        return;
      }
      if (!tokenId.trim() || Number.isNaN(Number(tokenId))) {
        alert('Invalid token ID.');
        return;
      }
      if (!price.trim() || Number(price) <= 0) {
        alert('Invalid price.');
        return;
      }

      const tokenIdValue = BigInt(tokenId);
      const priceInSmallestUnit = parseUnits(price, 6);

      if (tokenType === 'ERC721') {
        const approveHash = await writeToken({
          address: tokenAddress,
          abi: erc721Abi,
          functionName: 'approve',
          args: [marketplace, tokenIdValue],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      } else {
        const approveHash = await writeToken({
          address: tokenAddress,
          abi: erc1155Abi,
          functionName: 'setApprovalForAll',
          args: [marketplace, true],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const listHash = await listToken({
        args: [
          tokenAddress,
          tokenIdValue,
          tokenType === 'ERC721' ? 0 : 1,
          priceInSmallestUnit,
        ],
      });
      await publicClient.waitForTransactionReceipt({ hash: listHash });

      alert('Token listed successfully!');
      setTokenAddress('');
      setTokenId('');
      setPrice('');
      onSuccess();
    } catch (error) {
      console.error('Failed to list token:', error);
      alert('Failed to list token. Please try again.');
    } finally {
      setIsListing(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        List Your EC Token
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Token Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <p className="mt-1 text-xs text-gray-500">
            The contract address of your EC token
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Token ID
          </label>
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="1"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <p className="mt-1 text-xs text-gray-500">
            The unique identifier of your token
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Token Type
          </label>
          <select
            value={tokenType}
            onChange={(e) => setTokenType(e.target.value as 'ERC721' | 'ERC1155')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="ERC721">ERC-721</option>
            <option value="ERC1155">ERC-1155</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            The token standard of your EC token
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price (USDC)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1000.00"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <p className="mt-1 text-xs text-gray-500">
            The asking price in USDC
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-3">
          <p className="text-xs text-blue-900">
            <strong>Note:</strong> Your token will be escrowed in the
            marketplace contract until sold or cancelled. You must approve the
            marketplace contract to transfer your token before listing.
          </p>
        </div>

        <button
          type="submit"
          disabled={isListing}
          className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isListing ? 'Listing...' : 'List Token'}
        </button>
      </form>
    </div>
  );
}
