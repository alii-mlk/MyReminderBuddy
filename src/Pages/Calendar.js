import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';


export default function CalendarTab() {

    // const onDateChanged = useCallback((date, updateSource) => {
    //   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    // }, []);

    // const onMonthChange = useCallback(({dateString}) => {
    //   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
    // }, []);

    return (
        <CalendarProvider
            date={Date.now()}
            // onDateChanged={onDateChanged}
            // onMonthChange={onMonthChange}
            showTodayButton
        // disabledOpacity={0.6}
        // todayBottomMargin={16}
        >

            <ExpandableCalendar
                // horizontal={false}
                // hideArrows
                // disablePan
                // hideKnob
                // initialPosition={ExpandableCalendar.positions.OPEN}
                // calendarStyle={styles.calendar}
                // headerStyle={styles.header} // for horizontal only
                // disableWeekScroll
                // disableAllTouchEventsForDisabledDays
                firstDay={1}
            // animateScroll
            // closeOnDayPress={false}
            />
        </CalendarProvider>
    );
};

const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        backgroundColor: 'lightgrey'
    },
    section: {
        color: 'grey',
        textTransform: 'capitalize'
    }
});