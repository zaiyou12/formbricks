import nextMDX from "@next/mdx";
import { withPlausibleProxy } from "next-plausible";

import { recmaPlugins } from "./mdx/recma.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { remarkPlugins } from "./mdx/remark.mjs";
import withSearch from "./mdx/search.mjs";

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  transpilePackages: ["@formbricks/ui", "@formbricks/lib"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seo-strapi-aws-s3.s3.eu-central-1.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/3YFcABF2Ts",
        permanent: true,
      },
      {
        source: "/roadmap",
        destination: "https://github.com/orgs/formbricks/projects/1",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/formbricks/formbricks",
        permanent: true,
      },
      {
        source: "/deal",
        destination: "/concierge",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/form-hq",
        destination: "/",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "/docs/introduction/what-is-formbricks",
        permanent: true,
      },

      {
        source: "/docs/quickstart",
        destination: "/docs/getting-started/quickstart-in-app-survey",
        permanent: true,
      },
      {
        source: "/docs/getting-started/nextjs",
        destination: "/docs/getting-started/framework-guides#next-js",
        permanent: true,
      },
      {
        source: "/docs/formbricks-hq/self-hosting",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/react-form-library/getting-started",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/react-form-library/work-with-components",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/react-form-library/introduction",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/formbricks-hq/schema",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/events/why",
        destination: "/docs/actions/why",
        permanent: true,
      },
      {
        source: "/docs/events/code",
        destination: "/docs/actions/code",
        permanent: true,
      },
      {
        source: "/docs/events/code",
        destination: "/docs/actions/code",
        permanent: true,
      },
      {
        source: "/docs/quickstart",
        destination: "/docs/quickstart-in-app-survey",
        permanent: true,
      },
      {
        source: "/pmf",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/v1-and-how-we-got-here",
        destination: "/blog/experience-management-open-source",
        permanent: true,
      },
      {
        source: "/launch",
        destination: "https://www.producthunt.com/posts/formbricks",
        permanent: true,
      },
      {
        source: "/docs/self-hosting/from-source",
        destination: "/docs/self-hosting/docker",
        permanent: true,
      },
      {
        source: "/join-oss-friends",
        destination: "https://app.formbricks.com/s/clhys1p9r001cpr0hu65rwh17",
        permanent: true,
      },
      {
        source: "/docs/self-hosting/migrating-to-1.1",
        destination: "/docs/self-hosting/migration-guide",
        permanent: true,
      },
      {
        source: "/docs/contributing/gitpod",
        destination: "/docs/contributing/setup#gitpod",
        permanent: true,
      },
      {
        source: "/formtribe",
        destination: "/community",
        permanent: true,
      },
      {
        source: "/docs/actions/why",
        destination: "/docs/in-app-surveys/actions",
        permanent: true,
      },
      {
        source: "/docs/actions/no-code",
        destination: "/docs/in-app-surveys/actions#no-code-actions",
        permanent: true,
      },
      {
        source: "/docs/actions/code",
        destination: "/docs/in-app-surveys/actions#code-actions",
        permanent: true,
      },
      {
        source: "/docs/attributes/why",
        destination: "/docs/in-app-surveys/attributes",
        permanent: true,
      },
      {
        source: "/docs/attributes/custom-attributes",
        destination: "/docs/in-app-surveys/attributes#setting-custom-user-attributes",
        permanent: true,
      },
      {
        source: "/docs/attributes/identify-users",
        destination: "/docs/in-app-surveys/attributes#identifying-users",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "https://app.formbricks.com/auth/signup",
        permanent: true,
      },
      {
        source: "/blog/preseed-announcement",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: "/:path*",
          destination: `https://app.formbricks.com/s/:path*`,
        },
      ],
    };
  },
};

export default withPlausibleProxy({ customDomain: "https://plausible.formbricks.com" })(
  withSearch(withMDX(nextConfig))
);
