import { useEffect, useState } from "react";

export function range(size: number, startAt: number = 0): ReadonlyArray<number> {
    return [...Array<number>(size).keys()].map(i => i + startAt);
}

const SETTINGS_TOKEN = "SETTINGS";

export type Settings = {
    dark: boolean;
}

const defaultSettings: Settings = {
    dark: false,
}

export function useSettings() {
    const [settings, setSettings_] = useState<Settings>(defaultSettings);
    useEffect(() => {
        const settingsStr = localStorage.getItem(SETTINGS_TOKEN);
        if (settingsStr) {
            setSettings_(JSON.parse(settingsStr) || defaultSettings);
        }
    }, []);
    const setSettings = (settings: Settings) => {
        localStorage.setItem(SETTINGS_TOKEN, JSON.stringify(settings));
        setSettings_(settings);
    }
    return { settings, setSettings };
}

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;