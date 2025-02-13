import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";

import { prisma } from "@formbricks/database";

export const dynamic = "force-dynamic"; // no caching

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const checkDatabaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    throw new Error("Database could not be reached");
  }
};

/* const checkS3Connection = async () => {
  if (!IS_S3_CONFIGURED) {
    // dont try connecting if not in use
    return;
  }
  try {
    await testS3BucketAccess();
  } catch (e) {
    throw new Error("S3 Bucket cannot be accessed");
  }
}; */

export default async function HealthPage() {
  await checkDatabaseConnection();
  // Skipping S3 check for now until it's fixed
  // await checkS3Connection();

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
      <CheckBadgeIcon height={40} color="green" />
      <p className="text-md mt-4 font-bold text-zinc-900">All systems are up and running</p>
    </div>
  );
}
