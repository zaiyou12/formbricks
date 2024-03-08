import { ChevronDownIcon, Equal, Grid2X2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { TSurvey } from "@formbricks/types/surveys";

import { Button } from "../../Button";
import { Checkbox } from "../../Checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../DropdownMenu";
import { TooltipRenderer } from "../../Tooltip";

interface SurveyFilterProps {
  surveys: TSurvey[];
  setFilteredSurveys: (surveys: TSurvey[]) => void;
  orientation: string;
  setOrientation: (orientation: string) => void;
  userId: string;
}
interface TFilterOption {
  label: string;
  value: string;
}
interface TSortOption {
  label: string;
  sortFunction: (a: TSurvey, b: TSurvey) => number;
}

interface FilterDropdownProps {
  title: string;
  id: string;
  options: TFilterOption[];
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
  isOpen: boolean;
}

const statusOptions = [
  { label: "In Progress", value: "inProgress" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
  { label: "Draft", value: "draft" },
];
const typeOptions = [
  { label: "Link", value: "link" },
  { label: "In-app", value: "web" },
];

const sortOptions = [
  {
    label: "Last Modified",
    sortFunction: (a: TSurvey, b: TSurvey) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
      return 0;
    },
  },
  {
    label: "Created On",
    sortFunction: (a: TSurvey, b: TSurvey) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
      return 0;
    },
  },
  {
    label: "Alphabetical",
    sortFunction: (a: TSurvey, b: TSurvey) => a.name.localeCompare(b.name),
  },
  // Add other sorting options as needed
];

const getToolTipContent = (orientation: string) => {
  return <div>{orientation} View</div>;
};

export default function SurveyFilters({
  surveys,
  setFilteredSurveys,
  orientation,
  setOrientation,
  userId,
}: SurveyFilterProps) {
  const [createdByFilter, setCreatedByFilter] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpenStates, setDropdownOpenStates] = useState(new Map());

  const toggleDropdown = (id: string) => {
    setDropdownOpenStates(new Map(dropdownOpenStates).set(id, !dropdownOpenStates.get(id)));
  };

  const creatorOptions = [
    { label: "You", value: userId },
    { label: "Others", value: "other" },
  ];

  useEffect(() => {
    let filtered = [...surveys];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((survey) => survey.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (createdByFilter.length > 0) {
      filtered = filtered.filter((survey) => {
        if (survey.createdBy) {
          if (createdByFilter.length === 2) return true;
          if (createdByFilter.includes("other")) return survey.createdBy !== userId;
          else {
            return survey.createdBy === userId;
          }
        }
      });
    }

    if (statusFilters.length > 0) {
      filtered = filtered.filter((survey) => statusFilters.includes(survey.status));
    }
    if (typeFilters.length > 0) {
      filtered = filtered.filter((survey) => typeFilters.includes(survey.type));
    }
    if (sortBy && sortBy.sortFunction) {
      filtered.sort(sortBy.sortFunction);
    }

    setFilteredSurveys(filtered);
  }, [createdByFilter, statusFilters, typeFilters, sortBy, searchTerm, surveys]);

  const handleFilterChange = (
    value: string,
    selectedOptions: string[],
    setSelectedOptions: (options: string[]) => void
  ) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  const renderSortOption = (option: TSortOption) => (
    <DropdownMenuItem
      key={option.label}
      className="m-0 p-0"
      onClick={() => {
        setSortBy(option);
      }}>
      <div className="flex h-full w-full items-center space-x-2 px-2 py-1 hover:bg-slate-700">
        <span
          className={`h-4 w-4 rounded-full border ${sortBy === option ? "bg-brand-dark outline-brand-dark border-slate-900 outline" : "border-white"}`}></span>
        <p className="font-normal text-white">{option.label}</p>
      </div>
    </DropdownMenuItem>
  );

  const FilterDropdown = ({
    title,
    id,
    options,
    selectedOptions,
    setSelectedOptions,
    isOpen,
  }: FilterDropdownProps) => {
    const triggerClasses = `surveyFilterDropdown min-w-auto h-8 rounded-md border border-slate-700 sm:px-2 cursor-pointer outline-none 
    ${selectedOptions.length > 0 ? "bg-slate-900 text-white" : "hover:bg-slate-900"}`;

    return (
      <DropdownMenu open={isOpen} onOpenChange={() => toggleDropdown(id)}>
        <DropdownMenuTrigger asChild className={triggerClasses}>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm">{title}</span>
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-slate-900">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="m-0 p-0"
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange(option.value, selectedOptions, setSelectedOptions);
              }}>
              <div className="flex h-full w-full items-center space-x-2 px-2 py-1 hover:bg-slate-700">
                <Checkbox
                  checked={selectedOptions.includes(option.value)}
                  className={`bg-white ${selectedOptions.includes(option.value) ? "bg-brand-dark border-none" : ""}`}
                />
                <p className="font-normal text-white">{option.label}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex justify-between">
      <div className="flex space-x-2">
        <div className="flex h-8 items-center rounded-lg border border-slate-300 bg-white px-4">
          <Search className="h-4 w-4" />
          <input
            type="text"
            className="border-none bg-transparent placeholder:text-sm"
            placeholder="Search by survey name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <FilterDropdown
            title="Created By"
            id="creatorDropdown"
            options={creatorOptions}
            selectedOptions={createdByFilter}
            setSelectedOptions={setCreatedByFilter}
            isOpen={dropdownOpenStates.get("creatorDropdown")}
          />
        </div>
        <div>
          <FilterDropdown
            title="Status"
            id="statusDropdown"
            options={statusOptions}
            selectedOptions={statusFilters}
            setSelectedOptions={setStatusFilters}
            isOpen={dropdownOpenStates.get("statusDropdown")}
          />
        </div>
        <div>
          <FilterDropdown
            title="Type"
            id="typeDropdown"
            options={typeOptions}
            selectedOptions={typeFilters}
            setSelectedOptions={setTypeFilters}
            isOpen={dropdownOpenStates.get("typeDropdown")}
          />
        </div>
        {(createdByFilter.length > 0 || statusFilters.length > 0 || typeFilters.length > 0) && (
          <Button
            variant="darkCTA"
            size="sm"
            onClick={() => {
              setCreatedByFilter([]);
              setStatusFilters([]);
              setTypeFilters([]);
            }}
            className="h-8"
            EndIcon={X}
            endIconClassName="h-4 w-4">
            Clear Filters
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <TooltipRenderer
          shouldRender={true}
          tooltipContent={getToolTipContent("List")}
          className="bg-slate-900 text-white">
          <div
            className={`flex  h-8 w-8  items-center justify-center  rounded-lg border  p-1 ${orientation === "list" ? "bg-slate-900 text-white" : "bg-white"}`}
            onClick={() => setOrientation("list")}>
            <Equal className="h-5 w-5" />
          </div>
        </TooltipRenderer>

        <TooltipRenderer
          shouldRender={true}
          tooltipContent={getToolTipContent("Grid")}
          className="bg-slate-900 text-white">
          <div
            className={`flex h-8 w-8  items-center justify-center rounded-lg border  p-1 ${orientation === "grid" ? "bg-slate-900 text-white" : "bg-white"}`}
            onClick={() => setOrientation("grid")}>
            <Grid2X2 className="h-5 w-5" />
          </div>
        </TooltipRenderer>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="surveyFilterDropdown h-full cursor-pointer border border-slate-700 outline-none hover:bg-slate-900">
            <div className="min-w-auto h-8 rounded-md border sm:flex sm:px-2">
              <div className="hidden w-full items-center justify-between hover:text-white sm:flex">
                <span className="text-sm ">Sort by: {sortBy.label}</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-slate-900 ">
            {sortOptions.map(renderSortOption)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
