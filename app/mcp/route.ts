import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { findRecMsgs } from "../lib/db/dbQueries";

const mcpHandler = createMcpHandler(
    (mcpServer) => {
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
                const result = "John Doe"; // Placeholder for the actual father's name retrieval logic
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
},
    {},
);

/*
export async function GET(req) {
    return new Response("MCP Server is running", { status: 200 });
}
*/

export { mcpHandler as GET, mcpHandler as POST, mcpHandler as DELETE };