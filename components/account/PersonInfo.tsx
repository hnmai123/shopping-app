import React from 'react';
import { Image, Text, View } from 'react-native';

export default function PersonInfo({ user, dynamicStyles, role }: any) {
  return (
    <View style={dynamicStyles.card}>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Image
          source={require('@/assets/images/Acount.png')}
          style={{ width: 50, height: 50, borderRadius: 50 }}
        />
        <Text style={dynamicStyles.text}>{user?.nickname || "Nickname"}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 20 }}>
        <Text style={dynamicStyles.text}>{user?.name || 'Name'}</Text>
        {role && <Text style={dynamicStyles.text}>Role: {role}</Text>}
        <Text style={dynamicStyles.text}>{user?.email || "Email"}</Text>
      </View>
    </View>
  );
}