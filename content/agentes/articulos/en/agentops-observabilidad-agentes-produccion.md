---
slug: "agentops-observabilidad-agentes-produccion"
category: "inteligencia-artificial"
locale: en
isPillar: false
title: "AgentOps: how to run AI agents in production"
metaDescription: "AgentOps for AI agents in production: what to observe, OpenTelemetry GenAI, drift, auditing, incidents, versioning and governance with NIST and ISO 42001."
tags: ["ai agents", "agentops", "observability", "opentelemetry", "ai governance", "drift"]
coverBrief: "Ilustración geométrica: a la izquierda, un agente representado como un nodo con varias ramas (pasos y herramientas) que emiten líneas finas de trazas; las líneas convergen en un panel central con pequeñas series de tiempo y un indicador de alerta; a la derecha, un tablero con cuatro bloques (Govern, Map, Measure, Manage) y una flecha circular que vuelve al agente. Paleta de marca Nivelics, fondo oscuro, sin texto incrustado salvo etiquetas mínimas."
coverAlt: "AI agent sending traces to an observability platform that feeds a governance dashboard and an improvement loop"
faqItems:
  - question: "What is AgentOps?"
    answer: "The discipline of running AI agents in production: observing what they do step by step, controlling their cost, detecting when their behavior changes, responding to incidents and governing their versions. It borrows practices from DevOps and MLOps and adapts them to systems that reason, call tools and act on other systems."
  - question: "What is the difference between monitoring an API and observing an agent?"
    answer: "For an API, latency, errors and volume are enough. For an agent you also need the trace of every step: what the model decided, which tool it called with which arguments, what came back and how many tokens it consumed. An agent can respond with a 200 status code and still have made the wrong decision."
  - question: "Are the OpenTelemetry conventions for generative AI stable yet?"
    answer: "No. As of this article they are marked with Development status and are maintained in a dedicated repository within the OpenTelemetry project. Even so, they already define spans for invoking agents and executing tools, token usage attributes and duration metrics, so it makes sense to adopt them while wrapping the instrumentation to absorb changes."
  - question: "What is drift in an AI agent?"
    answer: "A change in its behavior without you having changed the agent. It can come from the data it receives, from the way users use it or from a new version of the provider's model. It is detected by comparing behavioral metrics against a baseline and running periodic evaluations on a fixed set of cases."
  - question: "Which frameworks help govern agents in a regulated organization?"
    answer: "The NIST AI RMF 1.0 organizes risk management into four functions: Govern, Map, Measure and Manage. ISO/IEC 42001:2023 specifies the requirements for a certifiable AI management system. The two complement each other: the first structures the risk work and the second turns it into an auditable management system."
sources:
  - "https://github.com/open-telemetry/semantic-conventions-genai"
  - "https://platform.claude.com/docs/en/about-claude/model-deprecations"
  - "https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html"
  - "https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements"
  - "https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
  - "https://www.nist.gov/itl/ai-risk-management-framework"
  - "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/"
  - "https://www.iso.org/standard/42001"
  - "https://genai.owasp.org/llm-top-10/"
---

# AgentOps: how to run AI agents in production

Putting an agent into production is the beginning of the work, not the end. From that day on, the agent receives inputs nobody anticipated, the provider ships new model versions, the systems it queries change their schemas and the cost per task shifts without anyone touching the code. If you can't see what the agent did at each step, you can't explain an error, defend a decision in an audit or know whether today's version is better than last month's.

AgentOps is the discipline that solves this. In our [pillar article on harness engineering](/en/blog/harness-engineering-agentes-ia) we placed it in the fifth and seventh layers of the harness: observability and continuous feedback. Here we get concrete: what to measure, with which standard, how to detect changes, how to audit, how to respond to incidents and how to govern the whole lifecycle.

## What to observe in an agent

An agent is not just another API. It can return a well-formed response, on time and without network errors, and still have made the wrong decision. That's why the unit of observation isn't the request; it's the **full trace of the task**.

| Signal           | What to capture                                                  | What it's for                                                        |
| ---------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| Per-step trace   | Every model call, in order, with the model and version used      | Reconstructing the reasoning and pinpointing where it went off track |
| Tool calls       | Name, arguments, result, error, duration                         | Spotting tools that are slow, misused or failing silently            |
| Tokens and cost  | Input and output tokens per step, cost per task                  | Budgets, alerts on abnormal consumption, comparison across versions  |
| Latency          | Duration per step and end to end                                 | Detecting loops, retries and bottlenecks                             |
| Escalations      | When the agent asked for human help and what the person answered | Measuring real autonomy and decision quality                         |
| Business outcome | Task resolved, rolled back, reopened                             | Connecting technical operations to value                             |

Two design decisions matter from day one:

- **Correlation.** Each task has an identifier that travels through every call: model, tools, downstream systems and human approvals. Without it, the trace breaks at exactly the point you need to investigate.
- **Content versus metadata.** Logging full prompts and responses helps with debugging, but it can store personal data. Keep them apart: metadata always; content with short retention, masked and with restricted access.

## OpenTelemetry for generative AI: what exists and how mature it is

There's no need to invent your own trace format. OpenTelemetry maintains [semantic conventions for generative AI](https://github.com/open-telemetry/semantic-conventions-genai) in a dedicated repository. They cover events, exceptions, metrics, model spans and agent spans, plus specific conventions for Anthropic, AWS Bedrock, Azure AI Inference, OpenAI and the Model Context Protocol.

What matters for an agent:

- **Agent and tool spans.** Operations such as `invoke_agent` and `execute_tool`, with attributes such as `gen_ai.agent.id`, `gen_ai.agent.version` and `gen_ai.tool.name`.
- **Token usage and model.** Attributes such as `gen_ai.request.model`, `gen_ai.response.model`, `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens`.
- **Metrics.** For example `gen_ai.client.token.usage` and `gen_ai.client.operation.duration`.
- **Content as opt-in.** Attributes such as `gen_ai.input.messages` are optional, and the specification itself warns that they are likely to contain sensitive information, including personal data.

**Maturity matters:** as of September 2026 these conventions are marked as _Development_, not stable. Attribute names may change. The practical recommendation is to adopt them, because they give you portability across observability tools, but to wrap the instrumentation in your own layer so that a convention change doesn't force you to touch every agent.

<!-- DIAGRAM: Left-to-right flow. Box 1 "Agent in production" with two stacked sub-blocks: "model call", "execute_tool". Arrow labeled "traces + metrics (OpenTelemetry GenAI)" to Box 2 "Observability platform" (sub-labels: "traces per task", "tokens, cost and latency"). Two arrows leave Box 2 toward Box 3 "Alerts": "behavioral drift" and "cost / abnormal consumption". From Box 3, arrow to Box 4 "Governance dashboard (NIST AI RMF)". From Box 4, curved return arrow to Box 1 labeled "improvement loop: evals → new version → gradual rollout". -->

![Agent in production sending traces to an observability platform, which raises drift and cost alerts and feeds a governance dashboard with an improvement loop back to the agent](/blog/agentes/agentops-observabilidad-agentes-produccion-1-en.svg)

## Drift detection: when the agent changes without you changing it

An agent has at least three sources of drift, and each one is detected differently.

### Data drift

The data the agent receives stops looking like the data you had when you evaluated it: a new type of request, a supplier that changed its invoice format, a system that started returning empty fields. It is detected by watching the distribution of inputs (categories, length, language, missing fields) and the rate of validation errors in tools.

### Behavioral drift

With the same inputs, the agent starts doing different things: more steps per task, more calls to a particular tool, more escalations, longer answers or more rejections from the human reviewer. It is detected by comparing those metrics against a per-version baseline and periodically running the same fixed set of [evaluation and verification](/en/blog/evals-verificacion-agentes-ia) cases you used to approve the version.

### Provider model version changes

This is the drift that catches teams most off guard, because it isn't in their repository. Providers retire models under their own rules:

- Anthropic [gives at least 60 days' notice](https://platform.claude.com/docs/en/about-claude/model-deprecations) before retiring a publicly released model, and requests to a retired model fail.
- In [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html), models go through Active, Legacy and End-of-Life states; for models launched from September 7, 2026 onward, the Legacy period is 6 months or 45 days depending on the model, and migration doesn't happen automatically.
- In [Azure OpenAI (Microsoft Foundry)](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements), Standard deployments can be upgraded to new versions automatically; the `versionUpgradeOption` property lets you choose between upgrading when a new default version is available, only when the current one expires, or never (`NoAutoUpgrade`).

The lesson: **pin explicit model versions**, turn off automatic upgrades in production (in Azure, with `NoAutoUpgrade` the deployment stops working when the model is retired, so the migration must be planned before that date), record the version in every span and treat any model change as a deployment, with prior evaluations and a gradual rollout. A per-provider model retirement calendar is part of the AgentOps inventory.

## Auditing and traceability

In a regulated organization, the audit question isn't "what did the model say?" but **who did what, when and with what permission**. An auditable agent log answers:

- **Who:** the agent (identifier and version) and the user on whose behalf it acted.
- **What:** the action executed, the arguments and the result, with the diff on the downstream system.
- **When:** a timestamp for every step, not just the start of the task.
- **With what permission:** the credential or scope used and, if there was human approval, who approved and when.
- **With what configuration:** the version of the prompt, the tool set and the model.

The [MCP specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) recommends that clients log tool usage for auditing. In practice, that log must be immutable (append-only), have a retention period set by compliance and be queryable by someone other than the team that built the agent.

## Incident management for agents

An incident involving an agent looks like a software incident and an operational one at the same time. It pays to have a dedicated runbook:

1. **Contain.** Move the affected action down to a lower autonomy level (from execute to suggest) or disable a specific tool, without shutting down the whole agent. This is only possible if the design planned for it; we explain how in the article on [guardrails and human oversight](/en/blog/guardrails-control-humano-agentes).
2. **Scope.** Use the traces to identify which tasks were affected, since when and with which version.
3. **Roll back.** Undo the actions that can be reversed and open manual cases for those that can't.
4. **Explain.** Reconstruct the chain: input, model steps, tool calls, result.
5. **Prevent.** Turn the case into a regression test that runs before every new version.

Cost incidents deserve a mention of their own: a retry loop or an input crafted to inflate consumption can multiply spend within hours. OWASP lists this risk as unbounded consumption in its [Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/). Cost alerts per task and per agent, with an automatic cutoff, are part of the runbook.

## Versioning: prompts, tools and models

An agent's behavior depends on at least three artifacts that change at different speeds. Each needs its own version, and the combination needs an agent version:

| Artifact                 | What to version                                  | Typical mistake                                                             |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------- |
| Prompts and instructions | Text, templates, examples                        | Hot-editing them from a console with no record                              |
| Tools                    | Schema, description, permissions, implementation | Changing a tool's description without realizing the model reads it          |
| Model                    | Provider, exact identifier, parameters           | Using aliases that point to the latest version                              |
| Agent                    | The combination of the three above               | Not being able to say which combination was live on the day of the incident |

Every new agent version goes through the same path: evaluation against the fixed set of cases, comparison with the current version, gradual rollout (a percentage of traffic or a group of users) and one-step rollback if the metrics get worse.

## Example: an agent that triages and prioritizes operational alerts

Consider an agent that helps the IT operations team triage and prioritize monitoring alerts. Here is what it looks like with AgentOps in place:

- **Input:** alerts from the monitoring system. They are treated as untrusted content: they may include log text written by any application.
- **Read tools (autonomous):** query the service's recent metrics, search for similar incidents in the history, read the service runbook.
- **Structured decision:** the agent proposes severity, affected service, probable cause, alerts it groups as duplicates and a suggested action. The output is validated against a schema.
- **Actions with human approval:** open or escalate an incident, silence duplicate alerts, run a remediation step from the runbook. The on-call engineer sees the proposal with the evidence (charts, similar incidents) and approves, corrects or rejects it.
- **Observability:** every alert produces a trace with the model's steps, the queries made, the proposal and the human decision.
- **Operational metrics:** percentage of proposals approved without changes, time from alert to decision, silenced alerts that later turned out to be relevant (the costliest error) and cost per alert triaged and prioritized.
- **Drift:** if the model provider changes versions or a new type of alert appears, the rate of human corrections goes up; that behavioral alert triggers a review before a real alert is missed.

Over time, the metrics show which actions can move up an autonomy level (grouping duplicates, for example) and which should stay under approval (silencing or remediating).

## Governance: NIST AI RMF and ISO/IEC 42001

Technical operations need a governance framework that gives them structure and makes them auditable. Two references work well for organizations with demanding compliance requirements:

- **[NIST AI RMF 1.0](https://www.nist.gov/itl/ai-risk-management-framework)**, published in January 2023, organizes AI risk management into [four functions](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/). **Govern** cultivates a culture of risk management; **Map** establishes the system's context, purpose and impacts; **Measure** analyzes, assesses and monitors risks with quantitative and qualitative methods; **Manage** allocates resources to address them, including incident response and continuous monitoring. In July 2024 NIST complemented the framework with the generative AI profile NIST AI 600-1.
- **[ISO/IEC 42001:2023](https://www.iso.org/standard/42001)** specifies the requirements for establishing, implementing, maintaining and continually improving an AI management system. It is certifiable, which makes it useful when a customer or regulator asks for formal evidence.

Translated into AgentOps, the mapping is straightforward:

| NIST function | In agent operations                                                 |
| ------------- | ------------------------------------------------------------------- |
| Govern        | Owners per agent, autonomy policies, inventory of agents and models |
| Map           | Processes each agent touches, data it uses, impact of its actions   |
| Measure       | Traces, periodic evaluations, drift, cost and escalation metrics    |
| Manage        | Incident runbooks, version rollbacks, autonomy adjustments          |

The governance dashboard isn't a quarterly report: it is a live view that shows, per agent, the active version, quality metrics, cost, incidents and changes pending approval.

## AgentOps checklist

- [ ] Every task has an end-to-end trace with a correlation ID.
- [ ] Instrumentation follows the OpenTelemetry GenAI conventions, wrapped in your own layer.
- [ ] Sensitive content is logged separately, masked and with short retention.
- [ ] The model version is pinned and recorded in every span; there is a retirement calendar per provider.
- [ ] There are behavioral baselines and periodic evaluations on a fixed set of cases.
- [ ] There are cost alerts per task and per agent, with an automatic cutoff.
- [ ] The audit log answers who, what, when and with what permission, and it is immutable.
- [ ] There is an incident runbook that lets you contain without shutting down the whole agent.

## Let's talk

If you already have agents in production, or are about to, and need to see, measure and govern them with the rigor your organization demands, that is the focus of our [agent operations and governance (AgentOps)](/en/services/artificial-intelligence/agentops) service. [Write to us](/en/contact) and we'll look together at what's happening inside your agents today.
