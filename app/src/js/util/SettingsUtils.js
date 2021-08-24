export let InvalidCellsDisplayType = Object.freeze({
    NORMAL: "Black Border",
    INVISIBLE: "Invisible",
    GRAYED_OUT: "Grayed Out"
});

export let BoardDisplayType = Object.freeze({
    GRID: "Grid",
    CALENDAR: "Calendar" 
});


export let defaultBoardSettings = {
    showTodayMarker: true,
    invalidCellsDisplayType: InvalidCellsDisplayType.GRAYED_OUT,
    boardDisplayType: BoardDisplayType.CALENDAR,
    showDayNumber: false
};

export let EmailStatus = Object.freeze({
    VERIFIED: "Verified",
    NOT_VERIFIED: "Not Verified",
    NO_EMAIL: "No Email"
});
