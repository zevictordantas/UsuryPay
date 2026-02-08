import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Marketplace
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const marketplaceAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_usdc', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'USDC',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllListings',
    outputs: [
      {
        name: '',
        internalType: 'struct Marketplace.Listing[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'tokenType',
            internalType: 'enum Marketplace.TokenType',
            type: 'uint8',
          },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'active', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'getListing',
    outputs: [
      {
        name: '',
        internalType: 'struct Marketplace.Listing',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'tokenType',
            internalType: 'enum Marketplace.TokenType',
            type: 'uint8',
          },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'active', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'tokenType',
        internalType: 'enum Marketplace.TokenType',
        type: 'uint8',
      },
      { name: 'price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'list',
    outputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Bought',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Cancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Listed',
  },
  { type: 'error', inputs: [], name: 'InvalidPrice' },
  { type: 'error', inputs: [], name: 'InvalidToken' },
  { type: 'error', inputs: [], name: 'ListingNotActive' },
  { type: 'error', inputs: [], name: 'NotSeller' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const marketplaceAddress = {
  31337: '0x0000000000000000000000000000000000000000',
  11155111: '0x4ED7BD530A763f243bA45F0E2d470148858C05B3',
} as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const marketplaceConfig = {
  address: marketplaceAddress,
  abi: marketplaceAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockECToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const mockEcTokenAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateEntitled',
    outputs: [{ name: 'entitled', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'getAllTokensOfOwner',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimable',
    outputs: [{ name: 'claimable', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getEffectiveClaimable',
    outputs: [
      { name: 'effectiveClaimable', internalType: 'uint256', type: 'uint256' },
      { name: 'shortfall', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTokenInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct MockECToken.TokenInfo',
        type: 'tuple',
        components: [
          { name: 'vaultId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'schedule',
            internalType: 'struct MockECToken.PaymentSchedule',
            type: 'tuple',
            components: [
              { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'endTime', internalType: 'uint256', type: 'uint256' },
              {
                name: 'ratePerSecond',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'customParams', internalType: 'bytes', type: 'bytes' },
            ],
          },
          { name: 'claimed', internalType: 'uint256', type: 'uint256' },
          { name: 'metadata', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTokenRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getVault',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'vaultId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'schedule',
        internalType: 'struct MockECToken.PaymentSchedule',
        type: 'tuple',
        components: [
          { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'ratePerSecond', internalType: 'uint256', type: 'uint256' },
          { name: 'customParams', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'metadata', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'vaultId', internalType: 'uint256', type: 'uint256' },
      { name: 'vault', internalType: 'address', type: 'address' },
    ],
    name: 'setVault',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateClaimed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newClaimedTotal',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'vaultId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokenMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
] as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const mockEcTokenAddress = {
  31337: '0x0000000000000000000000000000000000000000',
  11155111: '0x5F831B8c021C0C2A8fe471bd8ed76EB675462571',
} as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const mockEcTokenConfig = {
  address: mockEcTokenAddress,
  abi: mockEcTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockUSDC
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const mockUsdcAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

/**
 *
 */
export const mockUsdcAddress = {
  31337: '0x0000000000000000000000000000000000000000',
} as const

/**
 *
 */
export const mockUsdcConfig = {
  address: mockUsdcAddress,
  abi: mockUsdcAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PayrollDApp
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const payrollDAppAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_paymentToken', internalType: 'address', type: 'address' },
      { name: '_ecToken', internalType: 'address', type: 'address' },
      { name: '_marketplace', internalType: 'address', type: 'address' },
      { name: '_resaleProfitMargin', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'checkBalance',
    outputs: [
      { name: 'hasBalance', internalType: 'bool', type: 'bool' },
      { name: 'currentBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'neededAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'claimFromToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ecToken',
    outputs: [
      { name: '', internalType: 'contract MockECToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getECTokenValue',
    outputs: [
      { name: 'currentValue', internalType: 'uint256', type: 'uint256' },
      { name: 'futureValue', internalType: 'uint256', type: 'uint256' },
      { name: 'discountedValue', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'vault', internalType: 'address', type: 'address' }],
    name: 'getEmployerCreditScore',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'marketplace',
    outputs: [
      { name: '', internalType: 'contract Marketplace', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'ownedTokens',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paymentToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resaleProfitMargin',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'sellToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'resalePrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenListedOnMarketplace',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'futureValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenPurchased',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const payrollDAppAddress = {
  31337: '0x0000000000000000000000000000000000000000',
  11155111: '0xD3A836EcfD6Cbb32203023045Fb4a0A97B4B151D',
} as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const payrollDAppConfig = {
  address: payrollDAppAddress,
  abi: payrollDAppAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PayrollVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const payrollVaultAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_asset', internalType: 'address', type: 'address' },
      { name: '_ecToken', internalType: 'address', type: 'address' },
      { name: '_employer', internalType: 'address', type: 'address' },
      { name: '_vaultId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'defaultIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'settlementData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'amendDefault',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'checkSolvency',
    outputs: [
      { name: 'isSolvent', internalType: 'bool', type: 'bool' },
      { name: 'shortfall', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [
      { name: 'claimed', internalType: 'uint256', type: 'uint256' },
      { name: 'defaultOccurred', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ecToken',
    outputs: [
      { name: '', internalType: 'contract MockECToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'employer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'fund',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getDefaults',
    outputs: [
      {
        name: '',
        internalType: 'struct IECVault.DefaultEvent[]',
        type: 'tuple[]',
        components: [
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'shortfall', internalType: 'uint256', type: 'uint256' },
          { name: 'settlementData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmployerCreditScore',
    outputs: [{ name: 'score', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMintedTokens',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRequiredEscrow',
    outputs: [{ name: 'required', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVaultInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IECVault.VaultInfo',
        type: 'tuple',
        components: [
          { name: 'asset', internalType: 'address', type: 'address' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'payer', internalType: 'address', type: 'address' },
          { name: 'metadata', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'employee', internalType: 'address', type: 'address' },
      { name: 'monthlyAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'durationMonths', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintSalaryToken',
    outputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'shortfall', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onDefaultDetected',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalFunded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vaultId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'defaultIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'settlementData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'DefaultAmended',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'shortfall',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DefaultDetected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'payer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Funded',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PayrollVaultCCTP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const payrollVaultCctpAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_asset', internalType: 'address', type: 'address' },
      { name: '_ecToken', internalType: 'address', type: 'address' },
      { name: '_employer', internalType: 'address', type: 'address' },
      { name: '_vaultId', internalType: 'uint256', type: 'uint256' },
      { name: '_cctp', internalType: 'address', type: 'address' },
      { name: '_messageTransmitter', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'defaultIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'settlementData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'amendDefault',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cctp',
    outputs: [
      { name: '', internalType: 'contract ITokenMessenger', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'checkSolvency',
    outputs: [
      { name: 'isSolvent', internalType: 'bool', type: 'bool' },
      { name: 'shortfall', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [
      { name: 'claimed', internalType: 'uint256', type: 'uint256' },
      { name: 'defaultOccurred', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'destinationDomain', internalType: 'uint32', type: 'uint32' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'claimCrossChain',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ecToken',
    outputs: [
      { name: '', internalType: 'contract MockECToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'employer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'fund',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getDefaults',
    outputs: [
      {
        name: '',
        internalType: 'struct IECVault.DefaultEvent[]',
        type: 'tuple[]',
        components: [
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'shortfall', internalType: 'uint256', type: 'uint256' },
          { name: 'settlementData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmployerCreditScore',
    outputs: [{ name: 'score', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMintedTokens',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRequiredEscrow',
    outputs: [{ name: 'required', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVaultInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IECVault.VaultInfo',
        type: 'tuple',
        components: [
          { name: 'asset', internalType: 'address', type: 'address' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'payer', internalType: 'address', type: 'address' },
          { name: 'metadata', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'messageTransmitter',
    outputs: [
      {
        name: '',
        internalType: 'contract IMessageTransmitter',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'employee', internalType: 'address', type: 'address' },
      { name: 'monthlyAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'durationMonths', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintSalaryToken',
    outputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'shortfall', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onDefaultDetected',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'message', internalType: 'bytes', type: 'bytes' },
      { name: 'attestation', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'receiveCrossChainFunding',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalFunded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vaultId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'destinationDomain',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'nonce', internalType: 'uint64', type: 'uint64', indexed: false },
    ],
    name: 'CrossChainClaimInitiated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'submitter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CrossChainFundingReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'defaultIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'settlementData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'DefaultAmended',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'shortfall',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DefaultDetected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'payer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Funded',
  },
  { type: 'error', inputs: [], name: 'CCTPTransferFailed' },
  { type: 'error', inputs: [], name: 'InvalidDestinationDomain' },
  { type: 'error', inputs: [], name: 'InvalidRecipient' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const payrollVaultCctpAddress = {
  11155111: '0xadfCd25a5605d18C2121D00E964B9B1e0ab5B48A',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const payrollVaultCctpConfig = {
  address: payrollVaultCctpAddress,
  abi: payrollVaultCctpAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PayrollVaultFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const payrollVaultFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_ecToken', internalType: 'address', type: 'address' },
      { name: '_asset', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'createVault',
    outputs: [
      { name: 'vaultId', internalType: 'uint256', type: 'uint256' },
      { name: 'vault', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ecToken',
    outputs: [
      { name: '', internalType: 'contract MockECToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'employerVaults',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'employer', internalType: 'address', type: 'address' }],
    name: 'getEmployerVaults',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'vaultId', internalType: 'uint256', type: 'uint256' }],
    name: 'getVaultAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'vaults',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vaultId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'employer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'VaultCreated',
  },
] as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const payrollVaultFactoryAddress = {
  31337: '0x0000000000000000000000000000000000000000',
  11155111: '0x17cD72A6119BE4e775479CB755a8Cf4b79a0f895',
} as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const payrollVaultFactoryConfig = {
  address: payrollVaultFactoryAddress,
  abi: payrollVaultFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RBNPrimitive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const rbnPrimitiveAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owners', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getCashflow',
    outputs: [
      {
        name: '',
        internalType: 'struct IRBNPrimitive.Cashflow',
        type: 'tuple',
        components: [
          { name: 'treasury', internalType: 'address', type: 'address' },
          { name: 'beneficiary', internalType: 'address', type: 'address' },
          {
            name: 'settlementManager',
            internalType: 'address',
            type: 'address',
          },
          { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'currency', internalType: 'address', type: 'address' },
          {
            name: 'cashflowType',
            internalType: 'enum IRBNPrimitive.CashflowType',
            type: 'uint8',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      {
        name: 'data',
        internalType: 'struct IRBNPrimitive.Cashflow',
        type: 'tuple',
        components: [
          { name: 'treasury', internalType: 'address', type: 'address' },
          { name: 'beneficiary', internalType: 'address', type: 'address' },
          {
            name: 'settlementManager',
            internalType: 'address',
            type: 'address',
          },
          { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'currency', internalType: 'address', type: 'address' },
          {
            name: 'cashflowType',
            internalType: 'enum IRBNPrimitive.CashflowType',
            type: 'uint8',
          },
        ],
      },
    ],
    name: 'mintCashflow',
    outputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'isApproved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settlementManager', internalType: 'address', type: 'address' },
    ],
    name: 'setSettlementManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settlementManager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isApproved',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'cashflow',
        internalType: 'struct IRBNPrimitive.Cashflow',
        type: 'tuple',
        components: [
          { name: 'treasury', internalType: 'address', type: 'address' },
          { name: 'beneficiary', internalType: 'address', type: 'address' },
          {
            name: 'settlementManager',
            internalType: 'address',
            type: 'address',
          },
          { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'currency', internalType: 'address', type: 'address' },
          {
            name: 'cashflowType',
            internalType: 'enum IRBNPrimitive.CashflowType',
            type: 'uint8',
          },
        ],
        indexed: false,
      },
    ],
    name: 'CashflowMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  { type: 'error', inputs: [], name: 'AccountBalanceOverflow' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ArrayLengthsMismatch' },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotOwnerNorApproved' },
  { type: 'error', inputs: [], name: 'TokenDoesNotExist' },
  {
    type: 'error',
    inputs: [],
    name: 'TransferToNonERC1155ReceiverImplementer',
  },
  { type: 'error', inputs: [], name: 'TransferToZeroAddress' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
] as const

/**
 *
 */
export const rbnPrimitiveAddress = {
  31337: '0x0000000000000000000000000000000000000000',
} as const

/**
 *
 */
export const rbnPrimitiveConfig = {
  address: rbnPrimitiveAddress,
  abi: rbnPrimitiveAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SettlementManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const settlementManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_rbnPrimitive', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'authorizedRecorders',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'cashflowId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAccruedAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'cashflowId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAvailableAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'cashflowId', internalType: 'uint256', type: 'uint256' }],
    name: 'getLockedAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'cashflowId', internalType: 'uint256', type: 'uint256' }],
    name: 'getSettledAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'cashflowId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lockFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rbnPrimitive',
    outputs: [
      { name: '', internalType: 'contract IRBNPrimitive', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'cashflowId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recordAccrual',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recorder', internalType: 'address', type: 'address' },
      { name: 'authorized', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAuthorizedRecorder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rbnPrimitive', internalType: 'address', type: 'address' },
    ],
    name: 'setRBNPrimitive',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'cashflowId', internalType: 'uint256', type: 'uint256' }],
    name: 'settle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'cashflowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalAccrued',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AccrualRecorded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'cashflowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'locker',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'FundsLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'cashflowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Settled',
  },
  { type: 'error', inputs: [], name: 'AccrualExceedsLocked' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CashflowDoesNotExist' },
  { type: 'error', inputs: [], name: 'InsufficientFunds' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NothingToSettle' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
] as const

/**
 *
 */
export const settlementManagerAddress = {
  31337: '0x0000000000000000000000000000000000000000',
} as const

/**
 *
 */
export const settlementManagerConfig = {
  address: settlementManagerAddress,
  abi: settlementManagerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplace = /*#__PURE__*/ createUseReadContract({
  abi: marketplaceAbi,
  address: marketplaceAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"USDC"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplaceUsdc = /*#__PURE__*/ createUseReadContract({
  abi: marketplaceAbi,
  address: marketplaceAddress,
  functionName: 'USDC',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"getAllListings"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplaceGetAllListings =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'getAllListings',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"getListing"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplaceGetListing = /*#__PURE__*/ createUseReadContract(
  {
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'getListing',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplaceOnErc1155BatchReceived =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"onERC1155Received"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplaceOnErc1155Received =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"onERC721Received"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplaceOnErc721Received =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useReadMarketplaceSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWriteMarketplace = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  address: marketplaceAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"buy"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWriteMarketplaceBuy = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  address: marketplaceAddress,
  functionName: 'buy',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"cancel"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWriteMarketplaceCancel = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  address: marketplaceAddress,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"list"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWriteMarketplaceList = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  address: marketplaceAddress,
  functionName: 'list',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useSimulateMarketplace = /*#__PURE__*/ createUseSimulateContract({
  abi: marketplaceAbi,
  address: marketplaceAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"buy"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useSimulateMarketplaceBuy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'buy',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"cancel"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useSimulateMarketplaceCancel =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"list"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useSimulateMarketplaceList =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    functionName: 'list',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWatchMarketplaceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    address: marketplaceAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"Bought"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWatchMarketplaceBoughtEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    eventName: 'Bought',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"Cancelled"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWatchMarketplaceCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    eventName: 'Cancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"Listed"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4ed7bd530a763f243ba45f0e2d470148858c05b3)
 */
export const useWatchMarketplaceListedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    address: marketplaceAddress,
    eventName: 'Listed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcToken = /*#__PURE__*/ createUseReadContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"balanceOf"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"balanceOfBatch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"calculateEntitled"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenCalculateEntitled =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'calculateEntitled',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"getAllTokensOfOwner"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenGetAllTokensOfOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'getAllTokensOfOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"getClaimable"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenGetClaimable =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'getClaimable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"getEffectiveClaimable"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenGetEffectiveClaimable =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'getEffectiveClaimable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"getTokenInfo"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenGetTokenInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'getTokenInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"getTokenRecipient"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenGetTokenRecipient =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'getTokenRecipient',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"getVault"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenGetVault = /*#__PURE__*/ createUseReadContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
  functionName: 'getVault',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"isApprovedForAll"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"uri"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useReadMockEcTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcToken = /*#__PURE__*/ createUseWriteContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"claim"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcTokenClaim = /*#__PURE__*/ createUseWriteContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"mint"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcTokenSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcTokenSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcTokenSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"setVault"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcTokenSetVault = /*#__PURE__*/ createUseWriteContract(
  {
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'setVault',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"updateClaimed"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWriteMockEcTokenUpdateClaimed =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'updateClaimed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcToken = /*#__PURE__*/ createUseSimulateContract({
  abi: mockEcTokenAbi,
  address: mockEcTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"claim"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcTokenClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"mint"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcTokenMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcTokenSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcTokenSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcTokenSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"setVault"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcTokenSetVault =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'setVault',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockEcTokenAbi}__ and `functionName` set to `"updateClaimed"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useSimulateMockEcTokenUpdateClaimed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    functionName: 'updateClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockEcTokenAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWatchMockEcTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockEcTokenAbi}__ and `eventName` set to `"ApprovalForAll"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWatchMockEcTokenApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockEcTokenAbi}__ and `eventName` set to `"Claimed"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWatchMockEcTokenClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockEcTokenAbi}__ and `eventName` set to `"TokenMinted"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWatchMockEcTokenTokenMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    eventName: 'TokenMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockEcTokenAbi}__ and `eventName` set to `"TransferBatch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWatchMockEcTokenTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockEcTokenAbi}__ and `eventName` set to `"TransferSingle"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWatchMockEcTokenTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockEcTokenAbi}__ and `eventName` set to `"URI"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5f831b8c021c0c2a8fe471bd8ed76eb675462571)
 */
export const useWatchMockEcTokenUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockEcTokenAbi,
    address: mockEcTokenAddress,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockUsdcAbi}__
 *
 *
 */
export const useReadMockUsdc = /*#__PURE__*/ createUseReadContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"allowance"`
 *
 *
 */
export const useReadMockUsdcAllowance = /*#__PURE__*/ createUseReadContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadMockUsdcBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"decimals"`
 *
 *
 */
export const useReadMockUsdcDecimals = /*#__PURE__*/ createUseReadContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const useReadMockUsdcName = /*#__PURE__*/ createUseReadContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const useReadMockUsdcSymbol = /*#__PURE__*/ createUseReadContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const useReadMockUsdcTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockUsdcAbi}__
 *
 *
 */
export const useWriteMockUsdc = /*#__PURE__*/ createUseWriteContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useWriteMockUsdcApprove = /*#__PURE__*/ createUseWriteContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const useWriteMockUsdcMint = /*#__PURE__*/ createUseWriteContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useWriteMockUsdcTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useWriteMockUsdcTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockUsdcAbi,
    address: mockUsdcAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockUsdcAbi}__
 *
 *
 */
export const useSimulateMockUsdc = /*#__PURE__*/ createUseSimulateContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useSimulateMockUsdcApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockUsdcAbi,
    address: mockUsdcAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const useSimulateMockUsdcMint = /*#__PURE__*/ createUseSimulateContract({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useSimulateMockUsdcTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockUsdcAbi,
    address: mockUsdcAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockUsdcAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useSimulateMockUsdcTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockUsdcAbi,
    address: mockUsdcAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockUsdcAbi}__
 *
 *
 */
export const useWatchMockUsdcEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mockUsdcAbi,
  address: mockUsdcAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockUsdcAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const useWatchMockUsdcApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockUsdcAbi,
    address: mockUsdcAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockUsdcAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const useWatchMockUsdcTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockUsdcAbi,
    address: mockUsdcAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDApp = /*#__PURE__*/ createUseReadContract({
  abi: payrollDAppAbi,
  address: payrollDAppAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"checkBalance"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppCheckBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'checkBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"ecToken"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppEcToken = /*#__PURE__*/ createUseReadContract({
  abi: payrollDAppAbi,
  address: payrollDAppAddress,
  functionName: 'ecToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"getBalance"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppGetBalance = /*#__PURE__*/ createUseReadContract(
  {
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'getBalance',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"getECTokenValue"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppGetEcTokenValue =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'getECTokenValue',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"getEmployerCreditScore"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppGetEmployerCreditScore =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'getEmployerCreditScore',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"marketplace"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppMarketplace =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'marketplace',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppOnErc1155BatchReceived =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"onERC1155Received"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppOnErc1155Received =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"ownedTokens"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppOwnedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'ownedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"paymentToken"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppPaymentToken =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'paymentToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"resaleProfitMargin"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppResaleProfitMargin =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'resaleProfitMargin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useReadPayrollDAppSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollDAppAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useWritePayrollDApp = /*#__PURE__*/ createUseWriteContract({
  abi: payrollDAppAbi,
  address: payrollDAppAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"claimFromToken"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useWritePayrollDAppClaimFromToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'claimFromToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"sellToken"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useWritePayrollDAppSellToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'sellToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollDAppAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useSimulatePayrollDApp = /*#__PURE__*/ createUseSimulateContract({
  abi: payrollDAppAbi,
  address: payrollDAppAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"claimFromToken"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useSimulatePayrollDAppClaimFromToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'claimFromToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollDAppAbi}__ and `functionName` set to `"sellToken"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useSimulatePayrollDAppSellToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    functionName: 'sellToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollDAppAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useWatchPayrollDAppEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollDAppAbi}__ and `eventName` set to `"TokenClaimed"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useWatchPayrollDAppTokenClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    eventName: 'TokenClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollDAppAbi}__ and `eventName` set to `"TokenListedOnMarketplace"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useWatchPayrollDAppTokenListedOnMarketplaceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    eventName: 'TokenListedOnMarketplace',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollDAppAbi}__ and `eventName` set to `"TokenPurchased"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d)
 */
export const useWatchPayrollDAppTokenPurchasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollDAppAbi,
    address: payrollDAppAddress,
    eventName: 'TokenPurchased',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__
 */
export const useReadPayrollVault = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"asset"`
 */
export const useReadPayrollVaultAsset = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"checkSolvency"`
 */
export const useReadPayrollVaultCheckSolvency =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'checkSolvency',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"defaultCount"`
 */
export const useReadPayrollVaultDefaultCount =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'defaultCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"ecToken"`
 */
export const useReadPayrollVaultEcToken = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultAbi,
  functionName: 'ecToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"employer"`
 */
export const useReadPayrollVaultEmployer = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultAbi,
  functionName: 'employer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"endTime"`
 */
export const useReadPayrollVaultEndTime = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultAbi,
  functionName: 'endTime',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"getBalance"`
 */
export const useReadPayrollVaultGetBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'getBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"getDefaults"`
 */
export const useReadPayrollVaultGetDefaults =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'getDefaults',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"getEmployerCreditScore"`
 */
export const useReadPayrollVaultGetEmployerCreditScore =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'getEmployerCreditScore',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"getMintedTokens"`
 */
export const useReadPayrollVaultGetMintedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'getMintedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"getRequiredEscrow"`
 */
export const useReadPayrollVaultGetRequiredEscrow =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'getRequiredEscrow',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"getVaultInfo"`
 */
export const useReadPayrollVaultGetVaultInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'getVaultInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"startTime"`
 */
export const useReadPayrollVaultStartTime = /*#__PURE__*/ createUseReadContract(
  { abi: payrollVaultAbi, functionName: 'startTime' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"totalFunded"`
 */
export const useReadPayrollVaultTotalFunded =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultAbi,
    functionName: 'totalFunded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"vaultId"`
 */
export const useReadPayrollVaultVaultId = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultAbi,
  functionName: 'vaultId',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultAbi}__
 */
export const useWritePayrollVault = /*#__PURE__*/ createUseWriteContract({
  abi: payrollVaultAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"amendDefault"`
 */
export const useWritePayrollVaultAmendDefault =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultAbi,
    functionName: 'amendDefault',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"claim"`
 */
export const useWritePayrollVaultClaim = /*#__PURE__*/ createUseWriteContract({
  abi: payrollVaultAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"fund"`
 */
export const useWritePayrollVaultFund = /*#__PURE__*/ createUseWriteContract({
  abi: payrollVaultAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"mintSalaryToken"`
 */
export const useWritePayrollVaultMintSalaryToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultAbi,
    functionName: 'mintSalaryToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"onDefaultDetected"`
 */
export const useWritePayrollVaultOnDefaultDetected =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultAbi,
    functionName: 'onDefaultDetected',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultAbi}__
 */
export const useSimulatePayrollVault = /*#__PURE__*/ createUseSimulateContract({
  abi: payrollVaultAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"amendDefault"`
 */
export const useSimulatePayrollVaultAmendDefault =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultAbi,
    functionName: 'amendDefault',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulatePayrollVaultClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"fund"`
 */
export const useSimulatePayrollVaultFund =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultAbi,
    functionName: 'fund',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"mintSalaryToken"`
 */
export const useSimulatePayrollVaultMintSalaryToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultAbi,
    functionName: 'mintSalaryToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultAbi}__ and `functionName` set to `"onDefaultDetected"`
 */
export const useSimulatePayrollVaultOnDefaultDetected =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultAbi,
    functionName: 'onDefaultDetected',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultAbi}__
 */
export const useWatchPayrollVaultEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: payrollVaultAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchPayrollVaultClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultAbi}__ and `eventName` set to `"DefaultAmended"`
 */
export const useWatchPayrollVaultDefaultAmendedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultAbi,
    eventName: 'DefaultAmended',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultAbi}__ and `eventName` set to `"DefaultDetected"`
 */
export const useWatchPayrollVaultDefaultDetectedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultAbi,
    eventName: 'DefaultDetected',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultAbi}__ and `eventName` set to `"Funded"`
 */
export const useWatchPayrollVaultFundedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultAbi,
    eventName: 'Funded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctp = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultCctpAbi,
  address: payrollVaultCctpAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"asset"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpAsset = /*#__PURE__*/ createUseReadContract(
  {
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'asset',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"cctp"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpCctp = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultCctpAbi,
  address: payrollVaultCctpAddress,
  functionName: 'cctp',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"checkSolvency"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpCheckSolvency =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'checkSolvency',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"defaultCount"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpDefaultCount =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'defaultCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"ecToken"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpEcToken =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'ecToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"employer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpEmployer =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'employer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"endTime"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpEndTime =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'endTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"getBalance"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpGetBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'getBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"getDefaults"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpGetDefaults =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'getDefaults',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"getEmployerCreditScore"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpGetEmployerCreditScore =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'getEmployerCreditScore',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"getMintedTokens"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpGetMintedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'getMintedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"getRequiredEscrow"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpGetRequiredEscrow =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'getRequiredEscrow',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"getVaultInfo"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpGetVaultInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'getVaultInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"messageTransmitter"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpMessageTransmitter =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'messageTransmitter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"startTime"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpStartTime =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'startTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"totalFunded"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpTotalFunded =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'totalFunded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"vaultId"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useReadPayrollVaultCctpVaultId =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'vaultId',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctp = /*#__PURE__*/ createUseWriteContract({
  abi: payrollVaultCctpAbi,
  address: payrollVaultCctpAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"amendDefault"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctpAmendDefault =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'amendDefault',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"claim"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctpClaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"claimCrossChain"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctpClaimCrossChain =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'claimCrossChain',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"fund"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctpFund =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'fund',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"mintSalaryToken"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctpMintSalaryToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'mintSalaryToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"onDefaultDetected"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctpOnDefaultDetected =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'onDefaultDetected',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"receiveCrossChainFunding"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWritePayrollVaultCctpReceiveCrossChainFunding =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'receiveCrossChainFunding',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"amendDefault"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctpAmendDefault =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'amendDefault',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"claim"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctpClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"claimCrossChain"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctpClaimCrossChain =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'claimCrossChain',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"fund"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctpFund =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'fund',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"mintSalaryToken"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctpMintSalaryToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'mintSalaryToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"onDefaultDetected"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctpOnDefaultDetected =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'onDefaultDetected',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `functionName` set to `"receiveCrossChainFunding"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useSimulatePayrollVaultCctpReceiveCrossChainFunding =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    functionName: 'receiveCrossChainFunding',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultCctpAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWatchPayrollVaultCctpEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `eventName` set to `"Claimed"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWatchPayrollVaultCctpClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `eventName` set to `"CrossChainClaimInitiated"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWatchPayrollVaultCctpCrossChainClaimInitiatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    eventName: 'CrossChainClaimInitiated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `eventName` set to `"CrossChainFundingReceived"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWatchPayrollVaultCctpCrossChainFundingReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    eventName: 'CrossChainFundingReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `eventName` set to `"DefaultAmended"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWatchPayrollVaultCctpDefaultAmendedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    eventName: 'DefaultAmended',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `eventName` set to `"DefaultDetected"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWatchPayrollVaultCctpDefaultDetectedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    eventName: 'DefaultDetected',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultCctpAbi}__ and `eventName` set to `"Funded"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a)
 */
export const useWatchPayrollVaultCctpFundedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultCctpAbi,
    address: payrollVaultCctpAddress,
    eventName: 'Funded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useReadPayrollVaultFactory = /*#__PURE__*/ createUseReadContract({
  abi: payrollVaultFactoryAbi,
  address: payrollVaultFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"asset"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useReadPayrollVaultFactoryAsset =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'asset',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"ecToken"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useReadPayrollVaultFactoryEcToken =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'ecToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"employerVaults"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useReadPayrollVaultFactoryEmployerVaults =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'employerVaults',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"getEmployerVaults"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useReadPayrollVaultFactoryGetEmployerVaults =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'getEmployerVaults',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"getVaultAddress"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useReadPayrollVaultFactoryGetVaultAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'getVaultAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"vaults"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useReadPayrollVaultFactoryVaults =
  /*#__PURE__*/ createUseReadContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'vaults',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useWritePayrollVaultFactory = /*#__PURE__*/ createUseWriteContract(
  { abi: payrollVaultFactoryAbi, address: payrollVaultFactoryAddress },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"createVault"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useWritePayrollVaultFactoryCreateVault =
  /*#__PURE__*/ createUseWriteContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'createVault',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useSimulatePayrollVaultFactory =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `functionName` set to `"createVault"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useSimulatePayrollVaultFactoryCreateVault =
  /*#__PURE__*/ createUseSimulateContract({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    functionName: 'createVault',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultFactoryAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useWatchPayrollVaultFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link payrollVaultFactoryAbi}__ and `eventName` set to `"VaultCreated"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x17cd72a6119be4e775479cb755a8cf4b79a0f895)
 */
export const useWatchPayrollVaultFactoryVaultCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: payrollVaultFactoryAbi,
    address: payrollVaultFactoryAddress,
    eventName: 'VaultCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__
 *
 *
 */
export const useReadRbnPrimitive = /*#__PURE__*/ createUseReadContract({
  abi: rbnPrimitiveAbi,
  address: rbnPrimitiveAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadRbnPrimitiveBalanceOf = /*#__PURE__*/ createUseReadContract(
  {
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'balanceOf',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"balanceOfBatch"`
 *
 *
 */
export const useReadRbnPrimitiveBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"getCashflow"`
 *
 *
 */
export const useReadRbnPrimitiveGetCashflow =
  /*#__PURE__*/ createUseReadContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'getCashflow',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"isApprovedForAll"`
 *
 *
 */
export const useReadRbnPrimitiveIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"owner"`
 *
 *
 */
export const useReadRbnPrimitiveOwner = /*#__PURE__*/ createUseReadContract({
  abi: rbnPrimitiveAbi,
  address: rbnPrimitiveAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"ownerOf"`
 *
 *
 */
export const useReadRbnPrimitiveOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: rbnPrimitiveAbi,
  address: rbnPrimitiveAddress,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 *
 *
 */
export const useReadRbnPrimitiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"settlementManager"`
 *
 *
 */
export const useReadRbnPrimitiveSettlementManager =
  /*#__PURE__*/ createUseReadContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'settlementManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"supportsInterface"`
 *
 *
 */
export const useReadRbnPrimitiveSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"uri"`
 *
 *
 */
export const useReadRbnPrimitiveUri = /*#__PURE__*/ createUseReadContract({
  abi: rbnPrimitiveAbi,
  address: rbnPrimitiveAddress,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__
 *
 *
 */
export const useWriteRbnPrimitive = /*#__PURE__*/ createUseWriteContract({
  abi: rbnPrimitiveAbi,
  address: rbnPrimitiveAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 *
 *
 */
export const useWriteRbnPrimitiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 *
 *
 */
export const useWriteRbnPrimitiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"mintCashflow"`
 *
 *
 */
export const useWriteRbnPrimitiveMintCashflow =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'mintCashflow',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useWriteRbnPrimitiveRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 *
 *
 */
export const useWriteRbnPrimitiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 *
 */
export const useWriteRbnPrimitiveSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 *
 */
export const useWriteRbnPrimitiveSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 *
 */
export const useWriteRbnPrimitiveSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"setSettlementManager"`
 *
 *
 */
export const useWriteRbnPrimitiveSetSettlementManager =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'setSettlementManager',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useWriteRbnPrimitiveTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__
 *
 *
 */
export const useSimulateRbnPrimitive = /*#__PURE__*/ createUseSimulateContract({
  abi: rbnPrimitiveAbi,
  address: rbnPrimitiveAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 *
 *
 */
export const useSimulateRbnPrimitiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 *
 *
 */
export const useSimulateRbnPrimitiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"mintCashflow"`
 *
 *
 */
export const useSimulateRbnPrimitiveMintCashflow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'mintCashflow',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useSimulateRbnPrimitiveRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 *
 *
 */
export const useSimulateRbnPrimitiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 *
 */
export const useSimulateRbnPrimitiveSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 *
 */
export const useSimulateRbnPrimitiveSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 *
 */
export const useSimulateRbnPrimitiveSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"setSettlementManager"`
 *
 *
 */
export const useSimulateRbnPrimitiveSetSettlementManager =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'setSettlementManager',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useSimulateRbnPrimitiveTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__
 *
 *
 */
export const useWatchRbnPrimitiveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"ApprovalForAll"`
 *
 *
 */
export const useWatchRbnPrimitiveApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"CashflowMinted"`
 *
 *
 */
export const useWatchRbnPrimitiveCashflowMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'CashflowMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 *
 *
 */
export const useWatchRbnPrimitiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 *
 *
 */
export const useWatchRbnPrimitiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 *
 */
export const useWatchRbnPrimitiveOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"TransferBatch"`
 *
 *
 */
export const useWatchRbnPrimitiveTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"TransferSingle"`
 *
 *
 */
export const useWatchRbnPrimitiveTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rbnPrimitiveAbi}__ and `eventName` set to `"URI"`
 *
 *
 */
export const useWatchRbnPrimitiveUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rbnPrimitiveAbi,
    address: rbnPrimitiveAddress,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__
 *
 *
 */
export const useReadSettlementManager = /*#__PURE__*/ createUseReadContract({
  abi: settlementManagerAbi,
  address: settlementManagerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"authorizedRecorders"`
 *
 *
 */
export const useReadSettlementManagerAuthorizedRecorders =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'authorizedRecorders',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"getAccruedAmount"`
 *
 *
 */
export const useReadSettlementManagerGetAccruedAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'getAccruedAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"getAvailableAmount"`
 *
 *
 */
export const useReadSettlementManagerGetAvailableAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'getAvailableAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"getLockedAmount"`
 *
 *
 */
export const useReadSettlementManagerGetLockedAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'getLockedAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"getSettledAmount"`
 *
 *
 */
export const useReadSettlementManagerGetSettledAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'getSettledAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"owner"`
 *
 *
 */
export const useReadSettlementManagerOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 *
 *
 */
export const useReadSettlementManagerOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"rbnPrimitive"`
 *
 *
 */
export const useReadSettlementManagerRbnPrimitive =
  /*#__PURE__*/ createUseReadContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'rbnPrimitive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__
 *
 *
 */
export const useWriteSettlementManager = /*#__PURE__*/ createUseWriteContract({
  abi: settlementManagerAbi,
  address: settlementManagerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 *
 *
 */
export const useWriteSettlementManagerCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 *
 *
 */
export const useWriteSettlementManagerCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"lockFunds"`
 *
 *
 */
export const useWriteSettlementManagerLockFunds =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'lockFunds',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"recordAccrual"`
 *
 *
 */
export const useWriteSettlementManagerRecordAccrual =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'recordAccrual',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useWriteSettlementManagerRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 *
 *
 */
export const useWriteSettlementManagerRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"setAuthorizedRecorder"`
 *
 *
 */
export const useWriteSettlementManagerSetAuthorizedRecorder =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'setAuthorizedRecorder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"setRBNPrimitive"`
 *
 *
 */
export const useWriteSettlementManagerSetRbnPrimitive =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'setRBNPrimitive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"settle"`
 *
 *
 */
export const useWriteSettlementManagerSettle =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'settle',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useWriteSettlementManagerTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__
 *
 *
 */
export const useSimulateSettlementManager =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 *
 *
 */
export const useSimulateSettlementManagerCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 *
 *
 */
export const useSimulateSettlementManagerCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"lockFunds"`
 *
 *
 */
export const useSimulateSettlementManagerLockFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'lockFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"recordAccrual"`
 *
 *
 */
export const useSimulateSettlementManagerRecordAccrual =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'recordAccrual',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useSimulateSettlementManagerRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 *
 *
 */
export const useSimulateSettlementManagerRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"setAuthorizedRecorder"`
 *
 *
 */
export const useSimulateSettlementManagerSetAuthorizedRecorder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'setAuthorizedRecorder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"setRBNPrimitive"`
 *
 *
 */
export const useSimulateSettlementManagerSetRbnPrimitive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'setRBNPrimitive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"settle"`
 *
 *
 */
export const useSimulateSettlementManagerSettle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'settle',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link settlementManagerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useSimulateSettlementManagerTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link settlementManagerAbi}__
 *
 *
 */
export const useWatchSettlementManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link settlementManagerAbi}__ and `eventName` set to `"AccrualRecorded"`
 *
 *
 */
export const useWatchSettlementManagerAccrualRecordedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    eventName: 'AccrualRecorded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link settlementManagerAbi}__ and `eventName` set to `"FundsLocked"`
 *
 *
 */
export const useWatchSettlementManagerFundsLockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    eventName: 'FundsLocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link settlementManagerAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 *
 *
 */
export const useWatchSettlementManagerOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link settlementManagerAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 *
 *
 */
export const useWatchSettlementManagerOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link settlementManagerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 *
 */
export const useWatchSettlementManagerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link settlementManagerAbi}__ and `eventName` set to `"Settled"`
 *
 *
 */
export const useWatchSettlementManagerSettledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: settlementManagerAbi,
    address: settlementManagerAddress,
    eventName: 'Settled',
  })
