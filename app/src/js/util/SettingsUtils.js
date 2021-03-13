export let InvalidCellsDisplayType = Object.freeze({
    NORMAL: "Black Border",
    INVISIBLE: "Invisible",
    GRAYED_OUT: "Grayed Out"
});

export let defaultBoardSettings = {
    showTodayMarker: true,
    invalidCellsDisplayType: InvalidCellsDisplayType.GRAYED_OUT
};
