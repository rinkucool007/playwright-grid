/**
 * Global Setup for Selenium Grid Tests
 * 
 * This setup verifies that Selenium Grid is running and ready
 * before any tests execute. Tests will fail immediately if Grid
 * is not accessible.
 */

async function globalSetup() {
  const GRID_URL = process.env.GRID_URL || 'http://localhost:4444';
  
  console.log('\n========================================');
  console.log('Verifying Selenium Grid Connection...');
  console.log('========================================\n');
  
  try {
    const response = await fetch(`${GRID_URL}/status`);
    const status = await response.json();
    
    if (!status.value?.ready) {
      throw new Error(`Selenium Grid is not ready`);
    }
    
    console.log(`✓ Selenium Grid is ready at ${GRID_URL}`);
    console.log(`✓ Grid version: ${status.value.nodes?.[0]?.version || 'Unknown'}`);
    console.log(`✓ Available nodes: ${status.value.nodes?.length || 0}`);
    
    // Show available browsers
    const chromeNodes = status.value.nodes?.flatMap((node: any) => 
      node.slots?.filter((slot: any) => slot.stereotype?.browserName === 'chrome')
    ).length || 0;
    
    console.log(`✓ Chrome browser slots available: ${chromeNodes}`);
    console.log('\n✓ All tests will run in Selenium Grid\n');
    
  } catch (error) {
    console.error(`\n❌ FAILED TO CONNECT TO SELENIUM GRID\n`);
    console.error(`Grid URL: ${GRID_URL}`);
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    console.error(`Please ensure Selenium Grid is running at ${GRID_URL}`);
    console.error(`You can check the Grid UI at: ${GRID_URL}/ui/#\n`);
    
    throw new Error('Selenium Grid is not available. Cannot run tests.');
  }
}

export default globalSetup;
