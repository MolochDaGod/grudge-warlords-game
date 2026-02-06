# Grudge Warlords - Asset Optimization Guide

## 🎯 Overview

This guide explains how to optimize 3D models, textures, and assets for maximum performance in Grudge Warlords.

---

## 📊 Performance Goals

- **Load Time**: < 5 seconds on 4G connection
- **FPS**: 60fps on mid-range devices
- **Memory**: < 500MB total
- **Model Size**: < 5MB per character model
- **Texture Size**: < 2048x2048 pixels

---

## 🔄 FBX to GLB Conversion

### Why GLB?
- **Smaller file size** (30-50% reduction with Draco)
- **Faster loading** (binary format)
- **Embedded textures** (single file)
- **Better browser support**

### Installation

```bash
# Install FBX2glTF converter
npm install -g fbx2gltf

# Or download from:
# https://github.com/facebookincubator/FBX2glTF/releases
```

### Usage

#### Single File Conversion
```bash
node scripts/fbx-to-glb.js character.fbx public/assets/models/character.glb
```

#### Batch Conversion
```bash
# Convert all FBX in Toon_RTS zip
node scripts/fbx-to-glb.js --batch ../Toon_RTS_1767712618837 public/assets/models/characters
```

#### Example: Convert Your Character Models
```bash
# 1. Extract Toon_RTS_1767712618837.zip
cd ../
unzip Toon_RTS_1767712618837.zip

# 2. Batch convert all characters
cd grudge-warlords-game
node scripts/fbx-to-glb.js --batch ../Toon_RTS_1767712618837/Characters public/assets/models/characters

# 3. Convert boats
node scripts/fbx-to-glb.js --batch "../World Boats" public/assets/models/props
```

---

## 🖼️ Texture Optimization

### Recommended Settings

| Type | Format | Max Size | Compression |
|------|--------|----------|-------------|
| Diffuse/Color | JPG | 2048x2048 | 85% quality |
| Normal Maps | PNG | 2048x2048 | None |
| Roughness/Metalness | JPG | 1024x1024 | 90% quality |
| Ambient Occlusion | JPG | 1024x1024 | 90% quality |

### Tools

#### ImageMagick (Batch Processing)
```bash
# Install ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Resize textures to 2048x2048
magick input.png -resize 2048x2048 -quality 85 output.jpg

# Batch process all textures
for file in textures/*.png; do
  magick "$file" -resize 2048x2048 -quality 85 "textures/$(basename $file .png).jpg"
done
```

#### Online Tools
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/

---

## 📦 Asset Management System

### Manifest File

Edit `public/assets/manifest.json` to define your assets:

```json
{
  "version": "1.0.0",
  "models": {
    "warrior": "/assets/models/characters/warrior.glb",
    "goblin": "/assets/models/enemies/goblin.glb"
  },
  "textures": {
    "grass": "/assets/textures/grass.jpg"
  }
}
```

### Loading Assets

```typescript
import { assetManager } from './services/assetManager';

// Set up progress callback
assetManager.onProgress((progress) => {
  console.log(`Loading: ${progress.percentage}%`);
  console.log(`Current: ${progress.currentAsset}`);
});

// Load manifest
const manifest = await fetch('/assets/manifest.json').then(r => r.json());
await assetManager.loadManifest(manifest);

// Use loaded model
const warriorModel = assetManager.getModel('warrior');
scene.add(warriorModel);
```

---

## ⚡ Performance Optimizations

### 1. Model Optimization

#### Polygon Count
- **Characters**: 5,000-15,000 triangles
- **Props**: 500-5,000 triangles
- **Environment**: 50,000-100,000 triangles total

#### Reduce Polycount in Blender
```python
# In Blender, select object and run:
import bpy
modifier = bpy.context.object.modifiers.new(name="Decimate", type='DECIMATE')
modifier.ratio = 0.5  # 50% reduction
bpy.ops.object.modifier_apply(modifier="Decimate")
```

### 2. Draco Compression

Already included in FBX to GLB conversion:
- **Geometry**: 60-80% size reduction
- **Quality**: Minimal visual difference
- **Load Time**: Slightly slower (worth it)

### 3. Level of Detail (LOD)

Create multiple versions of models:
```
warrior_lod0.glb  // Full detail (5-10m)
warrior_lod1.glb  // Medium (10-30m)
warrior_lod2.glb  // Low (30m+)
```

### 4. Instancing

For repeated objects (trees, rocks, enemies):
```typescript
const geometry = model.children[0].geometry;
const material = model.children[0].material;
const instancedMesh = new THREE.InstancedMesh(geometry, material, 100);

// Set positions
for (let i = 0; i < 100; i++) {
  const matrix = new THREE.Matrix4();
  matrix.setPosition(x, y, z);
  instancedMesh.setMatrixAt(i, matrix);
}
```

### 5. Frustum Culling

Already enabled in `assetManager.ts`:
```typescript
child.frustumCulled = true; // Don't render off-screen objects
```

### 6. Texture Atlasing

Combine multiple textures into one:
```
character_atlas.png  // Contains all character textures
// 2048x2048 split into 512x512 tiles
```

---

## 🎮 Three.js Renderer Settings

### Optimized Settings (Already Applied)

```typescript
const renderer = new THREE.WebGLRenderer({
  antialias: true,      // Quality
  alpha: false,         // Performance
  powerPreference: "high-performance",
  stencil: false,       // Performance
  depth: true
});

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// Shadows (use carefully)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Good balance
```

### Quality vs Performance Presets

#### Low (Mobile)
```typescript
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = false;
// No post-processing
```

#### Medium (Default)
```typescript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
// Basic post-processing
```

#### High (Desktop)
```typescript
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Full post-processing
```

---

## 📁 Folder Structure

```
public/
└── assets/
    ├── manifest.json
    ├── models/
    │   ├── characters/
    │   │   ├── warrior.glb
    │   │   ├── mage.glb
    │   │   └── ...
    │   ├── enemies/
    │   │   ├── goblin.glb
    │   │   └── ...
    │   └── props/
    │       ├── boat_small.glb
    │       └── ...
    ├── textures/
    │   ├── grass.jpg
    │   ├── stone.jpg
    │   └── ...
    └── audio/
        ├── combat.mp3
        └── ...
```

---

## 🔧 Troubleshooting

### Models Not Loading
1. Check browser console for errors
2. Verify file paths in manifest.json
3. Ensure models are in GLB format
4. Check CORS headers if loading from CDN

### Low FPS
1. Reduce polygon count
2. Lower texture resolution
3. Disable shadows
4. Use LOD system
5. Reduce number of lights

### High Memory Usage
1. Dispose unused models: `assetManager.dispose()`
2. Compress textures
3. Use texture atlasing
4. Reduce max texture size in assetManager

### Long Load Times
1. Enable Draco compression
2. Use CDN for assets
3. Implement progressive loading
4. Preload critical assets only

---

## 📈 Monitoring Performance

### In-Browser DevTools

```typescript
// FPS Counter
import Stats from 'three/examples/jsm/libs/stats.module.js';
const stats = new Stats();
document.body.appendChild(stats.dom);

// In render loop
function animate() {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
}
```

### Memory Usage

```typescript
console.log(renderer.info.memory);
// {
//   geometries: 10,
//   textures: 5
// }
```

### Draw Calls

```typescript
console.log(renderer.info.render);
// {
//   frame: 1234,
//   calls: 45,    // Lower is better
//   triangles: 50000
// }
```

---

## ✅ Optimization Checklist

### Before Launch
- [ ] All FBX converted to GLB with Draco
- [ ] Textures resized to max 2048x2048
- [ ] Textures compressed (JPG 85% quality)
- [ ] Polygon count under limits
- [ ] Manifest.json configured
- [ ] Loading screen implemented
- [ ] FPS > 60 on target hardware
- [ ] Load time < 5 seconds
- [ ] Memory < 500MB

### Regular Maintenance
- [ ] Profile performance monthly
- [ ] Update assets when new optimizations available
- [ ] Monitor user feedback on performance
- [ ] A/B test quality settings

---

## 📚 Resources

- **Three.js Performance**: https://threejs.org/docs/#manual/en/introduction/Performance
- **glTF**: https://www.khronos.org/gltf/
- **Draco**: https://google.github.io/draco/
- **FBX2glTF**: https://github.com/facebookincubator/FBX2glTF
- **Blender Export**: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html

---

## 🎯 Quick Start

```bash
# 1. Install converter
npm install -g fbx2gltf

# 2. Convert your models
node scripts/fbx-to-glb.js --batch ../Toon_RTS_1767712618837 public/assets/models

# 3. Update manifest
# Edit public/assets/manifest.json

# 4. Run game
npm run dev
```

Your assets are now optimized! 🚀
