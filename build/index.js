import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runSearch, runIndex, setIndex } from "./commands.js";
const USER_AGENT = "seroost-search-mcp/1.0";
// Create server instance
const server = new McpServer({
    name: "seroost_search",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Let's register the tools we'll use.
server.tool("seroost_search", "Search through indexed codebase using semantic/fuzzy matching. Returns ranked results with line numbers, file paths, and relevance scores. Ideal for finding functions, classes, variable usage, or code patterns across the entire project including dependencies.", {
    query: z
        .string()
        .describe("Search term or phrase to find in the codebase. Can be function names, variable names, code snippets, or natural language descriptions of functionality."),
}, async ({ query }) => {
    try {
        let content = await runSearch(query);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(content),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: "failure",
                },
            ],
        };
    }
});
server.tool("seroost_set_index", "Configure the target directory for Seroost indexing. This sets the root path that will be indexed when the index command is run. Must be called before indexing to specify which codebase directory to search.", {
    path: z
        .string()
        .describe("Absolute path to the directory containing the codebase to index. This directory and all its subdirectories will be searchable after indexing."),
}, async ({ path }) => {
    try {
        let output = await setIndex(path);
        return {
            content: [
                {
                    type: "text",
                    text: output ? "success" : "no output returned",
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: "failure",
                },
            ],
        };
    }
});
server.tool("seroost_index", "Build the search index for the previously configured directory path. This processes all files in the target directory and creates a searchable index. Must run after setting the index path with seroost_set_index. Indexing may take time for large codebases but enables fast subsequent searches.", {}, // No parameters needed - uses the path set by seroost_set_index
async () => {
    try {
        let output = await runIndex();
        return {
            content: [
                {
                    type: "text",
                    text: output ? "success" : "no output returned",
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: "failure",
                },
            ],
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Seroost Search MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
