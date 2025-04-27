import React from "react";
import Svg, { Path } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

/**
 * SemiCircularProgress dibuja un semicírculo de fondo y un semicírculo de progreso
 * alrededor de un trofeo centrado, cargando de izquierda a derecha.
 */
const SemiCircularProgress = ({ progress = 0, size = 160 }) => {
  const radius = size / 2;
  const strokeWidth = 14;
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  // Semicírculo de fondo: de 180° (izquierda) a 360° (derecha)
  const arcBackground = describeArc(
    radius,
    radius,
    radius - strokeWidth / 2,
    180,
    360
  );
  // Semicírculo de progreso: de 180° al ángulo proporcional hacia la derecha
  const endAngle = 180 + (normalizedProgress * 180) / 100;
  const arcProgress = describeArc(
    radius,
    radius,
    radius - strokeWidth / 2,
    180,
    endAngle
  );

  const trophySize = 24;
  const trophyOffset = radius - trophySize;

  return (
    <View style={styles.container}>
      <View
        style={{
          width: size,
          height: radius + strokeWidth,
          position: "relative",
        }}
      >
        <Svg width={size} height={radius + strokeWidth}>
          <Path
            d={arcBackground}
            stroke="#4A4A4A"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={arcProgress}
            stroke="#B6F2DC"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
        <View style={[styles.trophyContainer, { top: trophyOffset }]}>
          <View
            style={[
              styles.trophyCircle,
              {
                width: trophySize * 2,
                height: trophySize * 2,
                borderRadius: trophySize,
              },
            ]}
          >
            <FontAwesome5 name="trophy" size={trophySize} color="#2A3038" />
          </View>
        </View>
      </View>
    </View>
  );
};

// Describe un arco semicircular en SVG
function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
  const sweepFlag = "1"; // sentido horario para avanzar de izquierda a derecha
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    end.x,
    end.y,
  ].join(" ");
}

// Convierte coordenadas polares a cartesianas
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 0) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  trophyContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  trophyCircle: {
    backgroundColor: "#B6F2DC",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SemiCircularProgress;
