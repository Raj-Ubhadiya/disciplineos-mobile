import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

import { disciplineTheme } from '@/shared/theme';
import {
  isWorkspaceRoute,
  writeLastWorkspaceRoute,
} from '@/shared/preferences/navigation-preferences';

export default function TabsLayout() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && isWorkspaceRoute(pathname)) {
      void writeLastWorkspaceRoute(pathname);
    }
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: disciplineTheme.colors.primary,
        tabBarInactiveTintColor: disciplineTheme.colors.textFaint,
        tabBarStyle: {
          backgroundColor: disciplineTheme.colors.surface,
          borderTopColor: '#e8eef6',
          borderTopWidth: 1,
          height: 84,
          paddingTop: 10,
          paddingBottom: 14,
          paddingHorizontal: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarItemStyle: {
          borderRadius: disciplineTheme.radius.lg,
          marginHorizontal: 2,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="grid-outline" size={size} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="sunny-outline" size={size} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="checkmark-circle-outline" size={size} />,
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="timer-outline" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person-outline" size={size} />,
        }}
      />
    </Tabs>
  );
}
