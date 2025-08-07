import { z } from "zod";
import { ModelType } from "@elizaos/core";

export const fixParsedParams = (parsedParams: Record<string, any>) => {
  if (!parsedParams || typeof parsedParams !== 'object') return parsedParams;

  const fieldsToFix = ['initialSupply', 'maxSupply', 'decimals'];

  const fixed: Record<string, any> = { ...parsedParams };

  for (const field of fieldsToFix) {
    const value = fixed[field];
    const coerced = Number(value);
    if (value !== undefined && typeof value === 'string' && !Number.isNaN(coerced)) {
      fixed[field] = coerced;
    }
  }

  return fixed;
};

// Define a type that covers the structure we need to access
interface ZodTypeWithDef {
  _def?: {
    innerType?: ZodTypeWithDef;
  };
}

// Helper function to check if a field schema has _def property in a type-safe way
function hasDefProperty(obj: any): obj is ZodTypeWithDef {
  return obj && typeof obj === 'object' && '_def' in obj;
}

// Helper function to extract numeric field names from a schema
function extractNumericFields(schema: any): string[] {
  // Default to empty array if we can't determine fields
  if (!schema || typeof schema !== 'object') return [];

  // For direct object schemas
  if (schema instanceof z.ZodObject && schema.shape) {
    const numericFields: string[] = [];

    for (const [field, fieldSchema] of Object.entries(schema.shape)) {
      if (!fieldSchema) continue;

      // Handle direct ZodNumber
      if (fieldSchema instanceof z.ZodNumber) {
        numericFields.push(field);
        continue;
      }

      // Handle wrapped ZodNumber (optional, default, etc.)
      if (hasDefProperty(fieldSchema) && fieldSchema._def && fieldSchema._def.innerType) {
        let innerType: any = fieldSchema._def.innerType;
        // Go through nested wrappers if needed
        while (hasDefProperty(innerType) && innerType._def && innerType._def.innerType) {
          innerType = innerType._def.innerType;
        }
        if (innerType instanceof z.ZodNumber) {
          numericFields.push(field);
        }
      }
    }

    return numericFields;
  }

  return [];
}

export const universalFixParsedParams = (parsedParams: Record<string, any>, zodSchema: any): Record<string, any> => {
  if (!parsedParams || typeof parsedParams !== 'object') return parsedParams;

  // If we can't determine the schema or it's not a valid Zod object, fall back to the default behavior
  if (!zodSchema) {
    return fixParsedParams(parsedParams);
  }

  try {
    // Get numeric fields from the schema
    const numericFields = extractNumericFields(zodSchema);

    // If we couldn't determine numeric fields, fall back to default behavior
    if (numericFields.length === 0) {
      return fixParsedParams(parsedParams);
    }

    // Fix the parsed parameters
    const fixed: Record<string, any> = {...parsedParams};

    for (const field of numericFields) {
      const value = fixed[field];
      const coerced = Number(value);
      if (value !== undefined && typeof value === 'string' && !Number.isNaN(coerced)) {
        fixed[field] = coerced;
      }
    }

    return fixed;
  } catch (error) {
    // If any error occurs during schema analysis, fall back to default behavior
    console.warn('Error analyzing schema for numeric fields:', error);
    return fixParsedParams(parsedParams);
  }
};


export const generateResponse = async (data: any, toolName: string, runtime: any) => {
  const prompt = `
  Based on this data: ${JSON.stringify(data)}
  
  Generate response for ${toolName} tool.
  This should be string with summary of the data in user readable format. Show only relevant information.
  
  If applicable provide:
  - whole transaction hash
  - token details
  - topic details
  - smart contract details
  - other relevant information
  `;

  return await runtime.useModel(ModelType.TEXT_SMALL, {prompt});
}