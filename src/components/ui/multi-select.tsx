import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";

const multiSelectVariants = cva(
  "m-1",
  {
    variants: {
      variant: {
        default: "border-foreground",
        secondary: "border-secondary text-secondary-foreground",
        destructive: "border-destructive text-destructive-foreground",
        inverted: "border-inverted text-inverted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  asChild?: boolean;
  className?: string;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
        onValueChange(selectedValues);
      }
    }, [selectedValues, onValueChange, defaultValue]);

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
    };
    
    const handleTogglePopover = () => {
      setIsPopoverOpen(prev => !prev);
    }

    const handleAnimationEnd = () => {
      setIsAnimating(false);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
           <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-card",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const Icon = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(multiSelectVariants({ variant }))}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {option?.label}
                        <X
                          className="h-4 w-4 ml-2 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn("bg-muted text-foreground", multiSelectVariants({ variant }))}
                    >
                      +{selectedValues.length - maxCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="h-full min-h-6"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0"
            style={{animation: isAnimating ? `popover-animate ${animation}s` : 'none'}}
            onAnimationEnd={handleAnimationEnd}
        >
          <Command onKeyDown={handleInputKeyDown}>
            <CommandList>
              <CommandGroup>
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return(
                        <CommandItem
                            key={option.value}
                            onSelect={() => toggleOption(option.value)}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    {option.icon && <option.icon className="h-4 w-4 mr-2"/>}
                                    <span>{option.label}</span>
                                </div>
                                {isSelected ? 
                                    <div className="h-4 w-4 bg-primary rounded-sm"/> : 
                                    <div className="h-4 w-4 bg-muted border border-foreground rounded-sm"/>}
                            </div>
                        </CommandItem>
                    )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
); 