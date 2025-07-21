import React from 'react';

export const Badge = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const classes = `${baseClasses} ${className}`;

  return (
    <div>
      <span className={classes} {...props}>
        {children}
      </span>
    </div>
  );
};

// Demo component to showcase different badge variants
const BadgeDemo = () => {
  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ShadCN Badge Component</h1>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Variants</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Sizes</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge size="sm">Small</Badge>
            <Badge size="default">Default</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Examples</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Status:</span>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Priority:</span>
              <Badge variant="destructive">High</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Version:</span>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Category:</span>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">UI</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Custom Content</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              <span className="mr-1">🎉</span>
              New Feature
            </Badge>
            <Badge variant="destructive">
              <span className="mr-1">⚠️</span>
              Breaking Change
            </Badge>
            <Badge variant="success">
              <span className="mr-1">✅</span>
              Completed
            </Badge>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h3 className="font-semibold mb-2">Usage Example:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
{`<Badge variant="default">Default Badge</Badge>
<Badge variant="secondary">Secondary Badge</Badge>
<Badge variant="destructive">Error Badge</Badge>
<Badge variant="outline">Outline Badge</Badge>
<Badge variant="success">Success Badge</Badge>
<Badge variant="warning">Warning Badge</Badge>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BadgeDemo;