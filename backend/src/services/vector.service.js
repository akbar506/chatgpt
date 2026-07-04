// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatgptIndex = pc.Index(process.env.PINECONE_INDEX_NAME);

async function createVectorMemory({ vector, metadata, messageId }) {
    // Upsert the generated vectors into the Pinecone index with the provided metadata and messageId
    await chatgptIndex.upsert({
        records: [
            {
                id: messageId, // Use the message ID as the unique identifier for the vector
                values: vector,
                metadata: metadata
            }
        ]
    })
}

async function queryVectorMemory({ vector, topK = 5, metadata }) {
    // Query the Pinecone index for similar vectors
    const data = await chatgptIndex.query({
        vector,
        topK,
        filter: metadata ? { metadata } : undefined, // Apply metadata filter if provided
        includeMetadata: true
    })
    
    return data.matches || [];
}

async function generateEmbedding(content) {
    // Generate an embedding for the given content using the Google GenAI model
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: content,
        config: {
            outputDimensionality: 768
        }
    });

    return response.embeddings
}

module.exports = {
    createVectorMemory,
    queryVectorMemory,
    generateEmbedding
}