import {embed, embedMany} from "ai"
import { openai } from "@ai-sdk/openai"


export async function generateEmbedding(text: String){
   const input = text.replace("\n", " ");
   
   const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: input
   })

   return embedding;
}

export async function generateEmbeddings(texts: String[]){
    const inputs = texts.map((text)=> text.replace("\n", ""))

    const { embeddings }  = await embedMany({
        model: openai.textEmbeddingModel("text-embedding-3-small"),
        values: inputs
    })

    return embeddings
}