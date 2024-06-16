export const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
            error => hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};
export const formatTime = (secs) => {
    let minutes = Math.floor(secs / 60);
    let seconds = Math.ceil(secs - minutes * 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
};
export const kelvinToCelius = (degree) => {
    return degree - 273
}

export const handleChange = (name, value, state, setState) => {
    let _state = { ...state }
    _state[name] = value
    setState(_state)
}
export const emtptyReminderTemplate = {
    title: "",
    isDailyReminder: false,
    // date: new Date(),
    // isAllDay: false,
    startTime: new Date(),
    endTime: new Date(),
    isChecked: false
}