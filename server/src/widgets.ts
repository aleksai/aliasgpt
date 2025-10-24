import { z } from "zod";

type AliasWidget = {
  id: string;
  hash: string;
  title: string;
  description: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  responseText: string;
  toolInputSchema: ToolInputSchema;
};

const widgets: AliasWidget[] = [
  {
    id: "alias-game",
    hash: "6ad9",
    title: "Alias",
    description: "Alias game. User describing, ChatGPT trying to guess.",
    templateUri: "ui://widget/alias-game.html",
    invoking: "Aliasing...",
    invoked: "Aliasing complete",
    responseText: "Let's play!",
    toolInputSchema: {
      type: "object",
      properties: {
        guess: {
          type: "string",
          description: "The guess of the target",
        },
      },
      required: [],
      additionalProperties: false,
    },
    toolInputParser: z.object({
      guess: z.string().optional(),
    }),
  },
];

export default widgets;