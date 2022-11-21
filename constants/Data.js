import { Appearance } from "react-native"

const themeMode = Appearance.getColorScheme()

const settings = {
    automaticOn: false,
    flashlightStayOn: true,
    incomingCalls: false,
    incomingSms: false,
    powerControl: false,
    notificationToolbarToggle: false,
    theme: themeMode === 'dark' ? true : false,

}
export default settings