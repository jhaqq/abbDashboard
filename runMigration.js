// runMigration.js
import { runMigration, verifyMigration } from "./app/hooks/productMigrations.js";
import { db } from './firebaseConfig.js'

const migrate = async () => {
  try {
    console.log('🚀 Starting product migration...');
    
    const results = await runMigration();
    
    console.log(`\n✅ Migration completed!`);
    console.log(`   Successfully migrated: ${results.successCount} products`);
    console.log(`   Failed: ${results.errorCount} products`);
    
    if (results.errorCount === 0) {
      console.log('\n🔍 Verifying migration...');
      await verifyMigration();
      console.log('\n🎉 All done! Your products are perfectly structured!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
  
  process.exit(0); // Exit the script when done
};

migrate();