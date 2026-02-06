#!/usr/bin/env node
/**
 * Grudge Warlords - FBX to GLB Converter
 * 
 * This script converts FBX models to optimized GLB format for web use
 * 
 * Usage:
 *   node scripts/fbx-to-glb.js input.fbx output.glb
 *   node scripts/fbx-to-glb.js --batch input-folder output-folder
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if FBX2glTF is installed
function checkFBX2glTF() {
  try {
    execSync('fbx2gltf --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('❌ FBX2glTF not found. Please install it first:');
    console.error('   npm install -g fbx2gltf');
    console.error('   Or download from: https://github.com/facebookincubator/FBX2glTF');
    return false;
  }
}

// Convert single FBX file to GLB
function convertFBXtoGLB(inputPath, outputPath, options = {}) {
  try {
    console.log(`🔄 Converting ${path.basename(inputPath)}...`);
    
    // Build FBX2glTF command with optimization flags
    const cmd = [
      'fbx2gltf',
      `"${inputPath}"`,
      '--binary',  // Output as GLB (binary)
      '--draco',   // Use Draco compression for geometries
      '--embed',   // Embed textures
      '--khr-materials-unlit', // Support unlit materials if present
      `--output "${outputPath}"`
    ].join(' ');
    
    execSync(cmd, { stdio: 'inherit' });
    
    const stats = fs.statSync(outputPath);
    console.log(`✅ Converted: ${path.basename(outputPath)} (${(stats.size / 1024).toFixed(2)} KB)`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return false;
  }
}

// Batch convert FBX files in a directory
function batchConvert(inputDir, outputDir) {
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory not found: ${inputDir}`);
    return;
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Get all FBX files in input directory
  const files = fs.readdirSync(inputDir)
    .filter(file => file.toLowerCase().endsWith('.fbx'));
  
  if (files.length === 0) {
    console.log('⚠️ No FBX files found in input directory');
    return;
  }
  
  console.log(`📦 Found ${files.length} FBX file(s) to convert\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  files.forEach(file => {
    const inputPath = path.join(inputDir, file);
    const outputFile = file.replace(/\.fbx$/i, '.glb');
    const outputPath = path.join(outputDir, outputFile);
    
    if (convertFBXtoGLB(inputPath, outputPath)) {
      successCount++;
    } else {
      errorCount++;
    }
  });
  
  console.log(`\n📊 Conversion complete:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Grudge Warlords FBX to GLB Converter
====================================

Usage:
  Single file:  node scripts/fbx-to-glb.js input.fbx output.glb
  Batch:        node scripts/fbx-to-glb.js --batch input-folder output-folder

Options:
  --help, -h    Show this help message

Requirements:
  - FBX2glTF tool must be installed
  - Install: npm install -g fbx2gltf

Examples:
  # Convert single file
  node scripts/fbx-to-glb.js character.fbx public/models/character.glb
  
  # Batch convert all FBX in folder
  node scripts/fbx-to-glb.js --batch ../models public/models

Notes:
  - Output GLB files are optimized with Draco compression
  - Textures are embedded in GLB file
  - Original FBX files are not modified
    `);
    return;
  }
  
  // Check if FBX2glTF is installed
  if (!checkFBX2glTF()) {
    process.exit(1);
  }
  
  // Batch mode
  if (args[0] === '--batch') {
    if (args.length < 3) {
      console.error('❌ Batch mode requires input and output directories');
      console.error('   Usage: node scripts/fbx-to-glb.js --batch <input-dir> <output-dir>');
      process.exit(1);
    }
    
    const inputDir = path.resolve(args[1]);
    const outputDir = path.resolve(args[2]);
    
    batchConvert(inputDir, outputDir);
  }
  // Single file mode
  else {
    if (args.length < 2) {
      console.error('❌ Single file mode requires input and output paths');
      console.error('   Usage: node scripts/fbx-to-glb.js <input.fbx> <output.glb>');
      process.exit(1);
    }
    
    const inputPath = path.resolve(args[0]);
    const outputPath = path.resolve(args[1]);
    
    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Input file not found: ${inputPath}`);
      process.exit(1);
    }
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    if (convertFBXtoGLB(inputPath, outputPath)) {
      console.log('\n✅ Conversion successful!');
    } else {
      console.log('\n❌ Conversion failed');
      process.exit(1);
    }
  }
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = { convertFBXtoGLB, batchConvert };
