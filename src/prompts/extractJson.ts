import mappings from '../data/mappings.json'
import example from '../data/example.json'

const prompt = `I have previously sent a text for analysis by GPT-4. The responses I received need to be aggregated and outputted in a strict JSON format.

**Data Output Format**:
Present the extracted data in a structured JSON format, including the company name,
industry, sector, industry group, base year, URL, emissions data, goals, reliability,
and review comments as per the specifications below. Never include any comments in the JSON output.

**Company Name**:
When a wikidata article is presented, always use the name from the wikidata article.

**Market-Based Emissions**
If the data includes market-based emissions,
include them as the emissions for scope 2.

**Biogenic CO2**
If the data includes biogenic CO2, include it in the scope 1 emissions.

**Public Comment**
When seeing the data in whole, also feel free to update the publicComment
accordingly. We are focused on the quality of the reporting, not the company itself or their
emissions but if something is unclear or seems off, please mention it in the publicComment.

**NEVER USE N/A or similar**
If a value is not available, report it as null or an empty string.

**NEVER CALCULATE ANY EMISSIONS**
If you can't find any data or if you are uncertain,
report it as null. If the company has reported individual categories but no totals, never
try to calculate totals; just report it as is.

**Units**:
If conversion is needed when extracting the data, you are allowed to convert between
units but never summarize or merge two fields into one. For example, if the data is in mSEK,
you can convert it to SEK. If the emissions are in giga tonnes CO2 (or similar), you should
convert it to tCO2e (metric tonnes CO2e).

**Verified by Wikidata**:
If you find a Wikidata article that matches the company, you can use the data from the article
to fill in the company name, ID, url, and logo. Also if you find ghg emissions data in the article,
you can use that data to fill in the emissions data and mark them as verified by wikidata with a link
to the article as a separate property: "verified": "https://www.wikidata.org/wiki/Q123456". Leave this
field empty if the data is not verified by Wikidata.

**Example**: Always generate this exact JSON structure, never use the data from the example.
\`\`\`json
${JSON.stringify(example, null, 2)}
\`\`\`

**Instructions**:
This is the elastic schema that will be used to index the results. Make sure to follow this precisely, making sure each value is the correct data type.
If the input doesn't match the data type, convert it (from string to number or vice versa) even if it means setting it to null.
If the input doesn't have a value, please make sure to set it to null or an empty string (according to the mappings).
Every property should be present in the output, make especially sure to include all the properties in the emission categories.

*** LANGUAGE: ONLY WRITE IN SWEDISH! If the original texts are written in English, translate to Swedish *** 

\`\`\`json
${JSON.stringify(mappings, null, 2)}
\`\`\`
`

export default prompt
