// Product Migration Script - Normalize all products to clean flat structure
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js'

// Helper function to extract bubble wrap details from SKU and name
const parseBubbleWrapProduct = (product) => {
  const { sku, name } = product;
  
  // Extract bubble size
  let bubbleSize = 'unknown';
  if (sku.includes('18-') || name.includes('1/8')) bubbleSize = '1/8';
  else if (sku.includes('316-') || name.includes('3/16')) bubbleSize = '3/16';
  else if (sku.includes('516-') || name.includes('5/16')) bubbleSize = '5/16';
  else if (sku.includes('12-') || name.includes('1/2')) bubbleSize = '1/2';
  
  // Extract width (look for width patterns in SKU and name)
  let width = null;
  
  // Handle specific patterns first to avoid conflicts
  if (sku.includes('-12inch-') || sku.includes('-12-')) width = 12;
  else if (sku.includes('-24inch-') || sku.includes('-24-')) width = 24;
  else if (sku.includes('-48inch-') || sku.includes('-48-')) width = 48;
  else {
    // Try regex patterns as fallback
    const nameWidthMatch = name.match(/(\d+)["']/);
    if (nameWidthMatch) width = parseInt(nameWidthMatch[1]);
  }
  
  // Extract roll count and determine roll type
  let rollsPerPack = 1;
  let rollType = 'single';
  
  const rollCountMatch = sku.match(/x(\d+)$/);
  const nameRollMatch = name.match(/\((\d+)\s*rolls?\)/i);
  
  if (rollCountMatch) rollsPerPack = parseInt(rollCountMatch[1]);
  else if (nameRollMatch) rollsPerPack = parseInt(nameRollMatch[1]);
  
  // Determine roll type from count or name
  if (name.toLowerCase().includes('single') || rollsPerPack === 1) rollType = 'single';
  else if (name.toLowerCase().includes('double') || rollsPerPack === 2) rollType = 'double';
  else if (name.toLowerCase().includes('triple') || rollsPerPack === 3) rollType = 'triple';
  else if (name.toLowerCase().includes('quad') || rollsPerPack === 4) rollType = 'quad';
  
  // Extract length
  let length = null;
  const lengthMatch = sku.match(/-(\d+)x\d+$/) || name.match(/(\d+)'/);
  if (lengthMatch) length = parseInt(lengthMatch[1]);
  else if (name.includes('350')) length = 350;
  else if (name.includes('175')) length = 175;
  else if (name.includes('90')) length = 90;
  else if (name.includes('65')) length = 65;
  
  // Determine grade
  let grade = 'classic';
  const subCat = product.subCategory || '';
  if (subCat === 'recycled' || name.toLowerCase().includes('recycled')) grade = 'recycled';
  else if (subCat === 'limitedGrade') grade = 'limited';
  else if (subCat === 'multiPurpose') grade = 'multi_purpose';
  
  return {
    bubble_size: bubbleSize,
    width: width,
    length: length,
    roll_type: rollType,
    rolls_per_pack: rollsPerPack,
    grade: grade
  };
};

// Helper function to extract instapak details
const parseInstapakProduct = (product) => {
  const { sku, name } = product;
  
  // Extract density from SKU or name
  let density = null;
  let densityDisplay = 'unknown';
  
  const skuDensityMatch = sku.match(/INSTA-(\d+)x/);
  const nameDensityMatch = name.match(/#(\d+)/);
  
  if (skuDensityMatch) {
    density = parseInt(skuDensityMatch[1]);
    densityDisplay = `#${density}`;
  } else if (nameDensityMatch) {
    density = parseInt(nameDensityMatch[1]);
    densityDisplay = `#${density}`;
  }
  
  // Extract pack size/quantity
  let packSize = 1;
  const packSizeMatch = sku.match(/x(\d+)$/) || name.match(/\(Qty (\d+)\)/);
  if (packSizeMatch) packSize = parseInt(packSizeMatch[1]);
  
  // Determine foam type
  let foamType = 'standard';
  if (name.toLowerCase().includes('quick')) foamType = 'quick_rt';
  
  return {
    density: density,
    density_display: densityDisplay,
    pack_size: packSize,
    pack_unit: 'bags',
    foam_type: foamType
  };
};

// Helper function to normalize category names
const normalizeCategory = (category, product) => {
  const cat = category?.toLowerCase();
  
  if (cat === 'bubblewrap' || cat === 'bubble' || cat === 'recycled') return 'bubble_wrap';
  if (cat === 'instapak') return 'instapak';
  if (cat === 'leica') return 'leica';
  if (cat === 'mg2') return 'tape';
  
  // Handle edge cases based on product analysis
  if (product.name?.toLowerCase().includes('bubble') || product.sku?.includes('18-') || product.sku?.includes('316-')) {
    return 'bubble_wrap';
  }
  
  return cat || 'other';
};

// Helper function to normalize subcategory
const normalizeSubcategory = (category, subcategory, subCategory) => {
  const sub = subcategory || subCategory || '';
  
  if (category === 'leica') {
    if (sub.toLowerCase() === 'disto') return 'distance_meter';
    if (sub.toLowerCase() === 'lino') return 'laser_level';
    if (sub.toLowerCase() === 'accessory') return 'accessory';
  }
  
  if (category === 'bubble_wrap') return 'packaging';
  if (category === 'instapak') return 'void_fill';
  if (category === 'tape') return 'packaging';
  
  return 'general';
};

// Helper function to normalize grade
const normalizeGrade = (category, subCategory, name) => {
  if (category !== 'bubble_wrap') return null;
  
  const sub = subCategory?.toLowerCase() || '';
  const productName = name?.toLowerCase() || '';
  
  if (sub === 'recycled' || productName.includes('recycled')) return 'recycled';
  if (sub === 'limitedgrade') return 'limited';
  if (sub === 'multipurpose') return 'multi_purpose';
  
  return 'classic';
};

// Main migration function
const migrateProduct = (product) => {
  // Normalize basic fields
  const normalizedCategory = normalizeCategory(product.category, product);
  const normalizedSubcategory = normalizeSubcategory(normalizedCategory, product.subcategory, product.subCategory);
  const normalizedGrade = normalizeGrade(normalizedCategory, product.subCategory, product.name);
  
  // Base normalized product
  const normalizedProduct = {
    // Keep all existing core fields
    sku: product.sku,
    name: product.name,
    upc: product.upc || null,
    weight: product.weight || null,
    imageURL: product.imageURL || null,
    
    // Add standardized fields
    active: true,
    category: normalizedCategory,
    subcategory: normalizedSubcategory,
    grade: normalizedGrade,
    
    // Initialize all possible category-specific fields as null
    bubble_size: null,
    width: null,
    length: null,
    roll_type: null,
    rolls_per_pack: null,
    
    density: null,
    density_display: null,
    pack_size: null,
    pack_unit: null,
    foam_type: null,
    
    tape_width: null,
    tape_length: null,
    adhesive_type: null,
    tape_color: null,
    thickness: null
  };
  
  // Add category-specific fields
  if (normalizedCategory === 'bubble_wrap') {
    const bubbleDetails = parseBubbleWrapProduct(product);
    Object.assign(normalizedProduct, bubbleDetails);
  } else if (normalizedCategory === 'instapak') {
    const instapakDetails = parseInstapakProduct(product);
    Object.assign(normalizedProduct, instapakDetails);
  }
  
  // Remove null fields to keep documents clean
  Object.keys(normalizedProduct).forEach(key => {
    if (normalizedProduct[key] === null) {
      delete normalizedProduct[key];
    }
  });
  
  return normalizedProduct;
};

// Function to preview migration (run this first to check results)
export const previewMigration = (products) => {
  console.log('=== MIGRATION PREVIEW ===');
  
  const results = products.map(product => {
    const normalized = migrateProduct(product);
    return {
      original: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        subCategory: product.subCategory
      },
      normalized: normalized
    };
  });
  
  // Show examples from each category
  const bubbleWrapExample = results.find(r => r.normalized.category === 'bubble_wrap');
  const instapakExample = results.find(r => r.normalized.category === 'instapak');
  const leicaExample = results.find(r => r.normalized.category === 'leica');
  
  console.log('\n--- BUBBLE WRAP EXAMPLE ---');
  console.log('Original:', bubbleWrapExample?.original);
  console.log('Normalized:', bubbleWrapExample?.normalized);
  
  console.log('\n--- INSTAPAK EXAMPLE ---');
  console.log('Original:', instapakExample?.original);
  console.log('Normalized:', instapakExample?.normalized);
  
  console.log('\n--- LEICA EXAMPLE ---');
  console.log('Original:', leicaExample?.original);
  console.log('Normalized:', leicaExample?.normalized);
  
  // Show category distribution
  const categoryCount = results.reduce((acc, r) => {
    acc[r.normalized.category] = (acc[r.normalized.category] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n--- CATEGORY DISTRIBUTION ---');
  console.log(categoryCount);
  
  return results;
};

// Function to actually perform the migration
export const runMigration = async () => {
  try {
    console.log('Starting product migration...');
    
    // Get all products from Firestore
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    const products = [];
    snapshot.docs.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${products.length} products to migrate`);
    
    // Migrate each product
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        const normalizedProduct = migrateProduct(product);
        
        // Update the document in Firestore
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, normalizedProduct);
        
        successCount++;
        console.log(`✅ Migrated: ${product.sku} (${product.name})`);
        
        // Add small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to migrate ${product.sku}:`, error);
      }
    }
    
    console.log('\n=== MIGRATION COMPLETE ===');
    console.log(`✅ Successfully migrated: ${successCount} products`);
    console.log(`❌ Failed to migrate: ${errorCount} products`);
    
    return { successCount, errorCount };
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Function to verify migration results
export const verifyMigration = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    const products = [];
    snapshot.docs.forEach(doc => {
      products.push(doc.data());
    });
    
    console.log('=== MIGRATION VERIFICATION ===');
    
    // Check category distribution
    const categories = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Categories:', categories);
    
    // Check bubble wrap products have required fields
    const bubbleWrapProducts = products.filter(p => p.category === 'bubble_wrap');
    const bubbleWrapWithRequiredFields = bubbleWrapProducts.filter(p => 
      p.bubble_size && p.width && p.roll_type
    );
    
    console.log(`Bubble wrap products: ${bubbleWrapProducts.length}`);
    console.log(`With required fields: ${bubbleWrapWithRequiredFields.length}`);
    
    // Check instapak products
    const instapakProducts = products.filter(p => p.category === 'instapak');
    const instapakWithRequiredFields = instapakProducts.filter(p => 
      p.density && p.pack_size
    );
    
    console.log(`Instapak products: ${instapakProducts.length}`);
    console.log(`With required fields: ${instapakWithRequiredFields.length}`);
    
    // Show some examples
    console.log('\n--- SAMPLE MIGRATED PRODUCTS ---');
    console.log('Bubble wrap example:', bubbleWrapProducts[0]);
    console.log('Instapak example:', instapakProducts[0]);
    
    return {
      totalProducts: products.length,
      categories,
      bubbleWrapCount: bubbleWrapProducts.length,
      instapakCount: instapakProducts.length
    };
    
  } catch (error) {
    console.error('Verification failed:', error);
    throw error;
  }
};

// Usage instructions:
/*
// 1. First, preview the migration with your product data:
const productData = [... your products array ...];
const preview = previewMigration(productData);

// 2. If the preview looks good, run the actual migration:
await runMigration();

// 3. Verify the results:
await verifyMigration();
*/