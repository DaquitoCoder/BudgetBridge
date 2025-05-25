// components/OtherGoalsCard.js
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import * as SplashScreen from "expo-splash-screen";
import { db } from "../firebase/config";
import { useFonts } from "expo-font";

const BAR_HEIGHT = 39;
const BAR_BORDER_RADIUS = 8;
const SCREEN_WIDTH = Dimensions.get("window").width - 32;

const OtherGoalsCard = forwardRef(({ email }, ref) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "meta_ahorro"));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((g) => g.usuario_correo === email);
      setGoals(list);
    } catch (e) {
      console.error("Error cargando metas:", e);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useImperativeHandle(ref, () => ({ reload: loadGoals }));

  useEffect(() => {
    if (email) loadGoals();
  }, [email, loadGoals]);

  const getBarColor = (meta) => {
    if (!meta.tiene_final || !meta.fecha_final) return "#22545E";
    const now = new Date();
    const end = meta.fecha_final.toDate
      ? meta.fecha_final.toDate()
      : new Date(meta.fecha_final);
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (days <= 1) return "#D95F80";
    if (days <= 7) return "#22545E";
    if (days <= 30) return "#6AA4C7";
    return "#22545E";
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#B6F2DC" />
      </View>
    );
  }

  if (!loaded && !error) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Otras metas de ahorro</Text>
      <ScrollView>
        {goals.length === 0 ? (
          <Text style={styles.noGoalsText}>
            No hay ninguna meta guardada por el momento.{"\n"}
            Por favor usa el botón de abajo para agregar una nueva meta.
          </Text>
        ) : (
          goals.map((g, idx) => {
            const inicio = g.fecha_inicio.toDate
              ? g.fecha_inicio.toDate()
              : new Date(g.fecha_inicio);
            const endLabel = g.tiene_final
              ? g.fecha_final.toDate
                ? g.fecha_final.toDate().toLocaleDateString()
                : new Date(g.fecha_final).toLocaleDateString()
              : "Continuo";
            const range = `De ${inicio.toLocaleDateString()} - ${endLabel}`;
            const percent = Math.min(
              (g.total_ahorrado / g.valor_meta) * 100,
              100
            );
            const barColor = getBarColor(g);

            return (
              <View key={g.id} style={styles.goalItem}>
                <View style={styles.barWrapper}>
                  <View style={styles.barBackground} />
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: (SCREEN_WIDTH * percent) / 100,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                  <Text style={styles.barText}>
                    ${g.total_ahorrado.toLocaleString()} / $
                    {g.valor_meta.toLocaleString()}
                  </Text>
                </View>

                <Text style={styles.goalTitle}>{g.nombre_meta}</Text>

                <View style={styles.line}>
                  <Text style={styles.labelBold}>Rango de tiempo: </Text>
                  <Text style={styles.labelRegular}>{range}</Text>
                </View>

                <View style={styles.line}>
                  <Text style={styles.labelBold}>Categoría: </Text>
                  <Text style={styles.labelRegular}>{g.categoria}</Text>
                </View>

                {idx < goals.length - 1 && <View style={styles.separator} />}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2A3038",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGroteskBold",
    marginBottom: 12,
  },
  noGoalsText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
    textAlign: "center",
    paddingVertical: 20,
  },
  goalItem: {
    marginBottom: 16,
  },
  barWrapper: {
    height: BAR_HEIGHT,
    width: "100%",
    position: "relative",
    marginBottom: 12,
    justifyContent: "center",
  },
  barBackground: {
    position: "absolute",
    height: BAR_HEIGHT,
    width: "100%",
    backgroundColor: "#4A4A4A",
    borderRadius: BAR_BORDER_RADIUS,
  },
  barFill: {
    position: "absolute",
    height: BAR_HEIGHT,
    borderRadius: BAR_BORDER_RADIUS,
  },
  barText: {
    position: "absolute",
    left: 8,
    fontSize: 18,
    fontFamily: "SpaceGroteskBold",
    color: "#FFFFFF",
    lineHeight: BAR_HEIGHT,
  },
  goalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGroteskBold",
    marginBottom: 8,
  },
  line: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  labelBold: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SpaceGroteskBold",
  },
  labelRegular: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SpaceGroteskRegular",
    flexShrink: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#4A4A4A",
    marginTop: 16,
  },
});

export default OtherGoalsCard;
