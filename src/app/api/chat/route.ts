import { streamText, UIMessage, convertToModelMessages, tool, InferUITools, UIDataTypes, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";

const tools = {
  searchKnowledgeBase: tool({
    description: "Search the knowledge base for relevant information",
    inputSchema: z.object({
      querry: z.string().describe("The search querry to find relevant documents")
    }),
    execute: async({ querry }) => {
      try {
        const results = await searchDocuments(querry, 3, 0.5);

        if (results.length === 0) {
          return "No relevant information found in the knowledge base"
        }

        const formatedResults = results.map((result, i) => `[${i + 1}] ${result.content}`).join("\n\n")

        return formatedResults;
      } catch (error) {
        console.error("Search error", error)
        return "Error searching the knowledge base";
      }
    },
  })
};

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1-mini"),
      messages: convertToModelMessages(messages),
      tools, 
      system: `You are a helpful assistant with access to a knowledge base. 
          When users ask questions, search the knowledge base for relevant information.
          Always search before answering if the question might relate to uploaded documents.
          Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results.`,
      stopWhen: stepCountIs(2)    
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming response", error);
    return new Response("An error has occured", { status: 500 });
  }
}
