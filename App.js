import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";

const healthHabits = [
  { id: "steps", title: "Daily Steps", target: "10k steps", progress: 0.72 },
  { id: "workouts", title: "Workouts", target: "5 / week", progress: 0.6 },
  { id: "exercise", title: "Exercises", target: "3 / day", progress: 0.8 },
  { id: "diet", title: "Diet Check-in", target: "Healthy meals", progress: 0.55 },
  { id: "rest", title: "Rest Days", target: "2 / week", progress: 0.4 },
];

const initialDailyHabits = [
  { id: "reading", title: "Read a book", schedule: "Daily · 20 min" },
  { id: "course", title: "Course lesson", schedule: "Mon, Wed, Fri" },
  { id: "cert", title: "Certification prep", schedule: "Weekend focus" },
  { id: "hydrate", title: "Hydration", schedule: "Daily · 2L water" },
];

const calendarDays = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  mood: index % 9 === 0 ? "🔥" : index % 7 === 0 ? "✨" : "",
}));

export default function App() {
  const [dailyHabits, setDailyHabits] = useState(() =>
    initialDailyHabits.map((habit, index) => ({
      ...habit,
      completed: index % 2 === 0,
    }))
  );
  const [productiveDays, setProductiveDays] = useState(() => new Set([4, 12, 18, 24]));

  const toggleHabit = (id) => {
    setDailyHabits((current) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const toggleProductiveDay = (day) => {
    setProductiveDays((current) => {
      const updated = new Set(current);
      if (updated.has(day)) {
        updated.delete(day);
      } else {
        updated.add(day);
      }
      return updated;
    });
  };

  const completionRate = useMemo(() => {
    const completedCount = dailyHabits.filter((habit) => habit.completed).length;
    return Math.round((completedCount / dailyHabits.length) * 100);
  }, [dailyHabits]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Habit Compass</Text>
        <Text style={styles.subheader}>
          A personal accomplishment and encouragement space built around who you
          are becoming.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Health Connect Snapshot</Text>
          <Text style={styles.sectionSub}>
            Synced from Health Connect · Daily, Monthly, Yearly
          </Text>
          {healthHabits.map((habit) => (
            <View key={habit.id} style={styles.progressRow}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>{habit.title}</Text>
                <Text style={styles.progressMeta}>{habit.target}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${habit.progress * 100}%` }]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Daily Focus</Text>
            <Text style={styles.badge}>{completionRate}% done</Text>
          </View>
          <Text style={styles.sectionSub}>
            Schedule reminders for habits and tap to mark progress.
          </Text>
          {dailyHabits.map((habit) => (
            <Pressable
              key={habit.id}
              onPress={() => toggleHabit(habit.id)}
              style={({ pressed }) => [
                styles.habitRow,
                habit.completed && styles.habitRowDone,
                pressed && styles.habitRowPressed,
              ]}
            >
              <View>
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.habitMeta}>{habit.schedule}</Text>
              </View>
              <Text style={styles.habitStatus}>
                {habit.completed ? "✓" : "○"}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Calendar Progress</Text>
          <Text style={styles.sectionSub}>
            Track streaks daily, monthly, and yearly at a glance.
          </Text>
          <View style={styles.calendarGrid}>
            {calendarDays.map((entry) => {
              const isProductive = productiveDays.has(entry.day);
              return (
                <Pressable
                  key={entry.day}
                  onPress={() => toggleProductiveDay(entry.day)}
                  style={({ pressed }) => [
                    styles.calendarCell,
                    isProductive && styles.calendarCellActive,
                    pressed && styles.calendarCellPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDay,
                      isProductive && styles.calendarDayActive,
                    ]}
                  >
                    {entry.day}
                  </Text>
                  <Text style={styles.calendarEmoji}>
                    {isProductive ? "🔥" : entry.mood}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.calendarHint}>
            Tap a day to mark it as a super productive moment.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Goals & Milestones</Text>
          <Text style={styles.sectionSub}>
            Celebrate certifications, course completions, and key life wins.
          </Text>
          <View style={styles.goalRow}>
            <View>
              <Text style={styles.goalTitle}>Mobile Dev Certification</Text>
              <Text style={styles.goalMeta}>ETA · 6 weeks</Text>
            </View>
            <Text style={styles.goalStatus}>65%</Text>
          </View>
          <View style={styles.goalRow}>
            <View>
              <Text style={styles.goalTitle}>Read 12 Books</Text>
              <Text style={styles.goalMeta}>Yearly · 7 completed</Text>
            </View>
            <Text style={styles.goalStatus}>58%</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You are building a life aligned with your values. Keep showing up.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 6,
  },
  subheader: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },
  sectionSub: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#111111",
    color: "#ffffff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  progressRow: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressTitle: {
    fontSize: 14,
    color: "#222222",
    fontWeight: "500",
  },
  progressMeta: {
    fontSize: 12,
    color: "#777777",
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#111111",
    borderRadius: 8,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  habitRowDone: {
    backgroundColor: "#f0f0f0",
    borderColor: "#cfcfcf",
  },
  habitRowPressed: {
    opacity: 0.7,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },
  habitMeta: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  habitStatus: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  calendarCell: {
    width: "13%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarCellActive: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },
  calendarCellPressed: {
    opacity: 0.7,
  },
  calendarDay: {
    fontSize: 12,
    color: "#111111",
    fontWeight: "600",
  },
  calendarDayActive: {
    color: "#ffffff",
  },
  calendarEmoji: {
    fontSize: 12,
    marginTop: 2,
  },
  calendarHint: {
    fontSize: 12,
    color: "#777777",
    marginTop: 10,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },
  goalMeta: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  goalStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
  },
  footer: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#111111",
    marginTop: 8,
  },
  footerText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
