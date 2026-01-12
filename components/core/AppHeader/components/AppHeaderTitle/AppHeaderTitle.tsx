import { Text } from "@/components";
import { AppHeaderTitleProps } from "./props";
import { styles } from "./styles";

export const AppHeaderTitle = ({ title, customStyle }: AppHeaderTitleProps) => {
  return (
    <Text style={[styles.headerTitle, customStyle]} size="lg" numberOfLines={1}>
      {title}
    </Text>
  );
};

export default AppHeaderTitle;
