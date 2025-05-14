import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ManagementCard({ title, rows, dynamicStyles }: any) {
    return (
        <View style={dynamicStyles.managementCard}>
            <View style={{
                backgroundColor: dynamicStyles.header.backgroundColor,
                padding: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>{title}</Text>
            </View>
            <View style={{
                height: 1,
                backgroundColor: dynamicStyles.divider.backgroundColor,
            }} />
            {rows.map((row: any, idx: number) => (
                <React.Fragment key={idx}>
                    <View style={dynamicStyles.managementRow}>
                        <Text style={dynamicStyles.text}>{row.label}</Text>
                        {row.value && <Text style={dynamicStyles.text}>{row.value}</Text>}
                        {row.onPress && (
                            <TouchableOpacity onPress={row.onPress}>
                                <Text style={dynamicStyles.text}>View {">"}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {idx < rows.length - 1 && <View style={dynamicStyles.divider} />}
                </React.Fragment>
            ))}
        </View>
    );
}