import React, { useState } from "react";

// Tab interface
// The Tab component accepts the following props:
// - label: string - The text to display for the tab
// - icon: React.ReactNode - An optional icon to display alongside the label
// - content: React.ReactNode - The content to display when the tab is active
// - disabled: boolean - Whether the tab is disabled

// Tabs component props
const Tabs = ({
  tabs = [],
  defaultActiveTab = 0,
  variant = "default",
  orientation = "horizontal",
  iconPosition = "left",
  fullWidth = false,
  onChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Define variant styles
  const variantStyles = {
    default: {
      container: "border-b border-gray-200",
      tab: "px-4 py-2 font-medium text-sm focus:outline-none",
      active: "text-blue-600 border-b-2 border-blue-600",
      inactive: "text-gray-500 hover:text-gray-700 hover:border-gray-300",
      disabled: "text-gray-300 cursor-not-allowed",
      content: "p-4",
    },
    pills: {
      container: "space-x-1",
      tab: "px-4 py-2 rounded-md font-medium text-sm focus:outline-none",
      active: "bg-blue-600 text-white",
      inactive: "text-gray-700 hover:bg-gray-100",
      disabled: "text-gray-300 cursor-not-allowed",
      content: "p-4 mt-4",
    },
    outline: {
      container: "border-b border-gray-200",
      tab: "px-4 py-2 font-medium text-sm border border-transparent focus:outline-none",
      active: "border-gray-200 border-b-white rounded-t-md text-blue-600",
      inactive: "text-gray-500 hover:text-gray-700",
      disabled: "text-gray-300 cursor-not-allowed",
      content: "p-4 border-l border-r border-b border-gray-200",
    },
    minimal: {
      container: "",
      tab: "px-3 py-1.5 font-medium text-sm focus:outline-none",
      active: "text-blue-600 font-semibold",
      inactive: "text-gray-500 hover:text-gray-700",
      disabled: "text-gray-300 cursor-not-allowed",
      content: "p-4 mt-2",
    },
    card: {
      container: "bg-gray-100 p-1 rounded-md",
      tab: "px-4 py-2 font-medium text-sm rounded-md focus:outline-none",
      active: "bg-white text-blue-600 shadow-sm",
      inactive: "text-gray-500 hover:text-gray-700",
      disabled: "text-gray-300 cursor-not-allowed",
      content: "p-4 mt-4",
    },
  };

  // Get the styles for the current variant
  const styles = variantStyles[variant] || variantStyles.default;

  // Handle tab click
  const handleTabClick = (index) => {
    if (tabs[index]?.disabled) return;
    setActiveTab(index);
    onChange(index);
  };

  // Apply orientation styles
  const containerOrientation =
    orientation === "vertical" ? "flex flex-row" : "flex flex-col";

  const tabListOrientation =
    orientation === "vertical"
      ? "flex flex-col space-y-2"
      : `flex ${orientation === "horizontal" ? "flex-row" : "flex-col"} ${
          fullWidth ? "w-full" : ""
        }`;

  const tabStyles =
    orientation === "vertical" && fullWidth
      ? "w-full"
      : orientation === "horizontal" && fullWidth
      ? "flex-1"
      : "";

  return (
    <div className={`tabs-component ${containerOrientation}`}>
      <div className={`tabs-list ${tabListOrientation} ${styles.container}`}>
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const isDisabled = tab.disabled;

          let tabStyle = `${styles.tab} ${tabStyles} flex items-center gap-2`;

          if (isDisabled) {
            tabStyle += ` ${styles.disabled}`;
          } else if (isActive) {
            tabStyle += ` ${styles.active}`;
          } else {
            tabStyle += ` ${styles.inactive}`;
          }

          return (
            <button
              key={index}
              className={tabStyle}
              onClick={() => handleTabClick(index)}
              disabled={isDisabled}
              aria-selected={isActive}
              role="tab"
            >
              {tab.icon && iconPosition === "left" && (
                <span className="tab-icon">{tab.icon}</span>
              )}
              <span>{tab.label}</span>
              {tab.icon && iconPosition === "right" && (
                <span className="tab-icon">{tab.icon}</span>
              )}
            </button>
          );
        })}
      </div>
      <div
        className={`tab-content ${styles.content} ${
          orientation === "vertical" ? "flex-1" : "w-full"
        }`}
      >
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;

// // useage example
// const Example = () => {
//   const tabsContent = [
//     {
//       label: "Dashboard",
//       icon: <HiOutlineInformationCircle />,
//       content: <div>Dashboard Content</div>,
//     },
//     {
//       label: "Settings",
//       icon: <HiOutlineCheckCircle />,
//       content: <div>Settings Content</div>,
//     },
//     {
//       label: "Messages",
//       icon: <HiOutlineExclamationCircle />,
//       content: <div>Messages Content</div>,
//       disabled: true,
//     },
//   ];

//   const handleTabChange = (index) => {
//     console.log(`Tab changed to index ${index}`);
//   };

//   return (
//     <div className="p-4 space-y-8">
//       <div>
//         <h2 className="text-lg font-medium mb-2">Default Tabs (Horizontal)</h2>
//         <Tabs tabs={tabsContent} onChange={handleTabChange} />
//       </div>

//       <div>
//         <h2 className="text-lg font-medium mb-2">Pills Variant</h2>
//         <Tabs tabs={tabsContent} variant="pills" onChange={handleTabChange} />
//       </div>

//       <div>
//         <h2 className="text-lg font-medium mb-2">Outline Variant</h2>
//         <Tabs tabs={tabsContent} variant="outline" onChange={handleTabChange} />
//       </div>

//       <div>
//         <h2 className="text-lg font-medium mb-2">Minimal Variant</h2>
//         <Tabs tabs={tabsContent} variant="minimal" onChange={handleTabChange} />
//       </div>

//       <div>
//         <h2 className="text-lg font-medium mb-2">Card Variant</h2>
//         <Tabs tabs={tabsContent} variant="card" onChange={handleTabChange} />
//       </div>

//       <div>
//         <h2 className="text-lg font-medium mb-2">Vertical Orientation</h2>
//         <Tabs
//           tabs={tabsContent}
//           orientation="vertical"
//           onChange={handleTabChange}
//         />
//       </div>

//       <div>
//         <h2 className="text-lg font-medium mb-2">Full Width Tabs</h2>
//         <Tabs tabs={tabsContent} fullWidth={true} onChange={handleTabChange} />
//       </div>

//       <div>
//         <h2 className="text-lg font-medium mb-2">Icons on Right</h2>
//         <Tabs
//           tabs={tabsContent}
//           iconPosition="right"
//           onChange={handleTabChange}
//         />
//       </div>
//     </div>
//   );
// };
