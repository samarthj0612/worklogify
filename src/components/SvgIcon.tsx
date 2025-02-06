import React from "react";
import { SvgProps } from "react-native-svg";

const iconMap = {};

interface IconProps extends SvgProps {
  name: keyof typeof iconMap;
  size?: number;
  color?: string;
}

const SvgIcon: React.FC<IconProps> = ({ name, size = 24, color = "#000", strokeWidth = 1.5, ...props }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`SVG icon "${name}" not found.`);
    return null;
  }

  return <IconComponent width={size} height={size} stroke={color} strokeWidth={strokeWidth} {...props} />;
};

export default SvgIcon;
