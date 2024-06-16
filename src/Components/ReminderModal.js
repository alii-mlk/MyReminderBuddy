import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View, Alert, Modal, StyleSheet, TextInput, Switch, Button, ScrollView, ImageBackground, useWindowDimensions, } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker'

export default function ReminderModal({ modalVisible, setModalVisible, isInEditMode, setIsInEditMode, reminder, handleChange, toggleSwitch, startTimeModal, setStartTimeModal, handleDateTimeChange, endTimeModal, setEndTimeModal, handleSubmit, setReminder }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
                if (isInEditMode) setIsInEditMode(false)
            }}>
            <ScrollView>
                <View style={styles.modalView}>
                    <View style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
                        <View style={{ flex: 1, }} />
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", display: 'flex' }} >
                            <Text style={styles.modalText}>Add new reminder</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }} >
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text> <Ionicons name={'close-outline'} size={40} color={"black"} /></Text>
                            </Pressable>
                        </View>
                    </View>
                    <Text>Title</Text>
                    <TextInput
                        value={reminder.title}
                        onChangeText={(value) => handleChange("title", value, reminder, setReminder)}
                        style={{ borderBlockColor: "lightGrey", borderWidth: 0.5, borderRadius: 10 }}

                    />
                    <View style={[styles.rowContainer, { borderBottomWidth: 0.5, borderBottomColor: "lightGrey", margin: 10, padding: 10 }]}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Is it a daily reminder</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={reminder.isDailyReminder ? '#4682B4' : 'white'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={reminder.isDailyReminder}
                        />
                    </View>
                    {reminder.isDailyReminder ?
                        undefined
                        :
                        <>
                            <Text style={{ fontSize: 20, fontWeight: "bold", borderBottomWidth: 0.5, borderBottomColor: "lightGrey", margin: 10, padding: 10 }}>Date and Time</Text>
                            <View style={{ paddingHorizontal: 20, display: "flex", gap: 20 }}>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                                    <Text>{reminder.startTime.toLocaleDateString('en-us', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}</Text>
                                    <Pressable style={styles.button} onPress={() => setStartTimeModal(true)} >
                                        <Text style={styles.buttonText}>Select Start Time</Text>
                                    </Pressable>
                                    <DatePicker
                                        modal
                                        mode='datetime'
                                        open={startTimeModal}
                                        date={reminder.startTime}
                                        minimumDate={new Date()}
                                        onConfirm={(date) => { handleDateTimeChange(date, "startTime") }}
                                        onCancel={() => {
                                            setStartTimeModal(false)
                                        }}
                                    />
                                </View>

                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                                    <Text>{reminder.endTime.toLocaleDateString('en-us', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}</Text>
                                    <Pressable style={styles.button} onPress={() => setEndTimeModal(true)}>
                                        <Text style={styles.buttonText}>Select End Time</Text>
                                    </Pressable>
                                    <DatePicker
                                        modal
                                        mode='datetime'
                                        open={endTimeModal}
                                        date={reminder.endTime}
                                        minimumDate={reminder.endTime}
                                        onConfirm={(date) => { handleDateTimeChange(date, "endTime") }}
                                        onCancel={() => {
                                            setEndTimeModal(false)
                                        }}
                                    />
                                </View>
                            </View>
                        </>
                    }
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => handleSubmit()}>
                        <Text style={styles.textStyle}>{isInEditMode ? "Edit Reminder" : "Submit"}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        gap: 10,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
    },
    rowContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#0099fa',
        width: 100,
    },
    buttonText: {
        fontSize: 11,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.1,
        color: 'white',
    },
})  