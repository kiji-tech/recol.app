import { DimensionValue, View } from "react-native";

type Props = {
  height?: string;
  width?: string;
} & React.PropsWithChildren<{}>;

const Card = ({ height = "auto", width = "auto", children }: Props) => {
  return (
    <View
      className="border-2 border-gray-500 p-4 mb-4 rounded-md"
      style={{
        height: height as DimensionValue,
        width: width as DimensionValue,
      }}
    >
      {children}
    </View>
  );
};

export default Card;
