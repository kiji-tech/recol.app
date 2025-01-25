import { TouchableOpacity, View } from 'react-native';
import IconButton from '../IconButton';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ChatButton() {
  const router = useRouter();
  return (
    <TouchableOpacity>
      <IconButton
        theme="background"
        icon={
          <MaterialIcons
            name="chat"
            size={18}
            className={`text-light-text dark:text-dark-text`}
            color="#000"
          />
        }
        onPress={() => {
          router.push('/(chat)/ChatScreen');
        }}
      />
    </TouchableOpacity>
  );
}
