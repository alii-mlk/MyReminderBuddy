import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View, Alert, Modal, StyleSheet, TextInput, Switch, Button, ScrollView, ImageBackground, useWindowDimensions, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { weatherConditions } from '../utils/weatherConditions';
import { emtptyReminderTemplate, handleChange, kelvinToCelius } from '../utils/utils';
import DatePicker from 'react-native-date-picker'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { WeatherContext } from '../Contexts/WeatherContext';
import { ReminderContext } from '../Contexts/RemindersContext';

export default function Home({ navigation }) {

  const [currentWeatherCondition, setCurrentWeatherCondition] = useState(undefined)
  const [additionalWeatherDetails, setAdditionalWeatherDetails] = useState(undefined)
  const { loading, weatherError, currentWeather, getWeatherData } = useContext(WeatherContext);
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
    if (loading || weatherError) return
    for (var i = 0; i < weatherConditions.length; i++) {
      if (weatherConditions[i].name == currentWeather.weather[0].main) {
        setAdditionalWeatherDetails(currentWeather.main)
        setCurrentWeatherCondition(weatherConditions[i])
        return
      }
    }
  }, [currentWeather, loading, weatherError])

  useEffect(() => {
    if (reminders.length == 0 || !reminders) return
    const now = new Date();
    console.log("reminders", reminders)
    let _remindersToShow = reminders.filter(_reminder => {
      return _reminder.isDailyReminder || (
        now.getTime() >= _reminder.startTime.getTime() &&
        now.getTime() <= _reminder.endTime.getTime()
      );
    });


    setRemindersToShow(_remindersToShow);
  }, [reminders])

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
          borderRightWidth: 1, borderRightColor: "grey", flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: isPortrait ? 'rgba(255, 255, 255,0.8)' : 'rgba(255, 255, 255,0.8)',
          
        }}>
          <ScrollView style={{ width: "100%" }}>
            <View style={{ flex: 1, width: "100%" }} >
              <View style={{ display: "flex", padding: 4, flex: 1, gap: 2, justifyContent: "center", alignItems: 'center', width: "100%" }}>
                <Text style={{ alignSelf: "center", color: "black" }}>Today reminders:</Text>
                {remindersToShow.length == 0 ?
                  <Text style={{ alignSelf: "center", color: "black" }}>No Reminders for current moment.</Text>
                  :
                  <>
                    {remindersToShow.map((item, index) => {
                      return <View style={styles.reminderRowContainer} key={index}>
                        <BouncyCheckbox style={styles.checkBox} isChecked={item.isChecked} onPress={() => { handleCheckBox(item) }} />

                        <Text style={[styles.todoTitle, {
                          flex: isPortrait ? 4 : 8,
                        }]}>{item.title}</Text>

                        <Pressable style={styles.trashContainer} onPress={() => removeReminder(item)}>
                          <Ionicons name={'trash'} size={20} color={"black"} />
                        </Pressable>

                        <Pressable style={styles.editContainer} onPress={() => { handleEditModalOpen(item) }}>
                          <Ionicons name={'pencil'} size={20} color={"black"} />
                        </Pressable>
                      </View>
                    })}
                  </>
                }
              </View>
            </View>
          </ScrollView>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Pressable onPress={() => { setModalVisible(true) }} >
              <Ionicons name={'add-circle-outline'} size={40} color={"black"} />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
      <View style={{ display: "flex", flex: 1 }}>
        {
          weatherError ?
            <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1, gap: 10 }}>
              <Ionicons size={48} name={"sad-outline"} color="black" />
              <Text>Failed to load weather information!</Text>
              <Button onPress={getWeatherData} title='Retry' />
            </View>
            : (!currentWeatherCondition || loading) ?
              <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1, }}>
                <ActivityIndicator />
                <Text>Loading weather info</Text>
              </View>
              :
              <View style={[styles.weatherContainer,
              { backgroundColor: currentWeatherCondition.color }
              ]}>
                <View style={styles.conditionWrapper}>
                  <Ionicons size={48} name={currentWeatherCondition.icon} color={"white"} />
                  <Text style={{ color: "white", fontSize: 20 }}>{Math.round(kelvinToCelius(additionalWeatherDetails.temp))}˚</Text>

                </View>
                <View style={styles.bodyContainer}>

                  <Text style={styles.title}>Current weather: {currentWeather.weather[0].main}</Text>
                  <Text style={styles.subtitle}>Feels Like: {Math.round(kelvinToCelius(additionalWeatherDetails.feels_like))}</Text>
                  <Text style={styles.subtitle}>humidity: {additionalWeatherDetails.humidity}</Text>
                  <Text style={styles.subtitle}>Tips: {currentWeatherCondition.subtitle}</Text>

                </View>
              </View>


        }
      </View>
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
  reminderRowContainer: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
    width: "100%"
  },
  trashContainer: {
    flex: 1
  },
  editContainer: {
    flex: 1
  },
  checkBox: {
    flex: 1
  },
  todoTitle: {
    color: "black",
  },
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
  weatherContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10

  },
  conditionWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: 'center',
    width: "100%",
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tempText: {
    fontSize: 48,
    color: '#fff'
  },
  bodyContainer: {
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    color: '#fff'
  },
  subtitle: {
    fontSize: 15,
    color: '#fff'
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
