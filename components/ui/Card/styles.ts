import { Colors } from "@/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  elevated: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filled: {
    backgroundColor: Colors.gray,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    padding: 16,
  },
});
