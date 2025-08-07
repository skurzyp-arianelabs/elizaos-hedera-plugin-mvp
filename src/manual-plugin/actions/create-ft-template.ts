export const extractionTemplate = `Given the recent messages and Hedera wallet information below:
{{recentMessages}}

Extract the following parameters required to create a fungible token on the Hedera network.

### Required:
- **tokenName** (string): The name of the token to create.

### Optional (Include only if **explicitly mentioned** in the latest user message):
- **tokenSymbol** (string): The symbol of the token (e.g., "MTK").
- **initialSupply** (integer): The initial supply of the token.
- **supplyType** (string): Can be "finite" or "infinite".
- **maxSupply** (integer): The maximum supply of the token. Only relevant if supplyType is "finite".
- **decimals** (integer): Number of decimal places the token supports.
- **treasuryAccountId** (string): The Hedera account ID of the treasury (e.g., "0.0.123456").
- **isSupplyKey** (boolean): Indicates whether a supply key should be set. Set to \`true\` if user wants to mint more tokens. Set to \`false\` if user says the supply is final or fixed.

⚠️ Do **not** assume values or apply defaults. Do **not** set a field unless it is clearly specified in the latest user input.

---

### Response format:

Respond with a JSON markdown block that includes **only** the fields that were explicitly mentioned in the most recent user message.

\`\`\`json
{
  "tokenName": string,
  // Optional fields only if present in input:
  // "tokenSymbol": string,
  // "initialSupply": number,
  // "supplyType": "finite" | "infinite",
  // "maxSupply": number,
  // "decimals": number,
  // "treasuryAccountId": string,
  // "isSupplyKey": boolean
}
\`\`\`

---

### Example

#### Input:
"Create new token with name MyToken with symbol MTK, 8 decimals and 1000 initial supply. The supply is fixed, don't allow further minting."

#### Output:
\`\`\`json
{
  "tokenName": "MyToken",
  "tokenSymbol": "MTK",
  "initialSupply": 1000,
  "decimals": 8,
  "isSupplyKey": false
}
\`\`\`

---

Always extract values **only from the last user message**. Do not infer or carry forward values from previous interactions.
`;
