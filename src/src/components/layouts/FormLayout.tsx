
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FormLayoutProps } from "./types";
import { LAYOUT_CONSTANTS } from "./constants";

export const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  description,
  breadcrumb,
  tabs = [],
  actions,
  onSubmit,
  children
}) => {
  const hasTabs = tabs.length > 0;
  const defaultTabValue = tabs[0]?.id || "default";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={LAYOUT_CONSTANTS.RESPONSIVE_CONTAINER + " py-8"}>
        {breadcrumb}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className={LAYOUT_CONSTANTS.PAGE_TITLE}>{title}</h1>
          {description && (
            <p className={LAYOUT_CONSTANTS.PAGE_DESCRIPTION}>{description}</p>
          )}
        </div>

        {/* Main Content */}
        <Card className={LAYOUT_CONSTANTS.CARD_STYLES}>
          <CardContent className="p-0">
            {hasTabs ? (
              <Tabs defaultValue={defaultTabValue} className="w-full">
                <div className="border-b border-gray-200 px-6 pt-6">
                  <TabsList className={cn("grid w-full h-12", `grid-cols-${tabs.length}`)}>
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        disabled={tab.disabled}
                        className="text-sm"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <form onSubmit={onSubmit}>
                  <div className="p-6">
                    {tabs.map((tab) => (
                      <TabsContent key={tab.id} value={tab.id} className="mt-0 space-y-8">
                        {tab.content}
                      </TabsContent>
                    ))}
                    {children}
                  </div>

                  {/* Form Actions */}
                  <div className={LAYOUT_CONSTANTS.FORM_ACTIONS}>
                    <div className={LAYOUT_CONSTANTS.FORM_BUTTON_SPACING}>
                      {actions}
                    </div>
                  </div>
                </form>
              </Tabs>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="p-6">
                  {children}
                </div>
                
                {/* Form Actions */}
                <div className={LAYOUT_CONSTANTS.FORM_ACTIONS}>
                  <div className={LAYOUT_CONSTANTS.FORM_BUTTON_SPACING}>
                    {actions}
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
