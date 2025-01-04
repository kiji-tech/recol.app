import { TouchableOpacity, View } from 'react-native';
import IconButton from '../IconButton';
import { useRouter } from 'expo-router';

export default function ChatButton() {
  const router = useRouter();
  return (
    <TouchableOpacity>
      <IconButton
        icon="chat"
        onPress={() => {
          router.push('/(chat)/ChatScreen');
        }}
      />
    </TouchableOpacity>
  );
}
