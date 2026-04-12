"use server"
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from 'zod';
// import { findRecMsgs } from '../db/dbQueries.ts';

const mcpServer = new McpServer({
    name: "ChatApp MCP Server",
    version: "1.0.0",
    description: "MCP server for ChatApp",
}, {
    capabilities: {
        tools: {}
    }
});

mcpServer.registerTool(
  "ping",
  {
    description: "Health check tool to verify MCP server is running",
    inputSchema: {},
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "My name is ChatApp MCP Server and I am alive and well!",
        },
      ],
    };
  }
);

// mcpServer.registerTool(
// 	"getRecentMsgs",
// 	{
// 		description: "Retrieve recent messages received across all private or group chats in the stated duration",
// 		inputSchema: z.object({
// 			username: z.string().describe("username of the user whose chats are to be summarized. e.g. john123, _._kendrick_, piyushraj."),
// 			duration: z.number().describe("The duration (in hours) to consider for message summarization. e.g. 10, 24, 48 etc"),
// 		}),
// 	},
// 	async ({ username, duration }) => {
// 		const res = await findRecMsgs(username, duration);
// 		return {
// 			content: [
// 				{
// 					type: "text",
// 					text: JSON.stringify(res),
// 				},
// 			],
// 		}
// 	}
// )

async function main() {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
}

await main();