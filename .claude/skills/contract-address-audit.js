#!/usr/bin/env node

/**
 * Contract Address Audit Skill
 * Validates contract address management practices
 */

const { readFileSync, statSync, existsSync, readdirSync } = require('fs');
const { execSync } = require('child_process');
const { join } = require('path');

const ADDRESS_PATTERN = /['"\`](0x[a-fA-F0-9]{40})['"\`]/g;
const IMPORT_DEPLOYMENTS_PATTERN = /import.*from\s+['"].*deployments\.json['"]/;

class ContractAddressAuditor {
  constructor(options = {}) {
    this.fix = options.fix || false;
    this.verbose = options.verbose || false;
    this.checkOnly = options.checkOnly || false;
    this.issues = [];
    this.warnings = [];
    this.successes = [];
  }

  log(message, type = 'info') {
    const prefix = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: '→',
    }[type];
    console.log(`${prefix} ${message}`);
  }

  async run() {
    console.log('🔍 Auditing contract address management...\n');

    this.checkDeploymentsJson();
    this.checkWagmiGenerated();
    this.checkAddressImports();
    this.checkGitignore();
    this.scanForHardcodedAddresses();

    this.printSummary();
  }

  checkDeploymentsJson() {
    if (!existsSync('deployments.json')) {
      this.issues.push('deployments.json not found');
      this.log('deployments.json not found', 'error');
      this.log('Run: pnpm deploy:local', 'info');
      return;
    }

    const stats = statSync('deployments.json');
    const age = Math.floor((Date.now() - stats.mtime) / 1000 / 60);
    this.successes.push('deployments.json exists');
    this.log(`deployments.json exists (modified ${age} minutes ago)`, 'success');
  }

  checkWagmiGenerated() {
    if (!existsSync('src/generated.ts')) {
      this.issues.push('src/generated.ts not found');
      this.log('src/generated.ts not found', 'error');
      this.log('Run: pnpm wagmi:generate', 'info');
      return;
    }

    if (!existsSync('deployments.json')) return;

    const deploymentsTime = statSync('deployments.json').mtime;
    const generatedTime = statSync('src/generated.ts').mtime;

    if (generatedTime < deploymentsTime) {
      this.issues.push('generated.ts is outdated');
      this.log('src/generated.ts is older than deployments.json', 'error');
      this.log('Run: pnpm wagmi:generate', 'info');

      if (this.fix) {
        this.log('Running pnpm wagmi:generate...', 'info');
        try {
          execSync('pnpm wagmi:generate', { stdio: 'inherit' });
          this.log('Regenerated hooks', 'success');
        } catch (error) {
          this.log('Failed to regenerate hooks', 'error');
        }
      }
    } else {
      this.successes.push('generated.ts is up-to-date');
      this.log('src/generated.ts is up-to-date', 'success');
    }
  }

  checkAddressImports() {
    const files = ['src/contracts/addresses.ts', 'wagmi.config.ts'];

    for (const file of files) {
      if (!existsSync(file)) {
        this.warnings.push(`${file} not found`);
        this.log(`${file} not found`, 'warning');
        continue;
      }

      const content = readFileSync(file, 'utf-8');
      if (IMPORT_DEPLOYMENTS_PATTERN.test(content)) {
        this.successes.push(`${file} imports from deployments.json`);
        this.log(`${file} imports from deployments.json`, 'success');
      } else {
        this.issues.push(`${file} doesn't import from deployments.json`);
        this.log(`${file} doesn't import from deployments.json`, 'error');
        this.log(`Add: import deployments from './deployments.json'`, 'info');
      }
    }
  }

  checkGitignore() {
    if (!existsSync('.gitignore')) {
      this.warnings.push('.gitignore not found');
      this.log('.gitignore not found', 'warning');
      return;
    }

    const gitignore = readFileSync('.gitignore', 'utf-8');
    const requiredPatterns = [
      { pattern: 'contracts/broadcast/*/31337/', name: 'Anvil broadcasts' },
      { pattern: 'contracts/broadcast/*/dry-run/', name: 'Dry run broadcasts' },
      { pattern: 'src/generated.ts', name: 'Generated hooks' },
      { pattern: 'deployments.json', name: 'Deployments artifact' },
    ];

    let allCorrect = true;
    for (const { pattern, name } of requiredPatterns) {
      if (!gitignore.includes(pattern)) {
        allCorrect = false;
        this.issues.push(`Missing .gitignore pattern: ${pattern}`);
        this.log(`Missing .gitignore pattern: ${pattern} (${name})`, 'error');
      }
    }

    if (allCorrect) {
      this.successes.push('.gitignore patterns correct');
      this.log('.gitignore patterns correct', 'success');
    }
  }

  getAllFiles(dir, fileList = []) {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = join(dir, file.name);
      if (file.isDirectory()) {
        this.getAllFiles(filePath, fileList);
      } else if (file.name.match(/\.(ts|tsx)$/)) {
        fileList.push(filePath);
      }
    }
    return fileList;
  }

  scanForHardcodedAddresses() {
    console.log(''); // blank line
    if (!existsSync('src')) return;

    const allFiles = this.getAllFiles('src');
    const files = allFiles.filter(f =>
      !f.includes('generated.ts') &&
      !f.includes('.test.') &&
      !f.includes('.spec.')
    );

    let foundCount = 0;

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      // Skip if file imports from deployments.json (likely using it correctly)
      if (IMPORT_DEPLOYMENTS_PATTERN.test(content)) {
        continue;
      }

      let match;
      ADDRESS_PATTERN.lastIndex = 0; // Reset regex
      while ((match = ADDRESS_PATTERN.exec(content)) !== null) {
        const address = match[1];
        const lineNum = content.substring(0, match.index).split('\n').length;
        const line = lines[lineNum - 1].trim();

        // Skip if it's in a comment
        if (line.startsWith('//') || line.startsWith('*')) {
          continue;
        }

        foundCount++;
        this.issues.push(`Hardcoded address in ${file}:${lineNum}`);
        this.log(`Found potential hardcoded address:`, 'warning');
        console.log(`  ${file}:${lineNum}`);
        console.log(`    ${line}`);
        this.log(`Should import from deployments.json`, 'info');
        console.log(''); // blank line
      }
    }

    if (foundCount === 0) {
      this.successes.push('No hardcoded addresses found');
      this.log('No hardcoded addresses found', 'success');
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    console.log(`\n✓ Successes: ${this.successes.length}`);
    console.log(`✗ Issues: ${this.issues.length}`);
    console.log(`⚠ Warnings: ${this.warnings.length}`);

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('\n🎉 All checks passed!');
    } else if (this.issues.length > 0) {
      console.log('\n❌ Issues found that need attention');
      if (!this.fix && !this.checkOnly) {
        console.log('\nRun with --fix to auto-fix some issues');
      }
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  fix: args.includes('--fix'),
  verbose: args.includes('--verbose'),
  checkOnly: args.includes('--check-only'),
};

// Run auditor
const auditor = new ContractAddressAuditor(options);
auditor.run().catch(console.error);
