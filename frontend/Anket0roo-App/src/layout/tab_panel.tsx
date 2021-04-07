import * as React from "react";

interface TabPanelProps {
    children?: JSX.Element;
    index: any;
    value: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({children, index, value}: TabPanelProps) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
        >
            {value === index && (
                children
            )}
        </div>
    );
}