import { icons, LucideProps } from "lucide-react";

interface TaskIconProps extends LucideProps {
  name: string;
}

export const TaskIcon = ({ name, ...props }: TaskIconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    const FallbackIcon = icons["ClipboardCheck"];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};