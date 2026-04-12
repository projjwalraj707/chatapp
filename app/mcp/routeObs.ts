import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { z } from "zod";
import { findRecMsgs } from "../lib/db/dbQueries";

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

mcpServer.registerTool(
	"getFatherName",
	{
		description: "Retrieve the father's name for a given user",
		inputSchema: {
			username: z.string().describe("The username of the user for whom to retrieve the father's name"),
		},
	},
	async ({ username }) => {
		const result = "Projjwal Raj"; // Placeholder for the actual father's name retrieval logic
		return {
			content: [
				{
					type: "text",
					text: `The father's name for user ${username} is ${result}.`,
				},
			],
		}
	}
)

mcpServer.registerTool(
	"getRecentMsgs",
	{
		description: "Retrieve recent messages received across all private or group chats in the stated duration",
		inputSchema: {
			username: z.string().describe("username of the user whose chats are to be summarized. e.g. john123, _._kendrick_, piyushraj707."),
			duration: z.number().describe("The duration (in hours) to consider for message summarization. e.g. 10, 24, 48 etc"),
		},
	},
	async ({ username, duration }) => {
		const res = await findRecMsgs(username, duration);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(res),
				},
			],
		}
	}
)

/*
export async function GET(request: Request, response: Response) {
    const transport = new StreamableHTTPServerTransport();
    mcpServer.connect(transport);
    transport.handleRequest(request, response);
    //Make this function 'ping' the MCP server to verify it's running
}
  */

const transport = new StreamableHTTPServerTransport();
mcpServer.connect(transport);

export async function GET(req) {
    return new Response("MCP Server is running707", { status: 200 });
}

export async function POST(req: Request, res) {
    transport.handleRequest(req, res, req.body);
}