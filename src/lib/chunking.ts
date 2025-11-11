import { RecursiveCharacterTextSplitter as CharactertextSplitter } from "@langchain/textsplitters"

export const textSplitter = new CharactertextSplitter({
    chunkSize: 150,
    chunkOverlap: 20,
    separators: [" "],
});

export async function chunkContent(content: String){
    return await textSplitter.splitText(content.trim());
}