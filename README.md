# Seroost Search MCP Server

A Model Context Protocol (MCP) server that provides AI agents with powerful codebase search capabilities using the [Seroost](https://github.com/Parado-xy/seroost) semantic search engine.

## Features

- **Semantic Code Search**: Find functions, classes, and code patterns using natural language queries
- **Ranked Results**: Get relevance-scored search results with line numbers and file paths
- **Fast Indexing**: Quick indexing of entire codebases including dependencies
- **MCP Integration**: Works with any MCP-compatible AI system (Claude, VS Code Copilot, etc.)
- **JSON API**: Structured responses perfect for programmatic use

## Prerequisites

- Node.js 18+
- [Seroost](https://github.com/Parado-xy/seroost) installed and built in release mode
- TypeScript (for development)

## Installation

1. **Install Seroost** (if not already installed):

   ```bash
   # Clone and build Seroost
   git clone https://github.com/Parado-xy/seroost
   cd seroost
   cargo build --release
   # Make sure the binary is in your PATH
   ```

2. **Clone this repository**:

   ```bash
   git clone https://github.com/Parado-xy/semantic-search-mcp
   cd search-mcp
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

## Usage

### As an MCP Server

Configure your MCP client to use this server:

```json
{
  "mcpServers": {
    "seroost-search": {
      "command": "node",
      "args": ["/path/to/search-mcp/build/index.js"]
    }
  }
}
```

### Available Tools

#### `seroost_set_index`

Configure the target directory for indexing.

**Parameters:**

- `path` (string): Absolute path to the directory to index

**Example:**

```json
{
  "name": "seroost_set_index",
  "arguments": {
    "path": "/home/user/my-project"
  }
}
```

#### `seroost_index`

Build the search index for the configured directory.

**Parameters:** None (uses path set by `seroost_set_index`)

**Example:**

```json
{
  "name": "seroost_index",
  "arguments": {}
}
```

#### `seroost_search`

Search through the indexed codebase.

**Parameters:**

- `query` (string): Search term, function name, or natural language description

**Example:**

```json
{
  "name": "seroost_search",
  "arguments": {
    "query": "user authentication functions"
  }
}
```

**Response:**

```json
{
  "query": "user authentication functions",
  "results": [
    {
      "rank": 1,
      "path": "/home/user/project/src/auth.js",
      "score": 0.8543,
      "line_matches": [
        {
          "line": 42,
          "content": "function authenticateUser(credentials) {"
        }
      ]
    }
  ]
}
```

## Workflow

1. **Set Index Path**: Use `seroost_set_index` to configure which directory to search
2. **Build Index**: Run `seroost_index` to process and index all files
3. **Search**: Use `seroost_search` to find relevant code with natural language queries

## Example Searches

- `"function createUser"` - Find user creation functions
- `"error handling"` - Find error handling patterns
- `"database connection"` - Find database-related code
- `"React components"` - Find React component definitions
- `"API endpoints"` - Find REST API route definitions

## Development

### Building

```bash
npm run build
```

### Project Structure

```
src/
├── index.ts        # MCP server setup and tool definitions
├── commands.ts     # Seroost command wrappers
build/              # Compiled JavaScript output
```

## How It Works

This MCP server acts as a bridge between AI agents and the Seroost search engine:

1. **Indexing**: Seroost processes your codebase and creates a searchable index
2. **Querying**: AI agents send search queries through the MCP protocol
3. **Results**: Seroost returns ranked, relevant code snippets with metadata
4. **Integration**: AI agents can use these results to understand and work with your code

## Benefits for AI Agents

- **Faster Code Discovery**: Find relevant code without reading entire files
- **Semantic Understanding**: Search by intent, not just exact text matches
- **Contextual Results**: Get ranked results with relevance scores
- **Large Codebase Support**: Handle projects with thousands of files
- **Cross-File Analysis**: Find usage patterns across the entire project

## License

ISC

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

## Related Projects

- [Seroost](https://github.com/Parado-xy/seroost) - The underlying search engine
- [Model Context Protocol](https://github.com/modelcontextprotocol) - The protocol this server implements
