import { ColorMode, ControlButton } from "@xyflow/react";
import React from "react-dom";
import { useColorMode } from "../context/ColorMode";
import { useCallback, useEffect, useState } from "react";
import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";


const MODES: ColorMode[] = ['system', 'dark', 'light'];

export function DarkModeToggleButton({...props}) {
    const [darkMode, setDarkMode] = useColorMode();
    const [icon, setIcon] = useState(darkMode);

    const cycleMode = useCallback(() => {
        const idx = MODES.indexOf(darkMode);
        console.log(idx, darkMode);
        setDarkMode(MODES[(idx + 1) % MODES.length]);
    }, [darkMode, setDarkMode]);

    useEffect(() => {
        // Icon shows next desired state, so show one ahead of the current position
        const idx = MODES.indexOf(darkMode);
        setIcon(MODES[(idx + 1) % MODES.length])
    }, [darkMode]);

    return <ControlButton {...props} onClick={cycleMode} title={`toggle dark mode (${darkMode})`}>
        {icon === "system" ? <FiMonitor /> : ""}
        {icon === "dark" ? <FiMoon /> : ""}
        {icon === "light" ? <FiSun /> : ""}
    </ControlButton>
}
