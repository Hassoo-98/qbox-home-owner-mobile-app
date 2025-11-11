import { Text } from "@/components";
import { AppHeaderTitleProps } from "./props";
import { styles } from "./styles";

export const AppHeaderTitle = ({ title }: AppHeaderTitleProps) => {
  return (
    <Text style={styles.headerTitle} size="lg">
      {title}
    </Text>
  );
};

export default AppHeaderTitle;
