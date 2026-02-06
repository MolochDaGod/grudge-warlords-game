// Grudge Warlords - Asset Management System with Performance Optimization

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

export interface AssetManifest {
  models: { [key: string]: string };
  textures: { [key: string]: string };
  audio?: { [key: string]: string };
}

export interface LoadProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentAsset: string;
  phase: 'models' | 'textures' | 'audio' | 'complete';
}

class AssetManager {
  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private dracoLoader: DRACOLoader;
  private ktx2Loader: KTX2Loader;
  
  private loadedModels: Map<string, THREE.Group> = new Map();
  private loadedTextures: Map<string, THREE.Texture> = new Map();
  private loadQueue: Array<() => Promise<void>> = [];
  
  private progressCallback?: (progress: LoadProgress) => void;
  private totalAssets = 0;
  private loadedAssets = 0;
  private currentPhase: LoadProgress['phase'] = 'models';
  
  // Performance optimization settings
  private maxTextureSize = 2048;
  private enableDraco = true;
  private enableKTX2 = false; // Set to true if you have KTX2 textures

  constructor() {
    // Initialize GLTF loader with DRACO compression support
    this.gltfLoader = new GLTFLoader();
    
    // Setup DRACO loader for compressed geometries
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.dracoLoader.setDecoderConfig({ type: 'js' });
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    
    // Setup KTX2 loader for compressed textures (optional)
    this.ktx2Loader = new KTX2Loader();
    this.ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.182.0/examples/jsm/libs/basis/');
    
    // Setup texture loader with optimization
    this.textureLoader = new THREE.TextureLoader();
    
    // Enable texture caching
    THREE.Cache.enabled = true;
  }

  /**
   * Set progress callback for loading updates
   */
  onProgress(callback: (progress: LoadProgress) => void) {
    this.progressCallback = callback;
  }

  /**
   * Update loading progress
   */
  private updateProgress(assetName: string) {
    this.loadedAssets++;
    const percentage = Math.floor((this.loadedAssets / this.totalAssets) * 100);
    
    if (this.progressCallback) {
      this.progressCallback({
        loaded: this.loadedAssets,
        total: this.totalAssets,
        percentage,
        currentAsset: assetName,
        phase: this.currentPhase
      });
    }
  }

  /**
   * Optimize texture for web performance
   */
  private optimizeTexture(texture: THREE.Texture): THREE.Texture {
    // Limit texture size
    if (texture.image) {
      const maxSize = this.maxTextureSize;
      if (texture.image.width > maxSize || texture.image.height > maxSize) {
        texture.image = this.resizeImage(texture.image, maxSize);
      }
    }

    // Optimize texture settings for performance
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4; // Moderate anisotropic filtering
    
    // Enable compression if supported
    if (texture.format === THREE.RGBAFormat) {
      // Use DXT5 compression for RGBA textures if available
      texture.format = THREE.RGBAFormat;
    }
    
    return texture;
  }

  /**
   * Resize image to max dimensions while maintaining aspect ratio
   */
  private resizeImage(image: HTMLImageElement, maxSize: number): HTMLImageElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let width = image.width;
    let height = image.height;
    
    if (width > maxSize || height > maxSize) {
      const scale = maxSize / Math.max(width, height);
      width = Math.floor(width * scale);
      height = Math.floor(height * scale);
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(image, 0, 0, width, height);
    
    const resizedImage = new Image();
    resizedImage.src = canvas.toDataURL();
    return resizedImage;
  }

  /**
   * Load a GLTF/GLB model with optimization
   */
  async loadModel(name: string, url: string): Promise<THREE.Group> {
    // Check cache first
    if (this.loadedModels.has(name)) {
      return this.loadedModels.get(name)!.clone();
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          
          // Optimize model
          this.optimizeModel(model);
          
          // Cache the model
          this.loadedModels.set(name, model);
          
          this.updateProgress(name);
          resolve(model.clone());
        },
        (progress) => {
          // Optional: Handle individual file progress
          console.log(`Loading ${name}: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
        },
        (error) => {
          console.error(`Error loading model ${name}:`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Optimize loaded model for performance
   */
  private optimizeModel(model: THREE.Group) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enable shadow casting/receiving
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Optimize geometry
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox();
          
          // Dispose of unnecessary attributes
          if (!child.geometry.attributes.uv && !child.geometry.attributes.uv2) {
            // No UVs, can remove normal if not needed
          }
        }
        
        // Optimize materials
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          
          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              // Optimize material settings
              material.needsUpdate = true;
              
              // Optimize textures if they exist
              if (material.map) {
                this.optimizeTexture(material.map);
              }
              if (material.normalMap) {
                this.optimizeTexture(material.normalMap);
              }
              if (material.roughnessMap) {
                this.optimizeTexture(material.roughnessMap);
              }
              if (material.metalnessMap) {
                this.optimizeTexture(material.metalnessMap);
              }
            }
          });
        }
        
        // Enable frustum culling
        child.frustumCulled = true;
      }
    });
  }

  /**
   * Load a texture with optimization
   */
  async loadTexture(name: string, url: string): Promise<THREE.Texture> {
    // Check cache first
    if (this.loadedTextures.has(name)) {
      return this.loadedTextures.get(name)!;
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          // Optimize texture
          this.optimizeTexture(texture);
          
          // Cache the texture
          this.loadedTextures.set(name, texture);
          
          this.updateProgress(name);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Error loading texture ${name}:`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Load all assets from manifest
   */
  async loadManifest(manifest: AssetManifest): Promise<void> {
    // Calculate total assets
    this.totalAssets = 
      Object.keys(manifest.models).length +
      Object.keys(manifest.textures).length +
      (manifest.audio ? Object.keys(manifest.audio).length : 0);
    
    this.loadedAssets = 0;

    // Load models
    this.currentPhase = 'models';
    const modelPromises = Object.entries(manifest.models).map(([name, url]) =>
      this.loadModel(name, url)
    );
    await Promise.all(modelPromises);

    // Load textures
    this.currentPhase = 'textures';
    const texturePromises = Object.entries(manifest.textures).map(([name, url]) =>
      this.loadTexture(name, url)
    );
    await Promise.all(texturePromises);

    // Load audio (if needed)
    if (manifest.audio) {
      this.currentPhase = 'audio';
      // Implement audio loading if needed
    }

    this.currentPhase = 'complete';
    console.log('All assets loaded successfully!');
  }

  /**
   * Get a loaded model (returns a clone)
   */
  getModel(name: string): THREE.Group | undefined {
    const model = this.loadedModels.get(name);
    return model ? model.clone() : undefined;
  }

  /**
   * Get a loaded texture
   */
  getTexture(name: string): THREE.Texture | undefined {
    return this.loadedTextures.get(name);
  }

  /**
   * Clear all cached assets and free memory
   */
  dispose() {
    // Dispose models
    this.loadedModels.forEach((model) => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    });
    this.loadedModels.clear();

    // Dispose textures
    this.loadedTextures.forEach((texture) => {
      texture.dispose();
    });
    this.loadedTextures.clear();

    // Clear Three.js cache
    THREE.Cache.clear();
    
    console.log('Asset manager disposed');
  }
}

// Singleton instance
export const assetManager = new AssetManager();
