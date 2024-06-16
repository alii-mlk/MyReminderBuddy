import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet, ScrollView, ImageBackground, useWindowDimensions, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { emtptyReminderTemplate, handleChange } from '../utils/utils';
import { ReminderContext } from '../Contexts/RemindersContext';
import ReminderCard from '../Components/ReminderCard';
import ReminderModal from '../Components/ReminderModal';

export default function RemindersList({ navigation }) {
    const { reminders, addReminder, removeReminder, editReminder, handleCheckBox } = useContext(ReminderContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [reminder, setReminder] = useState({
        title: "",
        isDailyReminder: false,
        startTime: new Date(),
        endTime: new Date(),
        isChecked: false
    })
    const [startTimeModal, setStartTimeModal] = useState(false)
    const [endTimeModal, setEndTimeModal] = useState(false)
    const [dateModal, setDateModal] = useState(false)
    const [remindersToShow, setRemindersToShow] = useState([])

    const [isInEditMode, setIsInEditMode] = useState(false)
    const [itemToEdit, setItemToEdit] = useState(undefined)

    useEffect(() => {
        if (!reminders) return;
        if (reminders.length == 0) {
            setRemindersToShow([])
            return
        }
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

        const _remindersToShow = reminders.filter(_reminder => {
            if (_reminder.isDailyReminder) return true;

            // Get the date parts in YYYY-MM-DD format for comparison
            const endDate = _reminder.endTime.toISOString().split('T')[0];

            return _reminder.isDailyReminder || today <= endDate;
        });

        setRemindersToShow(_remindersToShow);
    }, [reminders]);

    const toggleSwitch = () => {
        let _reminder = { ...reminder }
        _reminder.isDailyReminder = !reminder.isDailyReminder
        setReminder(_reminder)
    }
    const handleDateTimeChange = (value, name) => {
        console.log(value)
        let _reminder = { ...reminder }
        _reminder[name] = value
        if (name == "startTime") _reminder.endTime = value
        setReminder(_reminder)
        setStartTimeModal(false)
        setEndTimeModal(false)
    }
    const handleSubmit = () => {
        if (isInEditMode) {
            editReminder(itemToEdit, reminder)
            setIsInEditMode(false)
            setItemToEdit(undefined)
        }
        else {
            addReminder(reminder)
        }
        setReminder(emtptyReminderTemplate)
        setModalVisible(!modalVisible)
    }

    const handleEditModalOpen = (reminderToEdit) => {
        setIsInEditMode(true)
        setItemToEdit(reminderToEdit)
        setReminder(reminderToEdit)
        setModalVisible(true)
    }

    const { width, height } = useWindowDimensions()
    const isPortrait = height >= width
    const backgroundImage = isPortrait ? require('../Images/vertical3.jpg') : require('../Images/square1.png')

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
            <ImageBackground
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: isPortrait ? 'rgba(255, 255, 255,0.8)' : 'rgba(255, 255, 255,0.8)',
                    paddingVertical: 10
                }}>
                    <View style={{ flex: 5, width: "100%" }}>
                        <ScrollView style={{ width: "100%" }}>
                            <View style={{ display: "flex", padding: 4, flex: 1, gap: 2, justifyContent: "center", alignItems: 'center', width: "100%" }}>
                                <Text style={{ alignSelf: "center", color: "black", fontSize: 20, fontWeight: "bold" }}>All Reminders:</Text>
                                {remindersToShow.length == 0 ?
                                    <Text style={{ alignSelf: "center", color: "black" }}>No Reminders for today.</Text>
                                    :
                                    remindersToShow.map((item, index) => {
                                        return <ReminderCard item={item} isPortrait={isPortrait}
                                            index={index}
                                            handleCheckBox={handleCheckBox}
                                            removeReminder={removeReminder}
                                            handleEditModalOpen={handleEditModalOpen}
                                            key={index}
                                            isInListPage={true}
                                        />
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>


            <ReminderModal
                isInEditMode={isInEditMode}
                setIsInEditMode={setIsInEditMode}
                reminder={reminder}
                handleChange={handleChange}
                toggleSwitch={toggleSwitch}
                startTimeModal={startTimeModal}
                setStartTimeModal={setStartTimeModal}
                handleDateTimeChange={handleDateTimeChange}
                endTimeModal={endTimeModal}
                setEndTimeModal={setEndTimeModal}
                handleSubmit={handleSubmit}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setReminder={setReminder}
            />
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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
});