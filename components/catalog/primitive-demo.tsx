"use client"
import React from "react"
import { renderOverlayPrimitive } from "./overlay-primitive-demos"

export const renderComponentDemo = (Component: React.ComponentType<any>, name: string, variant: string) => {
  try {
    const nameLower = name.toLowerCase();
    const ov = renderOverlayPrimitive(nameLower, Component, {})
    if (ov) return ov
    
    if (nameLower === 'accordion') {
      return (
        <Component>
          <div className="p-4 border border-border rounded-lg mb-2">Accordion Trigger 1</div>
          <div className="p-4 border border-border rounded-lg">Accordion Trigger 2</div>
        </Component>
      );
    }
    if (nameLower === 'alert') {
      return <Component variant={variant}>This is an alert message!</Component>;
    }
    if (nameLower === 'breadcrumb') {
      return <Component />;
    }
    if (nameLower === 'avatar') {
      return <Component src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" fallback="JD" />;
    }
    if (nameLower === 'avatargroup') {
      return <Component max={3} />;
    }
    if (nameLower === 'badge') {
      return <Component variant={variant}>Badge</Component>;
    }
    if (nameLower === 'button') {
      return <Component variant={variant}>Button</Component>;
    }
    if (nameLower === 'card') {
      return (
        <Component className="w-[300px] p-6 border rounded-xl">
          <div className="font-bold text-lg mb-2">Card Title</div>
          <p className="text-sm text-muted-foreground">This is the card body content.</p>
        </Component>
      );
    }
    if (nameLower === 'checkbox') {
      return <Component id="checkbox-demo" label="Accept terms and conditions" />;
    }
    if (nameLower === 'chip') {
      return <Component label="Chip Label" />;
    }
    if (nameLower === 'combobox' || nameLower === 'autocomplete' || nameLower === 'select') {
      return <Component placeholder="Select option..." />;
    }
    if (nameLower === 'input' || nameLower === 'passwordinput' || nameLower === 'textarea' || nameLower === 'searchinput') {
      return <Component placeholder="Type here..." />;
    }
    if (nameLower === 'progress' || nameLower === 'progressbar') {
      return <Component value={60} className="w-[250px]" />;
    }
    if (nameLower === 'progresscircle') {
      return <Component value={75} />;
    }
    if (nameLower === 'rating') {
      return <Component value={4} />;
    }
    if (nameLower === 'slider') {
      return <Component defaultValue={[50]} max={100} step={1} className="w-[250px]" />;
    }
    if (nameLower === 'switch') {
      return <Component id="switch-demo" label="Toggle Option" />;
    }
    if (nameLower === 'tab' || nameLower === 'tabs' || nameLower === 'responsivetabs') {
      return <Component />;
    }
    if (nameLower === 'tag') {
      return <Component>Tag text</Component>;
    }
    if (nameLower === 'toast') {
      return <Component message="This is a toast notification!" />;
    }
    if (nameLower === 'timeline') {
      return <Component />;
    }
    if (nameLower === 'steps' || nameLower === 'stepper') {
      return <Component currentStep={1} steps={['Step 1', 'Step 2', 'Step 3']} />;
    }
    if (nameLower === 'loadingspinner' || nameLower === 'spin') {
      return <Component />;
    }
    if (nameLower === 'skeleton') {
      return <Component className="h-6 w-[200px]" />;
    }
    if (nameLower === 'navbar') {
      return <Component />;
    }
    if (nameLower === 'hero') {
      return <Component />;
    }
    
    return <Component variant={variant}>Demo content</Component>;
  } catch (err) {
    console.error(`Error rendering component ${name}:`, err);
    return <div className="text-destructive font-mono text-xs">Failed to render {name}: {String(err)}</div>;
  }
}

