import { ChatGroq } from '@langchain/groq'
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import { z } from "zod"

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions? like false or true).'
      ),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness and you should only provide code and nothing else'
      ),
  })
)

const getPrompt = async (content: string) => {
    const prompt = new PromptTemplate({
        template: `Analyze this journal entry and respond ONLY with valid JSON (no schema, no markdown, just raw JSON):
{entry}

IMPORTANT: Return ONLY this JSON structure, nothing else:
{{"mood": "one word mood", "subject": "topic", "summary": "one sentence summary", "negative": true/false, "color": "#HEXCODE"}}

Example response:
{{"mood": "happy", "subject": "family time", "summary": "About watching movies with family.", "negative": false, "color": "#FFD700"}}`,
        inputVariables: ['entry'],
    })

    const input = await prompt.format({
        entry: content,
    })

    return input
}

export const analyze = async (content: string) => {
    const input = await getPrompt(content)
    const model = new ChatGroq({ 
        model: "llama-3.1-8b-instant",
        temperature: 0,
        apiKey: process.env.GROQ_API_KEY,
    })
    const result = await model.invoke(input)
    
    try {
      // Extract the string content from the result
      const resultText = typeof result.content === 'string' ? result.content : String(result)
      console.log('🔵 Groq raw response:', resultText.substring(0, 500))
      
      // Find JSON objects that contain our expected fields (mood, subject, etc)
      // Try to find the actual data JSON, not the schema
      let dataJson = ''
      
      // First, try to find a JSON object with "mood" field
      const moodMatch = resultText.match(/\{[^{}]*"mood"[\s\S]*?\}/)
      if (moodMatch) {
        dataJson = moodMatch[0]
        console.log('✅ Found JSON with mood field')
      } else {
        // Fallback: try to extract any valid looking JSON
        const jsonMatches = resultText.match(/\{[\s\S]*?\}/g)
        if (jsonMatches && jsonMatches.length > 0) {
          // Look for the largest JSON object (likely to be the data, not schema)
          dataJson = jsonMatches.sort((a, b) => b.length - a.length)[0]
        }
      }
      
      if (!dataJson) {
        console.error('❌ No valid JSON found in response:', resultText.substring(0, 300))
        throw new Error('No JSON found in response')
      }
      
      console.log('🔵 Extracted JSON:', dataJson.substring(0, 200))
      
      // Remove comments from JSON (// comments)
      let cleanJson = dataJson.replace(/\/\/.*$/gm, '')
      
      // Remove trailing commas (,\s*}) which are invalid in JSON
      cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1')
      
      // Remove control characters (newlines, tabs, etc inside strings)
      // This fixes "Bad control character in string literal" errors
      cleanJson = cleanJson.replace(/[\n\r\t]/g, ' ')
      
      // Remove unquoted property names and fix them
      cleanJson = cleanJson.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      
      // Remove multiple spaces
      cleanJson = cleanJson.replace(/\s+/g, ' ')
      
      // Parse the cleaned JSON
      const parsed = JSON.parse(cleanJson)
      console.log('✅ Parsed successfully:', parsed)
      
      // Validate and pass to parser
      const validated = await parser.parse(JSON.stringify(parsed))
      console.log('✅ Validation complete:', validated)
      return validated
    } catch(e) {
      console.error('❌ Parse error:', (e as Error).message)
      console.error('❌ Full error:', e)
      return {
        mood: 'unknown',
        subject: 'unable to analyze',
        negative: false,
        summary: 'Unable to analyze entry',
        color: '#808080',
      }
    }
}