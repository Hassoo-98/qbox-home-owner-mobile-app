import { BoxInfo, Offer, QRSetting } from "@/components";
import { OFFERS, Spacing } from "@/constants";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export const Home = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <HomeContent />
    </KeyboardAvoidingView>
  );
};

const HomeContent = () => {
  return (
    <ScrollView
      style={{
        // flex: 1,
        padding: Spacing.md,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <BoxInfo />
      <FlatList
        data={OFFERS}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{
          flexGrow: 0, // Prevent FlatList from expanding
        }}
        renderItem={({ item }) => <Offer item={item} />}
      />
      <QRSetting />
    </ScrollView>
  );
};

export default Home;
