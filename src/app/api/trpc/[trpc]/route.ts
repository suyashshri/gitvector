import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/index";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    onError({ error, path }) {
      console.error(`tRPC Error on ${path}:`, error);
    },
  });

export { handler as GET, handler as POST };
