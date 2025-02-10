import { DynamicModule } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export async function loadConditionModules(
  pathOfConditionModules: string,
): Promise<DynamicModule[]> {
  const modulesDir = path.join(__dirname, pathOfConditionModules); // Path to the modules directory
  const moduleFiles = fs.readdirSync(modulesDir); // Read all files/folders in the directory
  const conditionModule: DynamicModule[] = [];

  for (const file of moduleFiles) {
    const modulePath = path.join(modulesDir, file);
    const stat = fs.statSync(modulePath);

    // Check if it's a directory (each module should be in its own folder)
    if (stat.isDirectory()) {
      const moduleFile = path.join(modulePath, `${file}.module.js`);
      // Check if the module file exists
      if (fs.existsSync(moduleFile)) {
        // Dynamically import the module
        const module = await import(moduleFile);
        const moduleClass = module[Object.keys(module)[0]]; // Get the module class
        conditionModule.push(moduleClass);
      }
    }
  }

  return conditionModule;
}
