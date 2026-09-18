---
slug: "ia-privada-agentes-on-premise"
category: "inteligencia-artificial"
locale: en
isPillar: false
title: "Private AI for agents: API, your own cloud account or on-premises"
metaDescription: "When your data can't leave your infrastructure: three deployment paths for AI agents, sensitivity-based routing and what running on-premises really takes."
tags: ["ai agents", "private ai", "on-premises", "data sovereignty", "vllm", "amazon bedrock"]
coverBrief: "Tres carriles horizontales que salen de un mismo punto de entrada: el superior se abre hacia una nube abierta (API pública), el del medio entra en un recinto con borde marcado dentro de una nube (nube en tu cuenta) y el inferior termina en un rack de servidores dentro de un edificio (on-premise). Sobre el punto de entrada, una etiqueta de clasificación de datos con tres niveles de color. Estilo geométrico, líneas limpias, paleta de la marca."
coverAlt: "Diagram of three deployment paths for AI agents (public API, cloud in your own account and on-premises) branching out from a data classifier"
faqItems:
  - question: "Does using a model provider's API mean my data is used for training?"
    answer: "Not necessarily. Anthropic, for example, states that by default it does not use inputs or outputs from its commercial products, including the API, to train models. Even so, 'no training' is not the same as 'not leaving your infrastructure': the data travels and is processed externally, and it may be retained temporarily for abuse monitoring under each service's terms."
  - question: "What is the difference between using Claude through the API and using it on Amazon Bedrock?"
    answer: "On Bedrock, the model runs in AWS-operated accounts that the model provider cannot access, and your traffic can go over AWS PrivateLink from your VPC. You gain network controls, identity (IAM), logging with CloudTrail and per-region retention settings. The model is the same; what changes is the contractual and technical perimeter in which it is processed."
  - question: "Is an open model on-premises as good as a frontier model?"
    answer: "For well-scoped, clearly specified tasks (classification, extraction, summarizing internal documents, questions over a knowledge base), a well-chosen open model is usually enough. In multi-step reasoning and complex tool use, the gap usually shows. The only honest way to know is to measure it with your own evals on your own tasks."
  - question: "Does deploying on-premises automatically make me compliant with Colombia's Law 1581 of 2012 (personal data protection)?"
    answer: "No. Where the model runs is just one piece; the law requires, among other things, the data subject's authorization, a legitimate purpose, security measures and rules for transferring data outside the country. Architecture can make compliance easier, but the assessment must be made by your legal or data protection team."
  - question: "Where do I start if I want a hybrid architecture?"
    answer: "With data classification, not with the model. Define three or four sensitivity levels, decide which deployment path each level allows, and put a gateway in place that enforces that rule before every call. Then choose models for each path and validate them with evals."
sources:
  - "https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training"
  - "https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html"
  - "https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html"
  - "https://docs.aws.amazon.com/bedrock/latest/userguide/usingVPC.html"
  - "https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy"
  - "https://docs.vllm.ai/en/latest/"
  - "https://docs.vllm.ai/en/latest/features/quantization/"
  - "https://docs.ollama.com/api/openai-compatibility"
  - "https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/ley_1581_2012.htm"
  - "https://www.iso.org/standard/42001"
  - "https://www.nist.gov/itl/ai-risk-management-framework"
---

# Private AI for agents: when your data can't leave the building

The question "which model should we use?" usually comes too late. In organizations that handle customer data, medical records, financial information or trade secrets, the question that shapes the architecture is a different one: **where can each piece of data travel, and who can see it while the agent processes it?** A chatbot answering FAQs can live comfortably behind a public API. An agent that reads contracts, queries the ERP and drafts replies containing personal data cannot.

We'll cover the three deployment paths (public API, cloud in your own account and on-premises), how to compare them, why the answer is almost always a hybrid that combines them, and what running open models in your own data center actually involves. This is one piece of an [agent's harness](/en/blog/harness-engineering-agentes-ia): the model routing layer, intersecting with data guardrails.

## When data can't leave your infrastructure

It helps to break "data sovereignty" down into concrete constraints, because each one pushes the architecture in a different direction:

- **Contractual constraint.** A customer or partner contractually prohibits you from processing their information with third parties, or requires knowing exactly which sub-processors touch their data.
- **Regulatory constraint.** The applicable law restricts international transfers or requires specific security measures. In Colombia, [Law 1581 of 2012 (personal data protection)](https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/ley_1581_2012.htm), in its Article 26, prohibits transferring personal data to countries that do not provide adequate levels of protection according to the standards of the Superintendence of Industry and Commerce (with exceptions your legal team should review).
- **Risk constraint.** No law forbids it, but the information is so sensitive (intellectual property, strategy, security data) that the organization won't accept that residual risk.
- **Connectivity constraint.** Plants, remote sites or segmented networks where the agent must work even without internet access.

If none of these apply, forcing on-premises means spending money and sacrificing quality for no reason. If any of them apply, the deployment choice stops being a preference and becomes a requirement.

## The three deployment paths

### 1. Public API with no-training agreements

You consume the model directly from the provider (Anthropic, OpenAI, Google) over the internet. It is the path with the best quality available on day one and the least operational friction.

The usual concern (that your data will train the model) is addressed in the commercial terms. Anthropic, for example, [states](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training) that by default it does not use inputs or outputs from its commercial products, including the API, to train its models.

But "no training" doesn't mean "not leaving." The prompt, the context and the responses are processed on the provider's infrastructure and may be retained for a period to detect abuse, according to the terms of service. For many use cases that is acceptable; for others, it is exactly what the contract or the law prohibits.

### 2. Cloud in your own account: Amazon Bedrock and Azure OpenAI

The frontier model is served by your cloud provider and consumed from your own account, with your network, identity and audit controls.

On **Amazon Bedrock**, the [data protection documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html) explains that models are deployed in accounts operated by the Bedrock team, which model providers cannot access: they don't see customers' prompts or responses. You can [connect your VPC to Bedrock with AWS PrivateLink](https://docs.aws.amazon.com/bedrock/latest/userguide/usingVPC.html) so that traffic doesn't traverse the internet, and log activity with CloudTrail. [Data retention](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html) is configured per region, and each model declares which modes it supports; some require retaining inputs and outputs within AWS for abuse review, and if your policy is zero retention, those models become unavailable unless you request zero-retention access, which AWS evaluates per account and per model. Check this before you commit.

On **Azure OpenAI** (now part of Microsoft Foundry), the [privacy documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy) states that prompts and responses are not available to OpenAI or to other customers, and are not used to train foundation models. There is also an abuse monitoring system that may store samples for human review, unless your organization is approved for modified abuse monitoring.

The value of this path: frontier quality inside a perimeter your security team already knows how to audit. The limit: the data leaves your data center and is processed in the cloud provider's region, and that only holds with **regional deployments, without global or cross-region inference**. On Azure, _Global_ and _DataZone_ deployments may process data outside the chosen region; on Bedrock, with cross-region inference, retained data is stored in the destination region. All of it has to fit your international transfer rules.

### 3. Open models on-premises with vLLM or Ollama

You download the weights of an open model (families such as Llama, Qwen or Mistral) and serve it on your own hardware. The data never leaves your network.

The two most common tools play different roles:

- **[vLLM](https://docs.vllm.ai/en/latest/)** is a production inference engine: it manages attention memory with PagedAttention, exposes an OpenAI API-compatible server, supports quantization and distributes the model across multiple GPUs. It is the option for many concurrent users or agents.
- **[Ollama](https://docs.ollama.com/api/openai-compatibility)** makes it easy to download and run models locally, with its own REST API and compatibility with a subset of the OpenAI API. It is excellent for prototypes and small deployments; for high concurrent loads, vLLM is the better choice.

OpenAI API compatibility matters: the same agent code can talk to the cloud or to your local server by changing only the endpoint, which is what makes the hybrid architecture viable.

## Comparison table

The values are deliberately qualitative: real cost depends on volume, model size, hardware utilization and negotiated pricing.

| Criterion              | Public API (no training)                                      | Cloud in your own account (Bedrock / Azure OpenAI)                                                                                                   | Open models on-premises (vLLM / Ollama)                                        |
| ---------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Data control**       | Low: data is processed on the model provider's infrastructure | Medium-high: consumed from your own account, with your network and identity controls, in the cloud provider's region (if the deployment is regional) | Maximum: data never leaves your network                                        |
| **Model quality**      | Frontier, with immediate access to new versions               | Frontier, with possible delays in regional availability                                                                                              | Good on well-scoped tasks; visible gap in complex reasoning and tool use       |
| **Operating cost**     | Usage-based, no upfront investment                            | Usage-based, plus network and platform costs                                                                                                         | High fixed cost (GPUs, power, staff); low marginal cost if utilization is high |
| **Operational effort** | Low                                                           | Low-medium: IAM, networking, quotas, retention                                                                                                       | High: hardware, serving, updates, evals, security                              |
| **Latency**            | Depends on the internet and the provider's load               | Good if the model is in a nearby region                                                                                                              | Low on the local network if the hardware is properly sized                     |

## The answer is usually hybrid: routing by data sensitivity

Hybrid isn't a fourth path: it is the combination of all three. Few organizations have a single type of data. The same customer service agent may answer a question about opening hours (public data), check the status of an order (internal data) and read an attached medical leave certificate (sensitive data under Article 5 of Law 1581, which covers, among others, health-related data). Sending everything on-premises sacrifices quality where it isn't needed; sending everything to the public API violates the constraint in the sensitive case.

The pattern that works is a **model gateway** that decides the route based on data classification before every call:

<!-- DIAGRAM: Left-to-right flow. Initial box "Agent request (prompt + context)". Arrow to box "Data classifier" (with note: "rules + personal data detector"). Arrow to diamond "Sensitivity level". Three labeled arrows leave the diamond: "Public / non-sensitive internal" → box "Public API (no-training agreement)"; "Confidential" → box "Cloud in your own account (Bedrock / Azure OpenAI over private network)"; "Restricted / sensitive data" → box "On-premises (vLLM + open model)". The three boxes converge with arrows into a final box "Audit log: route, model, classification". A dashed arrow from "Data classifier" to the on-premises route labeled "when in doubt, most restrictive route". -->

![Routing diagram based on data classification: a classifier sends each agent request to the public API, to the cloud in your own account or to an on-premises model depending on its sensitivity level, and everything is recorded in an audit log](/blog/agentes/ia-privada-agentes-on-premise-1-en.svg)

Four design rules that prevent the most common mistakes:

1. **Classification is done by code, not by the model.** A deterministic classifier (document source labels, field-level rules, personal identifier detectors) decides the route. Asking the LLM whether a piece of data is sensitive means sending it the sensitive data so it can decide.
2. **When in doubt, take the most restrictive route.** If the classifier can't determine the level, the data goes on-premises. The cheap mistake is losing some quality; the expensive one is a leak.
3. **Classification travels with the context.** If the agent retrieves a restricted document midway through a conversation, the whole conversation moves up a level. Levels only go up, never down, within a session.
4. **Every decision is logged.** Which route, which model, which classification and why. Without that record there is no audit, and it is the foundation of [agent operations and governance](/en/services/artificial-intelligence/agentops).

## What it really takes to run open models

Going on-premises is usually decided with the model in mind while underestimating everything else. This is what you will be operating:

### GPUs and sizing

The bottleneck is GPU memory: the model weights plus the attention cache for each concurrent request, which grows with context length. Size with real workloads (typical context size, peak-hour concurrency, target latency), not with the model's spec sheet.

### Quantization

As the [vLLM documentation](https://docs.vllm.ai/en/latest/features/quantization/) puts it, quantization trades model precision for a smaller memory footprint, which lets large models run on a wider range of hardware. But the loss isn't uniform: it can be imperceptible in summarization and noticeable in strict instruction following or in generating tool calls with an exact format. The only way to know whether a quantized version works for your agent is to measure it.

### Your own evals

With an open model, nobody else is measuring quality for your use case. You need your own test suite (real tasks, expected answers, correct tool calls) that you run before changing the model, the quantization or the inference server version. More in [evals and agent verification](/en/blog/evals-verificacion-agentes-ia). Without this, every update is a gamble.

### Patching and lifecycle

You take on the full lifecycle: patches for the inference server and its dependencies, GPU drivers, new model versions (to be evaluated before adoption), access control and monitoring. An unauthenticated inference endpoint on the corporate network is a real attack surface.

### Checklist before committing to on-premises

- [ ] Is there a concrete constraint (contractual, regulatory, risk or connectivity) that justifies it for this use case?
- [ ] Have you measured a candidate open model against your real tasks, including its quantized version?
- [ ] Do you have estimates for concurrency and context size at peak hours?
- [ ] Who operates the inference server, the drivers and the patches, and under what service agreement?
- [ ] Is the endpoint authenticated, segmented and logged?
- [ ] Can the agent code switch routes (local or cloud) without being rewritten?

## Compliance: what architecture can and cannot solve

This is not legal advice, and no deployment decision replaces the analysis of your legal or data protection team.

**Colombia's Law 1581 of 2012 (personal data protection).** It sets out principles for processing personal data (among them purpose limitation, restricted circulation, security and confidentiality) and [restricts international transfers](https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/ley_1581_2012.htm) to countries with adequate levels of protection. Architecture provides evidence for several of those principles: the on-premises path or a carefully chosen region helps with international transfers; the audit log helps with security and restricted circulation. But the data subject's authorization, the purpose of the processing and the cloud provider's role as a data processor are legal questions, not technical ones.

**ISO/IEC 42001.** It is the [international standard](https://www.iso.org/standard/42001) for AI management systems. It doesn't tell you where to deploy the model; it asks you to manage risks, assess impact, oversee suppliers and measure performance systematically. An architecture with explicit classification, logged routing and periodic evals produces exactly the kind of evidence that management system needs. The same applies to the [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

Design so that compliance is **demonstrable**: if an auditor asks why a conversation containing health data was processed where it was, the answer should be in a log, not in an engineer's memory.

## How we approach it

At Nivelics we design [private AI and on-premises](/en/services/artificial-intelligence/private-ai-on-premises) architectures starting from data classification and compliance requirements, and only then choose models and the deployment path: Claude on Amazon Bedrock or Azure OpenAI models consumed from your own account, open models served with vLLM on your infrastructure, or a combination of those paths behind a gateway with sensitivity-based routing and evals that validate each route.

If you are evaluating where an agent can run with data that can't leave your organization, [let's talk](/en/contact): we'll review your real constraints and propose an architecture you can defend before your risk committee.
