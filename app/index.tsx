import { Redirect } from 'expo-router';
import { useSessionUser } from '@/shared/lib/sessionUser';

export default function Index() {
  const user = useSessionUser();
  return <Redirect href={user ? '/main' : '/splash'} />;
}
