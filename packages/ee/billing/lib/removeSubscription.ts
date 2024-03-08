import Stripe from "stripe";

import { WEBAPP_URL } from "@formbricks/lib/constants";
import { env } from "@formbricks/lib/env";
import { getTeam, updateTeam } from "@formbricks/lib/team/service";

import { StripePriceLookupKeys } from "./constants";
import { getFirstOfNextMonthTimestamp } from "./createSubscription";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const baseUrl = process.env.NODE_ENV === "production" ? WEBAPP_URL : "http://localhost:3000";

const retrievePriceLookup = async (priceId: string) => (await stripe.prices.retrieve(priceId)).lookup_key;

export const removeSubscription = async (
  teamId: string,
  environmentId: string,
  priceLookupKeys: StripePriceLookupKeys[]
) => {
  try {
    const team = await getTeam(teamId);
    if (!team) throw new Error("Team not found.");
    if (!team.billing.stripeCustomerId) {
      return { status: 400, data: "No subscription exists for given team!", newPlan: false, url: "" };
    }

    const existingCustomer = (await stripe.customers.retrieve(team.billing.stripeCustomerId, {
      expand: ["subscriptions"],
    })) as Stripe.Customer;
    const existingSubscription = existingCustomer.subscriptions?.data[0] as Stripe.Subscription;

    const allScheduledSubscriptions = await stripe.subscriptionSchedules.list({
      customer: team.billing.stripeCustomerId,
    });
    const scheduledSubscriptions = allScheduledSubscriptions.data.filter(
      (scheduledSub) => scheduledSub.status === "not_started"
    );
    const newPriceIds: string[] = [];

    if (scheduledSubscriptions.length) {
      const priceIds = scheduledSubscriptions[0].phases[0].items.map((item) => item.price);
      for (const priceId of priceIds) {
        const priceLookUpKey = await retrievePriceLookup(priceId as string);
        if (!priceLookUpKey) continue;
        if (!priceLookupKeys.includes(priceLookUpKey as StripePriceLookupKeys)) {
          newPriceIds.push(priceId as string);
        }
      }

      if (!newPriceIds.length) {
        await stripe.subscriptionSchedules.cancel(scheduledSubscriptions[0].id);
      } else {
        await stripe.subscriptionSchedules.update(scheduledSubscriptions[0].id, {
          end_behavior: "release",
          phases: [
            {
              start_date: getFirstOfNextMonthTimestamp(),
              items: newPriceIds.map((priceId) => ({ price: priceId })),
              iterations: 1,
              metadata: { teamId },
            },
          ],
          metadata: { teamId },
        });
      }
    } else {
      const validSubItems = existingSubscription.items.data.filter(
        (subItem) =>
          subItem.price.lookup_key &&
          !priceLookupKeys.includes(subItem.price.lookup_key as StripePriceLookupKeys)
      );
      newPriceIds.push(...validSubItems.map((subItem) => subItem.price.id));

      if (newPriceIds.length) {
        await stripe.subscriptionSchedules.create({
          customer: team.billing.stripeCustomerId,
          start_date: getFirstOfNextMonthTimestamp(),
          end_behavior: "release",
          phases: [
            {
              items: newPriceIds.map((priceId) => ({ price: priceId })),
              iterations: 1,
              metadata: { teamId },
            },
          ],
          metadata: { teamId },
        });
      }
    }

    await stripe.subscriptions.update(existingSubscription.id, { cancel_at_period_end: true });

    let updatedFeatures = team.billing.features;
    for (const priceLookupKey of priceLookupKeys) {
      updatedFeatures[priceLookupKey as keyof typeof updatedFeatures].status = "cancelled";
    }

    await updateTeam(teamId, {
      billing: {
        ...team.billing,
        features: updatedFeatures,
      },
    });

    return {
      status: 200,
      data: "Successfully removed from your existing subscription!",
      newPlan: false,
      url: "",
    };
  } catch (err) {
    console.log("Error in removing subscription:", err);

    return {
      status: 500,
      data: "Something went wrong!",
      newPlan: true,
      url: `${baseUrl}/environments/${environmentId}/settings/billing`,
    };
  }
};
