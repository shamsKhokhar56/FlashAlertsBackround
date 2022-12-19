import { Appearance } from "react-native"

const themeMode = Appearance.getColorScheme()

const settings = {
    automaticOn: false,
    flashlightStayOn: false,
    incomingCalls: false,
    incomingSms: false,
    powerControl: false,
    powerControlPercentage: 0.10,
    notificationToolbarToggle: false,
    theme: themeMode === 'dark' ? true : false,

}
export default settings