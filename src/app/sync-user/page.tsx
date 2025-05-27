import prisma from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SyncUserWithDb = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User Not found");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user || !user.emailAddresses[0].emailAddress) {
    throw new Error("User email Not found");
  }

  await prisma.user.upsert({
    where: {
      emailAddress: user.emailAddresses[0]?.emailAddress,
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      id: userId,
      emailAddress: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  redirect("/dashboard");
};

export default SyncUserWithDb;
