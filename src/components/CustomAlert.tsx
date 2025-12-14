import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { colors, spacing, borderRadius } from '../theme/colors';

export interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    buttons?: AlertButton[];
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    buttons = [{ text: 'OK', style: 'default' }],
    onClose,
}) => {
    const handleButtonPress = (button: AlertButton) => {
        if (button.onPress) {
            button.onPress();
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.iconContainer}>
                        <Feather name="check-circle" size={48} color={colors.success} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => {
                            const isCancel = button.style === 'cancel';
                            const isDestructive = button.style === 'destructive';

                            return (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.button,
                                        isCancel && styles.buttonCancel,
                                        isDestructive && styles.buttonDestructive,
                                        buttons.length === 1 && styles.buttonSingle,
                                    ]}
                                    onPress={() => handleButtonPress(button)}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            isCancel && styles.buttonTextCancel,
                                            isDestructive && styles.buttonTextDestructive,
                                            button.text.length > 10 && styles.buttonTextLong,
                                        ]}
                                    >
                                        {button.text}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    container: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: spacing.sm,
    },
    button: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSingle: {
        flex: 1,
    },
    buttonTextLong: {
        fontSize: 14,
        paddingHorizontal: spacing.sm
    },
    buttonCancel: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    buttonDestructive: {
        backgroundColor: colors.error,
    },
    buttonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: '600',
        alignSelf: "center",
        paddingVertical: spacing.md,
    },
    buttonTextCancel: {
        color: colors.text,
    },
    buttonTextDestructive: {
        color: colors.background,
    },
});

export default CustomAlert;
