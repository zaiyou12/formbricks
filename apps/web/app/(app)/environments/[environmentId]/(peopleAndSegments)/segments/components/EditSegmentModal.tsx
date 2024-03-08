"use client";

import { UserGroupIcon } from "@heroicons/react/24/solid";

import SegmentSettings from "@formbricks/ee/advancedTargeting/components/SegmentSettings";
import { TActionClass } from "@formbricks/types/actionClasses";
import { TAttributeClass } from "@formbricks/types/attributeClasses";
import { TSegment, TSegmentWithSurveyNames } from "@formbricks/types/segment";
import ModalWithTabs from "@formbricks/ui/ModalWithTabs";

import BasicSegmentSettings from "./BasicSegmentSettings";
import SegmentActivityTab from "./SegmentActivityTab";

interface EditSegmentModalProps {
  environmentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  currentSegment: TSegmentWithSurveyNames;
  segments: TSegment[];
  attributeClasses: TAttributeClass[];
  actionClasses: TActionClass[];
  isAdvancedTargetingAllowed: boolean;
  isFormbricksCloud: boolean;
}

export default function EditSegmentModal({
  environmentId,
  open,
  setOpen,
  currentSegment,
  actionClasses,
  attributeClasses,
  segments,
  isAdvancedTargetingAllowed,
  isFormbricksCloud,
}: EditSegmentModalProps) {
  const SettingsTab = () => {
    if (isAdvancedTargetingAllowed) {
      return (
        <SegmentSettings
          actionClasses={actionClasses}
          attributeClasses={attributeClasses}
          environmentId={environmentId}
          initialSegment={currentSegment}
          segments={segments}
          setOpen={setOpen}
        />
      );
    }

    return (
      <BasicSegmentSettings
        attributeClasses={attributeClasses}
        environmentId={environmentId}
        initialSegment={currentSegment}
        setOpen={setOpen}
        isFormbricksCloud={isFormbricksCloud}
      />
    );
  };

  const tabs = [
    {
      title: "Activity",
      children: <SegmentActivityTab environmentId={environmentId} currentSegment={currentSegment} />,
    },
    {
      title: "Settings",
      children: <SettingsTab />,
    },
  ];

  return (
    <>
      <ModalWithTabs
        open={open}
        setOpen={setOpen}
        tabs={tabs}
        icon={<UserGroupIcon />}
        label={currentSegment.title}
        description={currentSegment.description || ""}
        closeOnOutsideClick={false}
      />
    </>
  );
}
