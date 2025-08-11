export function validateChatRequest(
  messages: unknown,
  systemPrompt: unknown
): string | null {
  if (!messages || !Array.isArray(messages)) {
    return "Invalid messages format";
  }

  if (systemPrompt && typeof systemPrompt !== "string") {
    return "System prompt must be a string";
  }

  for (const message of messages) {
    if (
      typeof message !== "object" ||
      message === null ||
      typeof message.role !== "string" ||
      typeof message.content !== "string"
    ) {
      return "Invalid message format";
    }
  }

  return null;
}
