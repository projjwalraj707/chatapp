import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";

const llm = new ChatOllama({
	model: "mistral:latest"
})

const client = new MultiServerMCPClient({
	"chatapp": {
		transport: "http",
		url: "http://localhost:3000/mcp",
	}
})

let agent: any;
const tools = await client.getTools();

try {
	agent = createAgent({
		model: llm,
		tools,
	});
	console.log("AI Agent created successfully 707 with tools:");
} catch (error) {
	console.error("Error fetching tools from MCP server:", error);
}

export { agent };
