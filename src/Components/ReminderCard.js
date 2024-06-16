import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ReminderCard({ item, index, handleCheckBox, removeReminder, handleEditModalOpen, isPortrait, isInListPage }) {
    return (
        <View style={styles.card}>
            <View style={styles.reminderRowContainer} >
                <BouncyCheckbox style={styles.checkBox} isChecked={item.isChecked} onPress={() => { handleCheckBox(item) }} />

                <Text style={[styles.todoTitle, {
                    flex: isInListPage ? isPortrait ? 9 : 20
                        : isPortrait ? 4 : 8,
                }]}>{item.title}</Text>

                <Pressable style={styles.trashContainer} onPress={() => removeReminder(item)}>
                    <Ionicons name={'trash'} size={20} color={"black"} />
                </Pressable>

                <Pressable style={styles.editContainer} onPress={() => { handleEditModalOpen(item) }}>
                    <Ionicons name={'pencil'} size={20} color={"black"} />
                </Pressable>
            </View>
            {item.isDailyReminder ?
            <Text>Daily Reminder</Text>
            :
                <>
                    <View style={{ display: 'flex', flexDirection: isPortrait && !isInListPage ? "column" : "row", justifyContent: isPortrait && !isInListPage ? undefined : "space-between", width: "100%" }}>
                        <Text>Starting Time: </Text>
                        <Text>{item.startTime.toLocaleDateString('en-us', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: isPortrait && !isInListPage ? "column" : "row", justifyContent: isPortrait && !isInListPage ? undefined : "space-between", width: "100%" }}>
                        <Text>End Time: </Text>
                        <Text>{item.endTime.toLocaleDateString('en-us', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}</Text>
                    </View>
                </>
            }

        </View >
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(190, 190, 190, 0.8)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 2
    },
    reminderRowContainer: {
        display: "flex",
        flexDirection: "row",
        marginVertical: 10,
        width: "100%",
    },
    checkBox: {
        flex: 1
    },
    todoTitle: {
        color: "black",
    },
    trashContainer: {
        flex: 1
    },
    editContainer:
    {
        flex: 1
    },
});
