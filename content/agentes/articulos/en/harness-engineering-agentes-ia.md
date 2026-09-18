---
slug: "harness-engineering-agentes-ia"
category: "inteligencia-artificial"
locale: en
isPillar: true
title: "Harness engineering: why the model is no longer your edge"
metaDescription: "The harness around an AI agent: its 7 layers (tools, verification, context, guardrails, observability, routing, feedback) and how to evaluate one."
tags:
  ["ai agents", "harness engineering", "agent engineering", "ai governance", "observability", "mcp"]
coverBrief: "Composición geométrica sobre fondo oscuro: un núcleo circular pequeño y sobrio en el centro (el modelo) rodeado por siete anillos concéntricos o segmentos hexagonales, cada uno con un ícono lineal mínimo (engranaje/llave para herramientas orquestadas, check para verificación independiente, capas apiladas para contexto y memoria, escudo para guardrails, ojo o pulso para observabilidad, bifurcación para enrutamiento de modelos, flecha circular para feedback continuo). Los anillos exteriores más gruesos y definidos que el núcleo, para transmitir que el valor está en la estructura alrededor. Paleta de marca Nivelics, sin texto en la imagen, sin robots ni cerebros."
coverAlt: "A core representing the AI model surrounded by the seven concentric layers of the harness: orchestrated tools, independent verification, context and memory, guardrails, observability, model routing and continuous feedback"
faqItems:
  - question: "What is harness engineering?"
    answer: "It is the discipline of designing everything that surrounds the language model in an agent: how it accesses tools, who verifies its work, what context and memory it receives, what limits it has, how it is observed and how it improves over time. The term gained traction in early 2026 through writing by Mitchell Hashimoto and the OpenAI team on coding agents, but the concept applies to any agent that operates on real systems."
  - question: "How is it different from prompt engineering and context engineering?"
    answer: "Prompt engineering optimizes the instructions for a single interaction. Context engineering decides what information enters the model's context window at each step. Harness engineering includes both, but adds what happens outside the model: permissions, action validation, independent verification, traceability and improvement loops."
  - question: "If I use the best model on the market, do I still need a harness?"
    answer: "Yes. A more capable model reduces some errors, but it does not decide which systems it can touch, it does not leave an auditable record of what it did, and it does not detect that its behavior changed after an update. Those guarantees come from the harness, and they are what a risk or audit function will ask for before approving an agent in production."
  - question: "Which harness layer should I build first?"
    answer: "Orchestrated tools with least-privilege permissions, and observability. Without the first, the agent can do more than it should; without the second, you don't know what it did. Verification, guardrails and evals are built on top of that foundation."
  - question: "How can I tell whether an agent vendor actually builds a harness?"
    answer: "Ask them to show you, on a concrete case, the full trace of an execution, the list of tools with their permissions, the evaluation suite they run before every change, and what happens when the agent gets something wrong. If the answer centers on the model or the prompt, the harness probably doesn't exist."
sources:
  - "https://mitchellh.com/writing/my-ai-adoption-journey"
  - "https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/"
  - "https://www.martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html"
  - "https://www.anthropic.com/engineering/building-effective-agents"
  - "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
  - "https://www.anthropic.com/engineering/writing-tools-for-agents"
  - "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - "https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
  - "https://genai.owasp.org/llm-top-10/"
  - "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/"
  - "https://github.com/open-telemetry/semantic-conventions-genai"
  - "https://www.nist.gov/itl/ai-risk-management-framework"
  - "https://www.iso.org/standard/42001"
  - "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981"
---

# Harness engineering: why the model is no longer your edge

Compare two AI agents running on the same model today. One can resolve real cases in your ERP with full traceability; the other can invent an invoice number and send it to a customer. Same model. The difference lies in everything else: which tools it can invoke and with what permissions, who reviews what it produces, what information it receives, what gets logged, and how it gets corrected when it fails.

That "everything else" has come to be called the **harness**: the scaffolding that surrounds the model. The discipline of designing it is _harness engineering_. Frontier models tend to converge and get replaced every few months; the harness is what turns any of them into a system you can trust, and it is what remains when you switch models.

## From prompt engineering to harness engineering

The way technical teams work with language models has shifted focus three times in just a few years.

**Prompt engineering.** The first stage was about wording: how to phrase the instruction, which examples to include, how to ask for a format. It worked for single-turn interactions and produced brittle results: a change of model or phrasing broke what used to work.

**Context engineering.** Once models started chaining steps and using tools, the bottleneck moved from words to information. In September 2025, Anthropic defined it as [the set of strategies for curating and maintaining the optimal set of tokens during inference](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), including all the information that reaches the model beyond the prompt. The question was no longer "how do I say it?" but "what does the model need to know at this step, and what is noise?".

**Harness engineering.** In early 2026 the term gained traction. Mitchell Hashimoto, co-founder of HashiCorp, described in [his account of adopting AI](https://mitchellh.com/writing/my-ai-adoption-journey) a practice he called "engineer the harness": every time an agent makes a mistake, take the time to build a fix so that the mistake never happens again. Days later, OpenAI published a report on an internal experiment in which engineers built a product with coding agents and focused on [designing environments, specifying intent and providing structured feedback](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/) instead of writing the code. Birgitta Böckeler, writing on Martin Fowler's site, summed it up as [a set of practices and tools for keeping agents under control](https://www.martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html).

Those pieces were born in the world of coding agents, but the idea applies just as well to agents for operations, finance, customer service or compliance.

## What an agent's harness is

A working definition: **the harness is everything around the model: who gives it tools, who checks its work, what it remembers, what it can touch, and whether anyone can see what it did.**

The model reasons and proposes; the harness decides what gets executed, with which data, within which limits and with what record. The architectural consequence: **the model should never have direct access to anything**. Everything it produces is a proposal that the harness validates.

In its guide [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), Anthropic distinguishes between _workflows_ (models and tools orchestrated through predefined code paths) and _agents_ (systems in which the model dynamically directs its own process and tool usage). Its recommendation is to start with the simplest possible solution and add autonomy only when simple solutions fall short. The harness is what lets you increase autonomy without losing control, because there are layers that contain the damage when the model gets it wrong.

<!-- DIAGRAM: Concentric diagram. In the center, a small circle labeled "Model (LLM)". Around it, seven segments forming a ring (or seven blocks arranged as a hexagon/heptagon), each with its exact label: "1. Orchestrated tools", "2. Independent verification", "3. Context and memory", "4. Guardrails", "5. Observability", "6. Model routing", "7. Continuous feedback". Outside the ring, on the left, a box "Users and events" with an arrow pointing to the ring; on the right, a box "Organization systems (ERP, DBs, APIs)" connected only to segment 1, not to the model. Footnote: "The model never touches systems directly". -->

![Diagram of the language model at the center surrounded by the seven layers of the harness: orchestrated tools, independent verification, context and memory, guardrails, observability, model routing and continuous feedback](/blog/agentes/harness-engineering-agentes-ia-1-en.svg)

## The 7 layers of the harness

The layers are responsibilities, not products. They can live in a framework such as LangGraph or the Vercel AI SDK, in your own services, or on a platform such as Amazon Bedrock or Azure OpenAI. What matters is that each one has a clear technical owner.

### 1. Orchestrated tools

**The problem it solves.** An agent is useful because it acts: it looks up an order, opens a ticket, updates a record. If the model holds an API credential and can call it freely, any reasoning error, or any malicious instruction that arrives inside a document, becomes a real action. OWASP classifies this as [Excessive Agency (LLM06:2025)](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) and points to three root causes: excessive functionality, excessive permissions and excessive autonomy.

**What good looks like.** The model emits a call intent ("I want to invoke `get_order` with these arguments"). An intermediate layer validates the arguments against a schema, checks that the user on whose behalf the agent is acting has permission on that resource, applies rate and volume limits, executes and logs. Tools are designed for the agent, not as a mirror of the existing API: Anthropic warns that [a common mistake is building tools that merely wrap existing API endpoints](https://www.anthropic.com/engineering/writing-tools-for-agents), without considering whether they suit an agent. A `find_customer_by_tax_id` tool that returns five relevant fields beats exposing the CRM's generic endpoint with forty. If you use [Model Context Protocol](/en/blog/mcp-integrar-agentes-sistemas-legados), the specification requires servers to [validate all inputs, implement access controls, rate-limit invocations and sanitize outputs](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).

**Typical mistake.** Giving the agent a service account with admin rights "so we don't run into problems during the pilot." The pilot passes, nobody scales the permissions back, and the agent reaches production able to do anything.

**What to ask a vendor.** What identity does the agent use against each system? Where is it validated that a call is authorized: in the prompt or in code? Which tools are read-only and which ones write? Is there a cap on actions per execution?

### 2. Independent verification

**The problem it solves.** Models can claim they did something they didn't, or produce a plausible but wrong result. If the same component that performs the task is the one declaring it went well, you don't have verification: you have self-assessment.

**What good looks like.** The principle is simple: **whoever verifies is not whoever does the work**. It pays to combine three kinds of verifier: deterministic (code that checks the total adds up, the record exists, the JSON matches the schema), model-based (for what can't be reduced to rules, such as whether an answer is complete; these require calibration) and human (high-impact decisions or random samples). Anthropic describes the _evaluator-optimizer_ pattern in its agents guide and, in its piece on [agent evaluations](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), stresses the difference between the transcript (what the agent said it did) and the outcome (the actual state of the system at the end). An agent can say "your booking is confirmed"; verification checks whether the booking exists. We go deeper in [evals and agent verification](/en/blog/evals-verificacion-agentes-ia).

**Typical mistake.** Using the same model, with the same context, to generate and to review. It tends to approve its own work. Another mistake: running evaluations only before launch and none in operation.

**What to ask a vendor.** What is verified deterministically and what by another model? Does the verifier have access to the actual state of the system, or only to the agent's answer? How many cases are in the evaluation suite, and who maintains them?

### 3. Context and memory

**The problem it solves.** The model only knows what is in its context window at that moment. Give it too much and it loses precision: Anthropic cites research on _context rot_, the drop in accuracy as the context grows. Give it too little and it hallucinates what is missing. Give it data the user shouldn't see and you have a leak.

**What good looks like.** Context is assembled per step, not accumulated. The goal, in Anthropic's words, is to find [the smallest possible set of high-signal tokens](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) that maximizes the likelihood of the desired outcome. Long-running tasks rely on techniques such as compaction (summarizing the history and restarting with the essentials), structured notes persisted outside the window, and sub-agents with a clean context that return summaries. Long-term memory has explicit rules: what is stored, for how long, who can read it and how it is deleted. Document retrieval (RAG) honors the permissions of the user asking, not those of the agent's account. This is not just good practice: if you process personal data in Colombia, [Law 1581 of 2012 (personal data protection)](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981) establishes, among others, the principles of purpose limitation and of restricted access and circulation.

**Typical mistake.** Indexing the entire document repository without permission filters. The agent ends up quoting a payroll document in an answer to a supplier.

**What to ask a vendor.** How do you decide what goes into the context at each step? Does retrieval filter by the end user's permissions? What persists across sessions, where is it stored, and how is the right to erasure exercised?

### 4. Guardrails

**The problem it solves.** There are things the agent must never do, no matter what the user, a document or a tool says. Instructions in the prompt are not enough: OWASP ranks prompt injection as [the number one risk in its 2025 Top 10 for LLM applications](https://genai.owasp.org/llm-top-10/), including the indirect kind, which arrives through external content such as emails, web pages or files.

**What good looks like.** Guardrails are designed on four fronts. **Behavioral**: out-of-scope topics, tone, explicit refusals. **Data**: detection and masking of personal data or secrets in inputs and outputs, and a clear separation between instructions and untrusted external content. **Tool**: allowlists of permitted actions, thresholds (for example, a refund above a certain amount requires human approval) and explicit confirmation for irreversible operations. **Operational**: cost, time and step limits per execution, and a kill switch to stop the agent. The rule that cuts across all of them: authorization lives in the systems and in the code, not in the model's good intentions. OWASP calls this _complete mediation_: [implement authorization in downstream systems rather than relying on the LLM to decide whether an action is allowed](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/). We expand on this in [guardrails and human oversight](/en/blog/guardrails-control-humano-agentes).

**Typical mistake.** Handling security with one line in the system prompt ("never reveal confidential information") and calling it a control.

**What to ask a vendor.** Which controls still work if the model is tricked? Which actions require human approval, and how is that approval recorded? Have you red-teamed indirect injection through documents and tools?

### 5. Observability

**The problem it solves.** An agent is non-deterministic and changes over time: the provider's model changes, the data changes, the users change. Without telemetry you don't know what it did, why, what it cost, or whether it behaves differently today than it did last month. For an audit function, an agent without traces is an agent that cannot be approved.

**What good looks like.** Every execution produces a complete trace: the input, every model call with its version, every tool invocation with arguments and result, every decision by verifiers and guardrails, the output, the tokens consumed and the latency. It pays to use a standard: OpenTelemetry maintains [semantic conventions for generative AI](https://github.com/open-telemetry/semantic-conventions-genai), still in development status, which include operations such as `invoke_agent` and `execute_tool` as well as MCP-specific conventions. On top of those traces you define metrics (resolution, escalations, retries) and drift alerts: if escalations climb after a model update, someone finds out before the customer does. More detail in [AgentOps and observability for agents in production](/en/blog/agentops-observabilidad-agentes-produccion).

**Typical mistake.** Logging only the question and the final answer. When something goes wrong, there is no way to tell which intermediate step went off track.

**What to ask a vendor.** Show me the full trace of a real execution. How long are traces retained, and who has access? Which alert fires if behavior changes after a model update?

### 6. Model routing

**The problem it solves.** Not every task needs the largest model. Classifying an email, extracting fields from a form and drafting a complex analysis have different requirements for quality, latency, cost and, above all, where the data may be processed. One model for everything is expensive, slow or simply unacceptable for certain data.

**What good looks like.** A routing layer classifies the request and directs it: to a small, fast model for simple tasks, to a frontier model for complex reasoning, to an open model served on your own infrastructure (Llama, Qwen or Mistral with vLLM or Ollama) when the data cannot leave, or to a deterministic flow when no model is needed. Anthropic describes routing as one of the basic patterns of agentic systems. It also provides resilience when a provider goes down and insulates the rest of the harness from any specific model: switching models becomes a configuration change validated with evals, not a rewrite. If data sovereignty is a requirement, see [private AI and on-premises agents](/en/blog/ia-privada-agentes-on-premise).

**Typical mistake.** Coupling prompts and parsers to a single model. The day that model is retired or its pricing changes, the project reopens.

**What to ask a vendor.** What happens if we switch models tomorrow? What criteria decide the route for each request? Which data can go to a cloud model, and which must stay on our own infrastructure?

### 7. Continuous feedback

**The problem it solves.** An agent that doesn't learn from its mistakes repeats them. That is the essence of Hashimoto's idea: every failure becomes a permanent improvement to the harness.

**What good looks like.** Signals come from several sources: user corrections, escalations, verifier rejections, cases flagged by audit. Every relevant case is analyzed and turned into something concrete: a new case in the evaluation suite, a guardrail rule, a better tool description, an adjustment to what context gets delivered. No change reaches production without passing the evals, which act as regression tests. This ties into governance frameworks: the [NIST AI RMF 1.0](https://www.nist.gov/itl/ai-risk-management-framework) organizes risk management into four functions (Govern, Map, Measure, Manage), and [ISO/IEC 42001](https://www.iso.org/standard/42001) requires continual improvement within an AI management system.

**Typical mistake.** Changing the prompt in production because a user complained, without evaluating the effect on the rest of the cases. You fix one and break three.

**What to ask a vendor.** How does a user-reported error become a test? Which evals run before each deployment? Who approves changes to the agent's behavior?

## How a request travels through the harness

Let's follow a concrete request. Say an accounts payable analyst asks: "Why hasn't supplier X's invoice been paid?"

1. **Input:** it arrives with the analyst's identity; guardrails separate instructions from data.
2. **Routing:** it is classified as a status inquiry and sent to the appropriate model.
3. **Model:** with a context scoped to that role, it proposes calling `get_invoice` and `get_approval_status`.
4. **Orchestrator:** it validates the arguments and the permissions on that supplier, then executes against the ERP with a read-only credential.
5. **Verifier:** it checks that the answer only cites data returned by the tools.
6. **Output:** the analyst receives the answer. A write above the threshold would have gone through human approval.

Every step emits traces to observability, and flagged cases feed the improvement loop.

<!-- DIAGRAM: Horizontal left-to-right flow with six boxes connected by arrows: "Input + input guardrails" → "Routing" → "Model (proposes action)" → "Tool orchestrator (validates permissions)" → "Independent verifier" → "Output". Below the orchestrator, a box "ERP / DB / APIs" connected with a bidirectional arrow only to the orchestrator, labeled "least-privilege credential". Between Verifier and Output, an optional branch to a box "Human approval" labeled "if above threshold". Beneath everything, a horizontal bar "Observability (traces, metrics, drift)" receiving dotted arrows from each of the six boxes. From the observability bar, a curved arrow back to the start labeled "Feedback → evals". -->

![A request flowing through the harness: input, routing, model, tool orchestrator with permissions, verifier and output, with traces sent to observability](/blog/agentes/harness-engineering-agentes-ia-2-en.svg)

## Why the model is no longer the edge

Three practical reasons to shift attention to the harness.

**Models are becoming interchangeable.** If your advantage depends on a specific model, it disappears with a competitor's next release or with the retirement of that version.

**The risk sits outside the model.** A risk committee is not worried that the model reasons poorly in the abstract; it is worried that the agent pays an invoice twice, exposes a customer's data or acts without leaving a trail. That is controlled in the harness.

**Knowledge of your operation lives in the harness.** Tools designed for your processes, evals built from your exceptions and your approval thresholds are proprietary assets that compound over time and can't be bought with a subscription.

## How to evaluate an agent vendor

Use this list with any vendor, internal or external. In a pilot, not every answer will be perfect, but every one of them should exist.

**Architecture and access**

- [ ] The model has no direct credentials to any system; every action goes through a layer that validates and logs.
- [ ] Each tool is defined as read or write, with its input schema and its limits.
- [ ] The agent acts with the end user's identity or permissions where appropriate, not with an all-powerful service account.
- [ ] Integrations follow a documented standard (for example, MCP) or a proprietary integration layer with clear contracts.

**Verification and quality**

- [ ] There is an evaluation suite with real cases from your operation, including edge cases and adversarial ones.
- [ ] Evals run before every change to a prompt, tool or model.
- [ ] Results are independently verified, not just self-assessed by the agent.

**Security and compliance**

- [ ] Indirect prompt injection has been tested through documents, emails and tool responses.
- [ ] High-impact actions require recorded human approval.
- [ ] It is clear which data leaves your infrastructure, to which provider and in which region.
- [ ] Document retrieval honors per-user permissions.

**Operations**

- [ ] You can see the full trace of any execution, with model version, tools invoked and cost.
- [ ] There are drift alerts and a procedure to stop the agent.
- [ ] There is a documented process for turning errors into verified improvements.
- [ ] Switching models is possible without rewriting the system.

Red flag: if the demo is flawless but nobody can show you what happens when the agent gets it wrong, you saw a well-written prompt, not a system.

## Where to start: the first 90 days

**Days 1 to 30: choose well and prepare the ground.**

- Pick a process that is well scoped, frequent and measurable, with a business owner. Better still if it starts in assist mode: the agent looks things up and proposes, a human executes.
- Map the systems the agent needs to touch. This is where systems without APIs and poorly defined permissions surface.
- Build a first evaluation suite with real cases, including the hard ones. Without it, you won't know whether the agent works.
- Agree with risk and security on which data can be processed, where and with which model.

**Days 31 to 60: build the minimum harness.**

- Implement orchestrated tools with least-privilege permissions and tools designed for the agent.
- Instrument observability from day one, not at the end.
- Add deterministic verification wherever possible, plus data and tool guardrails.
- Run the agent in shadow mode: it processes real cases without acting, and you compare against what the human team did.

**Days 61 to 90: controlled production.**

- Release to a small group of users, with human approval on sensitive actions.
- Review traces weekly, turn every relevant error into an evaluation case and adjust.
- Define the indicators that will decide whether to expand scope: quality, escalation rate, resolution time.
- Document the harness as a platform: the second agent should reuse the tools, observability and evals of the first.

If by day 90 you have an agent that is useful, traceable and backed by a working improvement loop, you have something more valuable than the agent itself: the foundation for building the next ones with less risk.

## How we approach this at Nivelics

At Nivelics we build agents harness-first. Our [custom agent engineering](/en/services/artificial-intelligence/ai-agents) service covers all seven layers; when the main challenge is connecting to existing systems, we handle [systems integration with MCP](/en/services/artificial-intelligence/systems-integration-mcp); when data cannot leave your infrastructure, we design [private AI on-premises](/en/services/artificial-intelligence/private-ai-on-premises) with open models; and for agents already in operation, we offer [agent operations and governance (AgentOps)](/en/services/artificial-intelligence/agentops).

Each layer in this article has its own in-depth guide: [MCP for integrating agents with legacy systems](/en/blog/mcp-integrar-agentes-sistemas-legados), [private AI and on-premises agents](/en/blog/ia-privada-agentes-on-premise), [evals and agent verification](/en/blog/evals-verificacion-agentes-ia), [guardrails and human oversight](/en/blog/guardrails-control-humano-agentes) and [AgentOps and observability in production](/en/blog/agentops-observabilidad-agentes-produccion).

If you are evaluating taking an agent to production, or you have one in pilot that hasn't yet earned the trust of risk and audit, [let's talk](/en/contact). We'll review the case with you, the systems involved, and which harness layers you need first.
