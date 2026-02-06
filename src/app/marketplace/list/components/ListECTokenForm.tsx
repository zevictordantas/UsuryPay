'use client';

import { useState } from 'react';

interface ListECTokenFormProps {
  onSuccess: () => void;
}

export function ListECTokenForm({ onSuccess }: ListECTokenFormProps) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenType, setTokenType] = useState<'ERC721' | 'ERC1155'>('ERC721');
  const [price, setPrice] = useState('');
  const [isListing, setIsListing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsListing(true);

    try {
      // TODO: Web3 Integration - Replace with actual contract calls
      // Step 1: Validate inputs
      // if (!isAddress(tokenAddress)) {
      //   alert('Invalid token address');
      //   return;
      // }

      // Step 2: Check token ownership
      // const tokenContract = getContract({
      //   address: tokenAddress,
      //   abi: tokenType === 'ERC721' ? ERC721ABI : ERC1155ABI,
      // });
      // const owner = await tokenContract.read.ownerOf([tokenId]);
      // if (owner !== userAddress) {
      //   alert('You do not own this token');
      //   return;
      // }

      // Step 3: Check/request approval
      // if (tokenType === 'ERC721') {
      //   const approved = await tokenContract.read.getApproved([tokenId]);
      //   if (approved !== marketplaceAddress) {
      //     console.log('Approving token for marketplace...');
      //     const approveTx = await tokenContract.write.approve([marketplaceAddress, tokenId]);
      //     await approveTx.wait();
      //   }
      // } else {
      //   const isApproved = await tokenContract.read.isApprovedForAll([userAddress, marketplaceAddress]);
      //   if (!isApproved) {
      //     console.log('Approving all tokens for marketplace...');
      //     const approveTx = await tokenContract.write.setApprovalForAll([marketplaceAddress, true]);
      //     await approveTx.wait();
      //   }
      // }

      // Step 4: List on marketplace
      // const priceInSmallestUnit = parseUnits(price, 6); // USDC has 6 decimals
      // console.log('Listing token on marketplace...');
      // const listTx = await marketplaceContract.write.list([
      //   tokenAddress,
      //   tokenId,
      //   tokenType === 'ERC721' ? 0 : 1, // TokenType enum
      //   priceInSmallestUnit
      // ]);
      // await listTx.wait();

      // Step 5: Listen for Listed event
      // marketplace.on('Listed', (listingId, seller, token, tokenId, price) => {
      //   console.log('Token listed successfully');
      // });

      console.log('Listing token:', {
        tokenAddress,
        tokenId,
        tokenType,
        price,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

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
