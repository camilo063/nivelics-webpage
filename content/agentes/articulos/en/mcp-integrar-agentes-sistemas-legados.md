---
slug: "mcp-integrar-agentes-sistemas-legados"
category: "inteligencia-artificial"
locale: en
isPillar: false
title: "MCP: how to integrate AI agents with legacy systems"
metaDescription: "How to use Model Context Protocol to connect AI agents to ERPs, databases and legacy systems with least privilege, auditing and without breaking anything."
tags: ["ai agents", "mcp", "model context protocol", "legacy systems", "integration", "ai security"]
coverBrief: "Ilustración geométrica: a la izquierda un nodo circular (el agente) conectado por una sola línea a un conector rectangular central (cliente MCP); desde el conector salen tres líneas hacia tres bloques a la derecha con íconos lineales mínimos: una base de datos cilíndrica, un bloque de módulos (ERP) y un bloque más antiguo con textura de terminal/mainframe unido por una pieza adaptadora. Entre el conector y los bloques, una franja translúcida que sugiere un filtro o capa de permisos. Paleta de marca Nivelics, sin texto, sin robots."
coverAlt: "AI agent connected through an MCP client and a permissions layer to an ERP, a database and a legacy system"
faqItems:
  - question: "What is Model Context Protocol (MCP)?"
    answer: "It is an open protocol that standardizes how an application built on language models connects to external data sources and tools. It defines servers that expose tools, resources and prompts, and clients that consume them, communicating through JSON-RPC 2.0 messages. Anthropic released it in November 2024 and, in December 2025, donated it to the Agentic AI Foundation, under the Linux Foundation."
  - question: "Can I connect a legacy system that has no API through MCP?"
    answer: "Yes, but not directly. You first need an integration layer (an adapter over the database, files, queues or, as a last resort, screen automation) with stable contracts. The MCP server is built on top of that adapter, not on top of the legacy system."
  - question: "Does MCP take care of my agents' security?"
    answer: "Not on its own. The specification defines OAuth 2.1-based authorization for HTTP transports and requires servers to validate inputs, enforce access control and rate-limit calls, but it warns that the protocol itself cannot enforce those principles. Least privilege, human approval and auditing are yours to design."
  - question: "Are the readOnlyHint or destructiveHint annotations enough to decide what to approve?"
    answer: "No. The specification defines them as hints and states that clients must consider them untrusted unless they come from trusted servers. On your own servers they are useful for the approval experience, but the real control must sit in the credential's permissions and in the target system."
  - question: "When should I not use MCP?"
    answer: "When the integration is a fixed flow that doesn't need a model to decide which tool to use, when there is a single consuming application with an integration that already works, or when complex transactional operations are required that shouldn't be broken up into agent calls. In those cases, a direct integration or a deterministic workflow is usually simpler and safer."
sources:
  - "https://modelcontextprotocol.io/specification/2026-07-28"
  - "https://modelcontextprotocol.io/specification/2026-07-28/changelog"
  - "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports"
  - "https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization"
  - "https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
  - "https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices"
  - "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts"
  - "https://www.anthropic.com/news/model-context-protocol"
  - "https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/"
  - "https://www.anthropic.com/engineering/writing-tools-for-agents"
  - "https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks"
  - "https://genai.owasp.org/llm-top-10/"
  - "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
  - "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/"
  - "https://github.com/open-telemetry/semantic-conventions-genai"
---

# MCP: how to integrate AI agents with legacy systems

An AI agent that can't query your ERP, your customer database or the billing system that has been running for twenty years is good for little more than drafting emails. The value lies in connecting it to the systems where your operation lives. And that is where the risk appears: those systems were not designed to receive requests from a language model, many have no API, and nearly all of them hold data that must not leak.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2026-07-28) has become a de facto standard for this connection. But MCP is a protocol, not an integration strategy. This guide explains what the specification actually defines, how to design least-privilege MCP servers on top of existing systems, which risks it introduces, and when you are better off not using it. It is part of our series on [harness engineering](/en/blog/harness-engineering-agentes-ia), where MCP plays the role of the orchestrated tools layer.

## What MCP is and what the specification defines

Anthropic introduced MCP in November 2024 to solve a concrete problem: [every new data source required its own custom implementation](https://www.anthropic.com/news/model-context-protocol), which made connected systems hard to scale. In December 2025 it [donated MCP to the Agentic AI Foundation](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/), a directed fund under the Linux Foundation, which reduces the risk of depending on a single vendor's roadmap.

The architecture has three roles, which communicate through JSON-RPC 2.0 messages:

- **Host:** the application with the model (your agent).
- **Client:** the connector inside the host that talks to a server.
- **Server:** the service that exposes a system's capabilities.

Servers offer three primitives:

| Primitive     | What it is according to the specification  | Typical use in integration                    |
| ------------- | ------------------------------------------ | --------------------------------------------- |
| **Tools**     | Functions the model executes               | `get_supplier_balance`, `create_draft_order`  |
| **Resources** | Context and data for the user or the model | A table schema, an internal policy, a catalog |
| **Prompts**   | Templated messages and workflows for users | "Reconcile invoice", "Summarize case"         |

The specification defines two [standard transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports): **stdio**, where the client launches the server as a local subprocess, and **Streamable HTTP**, where the server is an independent service that receives POST requests on a single endpoint. For enterprise integrations, Streamable HTTP is the norm: the MCP server lives next to the system it exposes, behind your network controls.

One point worth noting if you evaluated MCP a while ago: the [2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog) revision removed protocol-level sessions and the initialization handshake. Every request carries its own version and capabilities. If a server needs state across calls (a transaction in progress, a draft), it handles it with explicit identifiers passed as arguments. This simplifies load balancing, but it means you have to validate, on every call, that the identifier belongs to whoever is using it.

### Authorization

[Authorization in MCP](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) is optional. When it is implemented over HTTP, it is based on OAuth 2.1: the MCP server acts as a resource server and the client obtains tokens from an authorization server. With stdio, credentials are taken from the environment. Three rules matter in particular:

- The server **must validate that the token was issued for it** (audience), not for another service.
- The server **must not forward** the token it received from the client to downstream systems. If it calls an internal API, it uses its own credential. The specification explicitly prohibits this _token passthrough_ because it breaks traceability and the controls of the downstream systems.
- Scopes must follow least privilege, with step-up elevation when a more sensitive operation is attempted. The [security best practices](https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices) list publishing every possible scope and using wildcard scopes such as `*` or `full-access` as common mistakes.

## Integration first, agent second

The most frequent mistake in projects involving legacy systems is starting with the agent. A convincing demo gets built against a test database and, once you reach production, reality sets in: the ERP doesn't expose the information you need, the accounts receivable system only accepts flat files in nightly batches, and nobody knows who owns the customer table.

The sequence that works is the reverse:

1. **Capability inventory.** What the agent needs to look up and do, in business terms. Not "access to the ERP," but "check the status of an invoice by number and supplier."
2. **Stable integration layer.** For each capability, a clear contract over the real system. If there is an API, you wrap it. If there isn't, you build an adapter: read-only queries against a database replica, reading exchange files, publishing to a queue the legacy system already consumes or, as a last resort, screen automation with RPA. This adapter is tested with no model involved.
3. **MCP server on top of the adapter.** It exposes those capabilities as tools designed for an agent. The MCP server never talks directly to a legacy system without an API: it goes through the adapter.
4. **Agent.** Only once everything above works and has been tested.

This separation has a clear operational advantage: the adapter can be reused in other integrations, and the legacy system is protected by a layer that controls volume, format and permissions, regardless of whether the caller is an agent, a workflow or a traditional application.

<!-- DIAGRAM: On the left, a box "Agent (host + model)". To its right, a box "MCP client". Between the client and the servers, a vertical band labeled "Permissions layer (OAuth, scopes, human approval)". To the right of the band, three stacked boxes: "ERP MCP server", "Database MCP server (read-only)" and "Legacy system MCP server". To the right of each: "ERP (API)", "DB replica" and, for the third, an intermediate box "Adapter (files / queue / RPA)" before "Legacy system without API". All client↔server arrows cross the permissions band. Below, a horizontal bar "Audit log and traces (OpenTelemetry)" receiving dotted arrows from the MCP client and from the three servers. Note: "The model never connects directly to the systems". -->

![Architecture of an agent connected through an MCP client and a permissions layer to MCP servers for an ERP, a database and a legacy system via an adapter, with an audit log](/blog/agentes/mcp-integrar-agentes-sistemas-legados-1-en.svg)

## How to design least-privilege MCP servers

### Tools designed for the agent, not mirrors of the API

Anthropic warns that [a common mistake is building tools that merely wrap existing API endpoints](https://www.anthropic.com/engineering/writing-tools-for-agents). Exposing the generic `GET /api/v2/entities` endpoint with forty parameters forces the model to guess and widens what it can do. A `find_supplier_by_tax_id` tool that returns the five fields the use case needs is better. Less surface area, fewer tokens, fewer errors.

Practical rules:

- **One server per domain and risk level.** Separate reads from writes into different servers or scopes. That way you can connect a lookup agent to the read-only server alone.
- **Strict schemas.** The specification uses JSON Schema for inputs and outputs. Define types, ranges and enumerations, and reject additional properties. The server [must validate all inputs, implement access controls, rate-limit invocations and sanitize outputs](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).
- **Its own minimal credential.** The server accesses the target system with an account that can only do what its tools expose. If the server is read-only, so is the credential. When the use case calls for it, operations run in the end user's context, not under a generic identity.
- **Bounded results.** Pagination, limits and filtered fields by default. A tool that can return the entire customer table is an exfiltration channel.

### Read-only vs. write

The specification includes [tool annotations](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts) such as `readOnlyHint`, `destructiveHint`, `idempotentHint` and `openWorldHint`. Use them on your servers: they let the client auto-approve reads and ask for confirmation before writes. But keep in mind they are **hints**: the specification states that clients must consider them untrusted unless they come from trusted servers. The real control lives in the credential and in the target system.

For writes, a pattern that works well with critical systems is **propose and confirm**: the agent doesn't create the purchase order, it creates a draft. A human or a deterministic rule confirms it. The specification recommends that [there should always be a human in the loop with the ability to deny tool invocations](https://modelcontextprotocol.io/specification/2026-07-28/server/tools); for high-impact operations, treat that recommendation as a requirement. We cover approval levels in depth in [guardrails and human oversight](/en/blog/guardrails-control-humano-agentes).

### Idempotency

Agents retry: because of a timeout, a network error, or because the model decided to call the tool again. In a legacy system, an uncontrolled retry can duplicate a payment or an inventory movement. Every write tool must accept an **idempotency key** generated by the client or the orchestrator, and the server (or the adapter) must return the original result if it receives the same key twice. If the target system doesn't support this, the adapter keeps the record of processed keys. The 2026-07-28 revision reinforces the need: if the response stream is cut off, the client must reissue the request as a new one.

### Auditing

Every invocation must leave a record of who originated it (user and agent), which tool, with which arguments, what it returned, how long it took and whether it went through approval. The specification recommends that clients [log tool usage for audit purposes](https://modelcontextprotocol.io/specification/2026-07-28/server/tools), and the 2026-07-28 revision documents OpenTelemetry trace context propagation. The [OpenTelemetry semantic conventions for generative AI](https://github.com/open-telemetry/semantic-conventions-genai), still in development, include MCP-specific conventions. Correlating the agent's trace with the server's log and with the target system's log is what lets you answer an auditor who asks "what did the agent do on March 14, and why?"

## Risks specific to connecting agents to tools

### Prompt injection through tools

OWASP ranks prompt injection as [the number one risk in the 2025 Top 10 for LLM applications](https://genai.owasp.org/llm-top-10/). The indirect variant is the most worrying one for integrations: [it occurs when the model accepts input from external sources](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) such as files or web pages. With MCP, every tool result is external content. A notes field in the ERP, the body of an email or an attached PDF can contain instructions the model interprets as commands. If the same agent can read that content and execute writes, the attack path is wide open.

Mitigations: separate agents that read untrusted content from agents that execute sensitive actions, validate results before passing them to the model, keep least privilege to limit the blast radius, and apply what OWASP calls _complete mediation_: [authorization lives in the downstream systems, not in the model's judgment](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/).

### Tool poisoning and third-party servers

In April 2025, Invariant Labs described [tool poisoning attacks](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks): malicious instructions hidden in a tool's description, invisible to the user but visible to the model. They also documented the _rug pull_ (a server changes its description after it has been approved) and cross-server _shadowing_ (a malicious server alters how the agent uses another, trusted server). It is a supply chain problem, aligned with the Supply Chain category of the OWASP Top 10.

Controls: use only your own or reviewed servers, pin versions and verify the integrity of tool definitions, alert when a description changes, and never mix unaudited third-party servers with servers that touch critical systems in the same agent. Before production, it is worth putting the integration through adversarial testing; that is part of what an agent-focused [cybersecurity and ethical hacking](/en/services/cloud/ethical-hacking) engagement covers.

## When not to use MCP

MCP adds the most value when a model needs to choose dynamically among several capabilities and when several applications will consume the same integrations. It isn't always the answer:

- **Fixed flows.** If the process always runs the same steps in the same order, a deterministic workflow (in n8n or in code) that calls the model only for the part that requires language is simpler, cheaper and easier to audit.
- **A single consumer with an integration that already works.** Rewriting it as an MCP server adds a layer with no clear benefit.
- **Complex transactional operations.** If an operation requires atomicity across several steps, don't break it into tools the agent chains together. Expose a single high-level operation that the system executes transactionally.
- **Very tight latency.** Every hop adds time; in real-time interactions, measure before you decide.

## Checklist before connecting a critical system

- [ ] The system is accessed through an adapter that has been tested without a model.
- [ ] Read and write tools are separated by server or scope.
- [ ] Each server uses its own least-privilege credential and does not forward tokens.
- [ ] Writes use idempotency keys and the propose-and-confirm pattern.
- [ ] Input schemas are strict and results are bounded.
- [ ] Every invocation is logged and correlated with the agent's trace.
- [ ] Tool definitions are versioned, and changes trigger alerts.
- [ ] Indirect injection has been tested through the data the tools return.

At Nivelics we design these integrations through our [systems integration and MCP](/en/services/artificial-intelligence/systems-integration-mcp) service, always starting with the integration layer rather than the agent. If you have systems your team wants to connect to agents without compromising their stability or security, [let's talk](/en/contact).
