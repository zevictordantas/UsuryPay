// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {PayrollVaultCCTP} from "../src/PayrollVaultCCTP.sol";
import {MockECToken} from "../src/MockECToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {CCTPDomains} from "../src/CCTPDomains.sol";
import {ITokenMessenger, IMessageTransmitter} from "../src/interfaces/ICCTP.sol";

/**
 * @title MockTokenMessenger
 * @notice Mock CCTP TokenMessenger for testing
 */
contract MockTokenMessenger is ITokenMessenger {
    uint64 private _nonce;
    address public messageTransmitter;

    event DepositForBurn(
        uint64 indexed nonce,
        address indexed burnToken,
        uint256 amount,
        address indexed depositor,
        bytes32 mintRecipient,
        uint32 destinationDomain
    );

    constructor(address _messageTransmitter) {
        messageTransmitter = _messageTransmitter;
    }

    function depositForBurn(uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken)
        external
        returns (uint64 nonce)
    {
        // Transfer tokens from sender (simulating burn)
        MockUSDC(burnToken).transferFrom(msg.sender, address(this), amount);

        nonce = ++_nonce;
        emit DepositForBurn(nonce, burnToken, amount, msg.sender, mintRecipient, destinationDomain);
        return nonce;
    }

    function depositForBurnWithCaller(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken,
        bytes32
    ) external returns (uint64 nonce) {
        return this.depositForBurn(amount, destinationDomain, mintRecipient, burnToken);
    }

    function localMessageTransmitter() external view returns (address) {
        return messageTransmitter;
    }

    function localMinter() external pure returns (address) {
        return address(0);
    }
}

/**
 * @title MockMessageTransmitter
 * @notice Mock CCTP MessageTransmitter for testing
 */
contract MockMessageTransmitter is IMessageTransmitter {
    MockUSDC public usdc;
    mapping(bytes32 => bool) public processedMessages;

    constructor(address _usdc) {
        usdc = MockUSDC(_usdc);
    }

    function receiveMessage(bytes calldata message, bytes calldata) external returns (bool success) {
        // Decode message to get amount and recipient
        // Simplified: just mint to the caller's specified address
        bytes32 messageHash = keccak256(message);
        require(!processedMessages[messageHash], "Message already processed");
        processedMessages[messageHash] = true;

        // For testing: mint USDC to msg.sender
        // In real CCTP, the message contains the recipient
        (address recipient, uint256 amount) = abi.decode(message, (address, uint256));
        usdc.mint(recipient, amount);

        return true;
    }

    function localDomain() external pure returns (uint32) {
        return 0; // Ethereum domain
    }

    function usedNonces(uint32, uint64) external pure returns (bool) {
        return false;
    }
}

contract PayrollVaultCCTPTest is Test {
    PayrollVaultCCTP public vault;
    MockECToken public ecToken;
    MockUSDC public usdc;
    MockTokenMessenger public cctp;
    MockMessageTransmitter public messageTransmitter;

    address public employer = address(0x1);
    address public employee = address(0x2);
    address public crossChainRecipient = address(0x3);

    uint256 public constant INITIAL_FUNDING = 100_000e6; // 100k USDC
    uint256 public constant MONTHLY_SALARY = 5_000e6; // 5k USDC

    function setUp() public {
        // Deploy mocks
        usdc = new MockUSDC();
        ecToken = new MockECToken();
        messageTransmitter = new MockMessageTransmitter(address(usdc));
        cctp = new MockTokenMessenger(address(messageTransmitter));

        // Deploy CCTP vault
        vault = new PayrollVaultCCTP(
            address(usdc), address(ecToken), employer, 0, address(cctp), address(messageTransmitter)
        );

        // Register vault with token
        ecToken.setVault(0, address(vault));

        // Fund employer
        usdc.mint(employer, INITIAL_FUNDING);

        // Fund vault
        vm.startPrank(employer);
        usdc.approve(address(vault), INITIAL_FUNDING);
        vault.fund(INITIAL_FUNDING);
        vm.stopPrank();
    }

    function test_Constructor() public view {
        assertEq(address(vault.cctp()), address(cctp));
        assertEq(address(vault.messageTransmitter()), address(messageTransmitter));
        assertEq(vault.employer(), employer);
    }

    function test_ClaimCrossChain() public {
        // Mint salary token to employee
        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, MONTHLY_SALARY, 12);

        // Advance time to accrue some salary
        vm.warp(block.timestamp + 30 days);

        // Get claimable amount
        uint256 claimable = ecToken.getClaimable(tokenId);
        assertGt(claimable, 0, "Should have claimable amount");

        // Cross-chain claim to Arbitrum
        vm.prank(employee);
        uint64 nonce = vault.claimCrossChain(tokenId, claimable, CCTPDomains.ARBITRUM, crossChainRecipient);

        // Verify nonce returned
        assertGt(nonce, 0, "Nonce should be non-zero");

        // Verify USDC was transferred to CCTP (burned)
        assertEq(usdc.balanceOf(address(cctp)), claimable, "CCTP should hold burned USDC");
    }

    function test_ClaimCrossChain_PartialDefault() public {
        // Mint salary token to employee
        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, MONTHLY_SALARY, 12);

        // Advance time significantly
        vm.warp(block.timestamp + 365 days);

        // Get claimable (should exceed vault balance)
        uint256 claimable = ecToken.getClaimable(tokenId);
        uint256 vaultBalance = vault.getBalance();

        // If claimable exceeds balance, should result in partial claim
        if (claimable > vaultBalance) {
            vm.prank(employee);
            uint64 nonce = vault.claimCrossChain(tokenId, claimable, CCTPDomains.ARBITRUM, crossChainRecipient);

            assertGt(nonce, 0, "Should still return nonce for partial claim");
            assertEq(usdc.balanceOf(address(cctp)), vaultBalance, "Should transfer available balance");
        }
    }

    function test_ClaimCrossChain_RevertInvalidDomain() public {
        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, MONTHLY_SALARY, 12);

        vm.warp(block.timestamp + 30 days);
        uint256 claimable = ecToken.getClaimable(tokenId);

        vm.prank(employee);
        vm.expectRevert(PayrollVaultCCTP.InvalidDestinationDomain.selector);
        vault.claimCrossChain(tokenId, claimable, 99, crossChainRecipient); // Invalid domain
    }

    function test_ClaimCrossChain_RevertInvalidRecipient() public {
        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, MONTHLY_SALARY, 12);

        vm.warp(block.timestamp + 30 days);
        uint256 claimable = ecToken.getClaimable(tokenId);

        vm.prank(employee);
        vm.expectRevert(PayrollVaultCCTP.InvalidRecipient.selector);
        vault.claimCrossChain(tokenId, claimable, CCTPDomains.ARBITRUM, address(0));
    }

    function test_ClaimCrossChain_RevertNotOwner() public {
        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, MONTHLY_SALARY, 12);

        vm.warp(block.timestamp + 30 days);
        uint256 claimable = ecToken.getClaimable(tokenId);

        // Try to claim from non-owner
        vm.prank(address(0x999));
        vm.expectRevert("Not token owner");
        vault.claimCrossChain(tokenId, claimable, CCTPDomains.ARBITRUM, crossChainRecipient);
    }

    function test_ReceiveCrossChainFunding() public {
        uint256 fundingAmount = 50_000e6;
        uint256 balanceBefore = vault.getBalance();

        // Encode mock message (recipient, amount)
        bytes memory message = abi.encode(address(vault), fundingAmount);
        bytes memory attestation = "";

        // Receive funding
        vault.receiveCrossChainFunding(message, attestation);

        uint256 balanceAfter = vault.getBalance();
        assertEq(balanceAfter, balanceBefore + fundingAmount, "Balance should increase");
    }

    function test_ReceiveCrossChainFunding_UpdatesTotalFunded() public {
        uint256 fundingAmount = 25_000e6;
        uint256 totalFundedBefore = vault.totalFunded();

        bytes memory message = abi.encode(address(vault), fundingAmount);
        bytes memory attestation = "";

        vault.receiveCrossChainFunding(message, attestation);

        assertEq(vault.totalFunded(), totalFundedBefore + fundingAmount, "totalFunded should increase");
    }

    function test_CCTPDomains_AddressConversion() public pure {
        address testAddr = address(0x1234567890AbcdEF1234567890aBcdef12345678);
        bytes32 converted = CCTPDomains.addressToBytes32(testAddr);
        address recovered = CCTPDomains.bytes32ToAddress(converted);

        assertEq(recovered, testAddr, "Address conversion should be reversible");
    }

    function test_CCTPDomains_ValidDomains() public pure {
        assertTrue(CCTPDomains.isValidDomain(CCTPDomains.ETHEREUM));
        assertTrue(CCTPDomains.isValidDomain(CCTPDomains.ARBITRUM));
        assertTrue(CCTPDomains.isValidDomain(CCTPDomains.BASE));
        assertTrue(CCTPDomains.isValidDomain(CCTPDomains.POLYGON));
        assertFalse(CCTPDomains.isValidDomain(99));
    }
}
