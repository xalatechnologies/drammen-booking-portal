
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "number" | "tel";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
}

interface CheckboxFieldProps extends BaseFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function InputField({ 
  label, 
  error, 
  required, 
  description, 
  className, 
  type = "text",
  placeholder,
  value,
  onChange,
  ...props 
}: InputFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </Label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "input-primary",
          error && "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20"
        )}
        {...props}
      />
      {description && (
        <p className="text-sm text-text-secondary">{description}</p>
      )}
      {error && (
        <p className="text-sm text-semantic-error">{error}</p>
      )}
    </div>
  );
}

export function TextareaField({ 
  label, 
  error, 
  required, 
  description, 
  className,
  placeholder,
  value,
  onChange,
  rows = 4,
  ...props 
}: TextareaFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </Label>
      )}
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        className={cn(
          "input-primary resize-none",
          error && "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20"
        )}
        {...props}
      />
      {description && (
        <p className="text-sm text-text-secondary">{description}</p>
      )}
      {error && (
        <p className="text-sm text-semantic-error">{error}</p>
      )}
    </div>
  );
}

export function SelectField({ 
  label, 
  error, 
  required, 
  description, 
  className,
  placeholder,
  value,
  onChange,
  options,
  ...props 
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onChange} {...props}>
        <SelectTrigger className={cn(
          "input-primary",
          error && "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <p className="text-sm text-text-secondary">{description}</p>
      )}
      {error && (
        <p className="text-sm text-semantic-error">{error}</p>
      )}
    </div>
  );
}

export function CheckboxField({ 
  label, 
  error, 
  required, 
  description, 
  className,
  checked,
  onChange,
  ...props 
}: CheckboxFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          className={cn(
            error && "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20"
          )}
          {...props}
        />
        {label && (
          <Label className="text-sm font-medium text-text-primary">
            {label}
            {required && <span className="text-semantic-error ml-1">*</span>}
          </Label>
        )}
      </div>
      {description && (
        <p className="text-sm text-text-secondary">{description}</p>
      )}
      {error && (
        <p className="text-sm text-semantic-error">{error}</p>
      )}
    </div>
  );
}
