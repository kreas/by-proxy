import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const body = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")!}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0613",
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: body.prompt,
        },
      ],
      stream: true,
    }),
  });

  return new Response(res.body, { status: 200 });
};
