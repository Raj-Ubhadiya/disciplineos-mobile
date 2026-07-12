import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/features/auth/auth-provider';
import { AppQueryProvider } from '@/shared/query/query-provider';
import { disciplineTheme } from '@/shared/theme';

export default function RootLayout() {
  return (
    <AppQueryProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: disciplineTheme.colors.background,
            },
          }}
        />
      </AuthProvider>
    </AppQueryProvider>
  );
}
