import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const Button = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
}) => {
  const [loaded, error] = useFonts({
    SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#A3E4D7' : '#1E2429'}
        />
      ) : (
        <React.Fragment>
          {icon && (
            <Feather
              name={icon}
              size={18}
              color={variant === 'outline' ? '#A3E4D7' : '#1E2429'}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              {'fontFamily': 'SpaceGroteskBold'},
              disabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#A3E4D7',
  },
  secondaryButton: {
    backgroundColor: '#2A343D',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#A3E4D7',
  },
  dangerButton: {
    backgroundColor: '#FF6B6B',
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#1E2429',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#A3E4D7',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#A0A0A0',
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
