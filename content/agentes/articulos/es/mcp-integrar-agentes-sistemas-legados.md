---
slug: "mcp-integrar-agentes-sistemas-legados"
category: "inteligencia-artificial"
locale: es
isPillar: false
title: "MCP: cómo integrar agentes de IA con sistemas legados"
metaDescription: "Cómo usar Model Context Protocol para conectar agentes de IA a ERP, bases de datos y sistemas legados con mínimo privilegio, auditoría y sin romper nada."
tags:
  [
    "agentes de ia",
    "mcp",
    "model context protocol",
    "sistemas legados",
    "integración",
    "seguridad de ia",
  ]
coverBrief: "Ilustración geométrica: a la izquierda un nodo circular (el agente) conectado por una sola línea a un conector rectangular central (cliente MCP); desde el conector salen tres líneas hacia tres bloques a la derecha con íconos lineales mínimos: una base de datos cilíndrica, un bloque de módulos (ERP) y un bloque más antiguo con textura de terminal/mainframe unido por una pieza adaptadora. Entre el conector y los bloques, una franja translúcida que sugiere un filtro o capa de permisos. Paleta de marca Nivelics, sin texto, sin robots."
coverAlt: "Agente de IA conectado mediante un cliente MCP y una capa de permisos a un ERP, una base de datos y un sistema legado"
faqItems:
  - question: "¿Qué es Model Context Protocol (MCP)?"
    answer: "Es un protocolo abierto que estandariza cómo una aplicación con modelos de lenguaje se conecta a fuentes de datos y herramientas externas. Define servidores que exponen herramientas, recursos y prompts, y clientes que los consumen, comunicados mediante mensajes JSON-RPC 2.0. Anthropic lo publicó en noviembre de 2024 y en diciembre de 2025 lo donó a la Agentic AI Foundation, bajo la Linux Foundation."
  - question: "¿Puedo conectar con MCP un sistema legado que no tiene API?"
    answer: "Sí, pero no directamente. Primero necesitas una capa de integración (un adaptador sobre la base de datos, archivos, colas o, en último caso, automatización de pantallas) con contratos estables. El servidor MCP se construye sobre ese adaptador, no sobre el sistema legado."
  - question: "¿MCP resuelve la seguridad de mis agentes?"
    answer: "No por sí solo. La especificación define autorización basada en OAuth 2.1 para transportes HTTP y exige a los servidores validar entradas, controlar acceso y limitar la tasa de llamadas, pero advierte que el protocolo no puede imponer esos principios. El mínimo privilegio, la aprobación humana y la auditoría los diseñas tú."
  - question: "¿Las anotaciones readOnlyHint o destructiveHint bastan para decidir qué aprobar?"
    answer: "No. La especificación las define como pistas y establece que los clientes deben considerarlas no confiables salvo que provengan de servidores confiables. En tus propios servidores son útiles para la experiencia de aprobación, pero el control real debe estar en los permisos de la credencial y en el sistema de destino."
  - question: "¿Cuándo no conviene usar MCP?"
    answer: "Cuando la integración es un flujo fijo que no necesita que un modelo decida qué herramienta usar, cuando hay una sola aplicación consumidora con una integración que ya funciona, o cuando se requieren operaciones transaccionales complejas que no deberían fragmentarse en llamadas de un agente. En esos casos, una integración directa o un workflow determinista suele ser más simple y más seguro."
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

# MCP: cómo integrar agentes de IA con sistemas legados

Un agente de IA que no puede consultar tu ERP, tu base de clientes o el sistema de facturación que lleva veinte años funcionando sirve para poco más que redactar correos. El valor está en conectarlo a los sistemas donde vive la operación. Y ahí aparece el riesgo: esos sistemas no se diseñaron para recibir peticiones de un modelo de lenguaje, muchos no tienen API y casi todos contienen datos que no pueden filtrarse.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2026-07-28) se ha convertido en un estándar de facto para esta conexión. Pero MCP es un protocolo, no una estrategia de integración. Esta guía explica qué define realmente la especificación, cómo diseñar servidores MCP con mínimo privilegio sobre sistemas existentes, qué riesgos introduce y cuándo es mejor no usarlo. Es parte de nuestra serie sobre [harness engineering](/blog/harness-engineering-agentes-ia), donde MCP cumple el papel de la capa de herramientas orquestadas.

## Qué es MCP y qué define la especificación

Anthropic presentó MCP en noviembre de 2024 para resolver un problema concreto: [cada nueva fuente de datos requería su propia implementación](https://www.anthropic.com/news/model-context-protocol), lo que hacía difícil escalar sistemas conectados. En diciembre de 2025 lo [donó a la Agentic AI Foundation](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/), un fondo dirigido bajo la Linux Foundation, lo que reduce el riesgo de depender del roadmap de un solo proveedor.

La arquitectura tiene tres roles, comunicados con mensajes JSON-RPC 2.0:

- **Host:** la aplicación con el modelo (tu agente).
- **Cliente:** el conector dentro del host que habla con un servidor.
- **Servidor:** el servicio que expone capacidades de un sistema.

Los servidores ofrecen tres primitivas:

| Primitiva     | Qué es según la especificación               | Uso típico en integración                               |
| ------------- | -------------------------------------------- | ------------------------------------------------------- |
| **Tools**     | Funciones que el modelo ejecuta              | `consultar_saldo_proveedor`, `crear_borrador_orden`     |
| **Resources** | Contexto y datos para el usuario o el modelo | Esquema de una tabla, una política interna, un catálogo |
| **Prompts**   | Mensajes y flujos plantilla para usuarios    | "Conciliar factura", "Resumir caso"                     |

La especificación define dos [transportes estándar](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports): **stdio**, donde el cliente lanza el servidor como subproceso local, y **Streamable HTTP**, donde el servidor es un servicio independiente que recibe peticiones POST en un único endpoint. Para integraciones empresariales, Streamable HTTP es lo habitual: el servidor MCP vive junto al sistema que expone, detrás de tus controles de red.

Un dato relevante si evaluaste MCP hace un tiempo: la revisión [2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog) eliminó las sesiones a nivel de protocolo y el handshake de inicialización. Cada petición lleva su versión y capacidades. Si un servidor necesita estado entre llamadas (una transacción en curso, un borrador), lo maneja con identificadores explícitos que se pasan como argumentos. Esto simplifica el balanceo de carga, pero obliga a validar en cada llamada que ese identificador pertenece a quien lo usa.

### Autorización

La [autorización en MCP](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) es opcional. Cuando se implementa sobre HTTP, se basa en OAuth 2.1: el servidor MCP actúa como servidor de recursos y el cliente obtiene tokens de un servidor de autorización. Con stdio, las credenciales se toman del entorno. Tres reglas importan especialmente:

- El servidor **debe validar que el token fue emitido para él** (audiencia), no para otro servicio.
- El servidor **no debe reenviar** a sistemas de destino el token que recibió del cliente. Si llama a una API interna, usa su propia credencial. La especificación prohíbe explícitamente este _token passthrough_ porque rompe la trazabilidad y los controles de los sistemas de destino.
- Los scopes deben seguir mínimo privilegio, con elevación progresiva cuando se intenta una operación más sensible. Las [buenas prácticas de seguridad](https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices) listan como errores comunes publicar todos los scopes posibles y usar scopes comodín como `*` o `full-access`.

## Integración primero, agente después

El error más frecuente en proyectos con sistemas legados es empezar por el agente. Se construye una demo convincente contra una base de datos de pruebas y, al llegar a producción, aparece la realidad: el ERP no expone la información que se necesita, el sistema de cartera solo acepta archivos planos por lotes nocturnos y nadie sabe quién es dueño de la tabla de clientes.

La secuencia que funciona es la inversa:

1. **Inventario de capacidades.** Qué necesita consultar y hacer el agente, en términos de negocio. No "acceso al ERP", sino "consultar el estado de una factura por número y proveedor".
2. **Capa de integración estable.** Para cada capacidad, un contrato claro sobre el sistema real. Si hay API, se envuelve. Si no la hay, se construye un adaptador: consultas de solo lectura sobre una réplica de la base de datos, lectura de archivos de intercambio, publicación en una cola que el sistema legado ya consume o, como último recurso, automatización de pantallas con RPA. Este adaptador se prueba sin ningún modelo involucrado.
3. **Servidor MCP sobre el adaptador.** Expone esas capacidades como herramientas pensadas para un agente. El servidor MCP nunca habla directamente con un sistema legado sin API: lo hace a través del adaptador.
4. **Agente.** Solo cuando lo anterior funciona y está probado.

Esta separación tiene una ventaja operativa clara: el adaptador puede reutilizarse en otras integraciones, y el sistema legado queda protegido por una capa que controla volumen, formato y permisos, sin importar si quien llama es un agente, un workflow o una aplicación tradicional.

<!-- DIAGRAMA: A la izquierda, caja "Agente (host + modelo)". A su derecha, caja "Cliente MCP". Entre el cliente y los servidores, una franja vertical etiquetada "Capa de permisos (OAuth, scopes, aprobación humana)". A la derecha de la franja, tres cajas apiladas: "Servidor MCP ERP", "Servidor MCP Base de datos (solo lectura)" y "Servidor MCP Sistema legado". A la derecha de cada una: "ERP (API)", "Réplica de BD" y, para la tercera, una caja intermedia "Adaptador (archivos / cola / RPA)" antes de "Sistema legado sin API". Todas las flechas cliente↔servidor atraviesan la franja de permisos. Debajo, una barra horizontal "Registro de auditoría y trazas (OpenTelemetry)" que recibe flechas punteadas desde el cliente MCP y desde los tres servidores. Nota: "El modelo nunca se conecta directo a los sistemas". -->

![Arquitectura de un agente conectado mediante un cliente MCP y una capa de permisos a servidores MCP de ERP, base de datos y sistema legado vía adaptador, con registro de auditoría](/blog/agentes/mcp-integrar-agentes-sistemas-legados-1.svg)

## Cómo diseñar servidores MCP con mínimo privilegio

### Herramientas pensadas para el agente, no espejos de la API

Anthropic advierte que [un error común es crear herramientas que solo envuelven endpoints existentes](https://www.anthropic.com/engineering/writing-tools-for-agents). Exponer el endpoint genérico `GET /api/v2/entities` con cuarenta parámetros obliga al modelo a adivinar y amplía lo que puede hacer. Es mejor una herramienta `buscar_proveedor_por_nit` que devuelve los cinco campos que el caso necesita. Menos superficie, menos tokens, menos errores.

Reglas prácticas:

- **Un servidor por dominio y nivel de riesgo.** Separa lectura de escritura en servidores o scopes distintos. Así puedes conectar el agente de consulta solo al servidor de lectura.
- **Esquemas estrictos.** La especificación usa JSON Schema para entradas y salidas. Define tipos, rangos y enumeraciones, y rechaza propiedades adicionales. El servidor [debe validar todas las entradas, implementar controles de acceso, limitar la tasa de invocaciones y sanitizar las salidas](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).
- **Credencial propia y mínima.** El servidor accede al sistema de destino con una cuenta que solo puede hacer lo que sus herramientas exponen. Si el servidor es de lectura, la credencial también lo es. Cuando el caso lo exige, las operaciones se ejecutan en el contexto del usuario final, no con una identidad genérica.
- **Resultados acotados.** Paginación, límites y campos filtrados por defecto. Una herramienta que puede devolver toda la tabla de clientes es una vía de exfiltración.

### Solo lectura vs. escritura

La especificación incluye [anotaciones de herramientas](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts) como `readOnlyHint`, `destructiveHint`, `idempotentHint` y `openWorldHint`. Úsalas en tus servidores: permiten que el cliente apruebe automáticamente lecturas y pida confirmación antes de escrituras. Pero ten presente que son **pistas**: la especificación establece que los clientes deben considerarlas no confiables salvo que provengan de servidores confiables. El control real está en la credencial y en el sistema de destino.

Para escrituras, un patrón que funciona bien con sistemas críticos es **proponer y confirmar**: el agente no crea la orden de compra, crea un borrador. Un humano o una regla determinista la confirma. La especificación recomienda que [siempre haya un humano en el circuito con capacidad de negar invocaciones](https://modelcontextprotocol.io/specification/2026-07-28/server/tools); en operaciones de alto impacto, trata esa recomendación como requisito. Profundizamos en los niveles de aprobación en [guardrails y control humano](/blog/guardrails-control-humano-agentes).

### Idempotencia

Los agentes reintentan: por un timeout, por un error de red o porque el modelo decidió volver a llamar la herramienta. En un sistema legado, un reintento sin control puede duplicar un pago o un movimiento de inventario. Cada herramienta de escritura debe aceptar una **clave de idempotencia** generada por el cliente o el orquestador, y el servidor (o el adaptador) debe devolver el resultado original si recibe la misma clave dos veces. Si el sistema de destino no lo soporta, el adaptador guarda el registro de claves procesadas. La revisión 2026-07-28 refuerza la necesidad: si se corta el flujo de respuesta, el cliente debe reemitir la petición como una nueva.

### Auditoría

Cada invocación debe dejar un registro con quién la originó (usuario y agente), qué herramienta, con qué argumentos, qué devolvió, cuánto tardó y si pasó por aprobación. La especificación recomienda a los clientes [registrar el uso de herramientas con fines de auditoría](https://modelcontextprotocol.io/specification/2026-07-28/server/tools), y la revisión 2026-07-28 documenta la propagación de contexto de trazas de OpenTelemetry. Las [convenciones semánticas de OpenTelemetry para IA generativa](https://github.com/open-telemetry/semantic-conventions-genai), aún en desarrollo, incluyen convenciones específicas para MCP. Correlacionar la traza del agente con el registro del servidor y con el log del sistema de destino es lo que permite responder a un auditor "qué hizo el agente el 14 de marzo y por qué".

## Riesgos específicos de conectar agentes a herramientas

### Inyección de prompts a través de herramientas

OWASP ubica la inyección de prompts como [el riesgo número uno del Top 10 para aplicaciones LLM 2025](https://genai.owasp.org/llm-top-10/). La variante indirecta es la que más preocupa en integraciones: [ocurre cuando el modelo acepta entradas de fuentes externas](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) como archivos o páginas. Con MCP, cada resultado de herramienta es contenido externo. Un campo de observaciones en el ERP, el cuerpo de un correo o un PDF adjunto pueden contener instrucciones que el modelo interprete como órdenes. Si el mismo agente puede leer ese contenido y ejecutar escrituras, el camino de ataque está abierto.

Mitigaciones: separar agentes que leen contenido no confiable de agentes que ejecutan acciones sensibles, validar resultados antes de pasarlos al modelo, mantener mínimo privilegio para limitar el daño y aplicar lo que OWASP llama _complete mediation_: [la autorización vive en los sistemas de destino, no en el criterio del modelo](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/).

### Tool poisoning y servidores de terceros

En abril de 2025, Invariant Labs describió los [ataques de tool poisoning](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks): instrucciones maliciosas escondidas en la descripción de una herramienta, invisibles para el usuario pero visibles para el modelo. Documentaron también el _rug pull_ (un servidor cambia la descripción después de haber sido aprobado) y el _shadowing_ entre servidores (un servidor malicioso altera cómo el agente usa otro servidor confiable). Es un problema de cadena de suministro, alineado con la categoría Supply Chain del Top 10 de OWASP.

Controles: usar solo servidores propios o revisados, fijar versiones y verificar la integridad de las definiciones de herramientas, alertar cuando cambie una descripción, y no mezclar en un mismo agente servidores de terceros no auditados con servidores que tocan sistemas críticos. Antes de producción, conviene someter la integración a pruebas adversarias; es parte de lo que cubre un ejercicio de [ciberseguridad y ethical hacking](/servicios/cloud/ciberseguridad-ethical-hacking) enfocado en agentes.

## Cuándo no usar MCP

MCP aporta más cuando un modelo necesita elegir dinámicamente entre varias capacidades y cuando varias aplicaciones consumirán las mismas integraciones. No siempre es la respuesta:

- **Flujos fijos.** Si el proceso siempre ejecuta los mismos pasos en el mismo orden, un workflow determinista (en n8n o en código) que llama al modelo solo para la parte que requiere lenguaje es más simple, más barato y más fácil de auditar.
- **Un solo consumidor con una integración que ya funciona.** Reescribirla como servidor MCP agrega una capa sin beneficio claro.
- **Operaciones transaccionales complejas.** Si una operación requiere atomicidad entre varios pasos, no la fragmentes en herramientas que el agente encadena. Expón una sola operación de alto nivel que el sistema ejecuta de forma transaccional.
- **Latencia muy estricta.** Cada salto agrega tiempo; en interacciones en tiempo real, mide antes de decidir.

## Checklist antes de conectar un sistema crítico

- [ ] El sistema se accede a través de un adaptador probado sin modelo.
- [ ] Herramientas de lectura y escritura están separadas por servidor o scope.
- [ ] Cada servidor usa una credencial propia con permisos mínimos y no reenvía tokens.
- [ ] Las escrituras usan claves de idempotencia y el patrón proponer y confirmar.
- [ ] Los esquemas de entrada son estrictos y los resultados están acotados.
- [ ] Cada invocación queda registrada y correlacionada con la traza del agente.
- [ ] Las definiciones de herramientas están versionadas y se alerta ante cambios.
- [ ] Se probó inyección indirecta a través de los datos que devuelven las herramientas.

En Nivelics diseñamos este tipo de integraciones en nuestro servicio de [integración de sistemas y MCP](/servicios/inteligencia-artificial/integracion-sistemas-mcp), empezando siempre por la capa de integración y no por el agente. Si tienes sistemas que tu equipo quiere conectar a agentes sin comprometer su estabilidad ni su seguridad, [conversemos](/contacto).
