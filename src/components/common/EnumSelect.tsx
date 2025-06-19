
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEnum } from '@/hooks/useEnum';
import { EnumType } from '@/types/enum';
import { Loader2 } from 'lucide-react';

interface EnumSelectProps {
  enumType: EnumType;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showDescription?: boolean;
}

export function EnumSelect({
  enumType,
  value,
  onValueChange,
  placeholder,
  label,
  description,
  required = false,
  disabled = false,
  className = "",
  showDescription = true
}: EnumSelectProps) {
  const { options, isLoading, error } = useEnum(enumType);

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error loading options: {error}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-base font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      <Select 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="h-12 border-gray-300 focus:border-slate-700">
          <SelectValue placeholder={isLoading ? "Loading..." : placeholder}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
          {options.map((option) => (
            <SelectItem 
              key={option.id} 
              value={option.key}
              className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            >
              <div className="flex flex-col items-start py-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                {showDescription && option.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
