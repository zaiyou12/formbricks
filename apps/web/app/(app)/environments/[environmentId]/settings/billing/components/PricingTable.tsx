"use client";

import {
  manageSubscriptionAction,
  removeSubscriptionAction,
  upgradePlanAction,
} from "@/app/(app)/environments/[environmentId]/settings/billing/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { ProductFeatureKeys, StripePriceLookupKeys } from "@formbricks/ee/billing/lib/constants";
import { TTeam } from "@formbricks/types/teams";
import AlertDialog from "@formbricks/ui/AlertDialog";
import { Button } from "@formbricks/ui/Button";
import LoadingSpinner from "@formbricks/ui/LoadingSpinner";
import { PricingCard } from "@formbricks/ui/PricingCard";

interface PricingTableProps {
  team: TTeam;
  environmentId: string;
  peopleCount: number;
  responseCount: number;
  userTargetingFreeMtu: number;
  inAppSurveyFreeResponses: number;
}

export default function PricingTableComponent({
  team,
  environmentId,
  peopleCount,
  responseCount,
  userTargetingFreeMtu,
  inAppSurveyFreeResponses: appSurveyFreeResponses,
}: PricingTableProps) {
  const router = useRouter();
  const [loadingCustomerPortal, setLoadingCustomerPortal] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [activeLookupKey, setActiveLookupKey] = useState<StripePriceLookupKeys>();

  const openCustomerPortal = async () => {
    setLoadingCustomerPortal(true);
    const sessionUrl = await manageSubscriptionAction(team.id, environmentId);
    router.push(sessionUrl);
    setLoadingCustomerPortal(false);
  };

  const upgradePlan = async (priceLookupKeys: StripePriceLookupKeys[]) => {
    try {
      setUpgradingPlan(true);
      const { status, newPlan, url } = await upgradePlanAction(team.id, environmentId, priceLookupKeys);
      setUpgradingPlan(false);
      if (status != 200) {
        throw new Error("Something went wrong");
      }
      if (!newPlan) {
        toast.success("Plan upgraded successfully");
        router.refresh();
      } else if (newPlan && url) {
        router.push(url);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      toast.error("Unable to upgrade plan");
    } finally {
      setUpgradingPlan(false);
    }
  };

  const handleUnsubscribe = async (e, lookupKey) => {
    try {
      e.preventDefault();
      setActiveLookupKey(lookupKey);
      setOpenDeleteModal(true);
    } catch (err) {
      toast.error("Unable to open delete modal");
    }
  };

  const handleDeleteSubscription = async () => {
    try {
      if (!activeLookupKey) throw new Error("No active lookup key");
      await removeSubscriptionAction(team.id, environmentId, [activeLookupKey]);
      router.refresh();
      toast.success("Subscription deleted successfully");
    } catch (err) {
      toast.error("Unable to delete subscription");
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const coreAndWebAppSurveyFeatures = [
    {
      title: "Remove Formbricks Branding",
      comingSoon: false,
    },
    {
      title: "Team Roles",
      comingSoon: false,
    },
    {
      title: "250 responses / month free",
      comingSoon: false,
      unlimited: false,
    },
    {
      title: "$0.15 / responses afterwards",
      comingSoon: false,
      unlimited: false,
    },
    {
      title: "Multi-Language Surveys",
      comingSoon: true,
    },
    {
      title: "Unlimited Responses",
      unlimited: true,
    },
  ];

  const userTargetingFeatures = [
    {
      title: "2.500 identified users / month free",
      comingSoon: false,
      unlimited: false,
    },
    {
      title: "$0.01 / identified user afterwards",
      comingSoon: false,
      unlimited: false,
    },
    {
      title: "Advanced Targeting",
      comingSoon: false,
    },
    {
      title: "Unlimited User Identification",
      unlimited: true,
    },
    {
      title: "Reusable Segments",
      comingSoon: false,
      unlimited: true,
    },
  ];

  const linkSurveysFeatures = [
    {
      title: "Remove Formbricks Branding",
      comingSoon: false,
    },
    {
      title: "File Uploads up to 1 GB",
      comingSoon: false,
    },
    {
      title: "Custom Domain",
      comingSoon: true,
    },
    {
      title: "Multi-Language Surveys",
      comingSoon: true,
    },
  ];

  return (
    <div className="relative">
      {loadingCustomerPortal && (
        <div className="absolute h-full w-full rounded-lg bg-slate-900/5">
          <LoadingSpinner />
        </div>
      )}
      <div className="justify-between gap-4 rounded-lg">
        {team.billing.stripeCustomerId ? (
          <div className="flex w-full justify-end">
            <Button variant="minimal" className="justify-center py-2 shadow-sm" onClick={openCustomerPortal}>
              Cancel Subscription
            </Button>
            <Button
              variant="secondary"
              className="justify-center py-2 shadow-sm"
              loading={loadingCustomerPortal}
              onClick={openCustomerPortal}>
              {team.billing.features.inAppSurvey.unlimited ? "Manage Subscription" : "Manage Card details"}
            </Button>
          </div>
        ) : (
          <>
            {/* <div className="relative isolate mt-8 overflow-hidden rounded-lg bg-slate-900 px-3 pt-8 shadow-2xl sm:px-8 md:pt-12 lg:flex lg:gap-x-10 lg:px-12 lg:pt-0">
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                aria-hidden="true">
                <circle
                  cx={512}
                  cy={512}
                  r={512}
                  fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                  fillOpacity="0.7"
                />
                <defs>
                  <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                    <stop stopColor="#00E6CA" />
                    <stop offset={0} stopColor="#00C4B8" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-16 lg:text-left">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Launch Special:
                  <br /> Go Unlimited! Forever!
                </h2>
                <p className="text-md mt-6 leading-8 text-slate-300">
                  Get access to all pro features and unlimited responses + identified users for a flat fee of
                  only $99/month.
                  <br /> <br />
                  <span className="text-slate-400">
                    This deal ends on 31st of October 2023 at 11:59 PM PST.
                  </span>
                </p>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center lg:pr-8">
                <Button
                  variant="minimal"
                  className="w-full justify-center bg-white py-2 text-slate-800 shadow-sm"
                  loading={upgradingPlan}
                  onClick={() =>
                    upgradePlan([
                      StripePriceLookupKeys.inAppSurveyUnlimited,
                      StripePriceLookupKeys.linkSurveyUnlimited,
                      StripePriceLookupKeys.userTargetingUnlimited,
                    ])
                  }>
                  Upgrade now at $99/month
                </Button>
              </div>
            </div> */}

            <div className="relative isolate mt-8 overflow-hidden rounded-lg bg-slate-900 px-3 pt-8 shadow-2xl sm:px-8 md:pt-12 lg:flex lg:gap-x-10 lg:px-12 lg:pt-0">
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                aria-hidden="true">
                <circle
                  cx={512}
                  cy={512}
                  r={512}
                  fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                  fillOpacity="0.7"
                />
                <defs>
                  <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                    <stop stopColor="#00E6CA" />
                    <stop offset={0} stopColor="#00C4B8" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-16 lg:text-left">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Unlock the full power of Formbricks, for free.
                </h2>
                <p className="text-md mt-6 leading-8 text-slate-300">
                  Add a credit card, get access to all features.
                  <br />
                  You will <b>not</b> be charged until you exceed the free tier limits.
                </p>
              </div>
            </div>
          </>
        )}

        <PricingCard
          title={"Formbricks Core & Surveys"}
          subtitle={"Get 250 responses free every month"}
          featureName={ProductFeatureKeys[ProductFeatureKeys.inAppSurvey]}
          monthlyPrice={0}
          actionText={"Starting at"}
          team={team}
          metric="responses"
          sliderValue={responseCount}
          sliderLimit={350}
          freeTierLimit={appSurveyFreeResponses}
          paidFeatures={coreAndWebAppSurveyFeatures.filter((feature) => {
            if (team.billing.features.inAppSurvey.unlimited) {
              return feature.unlimited !== false;
            } else {
              return feature.unlimited !== true;
            }
          })}
          perMetricCharge={0.15}
          loading={upgradingPlan}
          onUpgrade={() => upgradePlan([StripePriceLookupKeys.inAppSurvey])}
          onUnsubscribe={(e) => handleUnsubscribe(e, ProductFeatureKeys[ProductFeatureKeys.inAppSurvey])}
        />

        <PricingCard
          title={"Link Survey Pro"}
          subtitle={"Link Surveys include unlimited surveys and responses for free."}
          featureName={ProductFeatureKeys[ProductFeatureKeys.linkSurvey]}
          monthlyPrice={30}
          actionText={""}
          team={team}
          paidFeatures={linkSurveysFeatures}
          loading={upgradingPlan}
          onUpgrade={() => upgradePlan([StripePriceLookupKeys.linkSurvey])}
          onUnsubscribe={(e) => handleUnsubscribe(e, ProductFeatureKeys[ProductFeatureKeys.linkSurvey])}
        />

        <PricingCard
          title={"User Identification"}
          subtitle={"Identify up to 2.500 users every month"}
          featureName={ProductFeatureKeys[ProductFeatureKeys.userTargeting]}
          monthlyPrice={0}
          actionText={"Starting at"}
          team={team}
          metric="people"
          sliderValue={peopleCount}
          sliderLimit={3500}
          freeTierLimit={userTargetingFreeMtu}
          paidFeatures={userTargetingFeatures.filter((feature) => {
            if (team.billing.features.userTargeting.unlimited) {
              return feature.unlimited !== false;
            } else {
              return feature.unlimited !== true;
            }
          })}
          perMetricCharge={0.01}
          loading={upgradingPlan}
          onUpgrade={() => upgradePlan([StripePriceLookupKeys.userTargeting])}
          onUnsubscribe={(e) => handleUnsubscribe(e, ProductFeatureKeys[ProductFeatureKeys.userTargeting])}
        />
      </div>

      <AlertDialog
        headerText="Are you sure that you want to unsubscribe?"
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onDecline={() => {
          setOpenDeleteModal(false);
        }}
        mainText="Your subscription for this product will be canceled at the End of this Month! After that, you won't have access to the Paid features anymore"
        onConfirm={() => handleDeleteSubscription()}
        confirmBtnLabel="Unsubscribe"
      />
    </div>
  );
}
